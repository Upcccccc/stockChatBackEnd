import { Request, Response } from 'express';
import { getStockMonotonicTrendsFromDB } from '../utils/stockMinMaxCompanyUtils';

export const getMonotonicTrends = async (req: Request, res: Response) => {
    const { company_name, start_date, end_date } = req.query;

    // Input validation
    if (!company_name || !start_date || !end_date) {
        return res.status(400).json({
            error: 'company_name, start_date, and end_date are all required'
        });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(start_date as string) || !dateRegex.test(end_date as string)) {
        return res.status(400).json({
            error: 'Dates must be in YYYY-MM-DD format'
        });
    }

    // Validate date range
    const startDateObj = new Date(start_date as string);
    const endDateObj = new Date(end_date as string);

    if (startDateObj > endDateObj) {
        return res.status(400).json({
            error: 'start_date must be before end_date'
        });
    }

    try {
        const trends = await getStockMonotonicTrendsFromDB(
            company_name as string,
            start_date as string,
            end_date as string
        );

        res.json({ data: trends });
    } catch (error) {
        console.error('Error fetching stock monotonic trends:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};