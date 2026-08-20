import React from 'react';
import { Order, OrderStatus } from '../types';

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
  onUpdateStatus,
}) => {
  if (!order) return null;

  const statusOptions: OrderStatus[] = ['New', 'In Progress', 'Ready', 'Delivered', 'Cancelled'];

  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case 'New':
        return 'bg-[#d88c9a]/20 text-[#5d2633]';
      case 'In Progress':
        return 'bg-[#ba999f]/30 text-[#73575c]';
      case 'Ready':
        return 'bg-[#e6e2dc] text-[#605e5a]';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-[#ffdad6] text-[#93000a]';
      default:
        return 'bg-[#e6e2dc] text-[#605e5a]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-[#fff8f6] border border-[#d7c1c4] rounded-2xl w-full max-w-lg p-6 shadow-xl space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-[#d7c1c4]/40 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-[20px] text-[#8b4b58]">{order.id}</span>
              <span className={`px-3 py-1 rounded-full font-semibold text-[11px] ${getStatusBadgeClass(order.status)}`}>
                {order.status}
              </span>
            </div>
            <p className="text-[12px] text-[#605e5a] mt-1">Placed on {order.date}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#605e5a] hover:text-[#8b4b58] p-1 rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Customer Info */}
        <div className="flex items-center gap-4 bg-[#fef1ec] p-4 rounded-xl border border-[#d7c1c4]/30">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-[#f8ebe6] flex items-center justify-center shrink-0 border border-[#d7c1c4]">
            {order.customer.avatar ? (
              <img
                src={order.customer.avatar}
                alt={order.customer.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-bold text-[14px] text-[#8b4b58]">
                {order.customer.initials || order.customer.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-[15px] text-[#201a18]">{order.customer.name}</h4>
            <p className="text-[12px] text-[#524345] opacity-80">{order.customer.email}</p>
            <div className="flex items-center gap-1.5 text-[12px] text-[#8b4b58] mt-1 font-medium">
              <span className="material-symbols-outlined text-[16px]">
                {order.fulfillment === 'Delivery' ? 'local_shipping' : 'store'}
              </span>
              Fulfillment: {order.fulfillment}
            </div>
          </div>
        </div>

        {/* Order Items Breakdown */}
        <div className="space-y-2">
          <h5 className="font-semibold text-[12px] text-[#605e5a] uppercase tracking-wider">
            Order Items
          </h5>
          <div className="bg-[#ffffff] border border-[#d7c1c4]/30 rounded-xl divide-y divide-[#d7c1c4]/20 p-3">
            {order.itemDetails && order.itemDetails.length > 0 ? (
              order.itemDetails.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 text-[14px]">
                  <div>
                    <span className="font-medium text-[#201a18]">{item.name}</span>
                    <span className="text-[#605e5a] text-[12px] ml-2">x{item.qty}</span>
                  </div>
                  <span className="font-semibold text-[#8b4b58]">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex justify-between items-center py-2 text-[14px]">
                <span className="font-medium text-[#201a18]">{order.items}</span>
                <span className="font-semibold text-[#8b4b58]">${order.total.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-3 font-bold text-[16px]">
              <span className="text-[#201a18]">Total Charged</span>
              <span className="text-[#8b4b58]">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Special Instructions */}
        {order.notes && (
          <div className="bg-[#f2e6e1] p-3 rounded-xl border border-[#d7c1c4]/40 text-[13px] text-[#524345]">
            <span className="font-semibold text-[#201a18]">Notes: </span>
            {order.notes}
          </div>
        )}

        {/* Status Update Controls */}
        <div className="space-y-2 pt-2 border-t border-[#d7c1c4]/40">
          <label className="font-semibold text-[12px] text-[#605e5a] uppercase tracking-wider block">
            Update Order Status
          </label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((st) => (
              <button
                key={st}
                onClick={() => onUpdateStatus(order.id, st)}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all cursor-pointer ${
                  order.status === st
                    ? 'bg-[#8b4b58] text-white shadow-sm'
                    : 'bg-[#ede0db] text-[#524345] hover:bg-[#d88c9a]/30'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-[#d7c1c4]/40">
          <button
            onClick={() => alert(`Receipt generated for order ${order.id}`)}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-[#8b4b58] hover:underline cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            Print Receipt
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#8b4b58] text-white rounded-xl font-semibold text-[12px] hover:bg-[#8b4b58]/90 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
