import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Créer un composant Link animé correctement
const MotionLink = motion(Link);

const Unauthorized = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3
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

    const lockVariants = {
        initial: { scale: 1 },
        animate: {
            scale: [1, 1.1, 1],
            rotate: [0, -5, 5, -5, 0],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const floatingShapes = {
        animate: {
            y: [0, -20, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4 relative overflow-hidden"
        >
            {/* Formes flottantes */}
            <motion.div
                variants={floatingShapes}
                animate="animate"
                className="absolute top-20 left-10 w-20 h-20 bg-red-200 rounded-full opacity-20"
            />
            <motion.div
                variants={floatingShapes}
                animate="animate"
                transition={{ delay: 0.5 }}
                className="absolute bottom-20 right-10 w-16 h-16 bg-orange-200 rounded-full opacity-20"
            />
            <motion.div
                variants={floatingShapes}
                animate="animate"
                transition={{ delay: 1 }}
                className="absolute top-1/2 left-1/4 w-12 h-12 bg-yellow-200 rounded-full opacity-20"
            />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="text-center max-w-2xl z-10"
            >
                {/* Icône animée */}
                <motion.div
                    variants={itemVariants}
                    className="mb-8"
                >
                    <motion.div
                        variants={lockVariants}
                        initial="initial"
                        animate="animate"
                        className="text-8xl mb-4"
                    >
                        🔐
                    </motion.div>
                </motion.div>

                {/* Texte */}
                <motion.h1
                    variants={itemVariants}
                    className="text-6xl md:text-7xl font-bold text-gray-900 mb-6"
                >
                    Accès Refusé
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed"
                >
                    Oups ! Il semble que vous n'ayez pas les autorisations nécessaires
                    pour accéder à cette page.
                </motion.p>

                <motion.div
                    variants={itemVariants}
                    className="space-y-6"
                >
                    {/* Boutons d'action */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <MotionLink
                            to="/"
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg block"
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0 15px 30px -5px rgba(59, 130, 246, 0.4)"
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            🏠 Retour à l'accueil
                        </MotionLink>

                        <MotionLink
                            to="/login"
                            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg block"
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0 15px 30px -5px rgba(16, 185, 129, 0.4)"
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            🔑 Se connecter
                        </MotionLink>
                    </div>

                    {/* Message supplémentaire */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="text-gray-500 text-sm mt-8"
                    >
                        Si vous pensez qu'il s'agit d'une erreur, contactez notre support.
                    </motion.p>
                </motion.div>

                {/* Animation de particules */}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-red-300 rounded-full"
                            initial={{
                                x: Math.random() * window.innerWidth,
                                y: Math.random() * window.innerHeight,
                            }}
                            animate={{
                                y: [0, -100, 0],
                                opacity: [0, 1, 0],
                            }}
                            transition={{
                                duration: Math.random() * 3 + 2,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                            }}
                        />
                    ))}
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default Unauthorized;