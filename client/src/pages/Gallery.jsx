import React, { useState, useEffect, useRef } from 'react';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleImages, setVisibleImages] = useState({});
  const imageRefs = useRef([]);

  const categories = [
    { id: 'all', name: 'Toutes', icon: '🖼️', color: 'from-blue-500 to-purple-500' },
    { id: 'creations', name: 'Créations', icon: '🎨', color: 'from-green-500 to-emerald-500' },
    { id: 'famille', name: 'Famille', icon: '👨‍👩‍👧‍👦', color: 'from-pink-500 to-rose-500' },
    { id: 'produits', name: 'Produits', icon: '📦', color: 'from-orange-500 to-red-500' },
    { id: 'divers', name: 'Divers', icon: '🌟', color: 'from-purple-500 to-indigo-500' }
  ];

  const images = [
    // Créations
    {
      id: 1,
      src: '/images/creations/Copilot_20250616_113317.png',
      category: 'creations',
      title: 'Création Artistique Élégante',
      description: 'Une œuvre unique mêlant tradition et modernité',
      featured: true
    },
    {
      id: 2,
      src: '/images/creations/Copilot_20250616_115931.png',
      category: 'creations',
      title: 'Design Contemporain',
      description: 'Inspiration moderne pour un public exigeant',
      featured: false
    },
    {
      id: 3,
      src: '/images/creations/Copilot_20250617_134534.png',
      category: 'creations',
      title: 'Sérigraphie Artisanale',
      description: 'Technique traditionnelle, résultat exceptionnel',
      featured: true
    },
    {
      id: 4,
      src: '/images/creations/Copilot_20250618_121530.png',
      category: 'creations',
      title: 'Création Originale',
      description: 'Pièce unique signée ByGagoos',
      featured: false
    },

    // Famille
    {
      id: 5,
      src: '/images/famille/Ntsika01.png',
      category: 'famille',
      title: 'Moments en Famille',
      description: 'Des souvenirs précieux partagés ensemble',
      featured: true
    },
    {
      id: 6,
      src: '/images/famille/Ntsika02.png',
      category: 'famille',
      title: 'Souvenirs Inoubliables',
      description: 'Capturer l\'essence des moments familiaux',
      featured: false
    },
    {
      id: 7,
      src: '/images/famille/Ntsika03.png',
      category: 'famille',
      title: 'Partage et Complicité',
      description: 'L\'union fait la force de notre entreprise',
      featured: false
    },
    {
      id: 8,
      src: '/images/famille/Ntsika04.png',
      category: 'famille',
      title: 'Union Familiale',
      description: 'Une famille unie autour d\'une passion commune',
      featured: true
    },

    // Produits
    {
      id: 9,
      src: '/images/produits/barkoay-3.png',
      category: 'produits',
      title: 'Collection Barkoay',
      description: 'Notre ligne de produits signature',
      featured: true
    },
    {
      id: 10,
      src: '/images/produits/barkoay-4.png',
      category: 'produits',
      title: 'Produit Premium',
      description: 'Excellence et qualité supérieure',
      featured: false
    },

    // Divers
    {
      id: 11,
      src: '/images/divers/barakoay.png',
      category: 'divers',
      title: 'Inspiration Quotidienne',
      description: 'Notre source d\'inspiration constante',
      featured: false
    },
    {
      id: 12,
      src: '/images/divers/fosa.png',
      category: 'divers',
      title: 'Design Fosa',
      description: 'Élégance et raffinement dans chaque détail',
      featured: true
    },
    {
      id: 13,
      src: '/images/divers/gagoos-art.png',
      category: 'divers',
      title: 'Art Gagoos',
      description: 'L\'expression artistique de notre marque',
      featured: true
    }
  ];

  const filteredImages = selectedCategory === 'all'
    ? images
    : images.filter(img => img.category === selectedCategory);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleImages(prev => ({
              ...prev,
              [entry.target.dataset.image]: true
            }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    imageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [filteredImages]);

  const addToRefs = (el, index) => {
    if (el && !imageRefs.current.includes(el)) {
      el.dataset.image = index;
      imageRefs.current.push(el);
    }
  };

  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const navigateImage = (direction) => {
    if (!selectedImage) return;

    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    let newIndex;

    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredImages.length;
    } else {
      newIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    }

    setSelectedImage(filteredImages[newIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isModalOpen) {
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowRight') navigateImage('next');
        if (e.key === 'ArrowLeft') navigateImage('prev');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, selectedImage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent animate-gradient">
            Galerie ByGagoos
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed transform hover:scale-105 transition-transform duration-300">
            Découvrez notre univers créatif à travers nos créations, nos moments familiaux
            et l'inspiration qui guide notre artisanat.
          </p>
        </div>

        {/* Animation de fond */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-blue-300 rounded-full opacity-20 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${5 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Filtres animés */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`group relative px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-500 transform hover:scale-110 ${selectedCategory === category.id
                ? `bg-gradient-to-r ${category.color} text-white shadow-2xl`
                : 'bg-white/80 text-gray-700 shadow-lg hover:shadow-xl backdrop-blur-sm'
                }`}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: selectedCategory === category.id ? 'pulse 2s infinite' : 'none'
              }}
            >
              <span className="text-xl mr-3 transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500">
                {category.icon}
              </span>
              {category.name}

              {/* Effet de brillance au survol */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 rounded-2xl"></div>
            </button>
          ))}
        </div>
      </div>

      {/* Grille d'images */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filteredImages.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😔</div>
            <p className="text-2xl text-gray-500">Aucune image trouvée dans cette catégorie</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                ref={el => addToRefs(el, index)}
                className={`card bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transform transition-all duration-700 cursor-pointer group overflow-hidden ${visibleImages[index] ? 'animate-fadeInUp opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  } ${image.featured ? 'ring-2 ring-yellow-400' : ''}`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => openModal(image)}
              >
                <div className="relative aspect-square bg-gray-200 overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Overlay au survol */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center">
                    <div className="text-white text-4xl opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      👁️
                    </div>
                  </div>

                  {/* Badge featured */}
                  {image.featured && (
                    <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold transform group-hover:scale-110 transition-transform duration-300">
                      ⭐ Vedette
                    </div>
                  )}

                  {/* Catégorie */}
                  <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium transform group-hover:scale-110 transition-transform duration-300">
                    {categories.find(cat => cat.id === image.category)?.icon}
                  </div>
                </div>

                <div className="card-body p-4">
                  <h3 className="font-bold text-gray-900 text-center group-hover:text-blue-600 transition-colors duration-300">
                    {image.title}
                  </h3>
                  <p className="text-sm text-gray-500 text-center mt-1 line-clamp-2">
                    {image.description}
                  </p>
                </div>

                {/* Effet de bordure colorée */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm group-hover:blur-md"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de visualisation d'image */}
      {isModalOpen && selectedImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative max-w-6xl max-h-full bg-white rounded-3xl overflow-hidden shadow-2xl transform animate-scaleIn">
            {/* Bouton fermer */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center text-2xl hover:bg-black/70 transition-all duration-300 transform hover:scale-110 hover:rotate-90"
            >
              ×
            </button>

            {/* Boutons navigation */}
            <button
              onClick={() => navigateImage('prev')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center text-2xl hover:bg-black/70 transition-all duration-300 transform hover:scale-110"
            >
              ‹
            </button>
            <button
              onClick={() => navigateImage('next')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center text-2xl hover:bg-black/70 transition-all duration-300 transform hover:scale-110"
            >
              ›
            </button>

            {/* Contenu du modal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
              {/* Image */}
              <div className="relative bg-gray-900 flex items-center justify-center p-8">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  className="max-w-full max-h-96 object-contain rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Informations */}
              <div className="p-8 flex flex-col justify-center">
                <div className="mb-6">
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                    {categories.find(cat => cat.id === selectedImage.category)?.name}
                  </span>
                  {selectedImage.featured && (
                    <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold mb-3 ml-2">
                      ⭐ Vedette
                    </span>
                  )}
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {selectedImage.title}
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {selectedImage.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Image {filteredImages.findIndex(img => img.id === selectedImage.id) + 1} sur {filteredImages.length}
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-300">
                    Voir les détails ›
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Inspiré par Notre Univers ?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Découvrez comment nous pouvons créer quelque chose d'unique ensemble
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              🎨 Discuter d'un Projet
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300">
              📞 Nous Contacter
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;