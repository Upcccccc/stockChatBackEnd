"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStockMonotonicTrendsFromDB = void 0;
const db_1 = __importDefault(require("../config/db"));
const getStockMonotonicTrendsFromDB = (company_name, start_date, // format: 'YYYY-MM-DD'
end_date // format: 'YYYY-MM-DD'
) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.default.connect();
    try {
        const result = yield client.query(`
            WITH company_ticker AS (
                SELECT ticker 
                FROM company 
                WHERE name ILIKE '%' || $1 || '%'
            ),
            daily_changes AS (
                SELECT 
                    date,
                    close,
                    CASE 
                        WHEN close >= LAG(close) OVER (ORDER BY date) THEN 1
                        ELSE 0
                    END as is_increase,
                    CASE 
                        WHEN close <= LAG(close) OVER (ORDER BY date) THEN 1
                        ELSE 0
                    END as is_decrease
                FROM stocks
                WHERE ticker = (SELECT ticker FROM company_ticker)
                AND date >= $2::date 
                AND date <= $3::date
                ORDER BY date
            ),
            grouped_trends AS (
                SELECT 
                    date,
                    close,
                    is_increase,
                    is_decrease,
                    SUM(CASE WHEN is_increase = 0 THEN 1 ELSE 0 END) OVER (ORDER BY date) as increase_group,
                    SUM(CASE WHEN is_decrease = 0 THEN 1 ELSE 0 END) OVER (ORDER BY date) as decrease_group
                FROM daily_changes
            ),
            increase_trends AS (
                SELECT 
                    MIN(date) as start_from,
                    MAX(date) as end_at,
                    MAX(close) - MIN(close) as amount
                FROM grouped_trends
                GROUP BY increase_group
                HAVING COUNT(*) > 1
                ORDER BY MAX(close) - MIN(close) DESC
                LIMIT 1
            ),
            decrease_trends AS (
                SELECT 
                    MIN(date) as start_from,
                    MAX(date) as end_at,
                    MIN(close) - MAX(close) as amount
                FROM grouped_trends
                GROUP BY decrease_group
                HAVING COUNT(*) > 1
                ORDER BY MIN(close) - MAX(close) DESC
                LIMIT 1
            )
            (SELECT start_from, end_at, amount, 'increase' as trend_type FROM increase_trends)
            UNION ALL
            (SELECT start_from, end_at, amount, 'decrease' as trend_type FROM decrease_trends)
            ORDER BY trend_type;
            `, [company_name, start_date, end_date]);
        return result.rows;
    }
    finally {
        client.release();
    }
});
exports.getStockMonotonicTrendsFromDB = getStockMonotonicTrendsFromDB;
