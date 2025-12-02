import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Products = () => {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const products = [
    {
      id: 1,
      name: 'Collection Barkoay',
      description: 'Des designs uniques inspirés de notre héritage culturel, imprimés avec passion sur des textiles de qualité supérieure.',
      price: 'À partir de 29,99€',
      image: '/images/produits/barkoay-3.png',
      features: ['Sérigraphie artisanale', 'Coton 100% biologique', 'Teintures écologiques', 'Fabriqué en France'],
      category: 'textile'
    },
    {
      id: 2,
      name: 'Série Fosa',
      description: 'Une collection limitée célébrant la beauté sauvage et l\'élégance naturelle, pour les esprits libres et authentiques.',
      price: 'À partir de 34,99€',
      image: '/images/divers/fosa.png',
      features: ['Édition limitée', 'Design exclusif', 'Matériaux premium', 'Numérotée et signée'],
      category: 'limited'
    },
    {
      id: 3,
      name: 'Gagoos Art Collection',
      description: 'Des œuvres d\'art uniques transformées en produits portables, où chaque pièce raconte une histoire particulière.',
      price: 'À partir de 49,99€',
      image: '/images/divers/gagoos-art.png',
      features: ['Œuvre originale', 'Signée par l\'artiste', 'Certificat d\'authenticité', 'Encadrement inclus'],
      category: 'art'
    },
    {
      id: 4,
      name: 'Essentiels ByGagoos',
      description: 'Les basiques réinventés avec notre touche artistique, parfaits pour le quotidien comme pour les occasions spéciales.',
      price: 'À partir de 24,99€',
      image: '/images/divers/barakoay-2.png',
      features: ['Confort optimal', 'Entretien facile', 'Taille inclusive', 'Livraison express'],
      category: 'essentials'
    }
  ];

  const categories = [
    { id: 'all', name: 'Toutes les collections' },
    { id: 'textile', name: 'Textile' },
    { id: 'limited', name: 'Éditions limitées' },
    { id: 'art', name: 'Œuvres d\'art' },
    { id: 'essentials', name: 'Essentiels' }
  ];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const imageHoverVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.1,
      rotate: [0, -1, 1, -1, 0],
      transition: { duration: 0.6 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="mb-12 text-center"
        >
          <motion.h1
            className="text-5xl font-bold text-gray-900 mb-4"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          >
            Nos Créations
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Découvrez notre collection de produits artisanaux, où chaque pièce est imprégnée
            de sens, créée avec amour et portée avec fierté.
          </motion.p>
        </motion.div>

        {/* Filtres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map(category => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${selectedCategory === category.id
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Grille des produits */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16"
          >
            {filteredProducts.map(product => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                layout
                initial="hidden"
                animate="visible"
                exit="hidden"
                onHoverStart={() => setHoveredProduct(product.id)}
                onHoverEnd={() => setHoveredProduct(null)}
                className="group"
              >
                <motion.div
                  whileHover="hover"
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                      <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover"
                        variants={imageHoverVariants}
                      />
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredProduct === product.id ? 1 : 0 }}
                        className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center"
                      >
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold shadow-lg"
                        >
                          👁️ Voir en détail
                        </motion.button>
                      </motion.div>
                    </div>
                    <div className="p-6 flex flex-col justify-between">
                      <div>
                        <motion.h3
                          className="text-2xl font-bold text-gray-900 mb-3"
                          whileHover={{ color: "#7c3aed" }}
                        >
                          {product.name}
                        </motion.h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">{product.description}</p>

                        <div className="mb-4">
                          {product.features.map((feature, index) => (
                            <motion.div
                              key={index}
                              className="flex items-center text-sm text-gray-600 mb-2"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.8 + index * 0.1 }}
                            >
                              <motion.svg
                                className="w-4 h-4 text-green-500 mr-3 flex-shrink-0"
                                whileHover={{ scale: 1.5, rotate: 180 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </motion.svg>
                              {feature}
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <motion.span
                          className="text-2xl font-bold text-purple-600"
                          whileHover={{ scale: 1.1 }}
                        >
                          {product.price}
                        </motion.span>
                        <motion.button
                          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg"
                          whileHover={{
                            scale: 1.05,
                            boxShadow: "0 10px 25px -5px rgba(168, 85, 247, 0.4)"
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          🛒 Découvrir
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Section avantages */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-gradient-to-r from-purple-600 to-pink-700 rounded-2xl p-8 text-white overflow-hidden relative"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -right-32 -top-32 w-64 h-64 bg-white bg-opacity-10 rounded-full"
          />
          <motion.div
            animate={{
              rotate: [360, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -left-32 -bottom-32 w-80 h-80 bg-white bg-opacity-5 rounded-full"
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative z-10"
          >
            {[
              {
                icon: '🚚',
                title: 'Livraison Rapide',
                desc: 'Expédition sous 48h'
              },
              {
                icon: '🔒',
                title: 'Paiement Sécurisé',
                desc: 'Transactions 100% sécurisées'
              },
              {
                icon: '💫',
                title: 'Satisfaction Garantie',
                desc: '30 jours pour changer d\'avis'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm"
              >
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-4xl mb-4"
                >
                  {item.icon}
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-purple-100">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Products;