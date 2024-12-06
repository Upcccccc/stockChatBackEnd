import { Request, Response } from 'express';
import { getNewsDeclineAssetsEventsFromDB } from '../utils/newsDeclineAssetsUtils';

export const getNewsDeclineAssetsEvents = async (req: Request, res: Response) => {
    // GET /api/news-decline-assets?assets=1000000&year=2023
    const { assets, year } = req.query;

    if (!assets || !year) {
        return res.status(400).json({ 
            error: 'Both minimum assets and year are required' 
        });
    }

    const assetsNum = Number(assets);
    if (isNaN(assetsNum)) {
        return res.status(400).json({ 
            error: 'Assets must be a valid number' 
        });
    }

    // Validate year format (optional but recommended)
    const yearStr = String(year);
    if (!/^\d{4}$/.test(yearStr)) {
        return res.status(400).json({ 
            error: 'Year must be in YYYY format' 
        });
    }

    try {
        // get news events from database
        const newsEvents = await getNewsDeclineAssetsEventsFromDB(assetsNum, yearStr);
        res.json({ data: newsEvents });
    } catch (error) {
        console.error('Error fetching news decline assets events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
