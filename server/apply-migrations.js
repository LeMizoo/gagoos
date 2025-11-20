const fs = require('fs');
const path = require('path');
const { pool } = require('./config/database');

async function applyMigrations() {
  try {
    const sqlPath = path.join(__dirname, 'config', 'update_database.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log('Applying migrations from', sqlPath);
    // Execute the SQL file
    await pool.query(sql);
    console.log('✅ Migrations applied successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error applying migrations:', err && (err.stack || err.message || err));
    process.exit(1);
  }
}

applyMigrations();
