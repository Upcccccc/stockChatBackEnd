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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStockData = void 0;
const stockUtils_1 = require("../utils/stockUtils");
const getStockData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyName, startDate, endDate } = req.query;
    if (!companyName) {
        return res.status(400).json({ error: 'Company Name is required' });
    }
    try {
        // get stock data from database
        const stockData = yield (0, stockUtils_1.getStockDataFromDB)(companyName, startDate, endDate);
        res.json({
            success: true,
            data: stockData,
            company: companyName
        });
    }
    catch (error) {
        console.error('Error fetching stock data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getStockData = getStockData;
