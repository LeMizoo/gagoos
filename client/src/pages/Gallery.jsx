import React, { useState } from 'react';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Toutes' },
    { id: 'creations', name: 'Créations' },
    { id: 'famille', name: 'Famille' },
    { id: 'produits', name: 'Produits' },
    { id: 'divers', name: 'Divers' }
  ];

  // Images organisées par catégories
  const images = [
    // Créations
    { id: 1, src: '/images/creations/Copilot_20250616_113317.png', category: 'creations', title: 'Création artistique' },
    { id: 2, src: '/images/creations/Copilot_20250616_115931.png', category: 'creations', title: 'Design unique' },
    { id: 3, src: '/images/creations/Copilot_20250617_134534.png', category: 'creations', title: 'Sérigraphie artisanale' },
    { id: 4, src: '/images/creations/Copilot_20250618_121530.png', category: 'creations', title: 'Création originale' },
    
    // Famille
    { id: 5, src: '/images/famille/Ntsika01.png', category: 'famille', title: 'Moments en famille' },
    { id: 6, src: '/images/famille/Ntsika02.png', category: 'famille', title: 'Souvenirs précieux' },
    { id: 7, src: '/images/famille/Ntsika03.png', category: 'famille', title: 'Partage familial' },
    { id: 8, src: '/images/famille/Ntsika04.png', category: 'famille', title: 'Union familiale' },
    
    // Produits
    { id: 9, src: '/images/produits/barkoay-3.png', category: 'produits', title: 'Collection Barkoay' },
    { id: 10, src: '/images/produits/barkoay-4.png', category: 'produits', title: 'Produit premium' },
    
    // Divers
    { id: 11, src: '/images/divers/barakoay.png', category: 'divers', title: 'Inspiration' },
    { id: 12, src: '/images/divers/fosa.png', category: 'divers', title: 'Design Fosa' },
    { id: 13, src: '/images/divers/gagoos-art.png', category: 'divers', title: 'Art Gagoos' }
  ];

  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Galerie ByGagoos</h1>
        <p className="text-gray-600">
          Découvrez notre univers créatif à travers nos créations, nos moments familiaux 
          et l'inspiration qui guide notre artisanat.
        </p>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Grille d'images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredImages.map(image => (
          <div key={image.id} className="card overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="aspect-square bg-gray-200 overflow-hidden">
              <img 
                src={image.src} 
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="card-body py-4">
              <h3 className="font-medium text-gray-900 text-center">{image.title}</h3>
              <span className="text-xs text-gray-500 uppercase tracking-wide block text-center mt-1">
                {categories.find(cat => cat.id === image.category)?.name}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucune image trouvée dans cette catégorie</p>
        </div>
      )}
    </div>
  );
};

export default Gallery;