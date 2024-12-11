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
exports.getNewsDeclineEventsFromDB = void 0;
const db_1 = __importDefault(require("../config/db"));
const getNewsDeclineEventsFromDB = (year) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.default.connect();
    try {
        const result = yield client.query(`
        WITH daily_changes AS (
            SELECT 
                s.ticker,
                s.date,
                s.open,
                LAG(s.open, 5) OVER (PARTITION BY s.ticker ORDER BY s.date) as five_day_prior_open
            FROM stocks s
            WHERE s.date >= make_date($1::int, 1, 1)
            AND s.date < make_date(($1::int + 1), 1, 1)
        ),
        significant_drops AS (
            SELECT DISTINCT ticker, date
            FROM daily_changes
            WHERE five_day_prior_open IS NOT NULL
            AND ((five_day_prior_open - open) / five_day_prior_open) > 0.001
        ),
        relevant_companies AS (
            SELECT c.name, c.ticker, sd.date as drop_date
            FROM company c
            INNER JOIN significant_drops sd ON c.ticker = sd.ticker
        )
        SELECT DISTINCT 
            n.date as news_date,
            rc.name as company_name,
            n.short_description,
            rc.drop_date
        FROM news n
        INNER JOIN relevant_companies rc ON 
            n.date >= rc.drop_date - INTERVAL '7 days' 
            AND n.date <= rc.drop_date + INTERVAL '7 days'
            AND (
                n.short_description ILIKE '%' || rc.name || '%'
                OR n.headline ILIKE '%' || rc.name || '%'
            )
        WHERE n.date >= make_date($1::int, 1, 1)
        AND n.date < make_date(($1::int + 1), 1, 1)
        ORDER BY n.date;
        `, [year]);
        return result.rows;
    }
    catch (error) {
        console.error('Error fetching news decline events from DB:', error);
        throw error;
    }
    finally {
        client.release();
    }
});
exports.getNewsDeclineEventsFromDB = getNewsDeclineEventsFromDB;
