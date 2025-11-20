import React, { useState } from 'react';

const RolesPermissions = () => {
    const [roles, setRoles] = useState([
        {
            id: 1,
            nom: "Gérante",
            description: "Accès complet à l'application",
            permissions: [
                "Accès complet",
                "Gestion fiscale",
                "Validation financière",
                "Gestion utilisateurs"
            ],
            utilisateurs: ["Sophie Gérante"]
        },
        {
            id: 2,
            nom: "Contre-maître",
            description: "Gestion production et équipe",
            permissions: [
                "Gestion production",
                "Gestion stocks",
                "Pointage équipe",
                "Suivi commandes"
            ],
            utilisateurs: ["Pierre Martin"]
        },
        {
            id: 3,
            nom: "Salarié",
            description: "Accès basique",
            permissions: [
                "Pointage personnel",
                "Consultation fiche",
                "Demande congés"
            ],
            utilisateurs: ["Marie Dupont", "Jean Technician"]
        }
    ]);

    const [nouveauRole, setNouveauRole] = useState({
        nom: "",
        description: "",
        permissions: []
    });

    const permissionsDisponibles = [
        "Accès complet",
        "Gestion production",
        "Gestion stocks",
        "Gestion RH",
        "Gestion comptabilité",
        "Gestion fiscale",
        "Pointage équipe",
        "Pointage personnel",
        "Validation financière",
        "Gestion utilisateurs"
    ];

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold text-bleu-serigraphie">
                🔐 Rôles et Permissions
            </h1>

            {/* Liste des rôles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {roles.map(role => (
                    <div key={role.id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-bleu-serigraphie">
                                    {role.nom}
                                </h3>
                                <p className="text-gray-600 text-sm">{role.description}</p>
                            </div>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                {role.utilisateurs.length} utilisateurs
                            </span>
                        </div>

                        <div className="mb-4">
                            <h4 className="font-semibold mb-2">Permissions:</h4>
                            <ul className="space-y-1">
                                {role.permissions.map((permission, index) => (
                                    <li key={index} className="flex items-center text-sm">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                        {permission}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Utilisateurs:</h4>
                            <p className="text-sm text-gray-600">
                                {role.utilisateurs.join(", ")}
                            </p>
                        </div>

                        <div className="flex space-x-2 mt-4">
                            <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded text-sm hover:bg-gray-200">
                                Modifier
                            </button>
                            <button className="flex-1 bg-bleu-serigraphie text-white py-2 rounded text-sm hover:bg-blue-700">
                                Gérer
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Ajouter un rôle */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Ajouter un nouveau rôle</h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Nom du rôle"
                            className="border rounded p-2"
                            value={nouveauRole.nom}
                            onChange={(e) => setNouveauRole({ ...nouveauRole, nom: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            className="border rounded p-2"
                            value={nouveauRole.description}
                            onChange={(e) => setNouveauRole({ ...nouveauRole, description: e.target.value })}
                        />
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2">Sélectionner les permissions:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                            {permissionsDisponibles.map((permission, index) => (
                                <label key={index} className="flex items-center space-x-2">
                                    <input type="checkbox" className="rounded" />
                                    <span className="text-sm">{permission}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600">
                        Créer le rôle
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RolesPermissions;