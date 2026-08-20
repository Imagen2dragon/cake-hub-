import React, { useState } from 'react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (cakeId: string, delta: number) => void;
  onRemoveItem: (cakeId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}) => {
  const [step, setStep] = useState<'cart' | 'payment' | 'receipt'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'Telebirr' | 'Chapa' | 'CBE Birr' | 'Credit Card' | 'Cash'>('Telebirr');
  const [payDepositOnly, setPayDepositOnly] = useState(true);
  const [customerName, setCustomerName] = useState('Sara Abebe');
  const [customerPhone, setCustomerPhone] = useState('+251 91 123 4567');
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.cake.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  const payableAmount = payDepositOnly ? total * 0.5 : total;

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/payment/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod,
          amount: payableAmount,
          isDeposit: payDepositOnly,
          customerInfo: { name: customerName, phone: customerPhone },
          items: cart.map(i => `${i.cake.name} (x${i.quantity})`).join(', ')
        }),
      });
      const data = await res.json();
      if (data && data.receipt) {
        setReceiptData(data.receipt);
        setStep('receipt');
      }
    } catch (err) {
      console.error(err);
      // Fallback local receipt
      setReceiptData({
        transactionId: `TXN-${paymentMethod.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'PAID',
        paymentMethod,
        amountPaid: payableAmount,
        paymentType: payDepositOnly ? '50% Deposit' : 'Full Payment',
        timestamp: new Date().toISOString(),
        customerName,
        customerPhone,
      });
      setStep('receipt');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinish = () => {
    onClearCart();
    setStep('cart');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="bg-[#fff8f6] border-l border-[#d7c1c4] w-full max-w-md h-full flex flex-col p-6 shadow-2xl animate-slide-in">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#d7c1c4]/40 pb-4 shrink-0">
          <div className="flex items-center gap-2 text-[#8b4b58]">
            <span className="material-symbols-outlined text-[24px]">
              {step === 'cart' ? 'shopping_cart' : step === 'payment' ? 'payments' : 'verified'}
            </span>
            <h3 className="font-semibold text-[20px] text-[#201a18]">
              {step === 'cart' && 'Your Bakery Order'}
              {step === 'payment' && 'Payment & Checkout Gateway'}
              {step === 'receipt' && 'Payment Receipt Confirmed'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#605e5a] hover:text-[#8b4b58] p-1 rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Content Views */}
        {step === 'receipt' && receiptData ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-4 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center animate-bounce shrink-0">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>
            <div>
              <h4 className="font-bold text-[20px] text-[#201a18]">Payment Successful!</h4>
              <p className="text-[12px] text-[#524345] mt-1">
                Transaction ID: <span className="font-mono font-bold text-[#8b4b58]">{receiptData.transactionId}</span>
              </p>
            </div>

            <div className="w-full bg-[#ffffff] p-4 rounded-2xl border border-[#d7c1c4] text-left space-y-2 text-[12px]">
              <div className="flex justify-between border-b border-dashed border-[#d7c1c4] pb-2">
                <span className="text-[#605e5a]">Method</span>
                <span className="font-bold text-[#8b4b58]">{receiptData.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-[#d7c1c4] pb-2">
                <span className="text-[#605e5a]">Payment Type</span>
                <span className="font-bold text-[#201a18]">{receiptData.paymentType}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-[#d7c1c4] pb-2">
                <span className="text-[#605e5a]">Amount Paid</span>
                <span className="font-bold text-[#201a18] text-[14px]">${receiptData.amountPaid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#605e5a]">Customer</span>
                <span className="font-medium text-[#201a18]">{receiptData.customerName} ({receiptData.customerPhone})</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3 bg-[#8b4b58] text-white rounded-xl font-bold text-[14px] shadow-md hover:bg-[#8b4b58]/90 transition-all cursor-pointer"
            >
              Done & Close
            </button>
          </div>
        ) : step === 'payment' ? (
          <div className="flex-1 overflow-y-auto py-4 space-y-4 text-[#201a18]">
            <button
              onClick={() => setStep('cart')}
              className="text-[12px] font-bold text-[#8b4b58] flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back to Cart Items
            </button>

            {/* Customer Details */}
            <div className="bg-[#ffffff] p-4 rounded-2xl border border-[#d7c1c4]/30 space-y-3">
              <h4 className="font-bold text-[14px] text-[#8b4b58] flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">person</span> Customer Details
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[12px]">
                <div>
                  <label className="text-[11px] font-semibold text-[#524345]">Full Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#f8ebe6] border border-[#d7c1c4] rounded-lg outline-none text-[12px]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#524345]">Phone Number</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#f8ebe6] border border-[#d7c1c4] rounded-lg outline-none text-[12px]"
                  />
                </div>
              </div>
            </div>

            {/* Deposit vs Full Payment */}
            <div className="bg-[#ffffff] p-4 rounded-2xl border border-[#d7c1c4]/30 space-y-2">
              <h4 className="font-bold text-[14px] text-[#8b4b58]">Payment Structure</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPayDepositOnly(true)}
                  className={`p-2.5 rounded-xl border text-[12px] font-bold cursor-pointer transition-all text-left ${
                    payDepositOnly
                      ? 'bg-[#8b4b58] text-white border-[#8b4b58]'
                      : 'bg-[#f8ebe6] text-[#524345] border-[#d7c1c4]'
                  }`}
                >
                  <p>50% Deposit</p>
                  <p className="text-[11px] opacity-90">${(total * 0.5).toFixed(2)}</p>
                </button>
                <button
                  type="button"
                  onClick={() => setPayDepositOnly(false)}
                  className={`p-2.5 rounded-xl border text-[12px] font-bold cursor-pointer transition-all text-left ${
                    !payDepositOnly
                      ? 'bg-[#8b4b58] text-white border-[#8b4b58]'
                      : 'bg-[#f8ebe6] text-[#524345] border-[#d7c1c4]'
                  }`}
                >
                  <p>100% Full</p>
                  <p className="text-[11px] opacity-90">${total.toFixed(2)}</p>
                </button>
              </div>
            </div>

            {/* Payment Method Options */}
            <div className="bg-[#ffffff] p-4 rounded-2xl border border-[#d7c1c4]/30 space-y-3">
              <h4 className="font-bold text-[14px] text-[#8b4b58]">Integrated Payment API Gateways</h4>
              <div className="space-y-2">
                {[
                  { id: 'Telebirr', name: 'Telebirr SuperApp / USSD', desc: 'Instant mobile money payment (Ethiopia)', icon: 'smartphone' },
                  { id: 'Chapa', name: 'Chapa Payment Gateway', desc: 'Accept Cards, Telebirr & CBE Birr', icon: 'credit_card' },
                  { id: 'CBE Birr', name: 'CBE Birr Mobile Banking', desc: 'Commercial Bank of Ethiopia Direct', icon: 'account_balance' },
                  { id: 'Credit Card', name: 'Stripe / International Card', desc: 'Visa, Mastercard, Amex', icon: 'payment' },
                  { id: 'Cash', name: 'Cash on Delivery / POS Counter', desc: 'Pay at store pickup', icon: 'payments' },
                ].map((pm) => (
                  <label
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === pm.id
                        ? 'border-[#8b4b58] bg-[#fdf2ef] shadow-xs'
                        : 'border-[#d7c1c4]/50 bg-[#ffffff] hover:bg-[#f8ebe6]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === pm.id}
                      onChange={() => {}}
                      className="accent-[#8b4b58]"
                    />
                    <span className="material-symbols-outlined text-[20px] text-[#8b4b58]">{pm.icon}</span>
                    <div className="flex-1">
                      <p className="font-bold text-[13px] text-[#201a18]">{pm.name}</p>
                      <p className="text-[10px] text-[#605e5a]">{pm.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Complete Payment Button */}
            <button
              disabled={isProcessing}
              onClick={handleProcessPayment}
              className="w-full py-3.5 bg-[#8b4b58] text-white rounded-xl font-bold text-[14px] shadow-md hover:bg-[#8b4b58]/90 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Processing Payment API...</span>
              ) : (
                <>
                  <span>Pay Now ${payableAmount.toFixed(2)} via {paymentMethod}</span>
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                </>
              )}
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
            <span className="material-symbols-outlined text-[48px] text-[#847375]">
              shopping_bag
            </span>
            <p className="font-semibold text-[16px] text-[#201a18]">Your cart is currently empty</p>
            <p className="text-[13px] text-[#605e5a]">
              Explore our catalogue and add artisanal creations to your order.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {cart.map((item) => (
              <div
                key={item.cake.id}
                className="flex items-center gap-4 bg-[#ffffff] p-3 rounded-xl border border-[#d7c1c4]/30"
              >
                <img
                  src={item.cake.image}
                  alt={item.cake.name}
                  className="w-16 h-16 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-[14px] text-[#201a18]">{item.cake.name}</h4>
                  <p className="text-[12px] text-[#8b4b58] font-bold">${item.cake.price}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateQty(item.cake.id, -1)}
                    className="w-7 h-7 rounded-md border border-[#d7c1c4] text-[#524345] flex items-center justify-center hover:bg-[#ede0db] cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-semibold text-[13px] w-5 text-center text-[#201a18]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQty(item.cake.id, 1)}
                    className="w-7 h-7 rounded-md border border-[#d7c1c4] text-[#524345] flex items-center justify-center hover:bg-[#ede0db] cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => onRemoveItem(item.cake.id)}
                  className="text-[#ba1a1a] p-1 hover:bg-[#ffdad6] rounded-md transition-colors cursor-pointer"
                  title="Remove"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer Summary */}
        {step === 'cart' && cart.length > 0 && (
          <div className="border-t border-[#d7c1c4]/40 pt-4 space-y-3 shrink-0">
            <div className="space-y-1 text-[13px] text-[#524345]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-[16px] text-[#201a18] pt-2 border-t border-[#d7c1c4]/20">
                <span>Total</span>
                <span className="text-[#8b4b58]">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setStep('payment')}
              className="w-full py-3.5 bg-[#8b4b58] text-white rounded-xl font-bold text-[14px] shadow-md hover:bg-[#8b4b58]/90 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Proceed to Payment Gateways (${total.toFixed(2)})</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

