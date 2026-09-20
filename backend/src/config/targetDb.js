import pg from 'pg';

const { Pool } = pg;

console.log('DEBUG - Target DB URL:', process.env.TARGET_DATABASE_URL);

const targetPool = new Pool({
    connectionString: process.env.TARGET_DATABASE_URL,
});

export default targetPool;