import { Request, Response } from 'express';
import { getSimilarCompaniesFromDB } from '../utils/stockSimilarCompaniesUtils';

export const getSimilarCompanies = async (req: Request, res: Response) => {
    const { company_name, start_date, end_date } = req.query;

    // Input validation
    if (!company_name || !start_date || !end_date) {
        return res.status(400).json({
            error: 'Company name, start date, and end date are required'
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
    if (new Date(start_date as string) > new Date(end_date as string)) {
        return res.status(400).json({
            error: 'Start date must be before end date'
        });
    }

    try {
        const similarCompanies = await getSimilarCompaniesFromDB(
            company_name as string,
            start_date as string,
            end_date as string
        );

        res.json({
            data: similarCompanies,
            metadata: {
                company: company_name,
                period: {
                    start: start_date,
                    end: end_date
                }
            }
        });
    } catch (error) {
        console.error('Error fetching similar companies:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
