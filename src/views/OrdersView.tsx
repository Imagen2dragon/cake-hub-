import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { PaymentReceiptModal } from '../components/PaymentReceiptModal';

interface OrdersViewProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onOpenNewOrderModal: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onSelectOrder,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  // Stats calculation
  const newCount = orders.filter((o) => o.status === 'New').length;
  const inProgressCount = orders.filter((o) => o.status === 'In Progress').length;
  const readyCount = orders.filter((o) => o.status === 'Ready').length;

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.items.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'New':
        return 'bg-[#d88c9a]/20 text-[#5d2633] border border-[#d88c9a]/40';
      case 'In Progress':
        return 'bg-amber-100 text-amber-900 border border-amber-300';
      case 'Ready':
        return 'bg-blue-100 text-blue-900 border border-blue-300';
      case 'Delivered':
        return 'bg-green-100 text-green-900 border border-green-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-900 border border-red-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full min-h-screen px-6 lg:px-12 py-10 select-none">
      {/* Top Header & Search Section */}
      <header className="mb-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="font-semibold text-[32px] leading-10 text-[#201a18] mb-1">
              Bakery Orders & Deposits
            </h2>
            <p className="text-[14px] leading-5 text-[#524345]">
              Track 50% deposit payments (Telebirr, Chapa, CBE Birr) & fulfillment schedules.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search order ID or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#fef1ec] border border-[#d7c1c4] rounded-xl px-4 py-2.5 pl-10 focus:ring-2 focus:ring-[#8b4b58] focus:outline-none transition-all text-[13px] w-64 text-[#201a18]"
              />
              <span className="material-symbols-outlined absolute left-3 top-3 text-[#524345] text-[18px]">
                search
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[12px] font-semibold text-[#605e5a]">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#ffffff] border border-[#d7c1c4] text-[#605e5a] px-3.5 py-2.5 rounded-xl text-[12px] font-bold cursor-pointer outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Ready">Ready</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Stats Bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#ffffff] p-6 rounded-2xl border border-[#d7c1c4] shadow-xs flex items-center justify-between transition-all hover:shadow-md">
            <div>
              <p className="font-semibold text-[11px] text-[#524345] mb-1 uppercase tracking-wider">
                NEW DEPOSIT BOOKINGS
              </p>
              <h3 className="font-bold text-[36px] text-[#8b4b58]">
                {newCount}
              </h3>
            </div>
            <div className="bg-[#d88c9a]/20 p-4 rounded-2xl text-[#8b4b58]">
              <span className="material-symbols-outlined text-[32px]">
                notifications_active
              </span>
            </div>
          </div>

          <div className="bg-[#ffffff] p-6 rounded-2xl border border-[#d7c1c4] shadow-xs flex items-center justify-between transition-all hover:shadow-md">
            <div>
              <p className="font-semibold text-[11px] text-[#524345] mb-1 uppercase tracking-wider">
                BAKING IN OVEN
              </p>
              <h3 className="font-bold text-[36px] text-[#73575c]">
                {inProgressCount}
              </h3>
            </div>
            <div className="bg-amber-100 p-4 rounded-2xl text-amber-900">
              <span className="material-symbols-outlined text-[32px]">
                bakery_dining
              </span>
            </div>
          </div>

          <div className="bg-[#ffffff] p-6 rounded-2xl border border-[#d7c1c4] shadow-xs flex items-center justify-between transition-all hover:shadow-md">
            <div>
              <p className="font-semibold text-[11px] text-[#524345] mb-1 uppercase tracking-wider">
                READY FOR PICKUP
              </p>
              <h3 className="font-bold text-[36px] text-[#666460]">
                {readyCount}
              </h3>
            </div>
            <div className="bg-emerald-100 p-4 rounded-2xl text-emerald-900">
              <span className="material-symbols-outlined text-[32px]">
                check_circle
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Active Orders Data Table */}
      <section className="bg-[#ffffff] rounded-2xl border border-[#d7c1c4] shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-[#d7c1c4] flex justify-between items-center bg-[#fef1ec]">
          <h4 className="font-bold text-[18px] text-[#201a18]">Customer Bookings & Deposits</h4>
          <span className="font-bold text-[11px] px-3 py-1 bg-[#ede0db] rounded-full text-[#524345]">
            Showing {filteredOrders.length} orders
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fef1ec] border-b border-[#d7c1c4]">
                <th className="px-6 py-4 font-bold text-[11px] text-[#605e5a] uppercase tracking-wider">ORDER CODE</th>
                <th className="px-6 py-4 font-bold text-[11px] text-[#605e5a] uppercase tracking-wider">CUSTOMER</th>
                <th className="px-6 py-4 font-bold text-[11px] text-[#605e5a] uppercase tracking-wider">DEPOSIT & METHOD</th>
                <th className="px-6 py-4 font-bold text-[11px] text-[#605e5a] uppercase tracking-wider">FULFILLMENT</th>
                <th className="px-6 py-4 font-bold text-[11px] text-[#605e5a] uppercase tracking-wider">STATUS</th>
                <th className="px-6 py-4 font-bold text-[11px] text-[#605e5a] uppercase tracking-wider text-right">TOTAL</th>
                <th className="px-6 py-4 font-bold text-[11px] text-[#605e5a] uppercase tracking-wider text-center">RECEIPT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d7c1c4]/30">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-[#605e5a] text-[14px]">
                    No orders match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-[#d88c9a]/5 transition-colors cursor-pointer"
                    onClick={() => onSelectOrder(order)}
                  >
                    <td className="px-6 py-5 font-bold text-[13px] text-[#8b4b58]">
                      {order.id}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-[#f8ebe6] flex items-center justify-center shrink-0 border border-[#d7c1c4]">
                          {order.customer.avatar ? (
                            <img
                              src={order.customer.avatar}
                              alt={order.customer.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="material-symbols-outlined text-[#605e5a]">
                              person
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[14px] text-[#201a18]">
                            {order.customer.name}
                          </p>
                          <p className="font-medium text-[11px] text-[#524345] opacity-70">
                            {order.customer.phone || order.customer.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="space-y-0.5">
                        <span className="font-bold text-[12px] text-emerald-800 block">
                          {order.depositStatus || 'Paid (50%)'}
                        </span>
                        <span className="text-[11px] text-[#605e5a] block font-semibold">
                          Via {order.paymentMethod || 'Telebirr'} ({order.depositAmount || Math.round(order.total * 0.5)} ETB)
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1.5 text-[#524345]">
                        <span className="material-symbols-outlined text-[18px]">
                          {order.fulfillment === 'Delivery' ? 'local_shipping' : 'store'}
                        </span>
                        <span className="text-[13px] font-semibold">{order.fulfillment}</span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`font-bold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <p className="font-bold text-[16px] text-[#8b4b58]">
                        {order.total} ETB
                      </p>
                    </td>

                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setReceiptOrder(order);
                        }}
                        className="px-3 py-1.5 bg-[#f8ebe6] hover:bg-[#ede0db] text-[#8b4b58] font-bold text-[11px] rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1 mx-auto"
                      >
                        <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-[#d7c1c4] bg-[#fef1ec] gap-4">
          <div className="flex items-center gap-2">
            <p className="text-[13px] text-[#524345]">Rows per page:</p>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="bg-transparent border-none font-bold text-[13px] text-[#201a18] cursor-pointer outline-none"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
          <p className="text-[12px] font-semibold text-[#847375]">
            Showing active orders list
          </p>
        </div>
      </section>

      {/* Digital Receipt Modal */}
      <PaymentReceiptModal
        order={receiptOrder}
        onClose={() => setReceiptOrder(null)}
      />
    </div>
  );
};
