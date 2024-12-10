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
exports.queryRAG = queryRAG;
const vectorUtils_1 = require("./vectorUtils");
const LLMUtils_1 = require("./LLMUtils");
function queryRAG(text) {
    return __awaiter(this, void 0, void 0, function* () {
        const queryVector = yield (0, vectorUtils_1.transformTextToVector)(text);
        const similarNews = yield (0, vectorUtils_1.findSimilarNews)(queryVector);
        const relevantSummaries = similarNews.map(doc => `${doc.title}: ${doc.summary}`);
        const aiResponse = yield (0, LLMUtils_1.generateResponse)(text, relevantSummaries);
        return {
            data: {
                answer: aiResponse,
                relatedNews: similarNews
            }
        };
    });
}
