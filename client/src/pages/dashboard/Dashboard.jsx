import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    // Dashboard simple temporaire
    const SimpleDashboard = ({ user }) => {
        const stats = [
            { label: 'Commandes du jour', value: '12', trend: '+3' },
            { label: 'Taux de complétion', value: '85%', trend: '+5%' },
            { label: 'Équipe active', value: '8/10', trend: '✓' },
            { label: 'Satisfaction', value: '92%', trend: '+2%' }
        ];

        return (
            <div className="dashboard-container">
                <div className="page-header">
                    <h1>Tableau de Bord {user?.role}</h1>
                    <p>Bonjour {user?.name}, bienvenue sur votre espace de travail</p>
                </div>

                <div className="dashboard-content">
                    <div className="welcome-section">
                        <h2>👋 Bienvenue chez ByGagoos</h2>
                        <p>Votre espace personnel de gestion et suivi</p>
                    </div>

                    <div className="dashboard-section">
                        <h2 style={{ marginBottom: '1.5rem', color: '#111827' }}>Aperçu Rapide</h2>
                        <div className="stats-grid">
                            {stats.map((stat, index) => (
                                <div key={index} className="stat-card">
                                    <h3>{stat.label}</h3>
                                    <div className="value">{stat.value}</div>
                                    <div className={`trend ${stat.trend.startsWith('+') || stat.trend === '✓' ? 'positive' : 'negative'}`}>
                                        {stat.trend}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="dashboard-section">
                        <h2 style={{ marginBottom: '1rem', color: '#111827' }}>Actions Disponibles</h2>
                        <div className="quick-actions">
                            <a href="/production" className="action-btn">
                                <span className="icon">🏭</span>
                                <span>Production</span>
                            </a>
                            <a href="/stocks" className="action-btn">
                                <span className="icon">📦</span>
                                <span>Stocks</span>
                            </a>
                            <a href="/rh" className="action-btn">
                                <span className="icon">👥</span>
                                <span>Équipe</span>
                            </a>
                            <a href="/comptabilite" className="action-btn">
                                <span className="icon">💰</span>
                                <span>Comptabilité</span>
                            </a>
                        </div>
                    </div>

                    <div className="dashboard-section">
                        <h2 style={{ marginBottom: '1rem', color: '#111827' }}>Prochaines Étapes</h2>
                        <div className="activity-list">
                            <div className="activity-item">
                                <div className="activity-icon">1</div>
                                <div className="activity-content">
                                    <p>Compléter votre profil utilisateur</p>
                                    <p className="activity-time">Configuration • 5 minutes</p>
                                </div>
                            </div>
                            <div className="activity-item">
                                <div className="activity-icon">2</div>
                                <div className="activity-content">
                                    <p>Explorer les modules disponibles</p>
                                    <p className="activity-time">Découverte • 10 minutes</p>
                                </div>
                            </div>
                            <div className="activity-item">
                                <div className="activity-icon">3</div>
                                <div className="activity-content">
                                    <p>Consulter la documentation</p>
                                    <p className="activity-time">Aide • 15 minutes</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (!user) {
        return (
            <div className="dashboard-container">
                <div className="page-header">
                    <h1>Accès non autorisé</h1>
                    <p>Veuillez vous connecter pour accéder au dashboard.</p>
                </div>
                <div className="dashboard-content">
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <p>Redirection vers la page de connexion...</p>
                        <a href="/login" className="action-btn" style={{ display: 'inline-flex', marginTop: '1rem' }}>
                            Se connecter
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return <SimpleDashboard user={user} />;
};

export default Dashboard;