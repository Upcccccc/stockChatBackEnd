import pool from '../config/db';

export const getSimilarCompaniesFromDB = async (
    company_name: string,
    start_date: string,
    end_date: string
) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `
            WITH base_company AS (
                SELECT ticker, name
                FROM company 
                WHERE name ILIKE '%' || $1 || '%'
                LIMIT 1
            ),
            base_company_stats AS (
                SELECT 
                    AVG(close) as avg_price,
                    STDDEV(close) as price_stddev
                FROM stocks s
                JOIN base_company b ON s.ticker = b.ticker
                WHERE date >= $2::date 
                AND date <= $3::date
            ),
            all_companies_stats AS (
                SELECT 
                    c.ticker,
                    c.name,
                    c.industry,
                    c.revenue,
                    AVG(s.close) as avg_price,
                    CORR(
                        s.close,
                        (SELECT s2.close 
                         FROM stocks s2 
                         WHERE s2.ticker = (SELECT ticker FROM base_company)
                         AND s2.date = s.date)
                    ) as price_correlation
                FROM stocks s
                JOIN company c ON s.ticker = c.ticker
                WHERE s.date >= $2::date 
                AND s.date <= $3::date
                AND c.ticker != (SELECT ticker FROM base_company)
                GROUP BY c.ticker, c.name, c.industry, c.revenue
                HAVING COUNT(*) > 0
            )
            SELECT 
                name,
                industry,
                revenue,
                avg_price,
                price_correlation
            FROM all_companies_stats
            WHERE price_correlation IS NOT NULL
            ORDER BY price_correlation DESC
            LIMIT 5;
            `,
            [company_name, start_date, end_date]
        );
        return result.rows;
    } finally {
        client.release();
    }
};