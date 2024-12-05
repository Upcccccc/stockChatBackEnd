import { Request, Response } from 'express';
import { getNewsEventsFromDB } from '../utils/newsUtils';

export const getNewsEvents = async (req: Request, res: Response) => {
    const { company_name } = req.query;

    if (!company_name ) {
        return res.status(400).json({ error: 'Company name is required' });
    }

    try {
        // get news events from database
        const newsEvents = await getNewsEventsFromDB(company_name  as string);

        res.json({ data: newsEvents });
    } catch (error) {
        console.error('Error fetching news events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
