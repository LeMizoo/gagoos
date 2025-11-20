import { Link } from 'react-router-dom';

const Unauthorized = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="text-6xl mb-4">🚫</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Accès non autorisé
                </h1>
                <p className="text-gray-600 mb-6">
                    Vous n'avez pas les permissions nécessaires pour accéder à cette page.
                </p>
                <Link
                    to="/dashboard"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                    Retour au tableau de bord
                </Link>
            </div>
        </div>
    );
};

export default Unauthorized;