import React, { useState } from 'react';
import { Order, BakeryBranch } from '../types';

interface BookingCalendarViewProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onOpenNewOrderModal: () => void;
}

export const BookingCalendarView: React.FC<BookingCalendarViewProps> = ({
  orders,
  onSelectOrder,
  onOpenNewOrderModal,
}) => {
  const [selectedBranch, setSelectedBranch] = useState<string>('All Branches');
  const [filterMonth] = useState('August 2026');

  const filteredOrders = orders.filter((o) => {
    if (selectedBranch !== 'All Branches' && o.branch !== selectedBranch) return false;
    return true;
  });

  // Calendar dates mock generator for 31 days
  const daysInMonth = Array.from({ length: 31 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-08-${dayNum < 10 ? '0' + dayNum : dayNum}`;
    const dayOrders = filteredOrders.filter((o) => o.date === dateStr || (dayNum === 10 && o.date === '2026-08-10') || (dayNum === 7 && o.date === '2026-08-07'));
    return { dayNum, dateStr, dayOrders };
  });

  return (
    <div className="w-full min-h-screen px-6 lg:px-12 py-10 select-none">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#8b4b58] mb-1">
            <span className="material-symbols-outlined text-[24px]">calendar_month</span>
            <span className="text-[12px] font-bold uppercase tracking-wider">Bakery Operations</span>
          </div>
          <h1 className="font-bold text-[32px] lg:text-[36px] text-[#201a18] leading-tight">
            Cake Booking & Schedule Calendar
          </h1>
          <p className="text-[14px] text-[#605e5a] mt-1">
            Manage oven baking schedules, delivery slots, and deposit statuses across branches
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-4 py-2.5 bg-[#f8ebe6] border border-[#d7c1c4] rounded-xl text-[12px] font-bold text-[#201a18] outline-none cursor-pointer shadow-xs"
          >
            <option>All Branches</option>
            <option>Addis Ababa - Bole Medhanialem</option>
            <option>Addis Ababa - Kazanchis Main</option>
            <option>Addis Ababa - Piassa Heritage</option>
            <option>Hawassa - Lake View</option>
          </select>

          <button
            onClick={onOpenNewOrderModal}
            className="bg-[#8b4b58] text-white px-5 py-2.5 rounded-xl font-bold text-[13px] tracking-wider shadow-md hover:bg-[#8b4b58]/90 transition-all cursor-pointer flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>New Booking</span>
          </button>
        </div>
      </header>

      {/* Stats Quick Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 bg-white rounded-2xl border border-[#d7c1c4]/40 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#f8ebe6] text-[#8b4b58] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[24px]">cake</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#847375] uppercase block">Scheduled Bakes</span>
            <span className="text-[22px] font-bold text-[#201a18]">{filteredOrders.length} Cakes</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#d7c1c4]/40 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[24px]">payments</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#847375] uppercase block">Deposit Value</span>
            <span className="text-[22px] font-bold text-amber-800">
              {filteredOrders.reduce((sum, o) => sum + (o.depositAmount || o.total * 0.5), 0).toFixed(2)} ETB
            </span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#d7c1c4]/40 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[24px]">local_shipping</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#847375] uppercase block">Delivery Express</span>
            <span className="text-[22px] font-bold text-emerald-800">
              {filteredOrders.filter((o) => o.fulfillment === 'Delivery').length} Active Routes
            </span>
          </div>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-white rounded-3xl border border-[#d7c1c4]/50 shadow-sm p-6 overflow-hidden">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#d7c1c4]/30">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-[20px] text-[#201a18]">{filterMonth}</h3>
            <span className="bg-[#f8ebe6] text-[#8b4b58] px-3 py-0.5 rounded-full text-[11px] font-bold">
              31 Days
            </span>
          </div>
          <div className="flex items-center gap-4 text-[12px] font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
              Delivery
            </span>
            <span className="flex items-center gap-1.5 text-amber-700">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
              Pickup
            </span>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-[11px] font-bold text-[#847375] uppercase tracking-wider">
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
          <div>Sun</div>
        </div>

        {/* Days Cells */}
        <div className="grid grid-cols-7 gap-2">
          {daysInMonth.map((d) => (
            <div
              key={d.dayNum}
              className={`min-h-[100px] p-2 rounded-2xl border transition-all flex flex-col justify-between ${
                d.dayOrders.length > 0
                  ? 'bg-[#f8ebe6]/60 border-[#d7c1c4] shadow-2xs'
                  : 'bg-[#fafafa] border-[#e8dedb]'
              }`}
            >
              <div className="flex justify-between items-center">
                <span
                  className={`text-[12px] font-bold ${
                    d.dayNum === 6 ? 'bg-[#8b4b58] text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-[#201a18]'
                  }`}
                >
                  {d.dayNum}
                </span>
                {d.dayOrders.length > 0 && (
                  <span className="bg-[#8b4b58] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {d.dayOrders.length}
                  </span>
                )}
              </div>

              {/* Order Chips */}
              <div className="space-y-1 mt-1 flex-1 overflow-y-auto max-h-[70px]">
                {d.dayOrders.map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => onSelectOrder(ord)}
                    className={`p-1 rounded-lg text-[10px] font-bold truncate cursor-pointer transition-transform hover:scale-105 ${
                      ord.fulfillment === 'Delivery'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                    title={`${ord.customer.name} - ${ord.items}`}
                  >
                    {ord.id}: {ord.customer.name.split(' ')[0]}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
