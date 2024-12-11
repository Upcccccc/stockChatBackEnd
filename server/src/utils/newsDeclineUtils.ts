import pool from '../config/db';

export const getNewsDeclineEventsFromDB = async (year: string) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `
        WITH daily_changes AS (
            SELECT 
                s.ticker,
                s.date,
                s.open,
                LAG(s.open, 5) OVER (PARTITION BY s.ticker ORDER BY s.date) as five_day_prior_open
            FROM stocks s
            WHERE s.date >= make_date($1::int, 1, 1)
            AND s.date < make_date(($1::int + 1), 1, 1)
        ),
        significant_drops AS (
            SELECT DISTINCT ticker, date
            FROM daily_changes
            WHERE five_day_prior_open IS NOT NULL
            AND ((five_day_prior_open - open) / five_day_prior_open) > 0.001
        ),
        relevant_companies AS (
            SELECT c.name, c.ticker, sd.date as drop_date
            FROM company c
            INNER JOIN significant_drops sd ON c.ticker = sd.ticker
        )
        SELECT DISTINCT 
            n.date as news_date,
            rc.name as company_name,
            n.short_description,
            rc.drop_date
        FROM news n
        INNER JOIN relevant_companies rc ON 
            n.date >= rc.drop_date - INTERVAL '7 days' 
            AND n.date <= rc.drop_date + INTERVAL '7 days'
            AND (
                n.short_description ILIKE '%' || rc.name || '%'
                OR n.headline ILIKE '%' || rc.name || '%'
            )
        WHERE n.date >= make_date($1::int, 1, 1)
        AND n.date < make_date(($1::int + 1), 1, 1)
        ORDER BY n.date;
        `,
            [year]
        );
        return result.rows;
    } catch (error) {
        console.error('Error fetching news decline events from DB:', error);
        throw error;
    } finally {
        client.release();
    }
};
