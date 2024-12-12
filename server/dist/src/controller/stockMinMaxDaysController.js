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
exports.getMinMaxDaysEvents = void 0;
const stockMinMaxDaysUtils_1 = require("../utils/stockMinMaxDaysUtils");
const getMinMaxDaysEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { company_name, year } = req.query;
    if (!company_name || !year) {
        return res.status(400).json({
            error: 'Both company_name and year are required'
        });
    }
    try {
        // get news events from database
        const newsEvents = yield (0, stockMinMaxDaysUtils_1.getStockMinMaxEventsFromDB)(company_name, year);
        res.json({ data: newsEvents });
    }
    catch (error) {
        console.error('Error fetching stock min max days events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getMinMaxDaysEvents = getMinMaxDaysEvents;
