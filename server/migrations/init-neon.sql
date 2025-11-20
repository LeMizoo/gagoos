-- Tables principales pour ByGagoos
CREATE TABLE IF NOT EXISTS utilisateurs (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe_hash VARCHAR(255) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('gerante', 'contremaitre', 'salarie', 'commercial')),
    date_embauche DATE,
    taux_horaire DECIMAL(10,2),
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS commandes (
    id SERIAL PRIMARY KEY,
    reference VARCHAR(100) UNIQUE NOT NULL,
    client_id INTEGER,
    type_produit VARCHAR(50) NOT NULL,
    quantite INTEGER NOT NULL,
    delai DATE NOT NULL,
    statut VARCHAR(50) NOT NULL DEFAULT 'En conception',
    priorite VARCHAR(20) DEFAULT 'Normal',
    informations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insérez un utilisateur admin par défaut
INSERT INTO utilisateurs (email, mot_de_passe_hash, nom, prenom, role) 
VALUES (
  'admin@bygagoos.com',
  '$2a$12$LQv3c1yqBNWB1lPXLUyxjOqQ5D2T5B5b5k5N5Y5J5Z5O5d5J5b5O5', -- motdepasse
  'Admin',
  'ByGagoos',
  'gerante'
) ON CONFLICT (email) DO NOTHING;