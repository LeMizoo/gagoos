import React, { useState } from 'react';

const GestionEtapes = () => {
    const [etapes, setEtapes] = useState([
        { id: 1, nom: "Création cadres", duree: "2h", statut: "Terminé" },
        { id: 2, nom: "Préparation encres", duree: "1h", statut: "En cours" },
        { id: 3, nom: "Impression", duree: "4h", statut: "À faire" },
        { id: 4, nom: "Séchage", duree: "6h", statut: "À faire" },
        { id: 5, nom: "Contrôle qualité", duree: "1h", statut: "À faire" }
    ]);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-bleu-serigraphie mb-6">
                🏭 Gestion des Étapes de Production
            </h1>

            <div className="space-y-4">
                {etapes.map(etape => (
                    <div key={etape.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold">{etape.nom}</h3>
                            <p className="text-sm text-gray-600">Durée: {etape.duree}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${etape.statut === 'Terminé' ? 'bg-green-100 text-green-800' :
                            etape.statut === 'En cours' ? 'bg-orange-100 text-orange-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                            {etape.statut}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GestionEtapes;