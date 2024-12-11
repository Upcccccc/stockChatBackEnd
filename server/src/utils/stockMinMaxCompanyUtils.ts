import pool from '../config/db';

export const getStockMonotonicTrendsFromDB = async (
    company_name: string,
    start_date: string, // format: 'YYYY-MM-DD'
    end_date: string    // format: 'YYYY-MM-DD'
) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `
            WITH company_ticker AS (
                SELECT ticker 
                FROM company 
                WHERE name ILIKE '%' || $1 || '%'
            ),
            daily_changes AS (
                SELECT 
                    date,
                    close,
                    CASE 
                        WHEN close >= LAG(close) OVER (ORDER BY date) THEN 1
                        ELSE 0
                    END as is_increase,
                    CASE 
                        WHEN close <= LAG(close) OVER (ORDER BY date) THEN 1
                        ELSE 0
                    END as is_decrease
                FROM stocks
                WHERE ticker = (SELECT ticker FROM company_ticker)
                AND date >= $2::date 
                AND date <= $3::date
                ORDER BY date
            ),
            grouped_trends AS (
                SELECT 
                    date,
                    close,
                    is_increase,
                    is_decrease,
                    SUM(CASE WHEN is_increase = 0 THEN 1 ELSE 0 END) OVER (ORDER BY date) as increase_group,
                    SUM(CASE WHEN is_decrease = 0 THEN 1 ELSE 0 END) OVER (ORDER BY date) as decrease_group
                FROM daily_changes
            ),
            increase_trends AS (
                SELECT 
                    MIN(date) as start_from,
                    MAX(date) as end_at,
                    MAX(close) - MIN(close) as amount
                FROM grouped_trends
                GROUP BY increase_group
                HAVING COUNT(*) > 1
                ORDER BY MAX(close) - MIN(close) DESC
                LIMIT 1
            ),
            decrease_trends AS (
                SELECT 
                    MIN(date) as start_from,
                    MAX(date) as end_at,
                    MIN(close) - MAX(close) as amount
                FROM grouped_trends
                GROUP BY decrease_group
                HAVING COUNT(*) > 1
                ORDER BY MIN(close) - MAX(close) DESC
                LIMIT 1
            )
            (SELECT start_from, end_at, amount, 'increase' as trend_type FROM increase_trends)
            UNION ALL
            (SELECT start_from, end_at, amount, 'decrease' as trend_type FROM decrease_trends)
            ORDER BY trend_type;
            `,
            [company_name, start_date, end_date]
        );
        return result.rows;
    } finally {
        client.release();
    }
};