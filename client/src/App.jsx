import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/shared/Navigation';
import './App.css';

// Pages publiques
import Home from './pages/Home';
import Products from './pages/Products';
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

// Composant App principal
function AppContent() {
  const { isAuthenticated } = useAuth();

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
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* ==================== REDIRECTIONS ==================== */}
          <Route path="/dashboard" element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
          } />

          {/* ==================== ROUTES PROTÉGÉES ==================== */}
          <Route path="/production/*" element={
            <ProtectedRoute requiredPermission="production">
              <Production />
            </ProtectedRoute>
          } />

          <Route path="/stocks/*" element={
            <ProtectedRoute requiredPermission="stocks">
              <StocksOverview />
            </ProtectedRoute>
          } />

          <Route path="/rh/*" element={
            <ProtectedRoute requiredPermission="rh">
              <GestionSalaries />
            </ProtectedRoute>
          } />

          <Route path="/comptabilite/*" element={
            <ProtectedRoute requiredPermission="comptabilite">
              <Fiscalite />
            </ProtectedRoute>
          } />

          {/* ==================== ROUTE 404 ==================== */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-xl text-gray-600">Page non trouvée</p>
                <button
                  onClick={() => window.history.back()}
                  className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Retour
                </button>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </div>
  );
}

// Composant App principal avec providers
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;