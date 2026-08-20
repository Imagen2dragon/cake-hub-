import React, { useState } from 'react';
import { CakeItem, FulfillmentType } from '../types';

interface CakeCustomizationModalProps {
  cake: CakeItem | null;
  onClose: () => void;
  onAddToCartWithCustomization: (cake: CakeItem, customizationText: string) => void;
}

export const CakeCustomizationModal: React.FC<CakeCustomizationModalProps> = ({
  cake,
  onClose,
  onAddToCartWithCustomization,
}) => {
  const [selectedTiers, setSelectedTiers] = useState<number>(cake?.maxTiers || 2);
  const [selectedFlavor, setSelectedFlavor] = useState<string>(
    cake?.flavors?.[0] || 'Vanilla Bean & Honey'
  );
  const [inscription, setInscription] = useState('');
  const [guests, setGuests] = useState(20);
  const [fulfillment, setFulfillment] = useState<FulfillmentType>('Delivery');
  const [date, setDate] = useState('2026-08-10');
  const [activeTab, setActiveTab] = useState<'customize' | 'reviews'>('customize');
  
  // Reviews state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewsList, setReviewsList] = useState(cake?.reviews || [
    { id: 'rev-1', author: 'Bethlehem T.', rating: 5, date: '2026-08-01', comment: 'Ordered for my engagement party in Bole. The flavor was divine and delivery was on time!' }
  ]);

  if (!cake) return null;

  const basePrice = cake.price * (selectedTiers > 1 ? selectedTiers * 0.75 : 1);
  const extraGuestsFee = Math.max(0, guests - 15) * 15;
  const totalETB = Math.round((basePrice + extraGuestsFee) * 30); // Convert USD equivalence or display ETB
  const depositETB = Math.round(totalETB * 0.5);

  const formattedOrderSummary = `Cake: ${cake.name} (${selectedTiers} Tiers)\nFlavor: ${selectedFlavor}\nInscription: "${inscription || 'None'}"\nHeadcount: ${guests} Guests\nFulfillment: ${fulfillment} on ${date}\nTotal: ${totalETB} ETB (Deposit 50%: ${depositETB} ETB)`;

  const whatsappUrl = `https://wa.me/251911000000?text=${encodeURIComponent(
    `Hello CakeHub Bakery! I would like to place an order:\n\n${formattedOrderSummary}`
  )}`;

  const telegramUrl = `https://t.me/cakehub_bakery?text=${encodeURIComponent(
    `Hello CakeHub Bakery! I would like to place an order:\n\n${formattedOrderSummary}`
  )}`;

  const handleAddToCart = () => {
    onAddToCartWithCustomization(
      cake,
      `${selectedTiers} Tiers | ${selectedFlavor} | Inscription: "${inscription || 'None'}" | ${fulfillment} on ${date}`
    );
    onClose();
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setReviewsList([
      {
        id: `rev-${Date.now()}`,
        author: 'Guest Customer',
        rating: newRating,
        date: 'Just now',
        comment: newComment,
      },
      ...reviewsList,
    ]);
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none animate-fade-in">
      <div className="bg-[#ffffff] rounded-3xl border border-[#d7c1c4] shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#8b4b58] text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[28px] text-[#ffd9de]">cake</span>
            <div>
              <h3 className="font-bold text-[18px]">{cake.name}</h3>
              <p className="text-[12px] text-[#ffd9de]">{cake.code} • {cake.category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-[#d7c1c4]/40 bg-[#f8ebe6] px-6 shrink-0">
          <button
            onClick={() => setActiveTab('customize')}
            className={`py-3 px-4 font-bold text-[13px] border-b-2 transition-all cursor-pointer ${
              activeTab === 'customize'
                ? 'border-[#8b4b58] text-[#8b4b58]'
                : 'border-transparent text-[#605e5a] hover:text-[#201a18]'
            }`}
          >
            Customization & Booking
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-4 font-bold text-[13px] border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-[#8b4b58] text-[#8b4b58]'
                : 'border-transparent text-[#605e5a] hover:text-[#201a18]'
            }`}
          >
            <span>Customer Reviews</span>
            <span className="bg-[#8b4b58] text-white text-[10px] px-2 py-0.5 rounded-full">
              {reviewsList.length}
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'customize' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Image & Quick Specs */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-2xl overflow-hidden bg-[#f8ebe6] h-60 border border-[#d7c1c4]/50 shadow-sm relative">
                  <img src={cake.image} alt={cake.altText} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-bold text-[#8b4b58] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span>{cake.rating.toFixed(1)}</span>
                  </div>
                </div>

                <p className="text-[13px] text-[#524345] leading-relaxed">{cake.description}</p>

                {/* Deposit Calculator Box */}
                <div className="p-4 bg-[#f8ebe6] rounded-2xl border border-[#d7c1c4] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-bold text-[#524345]">Calculated Total</span>
                    <span className="font-bold text-[20px] text-[#8b4b58]">{totalETB} ETB</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[#d7c1c4]/50">
                    <span className="text-[11px] font-bold text-amber-800">50% Booking Deposit</span>
                    <span className="font-bold text-[15px] text-amber-800">{depositETB} ETB</span>
                  </div>
                  <p className="text-[10px] text-[#847375] italic">
                    Pay 50% deposit to lock booking date via Telebirr, Chapa, or CBE Birr. Remaining balance due on pickup/delivery.
                  </p>
                </div>
              </div>

              {/* Form Customization Controls */}
              <div className="lg:col-span-7 space-y-4">
                {/* Event Occasion Preset Pills */}
                <div>
                  <label className="text-[12px] font-bold text-[#524345] block mb-1">Event Occasion</label>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {[
                      { label: '🎓 Graduation', inscription: 'Congratulations Class of 2026!' },
                      { label: '💍 Wedding', inscription: 'Forever & Always' },
                      { label: '🎂 Birthday', inscription: 'Happy Birthday!' },
                      { label: '🍼 Baby Shower', inscription: 'Welcome Little Miracle!' },
                      { label: '💖 Anniversary', inscription: 'Happy Anniversary!' },
                      { label: '👑 Royal Gala', inscription: 'Long Live The Royal!' },
                    ].map((occ) => (
                      <button
                        key={occ.label}
                        type="button"
                        onClick={() => {
                          if (!inscription) setInscription(occ.inscription);
                        }}
                        className="px-2.5 py-1 rounded-xl bg-[#f8ebe6] hover:bg-[#8b4b58] hover:text-white border border-[#d7c1c4] text-[11px] font-bold text-[#524345] transition-all cursor-pointer shrink-0"
                      >
                        {occ.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tiers */}
                <div>
                  <label className="text-[12px] font-bold text-[#524345] block mb-1">Select Tiers</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTiers(t)}
                        className={`py-2 rounded-xl text-[12px] font-bold border cursor-pointer transition-all ${
                          selectedTiers === t
                            ? 'bg-[#8b4b58] text-white border-[#8b4b58]'
                            : 'bg-[#f8ebe6] text-[#605e5a] border-[#d7c1c4]'
                        }`}
                      >
                        {t} {t === 1 ? 'Tier' : 'Tiers'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Flavor */}
                <div>
                  <label className="text-[12px] font-bold text-[#524345] block mb-1">Cake Flavor & Filling</label>
                  <select
                    value={selectedFlavor}
                    onChange={(e) => setSelectedFlavor(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#f8ebe6] border border-[#d7c1c4] rounded-xl text-[13px] font-semibold text-[#201a18] outline-none"
                  >
                    <option>Rose Water & Vanilla Bean</option>
                    <option>Red Velvet & Cream Cheese</option>
                    <option>Belgian Dark Chocolate Mousse</option>
                    <option>Pistachio & Cardamom Creme</option>
                    <option>Meyer Lemon & Lavender Honey</option>
                  </select>
                </div>

                {/* Inscription */}
                <div>
                  <label className="text-[12px] font-bold text-[#524345] block mb-1">Custom Inscription Message</label>
                  <input
                    type="text"
                    value={inscription}
                    onChange={(e) => setInscription(e.target.value)}
                    placeholder='e.g. "Happy Birthday Hannah!"'
                    className="w-full px-3.5 py-2.5 bg-[#f8ebe6] border border-[#d7c1c4] rounded-xl text-[13px] text-[#201a18] outline-none"
                  />
                </div>

                {/* Date & Fulfillment */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[12px] font-bold text-[#524345] block mb-1">Fulfillment</label>
                    <select
                      value={fulfillment}
                      onChange={(e) => setFulfillment(e.target.value as FulfillmentType)}
                      className="w-full px-3.5 py-2.5 bg-[#f8ebe6] border border-[#d7c1c4] rounded-xl text-[13px] font-semibold text-[#201a18] outline-none"
                    >
                      <option value="Delivery">Delivery Express</option>
                      <option value="Pickup">Store Pickup</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[12px] font-bold text-[#524345] block mb-1">Booking Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#f8ebe6] border border-[#d7c1c4] rounded-xl text-[13px] font-semibold text-[#201a18] outline-none"
                    />
                  </div>
                </div>

                {/* Instant Order Buttons */}
                <div className="space-y-2 pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-[12px] font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>Order on WhatsApp</span>
                    </a>
                    <a
                      href={telegramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 bg-sky-700 hover:bg-sky-600 text-white rounded-xl text-[12px] font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>Order on Telegram</span>
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full py-3.5 bg-[#8b4b58] text-white rounded-xl font-bold text-[13px] tracking-wider shadow-lg hover:bg-[#8b4b58]/90 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                    <span>Add to Cart & Pay Deposit ({depositETB} ETB)</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Reviews Tab */
            <div className="space-y-6">
              {/* Submit Review */}
              <form onSubmit={handleAddReview} className="p-4 bg-[#f8ebe6] rounded-2xl border border-[#d7c1c4] space-y-3">
                <h4 className="font-bold text-[14px] text-[#201a18]">Write a Customer Review</h4>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-[#524345]">Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="material-symbols-outlined text-[20px] text-amber-500 cursor-pointer"
                      style={{ fontVariationSettings: star <= newRating ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      star
                    </button>
                  ))}
                </div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Tell other cake lovers about taste, design, and delivery experience..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#d7c1c4] rounded-xl text-[13px] outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#8b4b58] text-white text-[12px] font-bold rounded-xl shadow-xs hover:bg-[#8b4b58]/90 cursor-pointer"
                >
                  Submit Review
                </button>
              </form>

              {/* Reviews List */}
              <div className="space-y-3">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="p-4 bg-white rounded-2xl border border-[#d7c1c4]/50 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[13px] text-[#201a18]">{rev.author}</span>
                      <span className="text-[11px] text-[#847375]">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-[14px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                          star
                        </span>
                      ))}
                    </div>
                    <p className="text-[12px] text-[#524345] leading-relaxed pt-1">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
