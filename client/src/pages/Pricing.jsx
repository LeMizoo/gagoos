import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Pricing = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const plans = [
    {
      name: 'Foundation',
      price: 'Gratuit',
      description: 'Parfait pour débuter',
      popular: false,
      features: [
        'Gestion production basique',
        'Gestion RH familiale',
        'Comptabilité essentielle',
        'Interface française',
        'Support par email'
      ],
      cta: 'Commencer gratuitement',
      ctaLink: '/register'
    },
    {
      name: 'Pro',
      price: '29€',
      period: '/par mois',
      description: 'Idéal pour les artisans établis',
      popular: true,
      features: [
        'Toutes les fonctionnalités Foundation',
        'Module fiscal complet',
        'Analyses avancées',
        'Application mobile',
        'Intégration bancaire',
        'Support prioritaire'
      ],
      cta: 'Essayer gratuitement',
      ctaLink: '/register'
    },
    {
      name: 'Excellence',
      price: '59€',
      period: '/par mois',
      description: 'Pour les entreprises en croissance',
      popular: false,
      features: [
        'Toutes les fonctionnalités Pro',
        'API externe',
        'E-commerce intégré',
        'Intelligence artificielle',
        'Marketplace ByGagoos',
        'Support dédié 24/7'
      ],
      cta: 'Nous contacter',
      ctaLink: '/contact'
    }
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

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

  const cardHoverVariants = {
    rest: {
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    },
    hover: {
      scale: 1.05,
      y: -10,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    }
  };

  const popularBadgeVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 200, damping: 15 }
    },
    hover: {
      scale: 1.1,
      rotate: [0, -5, 5, -5, 0],
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête animée */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-center mb-16"
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          >
            Tarifs Simples et Transparents
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Choisissez l'offre qui correspond le mieux à vos besoins. Tous les plans
            incluent l'essentiel pour gérer votre entreprise artisanale.
          </motion.p>
        </motion.div>

        {/* Grille des tarifs avec animations en cascade */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              custom={index}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <motion.div
                variants={cardHoverVariants}
                initial="rest"
                whileHover="hover"
                animate={hoveredCard === index ? "hover" : "rest"}
                className={`relative rounded-2xl p-1 ${plan.popular
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                  : 'bg-gradient-to-r from-gray-200 to-gray-300'
                  }`}
              >
                {plan.popular && (
                  <motion.div
                    variants={popularBadgeVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
                  >
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      ✨ Le plus populaire
                    </span>
                  </motion.div>
                )}

                <div className="bg-white rounded-xl p-8 h-full">
                  <motion.h3
                    className="text-2xl font-bold text-gray-900 mb-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    {plan.name}
                  </motion.h3>
                  <motion.div
                    className="mb-4"
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && (
                      <span className="text-gray-600 ml-1">{plan.period}</span>
                    )}
                  </motion.div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        className="flex items-center"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + featureIndex * 0.1 }}
                        whileHover={{ x: 10 }}
                      >
                        <motion.svg
                          className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"
                          whileHover={{ scale: 1.3, rotate: 360 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </motion.svg>
                        <span className="text-gray-600">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.a
                    href={plan.ctaLink}
                    className={`w-full block text-center py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900'
                      }`}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {plan.cta}
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Section supplémentaire animée */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              🎁 Essai gratuit de 30 jours
            </h3>
            <p className="text-gray-600 mb-4">
              Tous nos plans incluent un essai gratuit sans engagement
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg"
            >
              Démarrer l'essai gratuit
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Pricing;