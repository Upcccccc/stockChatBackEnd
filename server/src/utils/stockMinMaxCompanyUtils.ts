import pool from '../config/db';

export const getStockMonotonicTrendsFromDB = async (
    company_name: string,
    start_date: string,
    end_date: string
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
            
            daily_prices AS (
                SELECT 
                    date,
                    close,
                    close - LAG(close) OVER (ORDER BY date) as price_change,
                    LAG(date) OVER (ORDER BY date) as prev_date
                FROM stocks
                WHERE ticker = (SELECT ticker FROM company_ticker)
                AND date >= $2::date 
                AND date <= $3::date
            ),
            
            sequences AS (
                SELECT 
                    date,
                    close,
                    CASE 
                        WHEN price_change >= 0 THEN 1
                        ELSE -1 
                    END as trend,
                    CASE 
                        WHEN price_change >= 0 AND LAG(price_change) OVER (ORDER BY date) < 0 THEN 1  
                        WHEN price_change < 0 AND LAG(price_change) OVER (ORDER BY date) >= 0 THEN 1 
                        ELSE 0
                    END as new_sequence
                FROM daily_prices
                WHERE price_change IS NOT NULL
            ),
            
            grouped_sequences AS (
                SELECT
                    date,
                    close,
                    trend,
                    SUM(new_sequence) OVER (ORDER BY date) as sequence_group 
                FROM sequences
            ),
            
            trends AS (
                SELECT 
                    MIN(date) as start_from,
                    MAX(date) as end_at,
                    CASE 
                        WHEN trend = 1 THEN MAX(close) - MIN(close)
                        ELSE MIN(close) - MAX(close)
                    END as amount,
                    CASE 
                        WHEN trend = 1 THEN 'increase'
                        ELSE 'decrease'
                    END as trend_type
                FROM grouped_sequences
                GROUP BY sequence_group, trend
                HAVING COUNT(*) >= 2
            )
            
          
            SELECT start_from, end_at, amount, trend_type
            FROM trends
            WHERE (trend_type = 'increase' AND amount = (SELECT MAX(amount) FROM trends WHERE trend_type = 'increase'))
            OR (trend_type = 'decrease' AND amount = (SELECT MIN(amount) FROM trends WHERE trend_type = 'decrease'))
            ORDER BY trend_type;
            `,
            [company_name, start_date, end_date]
        );
        return result.rows;
    } finally {
        client.release();
    }
};