import React from 'react';

const ContremaitreDashboard = ({ user }) => {
    const productionStats = [
        { label: 'Commandes en production', value: '8', trend: '+2' },
        { label: 'Équipe active', value: '6/8', trend: 'Complet' },
        { label: 'Retard moyen', value: '2h', trend: '-30min' },
        { label: 'Qualité', value: '98%', trend: '+1%' }
    ];

    return (
        <div className="dashboard-container">
            <div className="page-header">
                <h1>Tableau de Bord Contremaître</h1>
                <p>Bonjour {user?.name}, gestion de la production</p>
            </div>

            <div className="dashboard-content">
                <div className="welcome-section">
                    <h2>🏭 Supervision Production</h2>
                    <p>Surveillez l'avancement des commandes et l'équipe</p>
                </div>

                <div className="dashboard-section">
                    <h2 style={{ marginBottom: '1.5rem', color: '#111827' }}>Production</h2>
                    <div className="stats-grid">
                        {productionStats.map((stat, index) => (
                            <div key={index} className="stat-card">
                                <h3>{stat.label}</h3>
                                <div className="value">{stat.value}</div>
                                <div className="trend positive">{stat.trend}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="dashboard-section">
                    <h2 style={{ marginBottom: '1rem', color: '#111827' }}>Commandes Prioritaires</h2>
                    <div className="activity-list">
                        <div className="activity-item">
                            <div className="activity-icon">🚨</div>
                            <div className="activity-content">
                                <p>Commande #2458 - Livraison aujourd'hui</p>
                                <p className="activity-time">Début: 08:00 • Échéance: 16:00</p>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon">⚠️</div>
                            <div className="activity-content">
                                <p>Commande #2459 - En retard</p>
                                <p className="activity-time">Retard: 1h30 • Priorité: Haute</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContremaitreDashboard;