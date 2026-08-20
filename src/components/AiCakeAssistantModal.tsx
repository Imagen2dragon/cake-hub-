import React, { useState } from 'react';
import { CakeItem, CartItem } from '../types';

interface AiCakeAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRecommendationToCart: (cake: CakeItem, customizationText: string) => void;
}

export const AiCakeAssistantModal: React.FC<AiCakeAssistantModalProps> = ({
  isOpen,
  onClose,
  onAddRecommendationToCart,
}) => {
  const [occasion, setOccasion] = useState('Graduation');
  const [guests, setGuests] = useState(25);
  const [flavor, setFlavor] = useState('Chocolate & Berry');
  const [budget, setBudget] = useState(2500);
  const [notes, setNotes] = useState('Prefer elegant gold leaf decor and custom name plaque.');

  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleConsultAi = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRecommendation(null);

    try {
      const res = await fetch('/api/ai-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion,
          guests,
          flavorPreference: flavor,
          budget,
          notes,
        }),
      });

      const data = await res.json();
      if (data && data.recommendation) {
        setRecommendation(data.recommendation);
      }
    } catch (err) {
      console.error(err);
      // Fallback
      setRecommendation({
        suggestedCakeName: `${occasion} Gold Crown Special`,
        suggestedTiers: guests > 30 ? 3 : 2,
        suggestedFlavor: flavor || 'Vanilla Rose & Pistachio',
        estimatedPrice: Math.min(budget, 3200),
        depositAmount: Math.min(budget, 3200) * 0.5,
        reasoning: `Specially crafted for ${guests} guests celebrating ${occasion}. Styled with signature edible gold leaf and velvet cream piping.`,
        bakerTip: 'Order 48 hours prior to allow custom sugar flower curing.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!recommendation) return;
    const recommendedCake: CakeItem = {
      id: `ai-cake-${Date.now()}`,
      code: '#AI-SPEC',
      name: recommendation.suggestedCakeName,
      category: 'Signature',
      price: recommendation.estimatedPrice,
      rating: 5.0,
      reviewCount: 1,
      soldCount: 1,
      revenue: recommendation.estimatedPrice,
      stockCount: 10,
      stockStatus: 'In Stock',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiB02ZGBONY2ukSkvpk_NnuwF-j6lFzGx3gL2bcfFKKNov4rS1Ar1ueuB0dv3D1VvbJ7Zs7DYjcFBDhA5MsECz4KkPhgYiI-t3Lm-23NwCijID6CwhTyirN4aD-fQIQZGFYa9yshixh7n3rtSooS3qRsVKxluwmIwXKBPSXBwC96ed7yYyUMkb7Re9W7gTNbXUlVahD-BaYedy9BuQu3Gnw0Y4DVS4zdJVT_8ZsqxLI4G2Veb7gubKLw',
      altText: recommendation.suggestedCakeName,
      description: recommendation.reasoning,
      isPopular: true,
    };

    onAddRecommendationToCart(
      recommendedCake,
      `Master Sommelier Recommendation: ${recommendation.suggestedTiers} Tiers | ${recommendation.suggestedFlavor} | ${guests} Guests`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none animate-fade-in">
      <div className="bg-[#ffffff] rounded-3xl border border-[#d7c1c4] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-[#8b4b58] text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[28px] text-[#ffd9de]">restaurant</span>
            <div>
              <h3 className="font-bold text-[18px]">Bakery Flavor Assistant</h3>
              <p className="text-[12px] text-[#ffd9de]">Personalized cake & flavor recommendations tailored to your event</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <form onSubmit={handleConsultAi} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] font-bold text-[#524345] block mb-1">Occasion / Event</label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#f8ebe6] border border-[#d7c1c4] rounded-xl text-[13px] font-medium outline-none focus:ring-2 focus:ring-[#8b4b58]"
              >
                <option>Graduation Party</option>
                <option>Wedding & Engagement</option>
                <option>Birthday Celebration</option>
                <option>Anniversary</option>
                <option>Corporate Event</option>
                <option>Holiday & Seasonal</option>
              </select>
            </div>

            <div>
              <label className="text-[12px] font-bold text-[#524345] block mb-1">Guest Count ({guests} portions)</label>
              <input
                type="range"
                min="5"
                max="150"
                step="5"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full accent-[#8b4b58] mt-2 cursor-pointer"
              />
              <span className="text-[11px] font-semibold text-[#8b4b58]">{guests} Guests Portion</span>
            </div>

            <div>
              <label className="text-[12px] font-bold text-[#524345] block mb-1">Flavor Preference</label>
              <select
                value={flavor}
                onChange={(e) => setFlavor(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#f8ebe6] border border-[#d7c1c4] rounded-xl text-[13px] font-medium outline-none focus:ring-2 focus:ring-[#8b4b58]"
              >
                <option>Chocolate & Berry</option>
                <option>Red Velvet & Cream Cheese</option>
                <option>Rose Water & Pistachio</option>
                <option>Vanilla Bean & Mango</option>
                <option>Lemon Lavender & Honey</option>
                <option>Vegan Almond & Raspberry</option>
              </select>
            </div>

            <div>
              <label className="text-[12px] font-bold text-[#524345] block mb-1">Max Budget (ETB / Birr)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#f8ebe6] border border-[#d7c1c4] rounded-xl text-[13px] font-medium outline-none focus:ring-2 focus:ring-[#8b4b58]"
                placeholder="2500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[12px] font-bold text-[#524345] block mb-1">Special Notes or Color Theme</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#f8ebe6] border border-[#d7c1c4] rounded-xl text-[13px] font-medium outline-none focus:ring-2 focus:ring-[#8b4b58]"
                placeholder="e.g. Gold & Burgundy ribbons with inscription plaque"
              />
            </div>

            <div className="md:col-span-2 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#8b4b58] text-white rounded-xl font-bold text-[13px] tracking-wider shadow-md hover:bg-[#8b4b58]/90 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                    <span>Consulting Master Pastry Chef...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">restaurant</span>
                    <span>Get Flavor Recommendation</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Result Card */}
          {recommendation && (
            <div className="p-5 bg-[#f8ebe6] border border-[#d7c1c4] rounded-2xl space-y-4 animate-fade-in">
              <div className="flex justify-between items-start">
                <div>
                  <span className="bg-[#8b4b58] text-white px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Chef Recommended Bake
                  </span>
                  <h4 className="font-bold text-[20px] text-[#201a18] mt-1">
                    {recommendation.suggestedCakeName}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#605e5a] font-semibold block uppercase">Estimated Price</span>
                  <span className="font-bold text-[22px] text-[#8b4b58]">
                    {recommendation.estimatedPrice} ETB
                  </span>
                  <span className="text-[11px] text-amber-700 font-bold block">
                    (50% Deposit: {recommendation.depositAmount || recommendation.estimatedPrice * 0.5} ETB)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[12px] bg-white p-3 rounded-xl border border-[#d7c1c4]/50">
                <div>
                  <span className="text-[#847375] block font-medium">Structure</span>
                  <span className="font-bold text-[#201a18]">{recommendation.suggestedTiers} Tier Custom Cake</span>
                </div>
                <div>
                  <span className="text-[#847375] block font-medium">Flavor Profile</span>
                  <span className="font-bold text-[#201a18]">{recommendation.suggestedFlavor}</span>
                </div>
              </div>

              <p className="text-[13px] text-[#524345] leading-relaxed italic bg-white/70 p-3 rounded-xl border border-[#d7c1c4]/30">
                "{recommendation.reasoning}"
              </p>

              {recommendation.bakerTip && (
                <div className="flex items-center gap-2 text-[12px] text-[#8b4b58] font-semibold">
                  <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                  <span>Chef Tip: {recommendation.bakerTip}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-3 bg-[#8b4b58] text-white rounded-xl font-bold text-[13px] tracking-wider shadow-lg hover:bg-[#8b4b58]/90 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                <span>Add Recommended Bake to Cart</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
