import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserProfile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        location: user.location || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setMessage('Profil mis à jour avec succès !');
        setIsEditing(false);
      } else {
        setMessage(`Erreur: ${result.error}`);
      }
    } catch (error) {
      setMessage('Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Mon Profil</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn btn-primary"
          disabled={loading}
        >
          {isEditing ? 'Annuler' : 'Modifier le profil'}
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded ${message.includes('Erreur') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}>
          {message}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Photo de profil */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
            {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </div>
          {isEditing && (
            <button className="w-full mt-4 btn btn-outline text-sm">
              Changer la photo
            </button>
          )}
        </div>

        {/* Informations du profil */}
        <div className="flex-1">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  placeholder="Votre nom complet"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                  placeholder="Votre email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Localisation
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input"
                  placeholder="Votre ville"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  className="input"
                  placeholder="Parlez-nous de vous..."
                />
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-outline"
                  disabled={loading}
                >
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Nom complet</p>
                  <p className="font-semibold">{user?.name || 'Non renseigné'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Localisation</p>
                  <p className="font-semibold">{user?.location || 'Non renseignée'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Membre depuis</p>
                  <p className="font-semibold">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'Date inconnue'}
                  </p>
                </div>
              </div>

              {user?.bio && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Bio</p>
                  <p className="text-gray-700 whitespace-pre-wrap">{user.bio}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;