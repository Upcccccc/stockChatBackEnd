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
exports.handleQuery = void 0;
const vectorUtils_1 = require("../utils/vectorUtils");
const LLMUtils_1 = require("../utils/LLMUtils");
const handleQuery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuery = req.body.query;
    if (!userQuery) {
        return res.status(400).json({ error: 'Query is required' });
    }
    try {
        // transfer the user query to vector
        const queryVector = yield (0, vectorUtils_1.transformTextToVector)(userQuery);
        // find the similar news by vector
        const similarNews = yield (0, vectorUtils_1.findSimilarNews)(queryVector);
        // take the summaries of the similar news
        const relevantSummaries = similarNews.map((doc) => ({
            title: doc.title,
            summary: doc.summary,
            distance: doc.distance
        }));
        // use LLM to generate response
        const aiResponse = yield (0, LLMUtils_1.generateResponse)(userQuery, relevantSummaries.map(news => `${news.title}: ${news.summary}`));
        // 返回完整信息
        res.json({
            success: true,
            data: {
                answer: aiResponse,
                relatedNews: relevantSummaries
            }
        });
    }
    catch (error) {
        console.error('Error handling query:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.handleQuery = handleQuery;
