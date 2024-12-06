import { Request, Response } from 'express';
import { getStockDataFromDB } from '../utils/stockUtils';

export const getStockData = async (req: Request, res: Response) => {
    const { companyName, startDate, endDate  } = req.query;

    if (!companyName) {
        return res.status(400).json({ error: 'Company Name is required' });
    }

    try {
        // get stock data from database
        const stockData = await getStockDataFromDB(

            companyName as string,
            startDate as string | undefined,
            endDate as string | undefined
        );

        res.json({
            success: true,
            data: stockData,
            company: companyName
        });
    } catch (error) {
        console.error('Error fetching stock data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
