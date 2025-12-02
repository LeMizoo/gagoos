const { Pool } = require('pg');
require('dotenv').config({ path: '.env.development' });

console.log('Testing DB connection...');
console.log('DB URL:', process.env.DATABASE_URL ? '✓ Set' : '✗ Missing');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function test() {
    try {
        const client = await pool.connect();
        console.log('✅ Database connected successfully!');

        const result = await client.query('SELECT NOW()');
        console.log('📅 Database time:', result.rows[0].now);

        client.release();
        process.exit(0);
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
}

test();