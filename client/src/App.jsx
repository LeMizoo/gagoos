// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import LoadingSpinner from './components/ui/LoadingSpinner';
import Header from './components/ui/Header';  // NOUVEAU HEADER
import Footer from './components/ui/Footer';  // NOUVEAU FOOTER
import './index.css';

// Import de TOUTES les pages
import Home from './pages/Home';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Gallery from './pages/Gallery';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';

// Composant pour protéger les routes
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Composant pour les routes publiques (redirige si déjà connecté)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  return !user ? children : <Navigate to="/dashboard" />;
};

// Layout principal AVEC NOUVEAUX HEADER/FOOTER
const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />  {/* NOUVEAU HEADER */}
      <main className="flex-grow">
        {children}
      </main>
      <Footer />  {/* NOUVEAU FOOTER */}
    </div>
  );
};

// Composant de page 404
const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page non trouvée</p>
        <a 
          href="/" 
          className="btn btn-primary"
        >
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Route racine - Page d'accueil publique */}
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            
            {/* Routes publiques avec layout */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <MainLayout>
                    <Login />
                  </MainLayout>
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <MainLayout>
                    <Register />
                  </MainLayout>
                </PublicRoute>
              } 
            />
            
            {/* Routes publiques normales */}
            <Route path="/features" element={<MainLayout><Features /></MainLayout>} />
            <Route path="/pricing" element={<MainLayout><Pricing /></MainLayout>} />
            <Route path="/gallery" element={<MainLayout><Gallery /></MainLayout>} />
            <Route path="/products" element={<MainLayout><Products /></MainLayout>} />
            <Route path="/about" element={<MainLayout><About /></MainLayout>} />
            <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
            
            {/* Routes protégées */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <MainLayout><Dashboard /></MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <MainLayout><Profile /></MainLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* Route 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;