import { Request, Response } from 'express';
import { getStockMinMaxEventsFromDB } from '../utils/stockMinMaxDaysUtils';

export const getMinMaxDaysEvents = async (req: Request, res: Response) => {
    const { company_name, year } = req.query;

    if (!company_name || !year) {
        return res.status(400).json({ 
            error: 'Both company_name and year are required' 
        });
    }

    try {
        // get news events from database
        const newsEvents = await getStockMinMaxEventsFromDB(company_name as string, year as string);
        res.json({ data: newsEvents });
    } catch (error) {
        console.error('Error fetching stock min max days events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
