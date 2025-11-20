import React from 'react';

const GeranteDashboard = ({ user }) => {
    const stats = [
        { label: 'Chiffre d\'affaires', value: '12,450 €', trend: '+12%' },
        { label: 'Commandes en cours', value: '24', trend: '+5%' },
        { label: 'Produits vendus', value: '156', trend: '+8%' },
        { label: 'Satisfaction client', value: '94%', trend: '+2%' }
    ];

    const quickActions = [
        { label: 'Nouvelle Commande', icon: '📦', path: '/production' },
        { label: 'Gérer Stocks', icon: '📊', path: '/stocks' },
        { label: 'Équipe RH', icon: '👥', path: '/rh' },
        { label: 'Comptabilité', icon: '💰', path: '/comptabilite' }
    ];

    const recentActivities = [
        { action: 'Nouvelle commande #2456', time: 'Il y a 5 min', user: 'Client Dupont' },
        { action: 'Stock mis à jour', time: 'Il y a 15 min', user: 'Marie' },
        { action: 'Paiement reçu #2455', time: 'Il y a 1 heure', user: 'Comptabilité' },
        { action: 'Production terminée', time: 'Il y a 2 heures', user: 'Atelier' }
    ];

    return (
        <div className="dashboard-container">
            {/* Header */}
            <div className="page-header">
                <h1>Tableau de Bord Gérante</h1>
                <p>Bonjour {user?.name}, voici l'aperçu de votre activité</p>
            </div>

            {/* Contenu principal */}
            <div className="dashboard-content">
                {/* Section de bienvenue */}
                <div className="welcome-section">
                    <h2>📊 Vue d'ensemble de l'entreprise</h2>
                    <p>Surveillez les performances et gérez vos activités</p>
                </div>

                {/* Statistiques */}
                <div className="dashboard-section">
                    <h2 style={{ marginBottom: '1.5rem', color: '#111827' }}>Indicateurs Clés</h2>
                    <div className="stats-grid">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-card">
                                <h3>{stat.label}</h3>
                                <div className="value">{stat.value}</div>
                                <div className={`trend ${stat.trend.startsWith('+') ? 'positive' : 'negative'}`}>
                                    {stat.trend}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions rapides */}
                <div className="dashboard-section">
                    <h2 style={{ marginBottom: '1rem', color: '#111827' }}>Actions Rapides</h2>
                    <div className="quick-actions">
                        {quickActions.map((action, index) => (
                            <a key={index} href={action.path} className="action-btn">
                                <span className="icon">{action.icon}</span>
                                <span>{action.label}</span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Activité récente */}
                <div className="dashboard-section">
                    <h2 style={{ marginBottom: '1rem', color: '#111827' }}>Activité Récente</h2>
                    <div className="activity-list">
                        {recentActivities.map((activity, index) => (
                            <div key={index} className="activity-item">
                                <div className="activity-icon">
                                    {index + 1}
                                </div>
                                <div className="activity-content">
                                    <p>{activity.action}</p>
                                    <p className="activity-time">{activity.time} • {activity.user}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeranteDashboard;