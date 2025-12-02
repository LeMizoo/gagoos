const { Client } = require('pg');

const testUrls = [
  'postgresql://neondb_owner:npg_y1iPFnCI5UKM@ep-wispy-hello-123456-pooler.us-east-2.aws.neon.tech:5432/neondb?sslmode=require',
  'postgresql://neondb_owner:npg_y1iPFnCI5UKM@ep-wispy-hello-123456-pooler.us-east-2.aws.neon.tech:443/neondb?sslmode=require'
];

async function testUrl(url) {
  console.log(`\ní´— Test: ${url.split('@')[1].split(':')[0]}`);
  
  const client = new Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000
  });

  try {
    const start = Date.now();
    await client.connect();
    const time = Date.now() - start;
    
    const res = await client.query('SELECT NOW()');
    console.log(`âœ… ConnectÃ© en ${time}ms`);
    console.log(`   í³… ${res.rows[0].now.toISOString()}`);
    
    await client.end();
    return { success: true, url, time };
  } catch (err) {
    console.log(`âŒ Ã‰chec: ${err.message}`);
    return { success: false, url, error: err.message };
  }
}

async function runTests() {
  console.log('í·ª Test des URLs avec Connection Pooling...\n');
  
  for (const url of testUrls) {
    await testUrl(url);
    await new Promise(r => setTimeout(r, 1000));
  }
}

runTests();
