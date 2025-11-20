import React, { useState } from 'react';

const GestionSalaries = () => {
    const [salaries, setSalaries] = useState([
        {
            id: 1,
            nom: "Dupont",
            prenom: "Marie",
            email: "marie.dupont@bygagoos.com",
            poste: "Sérigraphe",
            date_embauche: "15/01/2022",
            salaire: "1850€",
            competences: ["Impression textile", "Gestion encres"]
        },
        {
            id: 2,
            nom: "Martin",
            prenom: "Pierre",
            email: "pierre.martin@bygagoos.com",
            poste: "Contre-maître",
            date_embauche: "10/03/2020",
            salaire: "2450€",
            competences: ["Supervision", "Contrôle qualité", "Formation"]
        }
    ]);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-bleu-serigraphie">
                    👥 Gestion des Salariés
                </h1>
                <button className="bg-bleu-serigraphie text-white px-4 py-2 rounded hover:bg-blue-700">
                    + Nouveau Salarié
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {salaries.map(salarie => (
                    <div key={salarie.id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold">
                                    {salarie.prenom} {salarie.nom}
                                </h3>
                                <p className="text-gray-600">{salarie.poste}</p>
                                <p className="text-sm text-gray-500">{salarie.email}</p>
                            </div>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                                Actif
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Date d'embauche:</span>
                                <span className="font-medium">{salarie.date_embauche}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Salaire mensuel:</span>
                                <span className="font-bold text-green-500">{salarie.salaire}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Compétences:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {salarie.competences.map((competence, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                                        >
                                            {competence}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-2 mt-4">
                            <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200">
                                Modifier
                            </button>
                            <button className="flex-1 bg-bleu-serigraphie text-white py-2 rounded hover:bg-blue-700">
                                Voir fiche
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GestionSalaries;