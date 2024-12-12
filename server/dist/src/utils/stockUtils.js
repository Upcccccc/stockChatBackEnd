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
exports.getStockDataFromDB = void 0;
const db_1 = __importDefault(require("../config/db"));
const getStockDataFromDB = (companyName, startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.default.connect();
    try {
        // construct query
        let query = `
            SELECT 
                s.date,
                s.adj,
                s.close,
                s.open,
                s.high,
                s.low,
                s.volume,
                c.name as company_name,
                c.industry,
                c.sector,
                c.country
            FROM stocks s
            JOIN company c ON s.ticker = c.ticker
            WHERE c.name ILIKE '%' || $1 || '%'
        `;
        const queryParams = [companyName];
        let paramCounter = 2;
        // if start date and end date are provided, add them to the query
        if (startDate) {
            query += ` AND s.date >= ($${paramCounter}::date)`;
            queryParams.push(startDate);
            paramCounter++;
        }
        if (endDate) {
            query += ` AND s.date <= ($${paramCounter}::date)`;
            queryParams.push(endDate);
        }
        // add order by clause
        query += ' ORDER BY s.date ASC';
        const result = yield client.query(query, queryParams);
        return result.rows;
    }
    catch (error) {
        console.error('Error fetching stock data from DB:', error);
        throw error;
    }
    finally {
        client.release();
    }
});
exports.getStockDataFromDB = getStockDataFromDB;
