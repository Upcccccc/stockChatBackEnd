import pool from '../config/db';

export const getNewsDeclineEventsFromDB = async (year: string) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `
            WITH significant_drops AS (
                SELECT DISTINCT s.ticker, s.date
                FROM stocks s
                WHERE EXTRACT(YEAR FROM s.date) = $1
                AND ((s.open - s.close) / s.open) > 0.005
            ),
            relevant_companies AS (
                SELECT DISTINCT c.name, c.ticker, sd.date as drop_date
                FROM company c
                JOIN significant_drops sd ON c.ticker = sd.ticker
            )
            SELECT DISTINCT 
                n.date as news_date,
                rc.name as company_name,
                n.short_description,
                rc.drop_date
            FROM news n
            CROSS JOIN relevant_companies rc
            WHERE EXTRACT(YEAR FROM n.date) = $1
            AND (
                -- Relaxed text matching condition
                LOWER(n.short_description) LIKE LOWER('%' || rc.name || '%')
                OR LOWER(n.headline) LIKE LOWER('%' || rc.name || '%')
            )
            AND ABS(n.date - rc.drop_date) <= 7  -- Extended to 7 days
            ORDER BY n.date;
            `,
            [year] // Just pass the year as a single parameter
        );
        return result.rows;
    } catch (error) {
        console.error('Error fetching news decline events from DB:', error);
        throw error;
    } finally {
        client.release();
    }
};
