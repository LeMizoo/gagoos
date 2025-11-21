import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
// Icônes Lucide pour afficher/masquer
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'salarie' // valeur par défaut
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // États pour afficher/masquer les mots de passe
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation des champs requis
    if (!formData.prenom || !formData.nom || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Tous les champs obligatoires doivent être remplis');
      return;
    }

    // Vérification côté frontend
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    setLoading(true);

    // ✅ CORRECTION: Construire l'objet avec les champs requis par le backend
    const userData = {
      prenom: formData.prenom.trim(),
      nom: formData.nom.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      role: formData.role,
      departement: 'Production' // Valeur par défaut
    };

    console.log('📝 Données d\'inscription:', userData);

    const result = await register(userData);

    if (result.success) {
      // Redirection vers le dashboard après inscription réussie
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="/images/logos/gagoos.png"
            alt="ByGagoos"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer votre compte
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Champ prénom */}
            <div>
              <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
                Prénom *
              </label>
              <input
                id="prenom"
                name="prenom"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Votre prénom"
                value={formData.prenom}
                onChange={handleChange}
              />
            </div>

            {/* Champ nom */}
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                Nom *
              </label>
              <input
                id="nom"
                name="nom"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Votre nom"
                value={formData.nom}
                onChange={handleChange}
              />
            </div>

            {/* Champ email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="adresse@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Champ mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Votre mot de passe"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Champ confirmation mot de passe */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmer le mot de passe *
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirmer le mot de passe"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Champ rôle */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Rôle
              </label>
              <select
                id="role"
                name="role"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="salarie">Salarié</option>
                <option value="contremaitre">Contremaître</option>
                <option value="gerante">Gérante</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Bouton submit */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Création du compte...' : 'Créer le compte'}
            </button>
          </div>

          {/* Lien vers login */}
          <div className="text-center">
            <a href="/login" className="text-blue-600 hover:text-blue-500">
              Déjà un compte ? Se connecter
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;