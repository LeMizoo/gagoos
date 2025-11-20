import React from 'react';

const SalarieDashboard = ({ user }) => {
    const tasks = [
        { task: 'Finir commande #2458', progress: 75, deadline: 'Aujourd\'hui 16:00' },
        { task: 'Préparer commande #2460', progress: 0, deadline: 'Demain 10:00' },
        { task: 'Contrôle qualité #2457', progress: 100, deadline: 'Terminé' }
    ];

    return (
        <div className="dashboard-container">
            <div className="page-header">
                <h1>Tableau de Bord Salarié</h1>
                <p>Bonjour {user?.name}, voici vos tâches du jour</p>
            </div>

            <div className="dashboard-content">
                <div className="welcome-section">
                    <h2>👷 Mes Tâches</h2>
                    <p>Suivez votre progression et vos échéances</p>
                </div>

                <div className="dashboard-section">
                    <h2 style={{ marginBottom: '1rem', color: '#111827' }}>Tâches en Cours</h2>
                    <div className="activity-list">
                        {tasks.map((task, index) => (
                            <div key={index} className="activity-item">
                                <div className="activity-icon">
                                    {task.progress === 100 ? '✅' : '🔄'}
                                </div>
                                <div className="activity-content">
                                    <p>{task.task}</p>
                                    <p className="activity-time">
                                        Progression: {task.progress}% • {task.deadline}
                                    </p>
                                    {task.progress < 100 && (
                                        <div style={{
                                            width: '100%',
                                            height: '4px',
                                            background: '#e5e7eb',
                                            borderRadius: '2px',
                                            marginTop: '0.5rem'
                                        }}>
                                            <div style={{
                                                width: `${task.progress}%`,
                                                height: '100%',
                                                background: '#10b981',
                                                borderRadius: '2px'
                                            }}></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalarieDashboard;