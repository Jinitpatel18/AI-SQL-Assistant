import targetPool from '../../config/targetDb.js';

export const executeSafeQuery = async (sql) => {
    const client = await targetPool.connect();

    try {
        // Query timeout set karo — agar query 5 second se zyada le to cancel ho jaye
        await client.query('SET statement_timeout = 5000');

        const result = await client.query(sql);

        // Row limit — agar accidentally bahut zyada rows aa jayein
        const limitedRows = result.rows.slice(0, 100);

        return {
            rows: limitedRows,
            rowCount: result.rowCount,
            truncated: result.rows.length > 100,
        };
    } finally {
        client.release();
    }
};