import pool from '../config/db';

export const getStockDataFromDB = async (
    companyName: string,
    startDate?: string,
    endDate?: string
) => {
    const client = await pool.connect();
    try {
        // construct query
        let query = `
            SELECT 
                s.date,
                s.adj,
                s.close,
                s.open,
                s.high,
                s.low,
                s.volume,
                c.name as company_name,
                c.industry,
                c.sector,
                c.country
            FROM stocks s
            JOIN company c ON s.ticker = c.ticker
            WHERE c.name ILIKE '%' || $1 || '%'
        `;

        const queryParams = [companyName];
        let paramCounter = 2;

        // if start date and end date are provided, add them to the query
        if (startDate) {
            query += ` AND s.date >= ($${paramCounter}::date)`;
            queryParams.push(startDate);
            paramCounter++;
        }

        if (endDate) {
            query += ` AND s.date <= ($${paramCounter}::date)`;
            queryParams.push(endDate);
        }

        // add order by clause
        query += ' ORDER BY s.date ASC';

        const result = await client.query(query, queryParams);
        return result.rows;
    } catch (error) {
        console.error('Error fetching stock data from DB:', error);
        throw error;
    } finally {
        client.release();
    }
};
