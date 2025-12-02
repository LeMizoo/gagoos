import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    name: user?.name || 'Jean Dupont',
    email: user?.email || 'jean.dupont@email.com',
    phone: '+33 6 12 34 56 78',
    address: '123 Rue de la République, 75001 Paris',
    bio: 'Artisan passionné par la création de pièces uniques. Amoureux des matériaux nobles et des finitions soignées.'
  });

  const [stats, setStats] = useState({
    orders: 12,
    favorites: 8,
    memberSince: 2024,
    completedProjects: 24
  });

  const handleSave = () => {
    console.log('Profil sauvegardé:', profileData);
    setIsEditing(false);

    // Animation de succès
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) {
      saveBtn.style.background = 'linear-gradient(to right, #10b981, #059669)';
      setTimeout(() => {
        saveBtn.style.background = '';
      }, 2000);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Simulation d'upload
      console.log('Image upload:', file.name);
      alert('Photo de profil mise à jour!');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const tabContentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-8"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="mb-8 text-center"
        >
          <motion.h1
            className="text-4xl font-bold text-gray-900 mb-2"
            whileHover={{ scale: 1.02 }}
          >
            Mon Profil
          </motion.h1>
          <p className="text-gray-600">Gérez vos informations personnelles et vos préférences</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-4 gap-8"
        >
          {/* Sidebar */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-1 space-y-6"
          >
            {/* Carte profil */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100"
            >
              <div className="relative inline-block mb-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mx-auto mb-4 overflow-hidden shadow-lg"
                >
                  <img
                    src="/images/famille/Ntsika01.png"
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={triggerFileInput}
                  className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </motion.button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <motion.h3
                className="text-lg font-semibold text-gray-900"
                whileHover={{ color: "#7c3aed" }}
              >
                {user?.name}
              </motion.h3>
              <p className="text-gray-600 text-sm mb-4">{user?.email}</p>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold inline-block"
              >
                ✅ Vérifié
              </motion.div>
            </motion.div>

            {/* Navigation */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100"
            >
              <nav className="space-y-2">
                {[
                  { id: 'profile', label: '👤 Profil', icon: '👤' },
                  { id: 'orders', label: '📦 Commandes', icon: '📦' },
                  { id: 'favorites', label: '❤️ Favoris', icon: '❤️' },
                  { id: 'settings', label: '⚙️ Paramètres', icon: '⚙️' },
                  { id: 'security', label: '🔒 Sécurité', icon: '🔒' }
                ].map(tab => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center space-x-3 ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </motion.button>
                ))}
              </nav>
            </motion.div>

            {/* Statistiques */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-lg mr-2">📊</span> Statistiques
              </h3>
              <div className="space-y-4">
                {Object.entries(stats).map(([key, value]) => (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.05 }}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                    <span className="font-bold text-purple-600">{value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Contenu principal */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-3"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                {activeTab === 'profile' && (
                  <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                      <motion.h2
                        className="text-2xl font-bold text-gray-900"
                        initial={{ x: -20 }}
                        animate={{ x: 0 }}
                      >
                        Informations Personnelles
                      </motion.h2>
                      <motion.button
                        onClick={() => setIsEditing(!isEditing)}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg flex items-center space-x-2"
                        whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>{isEditing ? '✖️' : '✏️'}</span>
                        <span>{isEditing ? 'Annuler' : 'Modifier'}</span>
                      </motion.button>
                    </div>

                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-8"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div variants={itemVariants}>
                          <label className="label text-gray-700 font-semibold mb-2">Nom complet</label>
                          {isEditing ? (
                            <motion.input
                              type="text"
                              value={profileData.name}
                              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                              className="input w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              whileFocus={{ scale: 1.02 }}
                            />
                          ) : (
                            <motion.p
                              className="text-gray-900 text-lg p-3 bg-gray-50 rounded-xl"
                              whileHover={{ backgroundColor: "#f8fafc" }}
                            >
                              {profileData.name}
                            </motion.p>
                          )}
                        </motion.div>

                        <motion.div variants={itemVariants}>
                          <label className="label text-gray-700 font-semibold mb-2">Email</label>
                          {isEditing ? (
                            <motion.input
                              type="email"
                              value={profileData.email}
                              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                              className="input w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              whileFocus={{ scale: 1.02 }}
                            />
                          ) : (
                            <motion.p
                              className="text-gray-900 text-lg p-3 bg-gray-50 rounded-xl"
                              whileHover={{ backgroundColor: "#f8fafc" }}
                            >
                              {profileData.email}
                            </motion.p>
                          )}
                        </motion.div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div variants={itemVariants}>
                          <label className="label text-gray-700 font-semibold mb-2">Téléphone</label>
                          {isEditing ? (
                            <motion.input
                              type="tel"
                              value={profileData.phone}
                              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                              className="input w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              whileFocus={{ scale: 1.02 }}
                            />
                          ) : (
                            <motion.p
                              className="text-gray-900 text-lg p-3 bg-gray-50 rounded-xl"
                              whileHover={{ backgroundColor: "#f8fafc" }}
                            >
                              {profileData.phone}
                            </motion.p>
                          )}
                        </motion.div>

                        <motion.div variants={itemVariants}>
                          <label className="label text-gray-700 font-semibold mb-2">Adresse</label>
                          {isEditing ? (
                            <motion.input
                              type="text"
                              value={profileData.address}
                              onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                              className="input w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              whileFocus={{ scale: 1.02 }}
                            />
                          ) : (
                            <motion.p
                              className="text-gray-900 text-lg p-3 bg-gray-50 rounded-xl"
                              whileHover={{ backgroundColor: "#f8fafc" }}
                            >
                              {profileData.address}
                            </motion.p>
                          )}
                        </motion.div>
                      </div>

                      <motion.div variants={itemVariants}>
                        <label className="label text-gray-700 font-semibold mb-2">Bio</label>
                        {isEditing ? (
                          <motion.textarea
                            value={profileData.bio}
                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                            rows={4}
                            className="input w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                            whileFocus={{ scale: 1.02 }}
                            placeholder="Parlez-nous un peu de vous..."
                          />
                        ) : (
                          <motion.p
                            className="text-gray-900 text-lg p-3 bg-gray-50 rounded-xl leading-relaxed"
                            whileHover={{ backgroundColor: "#f8fafc" }}
                          >
                            {profileData.bio}
                          </motion.p>
                        )}
                      </motion.div>

                      {isEditing && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-end space-x-4 pt-6 border-t border-gray-200"
                        >
                          <motion.button
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Annuler
                          </motion.button>
                          <motion.button
                            onClick={handleSave}
                            className="save-btn px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg"
                            whileHover={{
                              scale: 1.05,
                              boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)"
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            💾 Sauvegarder
                          </motion.button>
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                )}

                {activeTab !== 'profile' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-8 text-center"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-6xl mb-4"
                    >
                      {activeTab === 'orders' && '📦'}
                      {activeTab === 'favorites' && '❤️'}
                      {activeTab === 'settings' && '⚙️'}
                      {activeTab === 'security' && '🔒'}
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Section {activeTab} en développement
                    </h3>
                    <p className="text-gray-600">
                      Cette fonctionnalité sera bientôt disponible !
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;