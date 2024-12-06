import { Request, Response } from 'express';
import { getNewsDeclineEventsFromDB } from '../utils/newsDeclineUtils';

export const getNewsDeclineEvents = async (req: Request, res: Response) => {
    const { company_name } = req.query;

    if (!company_name ) {
        return res.status(400).json({ error: 'Company name is required' });
    }

    try {
        // get news events from database
        const newsEvents = await getNewsDeclineEventsFromDB(company_name  as string);

        res.json({ data: newsEvents });
    } catch (error) {
        console.error('Error fetching news decline events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
