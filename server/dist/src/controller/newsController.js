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
exports.getNewsEvents = void 0;
const newsUtils_1 = require("../utils/newsUtils");
const getNewsEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { company_name } = req.query;
    if (!company_name) {
        return res.status(400).json({ error: 'Company name is required' });
    }
    try {
        // get news events from database
        const newsEvents = yield (0, newsUtils_1.getNewsEventsFromDB)(company_name);
        res.json({ data: newsEvents });
    }
    catch (error) {
        console.error('Error fetching news events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getNewsEvents = getNewsEvents;
