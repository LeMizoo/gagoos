# ByGagoos

Projet ByGagoos — API Node/Express + frontend React (Vite).

## Prérequis
- Node.js >= 18
- PostgreSQL (base `bygagoos` ou laisser `npm run init-db` créer la DB)

## Installation (serveur)
```powershell
cd server
npm install
# configurer .env si besoin (ex: DB_* et JWT_SECRET)
npm run init-db   # optionnel: crée tables et utilisateurs par défaut
npm run dev       # démarre en mode développement (nodemon)
# ou
npm run production
```

## Installation (client)
```powershell
cd client
npm install
npm run dev
```

## Tests rapides
- API health: `GET http://localhost:5000/api/health`
- Inscription: `POST http://localhost:5000/api/auth/register`
- Connexion: `POST http://localhost:5000/api/auth/login`

## Notes
- Ne partagez pas le fichier `.env` publicement.
- En production, définissez `NODE_ENV=production` et fournissez un `JWT_SECRET` fort.
