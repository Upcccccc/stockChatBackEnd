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
exports.getStockMinMaxEventsFromDB = void 0;
const db_1 = __importDefault(require("../config/db"));
const getStockMinMaxEventsFromDB = (company_name, year) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.default.connect();
    try {
        const result = yield client.query(`
            WITH company_ticker AS (
                SELECT ticker 
                FROM company 
                WHERE name ILIKE '%' || $1 || '%'
            ),
            biggest_drop AS (
                SELECT date as drop_date
                FROM stocks
                WHERE ticker = (SELECT ticker FROM company_ticker)
                AND date >= ($2 || '-01-01')::date 
                AND date < ($2 || '-12-31')::date
                AND (open - close) = (
                    SELECT MAX(open - close)
                    FROM stocks
                    WHERE ticker = (SELECT ticker FROM company_ticker)
                    AND date >= ($2 || '-01-01')::date 
                    AND date < ($2 || '-12-31')::date
                )
                LIMIT 1
            ),
            biggest_boost AS (
                SELECT date as boost_date
                FROM stocks
                WHERE ticker = (SELECT ticker FROM company_ticker)
                AND date >= ($2 || '-01-01')::date 
                AND date < ($2 || '-12-31')::date
                AND (close - open) = (
                    SELECT MAX(close - open)
                    FROM stocks
                    WHERE ticker = (SELECT ticker FROM company_ticker)
                    AND date >= ($2 || '-01-01')::date 
                    AND date < ($2 || '-12-31')::date
                )
                LIMIT 1
            )
            SELECT ABS(drop_date - boost_date) as days_between
            FROM biggest_drop, biggest_boost;
            `, [company_name, year]);
        return result.rows;
    }
    catch (error) {
        console.error('Error fetching stock min max days events from DB:', error);
        throw error;
    }
    finally {
        client.release();
    }
});
exports.getStockMinMaxEventsFromDB = getStockMinMaxEventsFromDB;
