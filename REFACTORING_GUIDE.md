# Recommandations Refactoring

## 📌 Priorité 1 : Harmoniser Authentification

Tous les fichiers de routes redéfinissent leur propre middleware `authenticateToken`.

**Solution :** Utiliser le middleware centralisé `server/middleware/authenticateToken.js` :

```javascript
// Avant (dans chaque route)
const authenticateToken = (req, res, next) => { /* ... */ };

// Après
const { authenticateToken, requireRole } = require('../middleware/authenticateToken');

// Usage
router.get('/admin-endpoint', authenticateToken, requireRole('admin'), handler);
```

**Fichiers à refactoriser :**
- `routes/dashboard.js` — réutiliser middleware centralisé
- `routes/stock.js` — importe `auth` depuis middleware, à harmoniser
- `routes/parametres.js` — vérifier pattern
- `routes/upload.js` — vérifier pattern
- `routes/posts.js` — vérifier pattern

---

## 📌 Priorité 2 : Validation Minimale Unifiée

Ajouter validation pour tous les POST/PUT :

```javascript
const { query, body, validationResult } = require('express-validator');

router.post('/commandes', 
  authenticateToken,
  requireRole('admin'),
  body('date_commande').isISO8601(),
  body('couleur_tissus').trim().notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  handler
);
```

---

## 📌 Priorité 3 : Gestion d'Erreurs Cohérente

Créer un middleware centralisé pour répondre aux erreurs (dev vs prod) :

```javascript
// middleware/errorHandler.js
module.exports = (err, req, res, next) => {
  const isDev = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    message: isDev ? err.message : 'Erreur serveur',
    ...(isDev && { stack: err.stack })
  });
};
```

---

## 📌 Priorité 4 : Logging Structuré

Utiliser `winston` pour centraliser les logs :

```bash
npm install winston
```

```javascript
// utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

---

## 📌 Priorité 5 : Protection CSRF (si cookies)

Si les clients utilisent les cookies HttpOnly, ajouter protection CSRF :

```bash
npm install csurf
```

```javascript
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: false });

app.get('/form', csrfProtection, (req, res) => {
  res.send(`<input type="hidden" name="_csrf" value="${req.csrfToken()}">`);
});
```

---

## 📌 Priorité 6 : Tests Unitaires

Ajouter suite de tests avec Jest + supertest :

```bash
npm install --save-dev jest supertest
```

```javascript
// __tests__/auth.test.js
const request = require('supertest');
const app = require('../server');

describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@test.com',
        password: 'TestPass123!',
        first_name: 'Test',
        last_name: 'User'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should reject short passwords', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test2@test.com',
        password: 'short'
      });

    expect(res.statusCode).toBe(400);
  });
});
```

---

## 📌 Vérifications de Code

- [ ] Aucun `console.log()` en prod (utiliser logger).
- [ ] Tous les endpoints authentifiés exigent token.
- [ ] Réponses d'erreur ne révèlent pas infos sensibles.
- [ ] Rate limiter sur endpoints sensibles.
- [ ] Validation input sur tous les POST/PUT/PATCH.
- [ ] Tests de couverture minimal (auth, happy path).

---

## 📋 Checklist Refactoring Rapid (2-3h)

1. [ ] Copier `authenticateToken` + `requireRole` dans tous les routes.
2. [ ] Ajouter `express-validator` pour validation.
3. [ ] Créer `errorHandler` middleware.
4. [ ] Remplacer `console.error()` par `logger`.
5. [ ] Ajouter 3-5 tests Jest pour `/api/auth`.
6. [ ] Vérifier CORS et CSP avec Helmet.
