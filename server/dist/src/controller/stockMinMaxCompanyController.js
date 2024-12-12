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
exports.getMonotonicTrends = void 0;
const stockMinMaxCompanyUtils_1 = require("../utils/stockMinMaxCompanyUtils");
const getMonotonicTrends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { company_name, start_date, end_date } = req.query;
    // Input validation
    if (!company_name || !start_date || !end_date) {
        return res.status(400).json({
            error: 'company_name, start_date, and end_date are all required'
        });
    }
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(start_date) || !dateRegex.test(end_date)) {
        return res.status(400).json({
            error: 'Dates must be in YYYY-MM-DD format'
        });
    }
    // Validate date range
    const startDateObj = new Date(start_date);
    const endDateObj = new Date(end_date);
    if (startDateObj > endDateObj) {
        return res.status(400).json({
            error: 'start_date must be before end_date'
        });
    }
    try {
        const trends = yield (0, stockMinMaxCompanyUtils_1.getStockMonotonicTrendsFromDB)(company_name, start_date, end_date);
        res.json({ data: trends });
    }
    catch (error) {
        console.error('Error fetching stock monotonic trends:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getMonotonicTrends = getMonotonicTrends;
