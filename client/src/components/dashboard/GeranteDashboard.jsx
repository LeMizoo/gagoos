// components/dashboard/GeranteDashboard.jsx
import React, { useEffect, useState } from 'react';

const GeranteDashboard = () => {
    const [chiffresCles, setChiffresCles] = useState({
        ca_mois_courant: "4 250€",
        commandes_en_cours: 12,
        depenses_mois: "2 800€",
        marge_nette: "1 450€"
    });

    const [alertes, setAlertes] = useState({
        stocks_critiques: ["Encre noire", "T-shirts XL"],
        echeances_fiscales: "TVA - 20/12",
        retards_paiement: ["Client X - 15j"]
    });

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold text-bleu-serigraphie">
                Tableau de Bord Gérante
            </h1>

            {/* Chiffres clés */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-gray-500">CA du mois</h3>
                    <p className="text-2xl font-bold text-orange-creatif">
                        {chiffresCles.ca_mois_courant}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-gray-500">Commandes en cours</h3>
                    <p className="text-2xl font-bold text-bleu-serigraphie">
                        {chiffresCles.commandes_en_cours}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-gray-500">Dépenses du mois</h3>
                    <p className="text-2xl font-bold text-red-500">
                        {chiffresCles.depenses_mois}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-gray-500">Marge nette</h3>
                    <p className="text-2xl font-bold text-green-500">
                        {chiffresCles.marge_nette}
                    </p>
                </div>
            </div>

            {/* Alertes */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">🚨 Alertes</h2>
                <div className="space-y-2">
                    <div className="flex items-center text-red-500">
                        <span>📦</span>
                        <span>Stocks critiques: {alertes.stocks_critiques.join(', ')}</span>
                    </div>
                    <div className="flex items-center text-orange-creatif">
                        <span>📋</span>
                        <span>Échéance: {alertes.echeances_fiscales}</span>
                    </div>
                    <div className="flex items-center text-yellow-500">
                        <span>⏰</span>
                        <span>Retards: {alertes.retards_paiement.join(', ')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeranteDashboard;