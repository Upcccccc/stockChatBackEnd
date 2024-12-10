import pool from '../config/db';

export const getStockMinMaxEventsFromDB = async (company_name: string, year: string) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `
            WITH company_ticker AS (
                SELECT ticker 
                FROM company 
                WHERE name ILIKE '%' || $1 || '%'
            ),
            biggest_drop AS (
                SELECT date as drop_date
                FROM stocks
                WHERE ticker = (SELECT ticker FROM company_ticker)
                AND date >= ($2 || '-01-01')::date 
                AND date < ($2 || '-12-31')::date
                AND (open - close) = (
                    SELECT MAX(open - close)
                    FROM stocks
                    WHERE ticker = (SELECT ticker FROM company_ticker)
                    AND date >= ($2 || '-01-01')::date 
                    AND date < ($2 || '-12-31')::date
                )
                LIMIT 1
            ),
            biggest_boost AS (
                SELECT date as boost_date
                FROM stocks
                WHERE ticker = (SELECT ticker FROM company_ticker)
                AND date >= ($2 || '-01-01')::date 
                AND date < ($2 || '-12-31')::date
                AND (close - open) = (
                    SELECT MAX(close - open)
                    FROM stocks
                    WHERE ticker = (SELECT ticker FROM company_ticker)
                    AND date >= ($2 || '-01-01')::date 
                    AND date < ($2 || '-12-31')::date
                )
                LIMIT 1
            )
            SELECT ABS(drop_date - boost_date) as days_between
            FROM biggest_drop, biggest_boost;
            `,
            [company_name, year] 
        );
        return result.rows;
    } catch (error) {
        console.error('Error fetching stock min max days events from DB:', error);
        throw error;
    } finally {
        client.release();
    }
};
