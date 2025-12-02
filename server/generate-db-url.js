require('dotenv').config();

const password = encodeURIComponent(process.env.DB_PASSWORD || '');
const dbUrl = `postgresql://${process.env.DB_USER}:${password}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?sslmode=require`;

console.log('🔐 URL de connexion PostgreSQL générée :');
console.log('\n' + dbUrl + '\n');
console.log('📋 Copiez cette ligne dans votre .env :');
console.log(`DATABASE_URL=${dbUrl}`);