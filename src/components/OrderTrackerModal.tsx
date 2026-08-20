import React, { useState } from 'react';
import { Order } from '../types';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  orders,
}) => {
  const [searchId, setSearchId] = useState('#AB-9842');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(
    orders.find((o) => o.id === '#AB-9842') || orders[0] || null
  );

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(
      (o) => o.id.toLowerCase() === searchId.trim().toLowerCase()
    );
    if (found) {
      setSelectedOrder(found);
    } else {
      alert(`Order "${searchId}" not found. Try #AB-9842 or #AB-9841`);
    }
  };

  const steps = [
    { title: 'Order Confirmed', desc: 'Deposit payment verified via Telebirr/Chapa', icon: 'fact_check' },
    { title: 'Baking & Layering', desc: 'Artisanal sponge baked in bakery oven', icon: 'bakery_dining' },
    { title: 'Decorating & Inscription', desc: 'Custom buttercream flowers & inscription applied', icon: 'palette' },
    { title: 'Quality & Packaging', desc: 'Chilled packaging and fragile seal applied', icon: 'inventory_2' },
    { title: 'Out for Delivery / Pickup', desc: 'Driver en route or waiting at store counter', icon: 'local_shipping' },
  ];

  const currentStepIndex = selectedOrder?.trackingStep || (selectedOrder?.status === 'Delivered' ? 5 : selectedOrder?.status === 'Ready' ? 4 : selectedOrder?.status === 'In Progress' ? 3 : 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none animate-fade-in">
      <div className="bg-[#ffffff] rounded-3xl border border-[#d7c1c4] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#8b4b58] text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[28px] text-[#ffd9de]">local_shipping</span>
            <div>
              <h3 className="font-bold text-[18px]">CakeHub Live Order & Delivery Tracker</h3>
              <p className="text-[12px] text-[#ffd9de]">Real-time status updates from oven to doorstep</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 pb-0 shrink-0">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Order Code e.g. #AB-9842"
                className="w-full px-4 py-3 pl-10 bg-[#f8ebe6] border border-[#d7c1c4] rounded-xl text-[14px] font-semibold text-[#201a18] outline-none focus:ring-2 focus:ring-[#8b4b58]"
              />
              <span className="material-symbols-outlined absolute left-3 top-3.5 text-[#847375] text-[20px]">
                search
              </span>
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#8b4b58] text-white font-bold text-[13px] rounded-xl hover:bg-[#8b4b58]/90 transition-all cursor-pointer"
            >
              Track Order
            </button>
          </form>
        </div>

        {/* Order Details & Stepper */}
        {selectedOrder ? (
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* Summary Box */}
            <div className="p-5 bg-[#f8ebe6] rounded-2xl border border-[#d7c1c4]/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[20px] text-[#201a18]">{selectedOrder.id}</span>
                  <span className="bg-[#8b4b58] text-white text-[11px] font-bold px-3 py-0.5 rounded-full">
                    {selectedOrder.fulfillment}
                  </span>
                </div>
                <p className="text-[13px] text-[#524345] font-medium mt-0.5">{selectedOrder.items}</p>
                <span className="text-[12px] text-[#847375] block mt-1">
                  Customer: <strong>{selectedOrder.customer.name}</strong> • {selectedOrder.branch || 'Bole Main'}
                </span>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-[#605e5a] font-semibold block uppercase">Total & Deposit</span>
                <span className="font-bold text-[20px] text-[#8b4b58]">{selectedOrder.total} ETB</span>
                <span className="text-[11px] text-green-700 font-bold block">
                  {selectedOrder.depositStatus || 'Paid (50%)'} via {selectedOrder.paymentMethod || 'Telebirr'}
                </span>
              </div>
            </div>

            {/* Visual Stepper Timeline */}
            <div className="space-y-4">
              <h4 className="font-bold text-[14px] text-[#201a18] uppercase tracking-wider">
                Progress Timeline
              </h4>

              <div className="space-y-4 relative pl-4 border-l-2 border-[#d7c1c4] ml-4">
                {steps.map((st, idx) => {
                  const stepNum = idx + 1;
                  const isDone = stepNum <= currentStepIndex;
                  const isCurrent = stepNum === currentStepIndex;

                  return (
                    <div key={st.title} className="relative pl-6">
                      {/* Circle Dot */}
                      <div
                        className={`absolute -left-[27px] top-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-[13px] transition-all ${
                          isDone
                            ? 'bg-[#8b4b58] text-white shadow-md'
                            : 'bg-white text-[#847375] border-2 border-[#d7c1c4]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {isDone ? 'check' : st.icon}
                        </span>
                      </div>

                      <div className={`p-3 rounded-xl transition-all ${isCurrent ? 'bg-[#f8ebe6] border border-[#d7c1c4]' : ''}`}>
                        <div className="flex items-center gap-2">
                          <h5 className={`font-bold text-[14px] ${isDone ? 'text-[#201a18]' : 'text-[#847375]'}`}>
                            {st.title}
                          </h5>
                          {isCurrent && (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                              Active Stage
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-[#605e5a] mt-0.5">{st.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Map Simulation */}
            {selectedOrder.fulfillment === 'Delivery' && (
              <div className="p-4 bg-slate-900 text-white rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[140px]">
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block">
                      Live Delivery Express Route
                    </span>
                    <h5 className="font-bold text-[15px] mt-0.5">Driver: Kassahun Abera (Toyota Vitz)</h5>
                    <p className="text-[12px] text-slate-300">Destination: Bole Subcity, Addis Ababa</p>
                  </div>
                  <span className="bg-green-500 text-white text-[11px] font-bold px-3 py-1 rounded-full animate-pulse">
                    ETA: 25 Mins
                  </span>
                </div>

                <div className="relative z-10 flex gap-3 mt-4">
                  <a
                    href={`https://wa.me/251911000000?text=Hello%20Bakery!%20Inquiring%20about%20Order%20${selectedOrder.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[12px] font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>Contact Driver WhatsApp</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-12 text-center text-[#847375]">
            <span className="material-symbols-outlined text-[48px] text-[#d7c1c4]">search_off</span>
            <p className="text-[14px] font-semibold mt-2">Enter an order ID above to view live status.</p>
          </div>
        )}
      </div>
    </div>
  );
};
