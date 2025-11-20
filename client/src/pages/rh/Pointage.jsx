import React, { useState } from 'react';

const Pointage = () => {
    const [pointages, setPointages] = useState([
        {
            id: 1,
            salarie: "Marie Dupont",
            date: "15/12/2024",
            heure_entree: "08:00",
            heure_sortie: "17:00",
            heures_travaillees: "8h",
            heures_supp: "1h"
        },
        {
            id: 2,
            salarie: "Pierre Martin",
            date: "15/12/2024",
            heure_entree: "07:45",
            heure_sortie: "16:30",
            heures_travaillees: "8h",
            heures_supp: "0h"
        }
    ]);

    const [nouveauPointage, setNouveauPointage] = useState({
        salarie: "",
        heure_entree: "",
        heure_sortie: ""
    });

    const ajouterPointage = () => {
        // Logique d'ajout de pointage
        console.log("Ajouter pointage:", nouveauPointage);
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-bleu-serigraphie mb-6">
                ⏱️ Gestion des Pointages
            </h1>

            {/* Formulaire d'ajout */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h2 className="text-xl font-bold mb-4">Nouveau Pointage</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <select
                        value={nouveauPointage.salarie}
                        onChange={(e) => setNouveauPointage({ ...nouveauPointage, salarie: e.target.value })}
                        className="border rounded p-2"
                    >
                        <option value="">Sélectionner un salarié</option>
                        <option value="Marie Dupont">Marie Dupont</option>
                        <option value="Pierre Martin">Pierre Martin</option>
                    </select>
                    <input
                        type="time"
                        value={nouveauPointage.heure_entree}
                        onChange={(e) => setNouveauPointage({ ...nouveauPointage, heure_entree: e.target.value })}
                        className="border rounded p-2"
                        placeholder="Heure d'entrée"
                    />
                    <input
                        type="time"
                        value={nouveauPointage.heure_sortie}
                        onChange={(e) => setNouveauPointage({ ...nouveauPointage, heure_sortie: e.target.value })}
                        className="border rounded p-2"
                        placeholder="Heure de sortie"
                    />
                    <button
                        onClick={ajouterPointage}
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                    >
                        Ajouter
                    </button>
                </div>
            </div>

            {/* Liste des pointages */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-bleu-serigraphie text-white">
                        <tr>
                            <th className="p-3 text-left">Salarié</th>
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">Entrée</th>
                            <th className="p-3 text-left">Sortie</th>
                            <th className="p-3 text-left">Heures travaillées</th>
                            <th className="p-3 text-left">Heures supp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pointages.map(pointage => (
                            <tr key={pointage.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-medium">{pointage.salarie}</td>
                                <td className="p-3">{pointage.date}</td>
                                <td className="p-3 text-green-500">{pointage.heure_entree}</td>
                                <td className="p-3 text-red-500">{pointage.heure_sortie}</td>
                                <td className="p-3 font-bold">{pointage.heures_travaillees}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded ${pointage.heures_supp === "0h" ? 'bg-gray-100 text-gray-800' : 'bg-orange-100 text-orange-800'
                                        }`}>
                                        {pointage.heures_supp}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Pointage;