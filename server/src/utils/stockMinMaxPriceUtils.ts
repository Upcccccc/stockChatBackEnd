import pool from '../config/db';

export const getStockMinMaxPriceEventsFromDB = async (year: string) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `
            WITH top_companies AS (
                SELECT ticker
                FROM company
                ORDER BY revenue DESC
                LIMIT 10
            ),
            bottom_companies AS (
                SELECT ticker
                FROM company
                ORDER BY revenue ASC
                LIMIT 10
            ),
            top_avg AS (
                SELECT AVG(close) as top_price
                FROM stocks
                WHERE date >= $1::date 
                AND date < $2::date
                AND ticker IN (SELECT ticker FROM top_companies)
            ),
            bottom_avg AS (
                SELECT AVG(close) as bottom_price
                FROM stocks
                WHERE date >= $1::date 
                AND date < $2::date
                AND ticker IN (SELECT ticker FROM bottom_companies)
            )
            SELECT top_price - bottom_price as price_difference
            FROM top_avg, bottom_avg;
            `,
            [`${year}-01-01`, `${year}-12-31`]
        );
        return result.rows;
    } catch (error) {
        console.error('Error fetching stock min max price events from DB:', error);
        throw error;
    } finally {
        client.release();
    }
};
