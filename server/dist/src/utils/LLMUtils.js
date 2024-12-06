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
exports.generateResponse = void 0;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
const generateResponse = (userQuery, relevantSummaries) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const relevantHistory = relevantSummaries.join('\n');
    const userPrompt = `
User: ${userQuery}

Below are relevant information that you must read and synthesize to give an answer to the user's question above.
${relevantHistory}

You (always in first person):
`;
    const completion = yield openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: userPrompt },
        ],
    });
    const aiResponse = ((_a = completion.choices[0].message) === null || _a === void 0 ? void 0 : _a.content) || '';
    return aiResponse;
});
exports.generateResponse = generateResponse;
