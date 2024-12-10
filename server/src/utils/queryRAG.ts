import { transformTextToVector, findSimilarNews } from './vectorUtils';
import { generateResponse } from './LLMUtils';

export async function queryRAG(text: string) {
    const queryVector = await transformTextToVector(text);
    const similarNews = await findSimilarNews(queryVector);
    const relevantSummaries = similarNews.map(doc => `${doc.title}: ${doc.summary}`);
    const aiResponse = await generateResponse(text, relevantSummaries);
    return {
        data: {
            answer: aiResponse,
            relatedNews: similarNews
        }
    };
}
