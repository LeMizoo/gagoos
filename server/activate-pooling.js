const axios = require('axios');
const API_KEY = 'napi_wm0wj0ll5enwtvu5aslq64ooxp17hcd4eod1ggf85kplf8wo6oe3w9r13boca6l1';
const PROJECT_ID = 'ancient-frog-80904941';

console.log('Ì∫Ä Activation du Connection Pooling Neon...\n');

axios.get(`https://api.neon.tech/v2/projects/${PROJECT_ID}`, {
  headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' }
})
.then(projectRes => {
  console.log('‚úÖ Projet:', projectRes.data.project.name);
  return axios.get(`https://api.neon.tech/v2/projects/${PROJECT_ID}/branches`, {
    headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' }
  });
})
.then(branchesRes => {
  const primaryBranch = branchesRes.data.branches.find(b => b.primary) || branchesRes.data.branches[0];
  console.log('‚úÖ Branche:', primaryBranch.name);
  
  return axios.post(
    `https://api.neon.tech/v2/projects/${PROJECT_ID}/connection_poolers`,
    {
      connection_pooler: {
        branch_id: primaryBranch.id,
        pool_mode: 'transaction',
        database_name: 'neondb',
        user_name: 'neondb_owner'
      }
    },
    {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
  );
})
.then(poolerRes => {
  const host = poolerRes.data.connection_pooler.host;
  const url = `postgresql://neondb_owner:npg_y1iPFnCI5UKM@${host}:5432/neondb?sslmode=require`;
  
  console.log('\nÌæâ POOLING ACTIV√â !');
  console.log('\nÌ≥ù DATABASE_URL pour votre .env:');
  console.log('='.repeat(70));
  console.log(url);
  console.log('='.repeat(70));
  
  require('fs').writeFileSync('DATABASE_URL.txt', url);
  console.log('\nÌ≤æ URL sauvegard√©e dans: DATABASE_URL.txt');
})
.catch(err => {
  console.error('‚ùå Erreur:', err.response?.data || err.message);
  
  if (err.response?.data?.message?.includes('already exists')) {
    console.log('\nÌ≤° Utilisez cette URL:');
    console.log('DATABASE_URL=postgresql://neondb_owner:npg_y1iPFnCI5UKM@ep-wispy-hello-123456-pooler.us-east-2.aws.neon.tech:5432/neondb?sslmode=require');
  }
});
