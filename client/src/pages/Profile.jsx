import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    bio: ''
  });

  const handleSave = () => {
    // Ici vous intégrerez la logique de sauvegarde
    console.log('Profil sauvegardé:', profileData);
    setIsEditing(false);
    alert('Profil mis à jour avec succès!');
  };

  return (
    <div className="fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon Profil</h1>
          <p className="text-gray-600">Gérez vos informations personnelles et vos préférences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations profil */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-header flex justify-between items-center">
                <h2 className="text-xl font-semibold">Informations Personnelles</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn btn-outline"
                >
                  {isEditing ? 'Annuler' : 'Modifier'}
                </button>
              </div>
              <div className="card-body">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="label">Nom complet</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          className="input"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="label">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          className="input"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="label">Téléphone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          className="input"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.phone || 'Non renseigné'}</p>
                      )}
                    </div>
                    <div>
                      <label className="label">Adresse</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.address}
                          onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                          className="input"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.address || 'Non renseignée'}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="label">Bio</label>
                    {isEditing ? (
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        rows={4}
                        className="input resize-none"
                        placeholder="Parlez-nous un peu de vous..."
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.bio || 'Aucune bio renseignée'}</p>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="btn btn-outline"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleSave}
                        className="btn btn-primary"
                      >
                        Sauvegarder
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Avatar */}
            <div className="card text-center">
              <div className="card-body">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 overflow-hidden">
                  <img 
                    src="/images/famille/Ntsika01.png" 
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold">{user?.name}</h3>
                <p className="text-gray-600 text-sm">{user?.email}</p>
                <button className="btn btn-outline mt-4 text-sm">
                  Changer la photo
                </button>
              </div>
            </div>

            {/* Statistiques */}
            <div className="card">
              <div className="card-header">
                <h3 className="font-semibold">Activité</h3>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commandes</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Favoris</span>
                    <span className="font-semibold">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Membre depuis</span>
                    <span className="font-semibold">2024</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="card">
              <div className="card-header">
                <h3 className="font-semibold">Actions Rapides</h3>
              </div>
              <div className="card-body space-y-2">
                <button className="btn btn-outline w-full justify-start text-sm">
                  Mes commandes
                </button>
                <button className="btn btn-outline w-full justify-start text-sm">
                  Mes favoris
                </button>
                <button className="btn btn-outline w-full justify-start text-sm">
                  Paramètres de notification
                </button>
                <button className="btn btn-outline w-full justify-start text-sm text-red-600 hover:text-red-700">
                  Supprimer le compte
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;