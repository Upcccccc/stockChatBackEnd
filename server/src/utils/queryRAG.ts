import { transformTextToVector, findSimilarNews } from './vectorUtils';
import { generateResponse } from './LLMUtils';

export async function queryRAG(text: string) {
    console.time('queryRAG');

    console.time('vectorTransform');
    const queryVector = await transformTextToVector(text);
    console.timeEnd('vectorTransform');

    console.time('similarNews');
    const similarNews = await findSimilarNews(queryVector);
    console.timeEnd('similarNews');

    console.time('generateResponse');
    const aiResponse = await generateResponse(text,
        similarNews.map(doc => `${doc.title}: ${doc.summary}`));
    console.timeEnd('generateResponse');

    console.timeEnd('queryRAG');

    return {
        data: {
            answer: aiResponse,
            relatedNews: similarNews
        }
    };
}
