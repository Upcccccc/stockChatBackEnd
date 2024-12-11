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
exports.getNewsDeclineAssetsEvents = void 0;
const newsDeclineAssetsUtils_1 = require("../utils/newsDeclineAssetsUtils");
const getNewsDeclineAssetsEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET /api/news-decline-assets?assets=1000000&year=2023
    const { assets, year } = req.query;
    if (!assets || !year) {
        return res.status(400).json({
            error: 'Both minimum assets and year are required'
        });
    }
    const assetsNum = Number(assets);
    if (isNaN(assetsNum)) {
        return res.status(400).json({
            error: 'Assets must be a valid number'
        });
    }
    // Validate year format (optional but recommended)
    const yearStr = String(year);
    if (!/^\d{4}$/.test(yearStr)) {
        return res.status(400).json({
            error: 'Year must be in YYYY format'
        });
    }
    try {
        // get news events from database
        const newsEvents = yield (0, newsDeclineAssetsUtils_1.getNewsDeclineAssetsEventsFromDB)(assetsNum, yearStr);
        res.json({ data: newsEvents });
    }
    catch (error) {
        console.error('Error fetching news decline assets events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getNewsDeclineAssetsEvents = getNewsDeclineAssetsEvents;
