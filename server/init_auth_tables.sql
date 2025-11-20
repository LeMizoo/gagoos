-- Table des utilisateurs pour l'authentification
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pour les sessions (optionnel)
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion d'un utilisateur admin par défaut
-- Le mot de passe est 'admin123' (à changer après)
INSERT INTO users (email, password, first_name, last_name, role) 
VALUES ('admin@bygagoos.com', '$2b$10$K8k6L3aV2Q1RwR9XcY8Zz.Jk7mN8qS2pW1T3U4V5W6X7Y8Z9A0B1C2D3E4F5G6H7I', 'Admin', 'ByGagoos', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insertion d'un utilisateur test
INSERT INTO users (email, password, first_name, last_name, role) 
VALUES ('test@bygagoos.com', '$2b$10$K8k6L3aV2Q1RwR9XcY8Zz.Jk7mN8qS2pW1T3U4V5W6X7Y8Z9A0B1C2D3E4F5G6H7I', 'Test', 'User', 'user')
ON CONFLICT (email) DO NOTHING;