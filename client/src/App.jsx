// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navigation from './components/shared/Navigation';
import './App.css';

// Pages publiques
import Home from './pages/Home';
import Products from './pages/Products';
import Features from './pages/Features';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Pages protégées
import Dashboard from './pages/Dashboard';
import Production from './pages/production/Production';
import StocksOverview from './pages/stocks/StocksOverview';
import GestionSalaries from './pages/rh/GestionSalaries';
import Fiscalite from './pages/comptabilite/Fiscalite';
import Unauthorized from './pages/Unauthorized';

// Composant Loading
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Chargement...</p>
    </div>
  </div>
);

// Composant App principal
function AppContent() {
  return (
    <div className="app-container">
      {/* Navigation visible partout */}
      <Navigation />

      {/* Contenu principal avec offset pour la nav fixe */}
      <div className="content-with-nav">
        <Routes>
          {/* ==================== ROUTES PUBLIQUES ==================== */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/features" element={<Features />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* ==================== ROUTES PROTÉGÉES ==================== */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/production/*"
            element={
              <ProtectedRoute requirePermission="production:manage">
                <Production />
              </ProtectedRoute>
            }
          />

          <Route
            path="/stocks/*"
            element={
              <ProtectedRoute requirePermission="stock:view">
                <StocksOverview />
              </ProtectedRoute>
            }
          />

          <Route
            path="/rh/*"
            element={
              <ProtectedRoute requirePermission="rh:manage">
                <GestionSalaries />
              </ProtectedRoute>
            }
          />

          <Route
            path="/comptabilite/*"
            element={
              <ProtectedRoute requirePermission="accounting:manage">
                <Fiscalite />
              </ProtectedRoute>
            }
          />

          {/* ==================== ROUTES ADMIN (optionnel) ==================== */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requireRole="admin">
                <div className="p-8">
                  <h1 className="text-3xl font-bold mb-6">Administration</h1>
                  <p>Espace réservé aux administrateurs</p>
                </div>
              </ProtectedRoute>
            }
          />

          {/* ==================== ROUTE DE CHARGEMENT ==================== */}
          <Route path="/loading" element={<LoadingSpinner />} />

          {/* ==================== REDIRECTIONS PAR DÉFAUT ==================== */}
          <Route path="/app" element={<Navigate to="/dashboard" replace />} />
          <Route path="/home" element={<Navigate to="/" replace />} />

          {/* ==================== ROUTE 404 ==================== */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center p-8">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-2xl text-gray-600 mb-8">Page non trouvée</p>
                <div className="space-y-4">
                  <a
                    href="/"
                    className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Retour à l'accueil
                  </a>
                  <br />
                  <a
                    href="/dashboard"
                    className="inline-block bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Tableau de bord
                  </a>
                </div>
              </div>
            </div>
          } />
        </Routes>
      </div>

      {/* Footer optionnel */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2024 ByGagoos. Tous droits réservés.</p>
          <p className="text-gray-500 text-sm mt-2">Version 2.1.0</p>
        </div>
      </footer>
    </div>
  );
}

// Composant App principal avec providers
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;