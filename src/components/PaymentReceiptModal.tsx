import React from 'react';
import { Order } from '../types';

interface PaymentReceiptModalProps {
  order: Order | null;
  onClose: () => void;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  order,
  onClose,
}) => {
  if (!order) return null;

  const depositPaid = order.depositAmount || Math.round(order.total * 0.5);
  const remainingBalance = Math.max(0, order.total - depositPaid);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none animate-fade-in">
      <div className="bg-[#ffffff] rounded-3xl border border-[#d7c1c4] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#8b4b58] text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px]">receipt_long</span>
            <h3 className="font-bold text-[16px]">CakeHub Digital Invoice & Receipt</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-8 space-y-6 overflow-y-auto flex-1 bg-white" id="printable-receipt">
          {/* Logo & Store Header */}
          <div className="text-center pb-6 border-b border-dashed border-[#d7c1c4]">
            <div className="flex items-center justify-center gap-2 text-[#8b4b58]">
              <span className="material-symbols-outlined text-[32px]">cake</span>
              <span className="font-bold text-[24px]">CakeHub SaaS</span>
            </div>
            <p className="text-[12px] text-[#605e5a] font-semibold mt-0.5">
              {order.branch || 'Addis Ababa - Bole Medhanialem Branch'}
            </p>
            <span className="text-[11px] text-[#847375]">Tax ID: 984021004 • Tel: +251 91 100 0000</span>
          </div>

          {/* Receipt Info Grid */}
          <div className="grid grid-cols-2 gap-4 text-[12px]">
            <div>
              <span className="text-[#847375] block">Order Ref</span>
              <span className="font-bold text-[#201a18] text-[14px]">{order.id}</span>
            </div>
            <div className="text-right">
              <span className="text-[#847375] block">Booking Date</span>
              <span className="font-bold text-[#201a18]">{order.date}</span>
            </div>
            <div>
              <span className="text-[#847375] block">Customer</span>
              <span className="font-bold text-[#201a18]">{order.customer.name}</span>
              <span className="text-[11px] text-[#605e5a] block">{order.customer.email}</span>
            </div>
            <div className="text-right">
              <span className="text-[#847375] block">Fulfillment</span>
              <span className="font-bold text-[#8b4b58]">{order.fulfillment}</span>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-[#d7c1c4]/50 rounded-2xl overflow-hidden text-[12px]">
            <table className="w-full text-left">
              <thead className="bg-[#f8ebe6] text-[#524345] font-bold">
                <tr>
                  <th className="p-3">Bake Item</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d7c1c4]/30">
                <tr>
                  <td className="p-3">
                    <span className="font-bold text-[#201a18] block">{order.items}</span>
                    {order.notes && (
                      <span className="text-[10px] text-[#847375] italic">Note: {order.notes}</span>
                    )}
                  </td>
                  <td className="p-3 text-center font-bold">1</td>
                  <td className="p-3 text-right font-bold text-[#201a18]">{order.total} ETB</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals & Deposit Breakdown */}
          <div className="p-4 bg-[#f8ebe6] rounded-2xl border border-[#d7c1c4] space-y-2 text-[13px]">
            <div className="flex justify-between items-center text-[#524345]">
              <span>Subtotal</span>
              <span className="font-bold">{order.total} ETB</span>
            </div>

            <div className="flex justify-between items-center text-emerald-800 font-bold pt-1 border-t border-[#d7c1c4]/50">
              <span>50% Deposit Paid ({order.paymentMethod || 'Telebirr'})</span>
              <span>- {depositPaid} ETB</span>
            </div>

            <div className="flex justify-between items-center text-[#8b4b58] font-bold text-[15px] pt-1 border-t border-[#d7c1c4]/50">
              <span>Balance Due on Fulfillment</span>
              <span>{remainingBalance} ETB</span>
            </div>
          </div>

          {/* Stamp & Verification */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-left text-[11px] text-green-700 font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>OFFICIAL TELEBIRR / CHAPA VERIFIED RECEIPT</span>
            </div>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#8b4b58] text-white rounded-xl text-[12px] font-bold shadow-xs hover:bg-[#8b4b58]/90 cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print Receipt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
