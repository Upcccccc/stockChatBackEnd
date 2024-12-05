import { Request, Response } from 'express';
import { transformTextToVector, findSimilarNews } from '../utils/vectorUtils';
import { generateResponse } from '../utils/LLMUtils';

export const handleQuery = async (req: Request, res: Response) => {
    const userQuery = req.body.query;

    if (!userQuery) {
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
        // transfer the user query to vector
        const queryVector = await transformTextToVector(userQuery);

        // find the similar news by vector
        const similarNews = await findSimilarNews(queryVector);

        // take the summaries of the similar news
        const relevantSummaries = similarNews.map((doc) => doc.summary);

        // use LLM to generate response
        const aiResponse = await generateResponse(userQuery, relevantSummaries);

        res.json({ data: aiResponse });
    } catch (error) {
        console.error('Error handling query:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};