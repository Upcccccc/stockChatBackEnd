import pool from '../config/db';

export const getNewsEventsFromDB = async (companyName: string) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `
            SELECT id, date, link, category, headline
            FROM news
            WHERE headline LIKE $1 OR short_description LIKE $1
            ORDER BY date DESC
            LIMIT 20
            `,
            [`%${companyName}%`]
        );
        return result.rows;
    } catch (error) {
        console.error('Error fetching news events from DB:', error);
        throw error;
    } finally {
        client.release();
    }
};
