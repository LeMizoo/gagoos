const axios = require('axios');

const API_KEY = 'napi_wm0wj0ll5enwtvu5aslq64ooxp17hcd4eod1ggf85kplf8wo6oe3w9r13boca6l1';
const PROJECT_ID = 'ancient-frog-80904941';

async function enablePooling() {
  console.log('��� Activation du Connection Pooling...');
  console.log('Project ID:', PROJECT_ID);
  
  try {
    // Étape 1: Récupérer les détails du projet
    console.log('\n1. Récupération des informations du projet...');
    const projectResponse = await axios.get(
      `https://api.neon.tech/v2/projects/${PROJECT_ID}`,
      {
        headers: {
          'Authorization': \`Bearer \${API_KEY}\`,
          'Accept': 'application/json'
        }
      }
    );
    
    const project = projectResponse.data.project;
    console.log('✅ Projet:', project.name);
    console.log('   Host:', project.host);
    
    // Étape 2: Récupérer les branches
    console.log('\n2. Récupération des branches...');
    const branchesResponse = await axios.get(
      \`https://api.neon.tech/v2/projects/\${PROJECT_ID}/branches\`,
      {
        headers: {
          'Authorization': \`Bearer \${API_KEY}\`,
          'Accept': 'application/json'
        }
      }
    );
    
    const branches = branchesResponse.data.branches;
    const primaryBranch = branches.find(b => b.primary) || branches[0];
    console.log('✅ Branche primaire:', primaryBranch.name);
    
    // Étape 3: Créer le pooler
    console.log('\n3. Création du Connection Pooler...');
    const poolerResponse = await axios.post(
      \`https://api.neon.tech/v2/projects/\${PROJECT_ID}/connection_poolers\`,
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
          'Authorization': \`Bearer \${API_KEY}\`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Connection Pooler créé !');
    console.log('   Status:', poolerResponse.data.connection_pooler.status);
    
    // Étape 4: Générer l'URL
    const poolerHost = poolerResponse.data.connection_pooler.host;
    const databaseUrl = \`postgresql://neondb_owner:npg_y1iPFnCI5UKM@\${poolerHost}:5432/neondb?sslmode=require\`;
    
    console.log('\n��� POOLING ACTIVÉ !');
    console.log('\n��� Ajoutez à votre .env :');
    console.log('='.repeat(70));
    console.log(\`DATABASE_URL=\${databaseUrl}\`);
    console.log('='.repeat(70));
    
    // Sauvegarder
    const fs = require('fs');
    fs.writeFileSync('neon-pooling-url.txt', 
      \`# Connection Pooling activé le \${new Date().toISOString()}\n\` +
      \`DATABASE_URL=\${databaseUrl}\n\`
    );
    
    console.log('\n��� URL sauvegardée dans: neon-pooling-url.txt');
    
  } catch (error) {
    console.error('\n❌ Erreur:', error.response ? error.response.data : error.message);
    
    // Si le pooler existe déjà
    if (error.response?.data?.message?.includes('already exists')) {
      console.log('\n��� Pooler existe déjà. Essayez cette URL:');
      console.log('DATABASE_URL=postgresql://neondb_owner:npg_y1iPFnCI5UKM@ep-wispy-hello-123456-pooler.us-east-2.aws.neon.tech:5432/neondb?sslmode=require');
    }
  }
}

enablePooling().catch(console.error);
