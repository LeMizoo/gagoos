import React, { useState } from 'react';

const AlertesStocks = () => {
    const [alertes, setAlertes] = useState([
        {
            id: 1,
            produit: "Encre noire PVC",
            type: "Encre",
            niveau: "CRITIQUE",
            quantite_actuelle: "8 kg",
            seuil: "10 kg",
            date_alerte: "15/12/2024"
        },
        {
            id: 2,
            produit: "Flyers 90g",
            type: "Support",
            niveau: "FAIBLE",
            quantite_actuelle: "85 unités",
            seuil: "200 unités",
            date_alerte: "14/12/2024"
        },
        {
            id: 3,
            produit: "Racles standard",
            type: "Consommable",
            niveau: "CRITIQUE",
            quantite_actuelle: "3 unités",
            seuil: "5 unités",
            date_alerte: "16/12/2024"
        }
    ]);

    const getNiveauColor = (niveau) => {
        const colors = {
            'CRITIQUE': 'bg-red-100 text-red-800 border-red-200',
            'FAIBLE': 'bg-orange-100 text-orange-800 border-orange-200',
            'NORMAL': 'bg-green-100 text-green-800 border-green-200'
        };
        return colors[niveau] || 'bg-gray-100 text-gray-800';
    };

    const commanderProduit = (id) => {
        setAlertes(alertes.filter(alerte => alerte.id !== id));
        // Ici, vous intégrerez l'API de commande
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-bleu-serigraphie mb-6">
                🚨 Alertes de Stocks
            </h1>

            <div className="space-y-4">
                {alertes.map(alerte => (
                    <div key={alerte.id} className={`border rounded-lg p-4 ${getNiveauColor(alerte.niveau)}`}>
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg">{alerte.produit}</h3>
                                <p className="text-sm">Type: {alerte.type}</p>
                                <p className="text-sm">Stock actuel: {alerte.quantite_actuelle}</p>
                                <p className="text-sm">Seuil d'alerte: {alerte.seuil}</p>
                                <p className="text-xs text-gray-600">Alerte depuis: {alerte.date_alerte}</p>
                            </div>
                            <div className="text-right">
                                <span className={`inline-block px-3 py-1 rounded-full font-bold ${alerte.niveau === 'CRITIQUE' ? 'bg-red-500 text-white' :
                                    alerte.niveau === 'FAIBLE' ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'
                                    }`}>
                                    {alerte.niveau}
                                </span>
                                <button
                                    onClick={() => commanderProduit(alerte.id)}
                                    className="mt-2 bg-bleu-serigraphie text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Commander
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {alertes.length === 0 && (
                    <div className="text-center py-8 bg-green-50 rounded-lg">
                        <span className="text-4xl">✅</span>
                        <p className="text-xl font-semibold text-green-800 mt-2">Aucune alerte de stock</p>
                        <p className="text-green-600">Tous vos stocks sont à des niveaux optimaux</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlertesStocks;