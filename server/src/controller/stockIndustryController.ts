import { Request, Response } from 'express';
import { getIndustryAnalysisFromDB } from '../utils/stockIndustryUtils';

// Add this mapping object at the top of the file
const COMPANY_NAME_MAPPING: { [key: string]: string } = {
    'google': 'Alphabet',
    'facebook': 'Meta',
};

export const getIndustryAnalysis = async (req: Request, res: Response) => {
    const { company_name, start_date, end_date } = req.query;

    // Check if all required parameters are present
    if (!company_name || !start_date || !end_date) {
        return res.status(400).json({
            error: 'Company name, start date, and end date are all required'
        });
    }

    // Validate and map company name
    let companyNameStr = String(company_name).toLowerCase().trim();

    // Check mapping for alternative names
    companyNameStr = COMPANY_NAME_MAPPING[companyNameStr] || companyNameStr;

    if (companyNameStr.length < 2 || companyNameStr.length > 100) {
        return res.status(400).json({
            error: 'Company name must be between 2 and 100 characters'
        });
    }

    // Validate date formats
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const startDateStr = String(start_date);
    const endDateStr = String(end_date);

    if (!dateRegex.test(startDateStr) || !dateRegex.test(endDateStr)) {
        return res.status(400).json({
            error: 'Dates must be in YYYY-MM-DD format'
        });
    }

    // Validate date range
    const startDateObj = new Date(startDateStr);
    const endDateObj = new Date(endDateStr);

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
        return res.status(400).json({
            error: 'Invalid date values'
        });
    }

    if (endDateObj < startDateObj) {
        return res.status(400).json({
            error: 'End date must be after start date'
        });
    }

    // Optional: Check if date range is within reasonable bounds
    // const maxDateRange = 365 * 5; // 5 years
    // const daysDifference = Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24));
    //
    // if (daysDifference > maxDateRange) {
    //     return res.status(400).json({
    //         error: 'Date range cannot exceed 5 years'
    //     });
    // }

    try {
        // Get industry analysis from database
        const analysis = await getIndustryAnalysisFromDB(
            companyNameStr,
            startDateStr,
            endDateStr
        );

        // Check if any data was found
        if (!analysis) {
            return res.status(404).json({
                error: `No data found for ${company_name}. Please try the official company name.`
            });
        }

        res.json({
            data: analysis,
            metadata: {
                company: companyNameStr,
                original_query: String(company_name),
                period: {
                    start: startDateStr,
                    end: endDateStr
                }
            }
        });

    } catch (error) {
        console.error('Error fetching industry analysis:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
};