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
exports.findSimilarNews = exports.transformTextToVector = exports.initEmbeddingModel = void 0;
const db_1 = __importDefault(require("../config/db"));
let embeddingModel;
let pipeline;
// initialize the pipeline
const initPipeline = () => __awaiter(void 0, void 0, void 0, function* () {
    const transformers = yield import('@xenova/transformers');
    pipeline = transformers.pipeline;
});
// initialize the embedding model
const initEmbeddingModel = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!pipeline) {
        yield initPipeline();
    }
    if (!embeddingModel) {
        // using pipeline to load the distilbert model
        embeddingModel = yield pipeline('feature-extraction', 'Xenova/distilbert-base-uncased', {
            pooling: 'cls', // 使用 CLS token
            normalize: true,
            revision: 'default',
            progress_callback: (progress) => {
                console.log(`Model loading progress: ${Math.round(progress * 100)}%`);
            },
        });
        console.log('Embedding model loaded successfully.');
    }
});
exports.initEmbeddingModel = initEmbeddingModel;
// transfer text to vector
const transformTextToVector = (text) => __awaiter(void 0, void 0, void 0, function* () {
    if (!embeddingModel) {
        yield (0, exports.initEmbeddingModel)();
    }
    // get the embedding of the text
    console.log('Transforming text to vector...');
    const output = yield embeddingModel(text, {
        pooling: 'cls',
        normalize: true
    });
    console.log(output);
    console.log('Text transformed to vector successfully.');
    const vector = Array.from(output.data).map(value => Number(value));
    return vector;
});
exports.transformTextToVector = transformTextToVector;
// search for similar news by vector
const findSimilarNews = (queryVector) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.default.connect();
    console.log(queryVector.length);
    console.log('Query vector:', queryVector);
    try {
        // transfer the vector to string like '[0.1, 0.2, 0.3]'
        const vectorString = '[' + queryVector.join(',') + ']';
        const result = yield client.query(`
            SELECT 
                id,
                headline as title,
                short_description as summary,
                date
            FROM news
            ORDER BY embedding <=> $1::vector
            LIMIT 5
            `, [vectorString]);
        return result.rows;
    }
    catch (error) {
        console.error('Error during vector search:', error);
        throw error;
    }
    finally {
        client.release();
    }
});
exports.findSimilarNews = findSimilarNews;
