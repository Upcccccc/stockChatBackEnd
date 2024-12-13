import { Request, Response } from 'express';
import { transformTextToVector, findSimilarNewsWithUrls } from '../utils/vectorUtils';

export const getSimilarNews = async (req: Request, res: Response) => {
    const { headline } = req.body;

    if (!headline) {
        return res.status(400).json({ error: 'Headline is required' });
    }

    try {
        // Convert headline to vector
        const queryVector = await transformTextToVector(headline);

        // Find similar news with URLs
        const similarNews = await findSimilarNewsWithUrls(queryVector);

        res.json({
            success: true,
            data: similarNews
        });
    } catch (error) {
        console.error('Error finding similar news:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};