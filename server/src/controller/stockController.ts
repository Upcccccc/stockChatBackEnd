import { Request, Response } from 'express';
import { getStockDataFromDB } from '../utils/stockUtils';

export const getStockData = async (req: Request, res: Response) => {
    const { company_code, start_date, end_date } = req.query;

    if (!company_code) {
        return res.status(400).json({ error: 'Company code is required' });
    }

    try {
        // get stock data from database
        const stockData = await getStockDataFromDB(

            // TODO: what compnay infor we need?

            company_code as string,
            start_date as string | undefined,
            end_date as string | undefined
        );

        res.json({ data: stockData });
    } catch (error) {
        console.error('Error fetching stock data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
