# Security Guidelines — ByGagoos

## JWT & Authentication
- ✅ Tokens JWT signés avec `HS256` (via `jsonwebtoken`).
- ✅ Tokens valides 24 heures (expiresIn: '24h').
- ✅ Cookies HttpOnly en production (`secure: true`, `sameSite: lax`).
- ✅ Rate limiting sur endpoints d'auth (10 req/15min par IP).
- ⚠️ **TODO (production)**: Implémenter un refresh token et short-lived access token (15min).
- ⚠️ **TODO**: Gérer la déconnexion (token blacklist ou JWT révocation).

## Password Security
- ✅ Hachage bcryptjs avec 10 rounds (coût computational).
- ✅ Validation minimale (8 caractères minimum, déjà en place).
- ⚠️ **TODO (production)**: Ajouter complexité requise (majuscules, chiffres, caractères spéciaux).

## CORS & Headers
- ✅ CORS activé avec whitelist (localhost:5173 dev, localhost:3000 prod).
- ✅ `Helmet.js` pour sécuriser headers HTTP (CSP, X-Frame-Options, etc.).
- ⚠️ **TODO (production)**: Revoir CORS origins — ne pas utiliser wildcard.

## Database
- ✅ Requêtes paramétrées (protection SQL injection via `pg` client).
- ⚠️ **TODO**: Ajouter audit/logging des modifications sensibles.

## Environment Variables
- ⚠️ **CRITIQUE**: Ne jamais commiter `.env` — fichier ignoré via `.gitignore`.
- ⚠️ **CRITIQUE**: Utiliser `JWT_SECRET` et `DB_PASSWORD` différents en production.
- ✅ Exemple fourni: `.env.example` (à copier et compléter).

## Monitoring & Logging
- ✅ Morgan middleware pour HTTP request logging.
- ✅ Erreurs loggées avec stack trace (dev mode) / message générique (prod).
- ⚠️ **TODO**: Centraliser logs (fichier ou service externe).

## Inputs Validation
- ✅ Email normalisé (trim + lowercase) avant requête BD.
- ✅ Mot de passe > 8 caractères.
- ⚠️ **TODO**: Ajouter validation avec `joi` ou `zod` pour tous les endpoints.

## Production Checklist
- [ ] Changer `NODE_ENV=production`.
- [ ] Générer un `JWT_SECRET` fort (32+ caractères aléatoires).
- [ ] Configurer DB_PASSWORD sécurisé.
- [ ] Activer HTTPS (reverse proxy + certificat SSL).
- [ ] Activer secure cookies (sameSite, secure flag).
- [ ] Déployer client build (`npm run build`) sur même domaine.
- [ ] Revoir CORS origins.
- [ ] Configurer logs centralisés.
- [ ] Mettre en place monitoring (uptime, erreurs).

## Dépendances de Sécurité
- `helmet` v8 — headers HTTP sécurisés ✅
- `express-rate-limit` v7 — limitation de débit ✅
- `bcryptjs` v3 — hachage mot de passe ✅
- `jsonwebtoken` v9 — signature JWT ✅
- `cors` v2.8 — contrôle CORS ✅
- `cookie-parser` v1.4 — parsing cookies (HttpOnly) ✅
