import { Request, Response } from 'express';
import { getLatestNewsFromDB, getNewsEventsFromDB } from '../utils/newsUtils';

export const getNewsEvents = async (req: Request, res: Response) => {
    const { company_name } = req.query;

    try {
        const newsEvents = company_name
            ? await getNewsEventsFromDB(company_name as string)
            : await getLatestNewsFromDB();

        res.json({
            data: newsEvents,
            totalCount: newsEvents.length
        });
    } catch (error) {
        console.error('Error fetching news events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};