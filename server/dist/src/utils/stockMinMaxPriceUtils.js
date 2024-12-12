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
exports.getStockMinMaxPriceEventsFromDB = void 0;
const db_1 = __importDefault(require("../config/db"));
const getStockMinMaxPriceEventsFromDB = (year) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.default.connect();
    try {
        const result = yield client.query(`
            WITH top_companies AS (
                SELECT ticker
                FROM company
                ORDER BY revenue DESC
                LIMIT 10
            ),
            bottom_companies AS (
                SELECT ticker
                FROM company
                ORDER BY revenue ASC
                LIMIT 10
            ),
            top_avg AS (
                SELECT AVG(close) as top_price
                FROM stocks
                WHERE date >= $1::date 
                AND date < $2::date
                AND ticker IN (SELECT ticker FROM top_companies)
            ),
            bottom_avg AS (
                SELECT AVG(close) as bottom_price
                FROM stocks
                WHERE date >= $1::date 
                AND date < $2::date
                AND ticker IN (SELECT ticker FROM bottom_companies)
            )
            SELECT top_price - bottom_price as price_difference
            FROM top_avg, bottom_avg;
            `, [`${year}-01-01`, `${year}-12-31`]);
        return result.rows;
    }
    catch (error) {
        console.error('Error fetching stock min max price events from DB:', error);
        throw error;
    }
    finally {
        client.release();
    }
});
exports.getStockMinMaxPriceEventsFromDB = getStockMinMaxPriceEventsFromDB;
