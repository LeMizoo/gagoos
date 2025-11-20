const http = require('http');

console.log('🧪 TEST DE RÉPARATION BYGAGOOS...\\n');

// Test des endpoints
const endpoints = [
  'http://localhost:5000/api/health',
  'http://localhost:5000/api/dashboard/stats',
  'http://localhost:5000/api/dashboard/commandes',
  'http://localhost:5000/api/test-db'
];

function testEndpoint(url) {
  return new Promise((resolve) => {
    const start = Date.now();
    http.get(url, (res) => {
      const duration = Date.now() - start;
      if (res.statusCode === 200) {
        console.log(`✅ ${url} - ${res.statusCode} (${duration}ms)`);
      } else {
        console.log(`❌ ${url} - ${res.statusCode} (${duration}ms)`);
      }
      resolve();
    }).on('error', (err) => {
      console.log(`❌ ${url} - ERREUR: ${err.message}`);
      resolve();
    });
  });
}

async function runTests() {
  console.log('🔍 Test des endpoints...\\n');
  
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\\n🎯 INSTRUCTIONS:');
  console.log('1. Backend: cd server && npm run dev');
  console.log('2. Frontend: cd client && npm run dev');
  console.log('3. Ouvrez: http://localhost:5173');
  console.log('\\n📞 Si problèmes:');
  console.log('- Vérifiez que PostgreSQL tourne');
  console.log('- Vérifiez les ports 5000 et 5173');
  console.log('- Consultez les logs des consoles');
}

runTests();