import { Request, Response } from 'express';
import { getStockMinMaxPriceEventsFromDB } from '../utils/stockMinMaxPriceUtils';

export const getMinMaxPriceEvents = async (req: Request, res: Response) => {
    const { year } = req.query;

    if (!year) {
        return res.status(400).json({ 
            error: 'Year is required' 
        });
    }

    try {
        // get news events from database
        const newsEvents = await getStockMinMaxPriceEventsFromDB(year as string);
        res.json({ data: newsEvents });
    } catch (error) {
        console.error('Error fetching stock min max price events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
