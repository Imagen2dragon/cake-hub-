import React, { useState } from 'react';
import { Order, FulfillmentType, PaymentMethod, BakeryBranch } from '../types';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOrder: (newOrder: Order) => void;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
  isOpen,
  onClose,
  onAddOrder,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [itemTitle, setItemTitle] = useState('Custom Tiered Cake');
  const [price, setPrice] = useState('2400');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Telebirr');
  const [branch, setBranch] = useState<BakeryBranch>('Addis Ababa - Bole Medhanialem');
  const [fulfillment, setFulfillment] = useState<FulfillmentType>('Delivery');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail) return;

    const numId = Math.floor(1000 + Math.random() * 9000);
    const totalVal = parseFloat(price) || 2400;
    const order: Order = {
      id: `#AB-${numId}`,
      customer: {
        name: customerName,
        email: customerEmail,
        initials: customerName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      },
      items: itemTitle,
      itemDetails: [
        { name: itemTitle, qty: 1, price: totalVal }
      ],
      fulfillment,
      status: 'New',
      total: totalVal,
      depositAmount: Math.round(totalVal * 0.5),
      depositStatus: 'Paid (50%)',
      paymentMethod,
      branch,
      date: new Date().toISOString().split('T')[0],
      notes,
      trackingStep: 1,
    };

    onAddOrder(order);
    onClose();
    // reset
    setCustomerName('');
    setCustomerEmail('');
    setItemTitle('Custom Tiered Cake');
    setPrice('2400');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none animate-fade-in">
      <div className="bg-[#fff8f6] border border-[#d7c1c4] rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-6">
        <div className="flex justify-between items-center border-b border-[#d7c1c4]/40 pb-4">
          <div className="flex items-center gap-2 text-[#8b4b58]">
            <span className="material-symbols-outlined text-[24px]">add_circle</span>
            <h3 className="font-bold text-[20px] text-[#201a18]">Create New Custom Booking</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#605e5a] hover:text-[#8b4b58] p-1 rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[12px] font-bold text-[#524345]">Customer Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Eleanor Thorne"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#d7c1c4] rounded-xl text-[13px] text-[#201a18] focus:ring-2 focus:ring-[#8b4b58] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-bold text-[#524345]">Customer Phone / Email</label>
              <input
                type="text"
                required
                placeholder="e.g. +251 91 123 4567"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#d7c1c4] rounded-xl text-[13px] text-[#201a18] focus:ring-2 focus:ring-[#8b4b58] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[12px] font-bold text-[#524345]">Cake Item</label>
              <select
                value={itemTitle}
                onChange={(e) => setItemTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#d7c1c4] rounded-xl text-[13px] text-[#201a18] focus:ring-2 focus:ring-[#8b4b58] outline-none"
              >
                <option value="Custom Tiered Cake">Custom Tiered Cake</option>
                <option value="Rose Velvet Dream">Rose Velvet Dream</option>
                <option value="Midnight Truffle">Midnight Truffle</option>
                <option value="Pastel Macaron Box (12pcs)">Pastel Macaron Box (12pcs)</option>
                <option value="Zesty Lemon Tart">Zesty Lemon Tart</option>
                <option value="Peach Blossom Cake">Peach Blossom Cake</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-bold text-[#524345]">Total Price (ETB)</label>
              <input
                type="number"
                required
                placeholder="2400"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#d7c1c4] rounded-xl text-[13px] text-[#201a18] focus:ring-2 focus:ring-[#8b4b58] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[12px] font-bold text-[#524345]">50% Deposit Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#d7c1c4] rounded-xl text-[13px] font-semibold text-[#201a18] outline-none"
              >
                <option value="Telebirr">Telebirr</option>
                <option value="Chapa">Chapa Pay</option>
                <option value="CBE Birr">CBE Birr</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-bold text-[#524345]">Bakery Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value as BakeryBranch)}
                className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#d7c1c4] rounded-xl text-[13px] font-semibold text-[#201a18] outline-none"
              >
                <option value="Addis Ababa - Bole Medhanialem">Bole Medhanialem</option>
                <option value="Addis Ababa - Kazanchis Main">Kazanchis Main</option>
                <option value="Addis Ababa - Piassa Heritage">Piassa Heritage</option>
                <option value="Hawassa - Lake View">Hawassa Lake View</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[12px] font-bold text-[#524345]">Fulfillment Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-[13px] font-semibold text-[#201a18] cursor-pointer">
                <input
                  type="radio"
                  name="fulfillment"
                  value="Delivery"
                  checked={fulfillment === 'Delivery'}
                  onChange={() => setFulfillment('Delivery')}
                  className="accent-[#8b4b58]"
                />
                Delivery Express
              </label>
              <label className="flex items-center gap-2 text-[13px] font-semibold text-[#201a18] cursor-pointer">
                <input
                  type="radio"
                  name="fulfillment"
                  value="Pickup"
                  checked={fulfillment === 'Pickup'}
                  onChange={() => setFulfillment('Pickup')}
                  className="accent-[#8b4b58]"
                />
                Store Pickup
              </label>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[12px] font-bold text-[#524345]">Custom Inscription / Notes</label>
            <textarea
              rows={2}
              placeholder="e.g. Custom fondant plaque message..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#ffffff] border border-[#d7c1c4] rounded-xl text-[13px] text-[#201a18] focus:ring-2 focus:ring-[#8b4b58] outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#d7c1c4]/40">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-[#847375] text-[#524345] rounded-xl font-bold text-[12px] hover:bg-[#ede0db] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#8b4b58] text-white rounded-xl font-bold text-[12px] shadow-md hover:bg-[#8b4b58]/90 transition-all active:scale-95 cursor-pointer"
            >
              Save Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
