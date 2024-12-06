import pool from '../config/db';

export const getNewsDeclineEventsFromDB = async (companyName: string) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `
            WITH target_company AS (
                SELECT ticker FROM company WHERE name ILIKE $1
            ),
            price_drops AS (
                SELECT ticker, date
                FROM stocks s1
                WHERE close < open 
                AND ticker = (SELECT ticker FROM target_company)
                AND EXISTS (
                    SELECT 1 FROM stocks s2
                    WHERE s2.ticker = s1.ticker
                    AND s2.date BETWEEN s1.date AND s1.date + interval '6 days'
                    GROUP BY s2.ticker
                    HAVING COUNT(*) >= 7 AND ALL(s2.close < s2.open)
                )
            )
            SELECT DISTINCT n.short_description, n.date
            FROM news n, price_drops p, target_company t
            WHERE n.date = p.date
            AND n.short_description ILIKE '%' || (SELECT name FROM company WHERE ticker = t.ticker) || '%'
            ORDER BY n.date;
            `,
            [`%${companyName}%`]  // Remove the comma after the array
        );
        return result.rows;
    } catch (error) {
        console.error('Error fetching news decline events from DB:', error);
        throw error;
    } finally {
        client.release();
    }
};
