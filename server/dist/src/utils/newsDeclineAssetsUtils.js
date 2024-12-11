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
exports.getNewsDeclineAssetsEventsFromDB = void 0;
const db_1 = __importDefault(require("../config/db"));
const getNewsDeclineAssetsEventsFromDB = (assets, year) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.default.connect();
    try {
        const result = yield client.query(`
            WITH first_big_drops AS (
                SELECT s.ticker, MIN(s.date) as drop_date
                FROM stocks s
                WHERE s.open - s.close > 2
                GROUP BY s.ticker
            )
            SELECT DISTINCT n.headline, n.date
            FROM news n
            JOIN company c ON n.headline ILIKE '%' || c.name || '%'
            WHERE c.total_assets > $1
            AND EXISTS (
                SELECT 1 
                FROM first_big_drops f
                WHERE f.ticker = c.ticker
                AND EXTRACT(YEAR FROM n.date) = $2::integer
                AND n.date > f.drop_date
            );
            `, [assets, year]);
        return result.rows;
    }
    catch (error) {
        console.error('Error fetching news decline assets events from DB:', error);
        throw error;
    }
    finally {
        client.release();
    }
});
exports.getNewsDeclineAssetsEventsFromDB = getNewsDeclineAssetsEventsFromDB;
