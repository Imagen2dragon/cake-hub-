import React from 'react';
import { motion } from 'motion/react';
import { Order, InventoryItem } from '../types';

interface DashboardViewProps {
  orders: Order[];
  inventory: InventoryItem[];
  onNavigateToOrders: () => void;
  onOpenManageInventory: () => void;
  onSelectOrder: (order: Order) => void;
  userName?: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  orders,
  inventory,
  onNavigateToOrders,
  onOpenManageInventory,
  onSelectOrder,
  userName = 'Head Baker',
}) => {
  const recentOrders = orders.slice(0, 4);

  const metrics = [
    {
      title: 'Daily Revenue',
      value: '$3,420.50',
      badge: '+12%',
      isPositive: true,
      icon: 'payments',
      badgeIcon: 'trending_up',
    },
    {
      title: 'Active Orders',
      value: '24',
      badge: '8 In Progress',
      isPositive: false,
      icon: 'shopping_basket',
    },
    {
      title: 'Pending Requests',
      value: '07',
      badge: 'High Priority',
      isHighPriority: true,
      icon: 'rate_review',
    },
  ];

  return (
    <div className="w-full min-h-screen px-6 lg:px-12 py-10 select-none">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4"
      >
        <div>
          <h2 className="font-semibold text-[32px] leading-10 text-[#201a18]">
            Morning, {userName}
          </h2>
          <p className="text-[14px] leading-5 text-[#524345] mt-1">
            Here is what's happening in your bakery today.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-[#f8ebe6] rounded-xl px-4 py-2 flex items-center gap-2 text-[#524345] border border-[#d7c1c4]">
            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
            <span className="font-semibold text-[12px]">Oct 24, 2023</span>
          </div>
        </div>
      </motion.header>

      {/* Metric Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {metrics.map((m, idx) => (
          <motion.div
            key={m.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.08 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-[#ffffff] p-6 rounded-xl border border-[#d7c1c4] flex flex-col justify-between h-40 shadow-xs hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div className="p-3 bg-[#fef1ec] rounded-lg text-[#8b4b58]">
                <span className="material-symbols-outlined text-[24px]">{m.icon}</span>
              </div>
              {m.isHighPriority ? (
                <span className="bg-[#ffdad6] text-[#93000a] px-2 py-0.5 rounded-full font-medium text-[11px]">
                  {m.badge}
                </span>
              ) : (
                <span className={`font-semibold text-[12px] flex items-center gap-1 ${m.isPositive ? 'text-green-700' : 'text-[#524345]'}`}>
                  {m.badge}
                  {m.badgeIcon && <span className="material-symbols-outlined text-[14px]">{m.badgeIcon}</span>}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-[12px] text-[#524345] uppercase tracking-wider">
                {m.title}
              </h3>
              <p className="font-bold text-[32px] leading-10 text-[#201a18] mt-1">{m.value}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Orders Table */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="lg:col-span-8 bg-[#ffffff] rounded-xl border border-[#d7c1c4] overflow-hidden shadow-xs"
        >
          <div className="p-6 border-b border-[#ede0db] flex justify-between items-center">
            <h3 className="font-semibold text-[20px] text-[#201a18]">Recent Orders</h3>
            <button
              onClick={onNavigateToOrders}
              className="text-[#8b4b58] font-semibold text-[12px] hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#fef1ec]">
                <tr>
                  <th className="px-6 py-4 font-semibold text-[12px] text-[#605e5a] uppercase">
                    Order ID
                  </th>
                  <th className="px-6 py-4 font-semibold text-[12px] text-[#605e5a] uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-4 font-semibold text-[12px] text-[#605e5a] uppercase">
                    Items
                  </th>
                  <th className="px-6 py-4 font-semibold text-[12px] text-[#605e5a] uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 font-semibold text-[12px] text-[#605e5a] uppercase text-right">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ede0db]">
                {recentOrders.map((ord) => (
                  <tr
                    key={ord.id}
                    onClick={() => onSelectOrder(ord)}
                    className="hover:bg-[#fef1ec]/60 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-semibold text-[14px] text-[#201a18]">
                      {ord.id}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {ord.customer.avatar ? (
                          <img
                            src={ord.customer.avatar}
                            alt={ord.customer.name}
                            className="w-8 h-8 rounded-full object-cover shrink-0 border border-[#d7c1c4]"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#ba999f] text-white font-semibold text-[12px] flex items-center justify-center shrink-0">
                            {ord.customer.initials || ord.customer.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span className="font-medium text-[14px] text-[#201a18]">
                          {ord.customer.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-[14px] text-[#524345] max-w-[200px] truncate">
                      {ord.items}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`font-medium text-[11px] px-3 py-1 rounded-full ${
                          ord.status === 'In Progress'
                            ? 'bg-[#d88c9a]/20 text-[#5d2633]'
                            : ord.status === 'Ready'
                            ? 'bg-[#e6e2dc] text-[#605e5a]'
                            : ord.status === 'Delivered'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-[#ffdad6] text-[#93000a]'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-[14px] text-[#201a18] text-right font-semibold">
                      ${ord.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Right Column: Popular Inventory Grid */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="lg:col-span-4 flex flex-col"
        >
          <div className="bg-[#ffffff] rounded-xl border border-[#d7c1c4] p-6 shadow-xs flex flex-col flex-grow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-[20px] text-[#201a18]">Popular Inventory</h3>
              <span className="material-symbols-outlined text-[#605e5a]">inventory_2</span>
            </div>

            <div className="space-y-4">
              {inventory.map((inv, idx) => (
                <motion.div
                  key={inv.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.4 + idx * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-4 p-3 rounded-lg border border-[#ede0db] hover:bg-[#fef1ec] transition-colors cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-md overflow-hidden shrink-0 border border-[#d7c1c4]/30">
                    <img
                      src={inv.image}
                      alt={inv.altText}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-grow">
                    <p className="font-semibold text-[12px] text-[#201a18]">{inv.name}</p>
                    <div className="w-full bg-[#ede0db] h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${
                          inv.status === 'High'
                            ? 'bg-[#8b4b58]'
                            : inv.status === 'Medium'
                            ? 'bg-[#ba999f]'
                            : 'bg-[#ba1a1a]'
                        }`}
                        style={{ width: `${Math.min(100, (inv.stock / inv.maxStock) * 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="font-medium text-[11px] text-[#524345]">
                        {inv.stock} units in stock
                      </span>
                      <span
                        className={`font-bold text-[11px] ${
                          inv.status === 'Critical' || inv.status === 'Low Stock'
                            ? 'text-[#ba1a1a]'
                            : 'text-[#8b4b58]'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <button
              onClick={onOpenManageInventory}
              className="w-full border-2 border-[#847375] text-[#524345] font-semibold text-[12px] py-3 rounded-xl mt-6 hover:bg-[#f8ebe6] transition-all active:scale-95 cursor-pointer"
            >
              Manage Full Inventory
            </button>
          </div>
        </motion.section>
      </div>
    </div>
  );
};
