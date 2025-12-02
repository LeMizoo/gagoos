import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const fillDemoAccount = (email, password) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img
            src="/images/logos/gagoos.png"
            alt="Gagoos"
            className="mx-auto h-16 w-auto"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connexion à ByGagoos
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accédez à votre espace de travail
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-200"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>

          <div className="text-center">
            <Link to="/register" className="text-indigo-600 hover:text-indigo-500 text-sm">
              Créer un compte
            </Link>
          </div>

          {/* Comptes de démonstration */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3 text-center">
              Comptes de démonstration :
            </h3>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('gerante@bygagoos.com', 'demo123')}
                className="w-full text-left p-3 text-sm bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition duration-200"
              >
                <strong>Gérante</strong><br />
                gerante@bygagoos.com / demo123
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('contremaitre@bygagoos.com', 'demo123')}
                className="w-full text-left p-3 text-sm bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition duration-200"
              >
                <strong>Contremaître</strong><br />
                contraemaitre@bygagoos.com / demo123
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('salarie@bygagoos.com', 'demo123')}
                className="w-full text-left p-3 text-sm bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 transition duration-200"
              >
                <strong>Salarié</strong><br />
                salarie@bygagoos.com / demo123
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('admin@gagoos.com', 'password')}
                className="w-full text-left p-3 text-sm bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 transition duration-200"
              >
                <strong>Administrateur</strong><br />
                admin@gagoos.com / password
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;