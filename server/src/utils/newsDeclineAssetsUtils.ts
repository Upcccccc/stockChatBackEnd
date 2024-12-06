import pool from '../config/db';

export const getNewsDeclineAssetsEventsFromDB = async (assets: number, year: string) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `
            WITH first_big_drops AS (
                SELECT s.ticker, MIN(s.date) as drop_date
                FROM stocks s
                WHERE s.open - s.close > 2
                GROUP BY s.ticker
            )
            SELECT DISTINCT n.headline, n.date
            FROM news n
            JOIN company c ON n.headline ILIKE '%' || c.name || '%'
            WHERE c.total_assets > $1
            AND EXISTS (
                SELECT 1 
                FROM first_big_drops f
                WHERE f.ticker = c.ticker
                AND EXTRACT(YEAR FROM n.date) = $2::integer
                AND n.date > f.drop_date
            );
            `,
            [assets, year] 
        );
        return result.rows;
    } catch (error) {
        console.error('Error fetching news decline assets events from DB:', error);
        throw error;
    } finally {
        client.release();
    }
};
