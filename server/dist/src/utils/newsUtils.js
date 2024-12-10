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
exports.getNewsEventsFromDB = void 0;
const db_1 = __importDefault(require("../config/db"));
const getNewsEventsFromDB = (companyName) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.default.connect();
    try {
        const result = yield client.query(`
            SELECT id, date, link, category, headline
            FROM news
            WHERE headline LIKE $1 OR short_description LIKE $1
            ORDER BY date DESC
            LIMIT 20
            `, [`%${companyName}%`]);
        return result.rows;
    }
    catch (error) {
        console.error('Error fetching news events from DB:', error);
        throw error;
    }
    finally {
        client.release();
    }
});
exports.getNewsEventsFromDB = getNewsEventsFromDB;
