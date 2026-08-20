import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CakeItem } from '../types';
import { CakeCustomizationModal } from '../components/CakeCustomizationModal';

interface CatalogueViewProps {
  cakes: CakeItem[];
  onAddToCart: (cake: CakeItem) => void;
  onAddToCartWithCustomization: (cake: CakeItem, customizationText: string) => void;
  onOpenCart: () => void;
  onOpenAiAssistant: () => void;
  onOpenCustomBuilder: () => void;
  onOpenPaymentGateway?: () => void;
}

export const CatalogueView: React.FC<CatalogueViewProps> = ({
  cakes,
  onAddToCart,
  onAddToCartWithCustomization,
  onOpenCart,
  onOpenAiAssistant,
  onOpenCustomBuilder,
  onOpenPaymentGateway,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Creations');
  const [sortBy, setSortBy] = useState<string>('Featured');
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['cake-1', 'cake-3']));
  const [addedToast, setAddedToast] = useState<string | null>(null);
  const [selectedCakeForCustomization, setSelectedCakeForCustomization] = useState<CakeItem | null>(null);

  const categories = [
    'All Creations',
    'Tiered Cakes',
    'Signature',
    'Small Bites',
    'Seasonal',
    'Vegan Delights',
  ];

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(favorites);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setFavorites(next);
  };

  const handleAddQuick = (cake: CakeItem, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(cake);
    setAddedToast(`Added "${cake.name}" to cart!`);
    setTimeout(() => setAddedToast(null), 3000);
  };

  const filteredCakes = cakes.filter((c) => {
    if (selectedCategory === 'All Creations') return true;
    return c.category === selectedCategory;
  }).sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.price - b.price;
    if (sortBy === 'Price: High to Low') return b.price - a.price;
    if (sortBy === 'Highest Rated') return b.rating - a.rating;
    return 0; // Featured
  });

  return (
    <div className="w-full min-h-screen pt-24 pb-20 px-6 lg:px-12 select-none">
      {/* Toast notification */}
      <AnimatePresence>
        {addedToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 bg-[#8b4b58] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3"
          >
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span className="text-[13px] font-semibold">{addedToast}</span>
            <button
              onClick={onOpenCart}
              className="ml-2 underline text-[12px] font-bold cursor-pointer"
            >
              View Cart
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Banner Section */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative rounded-3xl overflow-hidden mb-12 bg-[#f8ebe6] border border-[#d7c1c4]/40 min-h-[360px] flex items-center shadow-md"
      >
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA69ySOOjQxcqEmFgwP2OqBwuitG94OK9-CXZhdFi7aHPIr9apeV8WZNeY33cngOtrJfkcbWOZKkUNYLzMMDpXauNOwPrPlgQp_Ejr29OWBHoKjPpltgSrievYQJi2V_-Ndkh_fyUv_9Bndi-1HEHc2xgmul9uaDlHKIsrXQ9NZ2YjXv9SZxxL_GqBsRH7l8y5Q2RqEBX94P0A3mSUr23FzeSZ0EwHw1iSMiMyPru5adzlRkRHLK7w96A"
            alt="Artisan cake golden hour display"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-2xl p-8 lg:p-12 space-y-4">
          <span className="inline-block bg-[#8b4b58] text-white px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase">
            Digital Cake Catalogue & Custom Orders
          </span>
          <h1 className="font-bold text-[36px] lg:text-[44px] leading-tight text-[#201a18]">
            Artisanal Ethiopian Bakes & Tiered Cakes
          </h1>
          <p className="text-[15px] leading-relaxed text-[#524345]">
            Browse our fresh digital catalogue. Customize headcount, flavors, and inscriptions, then pay a 50% deposit securely.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onOpenAiAssistant}
              className="bg-[#8b4b58] text-white px-6 py-3 rounded-full font-bold text-[13px] tracking-wider shadow-lg hover:bg-[#8b4b58]/90 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">restaurant</span>
              <span>Flavor Assistant</span>
            </button>

            <button
              onClick={onOpenCustomBuilder}
              className="bg-white text-[#8b4b58] border-2 border-[#8b4b58] px-6 py-3 rounded-full font-bold text-[13px] tracking-wider shadow-md hover:bg-[#f8ebe6] active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">view_in_ar</span>
              <span>3D Custom Builder</span>
            </button>
          </div>
        </div>
      </motion.section>

      {/* Filter and Sorting Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-[#d7c1c4]/30">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full font-semibold text-[12px] tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#8b4b58] text-white shadow-sm'
                  : 'bg-[#f8ebe6] text-[#605e5a] hover:bg-[#ede0db]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[12px] font-semibold text-[#605e5a]">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#f8ebe6] border border-[#d7c1c4] text-[#201a18] px-4 py-2 rounded-full font-semibold text-[12px] outline-none cursor-pointer"
          >
            <option>Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCakes.map((cake, idx) => {
          const priceETB = Math.round(cake.price * 30);
          const depositETB = Math.round(priceETB * 0.5);

          return (
            <motion.div
              key={cake.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(idx * 0.05, 0.3) }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCakeForCustomization(cake)}
              className="bg-[#ffffff] rounded-2xl border border-[#d7c1c4]/40 overflow-hidden shadow-xs hover:shadow-xl transition-shadow duration-300 flex flex-col group cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden bg-[#f8ebe6]">
                <img
                  src={cake.image}
                  alt={cake.altText}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Rating Overlay */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <span
                    className="material-symbols-outlined text-[16px] text-amber-500"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="font-bold text-[12px] text-[#201a18]">
                    {cake.rating.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-[#605e5a]">({cake.reviewCount})</span>
                </div>

                {/* Favorite Button */}
                <button
                  onClick={(e) => toggleFavorite(cake.id, e)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#8b4b58] shadow-sm hover:scale-110 active:scale-90 transition-transform cursor-pointer"
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{
                      fontVariationSettings: favorites.has(cake.id) ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    favorite
                  </span>
                </button>

                {cake.isPopular && (
                  <div className="absolute bottom-4 left-4 bg-[#8b4b58] text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase shadow-xs">
                    Popular Masterpiece
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-[18px] text-[#201a18] group-hover:text-[#8b4b58] transition-colors">
                      {cake.name}
                    </h3>
                    <span className="font-mono text-[11px] text-[#847375] font-semibold">
                      {cake.code}
                    </span>
                  </div>

                  <p className="text-[13px] text-[#524345] leading-relaxed line-clamp-2 mb-3">
                    {cake.description}
                  </p>

                  <div className="flex items-center gap-2">
                    <span className="bg-[#f8ebe6] text-[#8b4b58] px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                      {cake.category}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        cake.stockCount < 10
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-green-100 text-green-900'
                      }`}
                    >
                      {cake.stockCount} Available
                    </span>
                  </div>
                </div>

                {/* Footer CTA */}
                <div className="flex justify-between items-center pt-3 border-t border-[#d7c1c4]/20">
                  <div>
                    <span className="text-[10px] text-[#605e5a] font-semibold block uppercase">Total & Deposit</span>
                    <span className="font-bold text-[20px] text-[#8b4b58]">
                      {priceETB} ETB
                    </span>
                    <span className="text-[10px] font-bold text-amber-800 block">
                      (50% Dep: {depositETB} ETB)
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleAddQuick(cake, e)}
                    className="bg-[#8b4b58] text-white px-4 py-2.5 rounded-xl font-bold text-[12px] tracking-wider shadow-sm hover:bg-[#8b4b58]/90 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                    <span>Order</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Cake Customization Modal */}
      <CakeCustomizationModal
        cake={selectedCakeForCustomization}
        onClose={() => setSelectedCakeForCustomization(null)}
        onAddToCartWithCustomization={onAddToCartWithCustomization}
      />
    </div>
  );
};
