import React, { useState } from 'react';
import { CakeItem } from '../types';

interface AnalyticsViewProps {
  topCakes: CakeItem[];
  onSelectCakeDetails?: (cake: CakeItem) => void;
  onNavigateToCatalogue?: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  topCakes,
  onNavigateToCatalogue,
}) => {
  const [timeRange, setTimeRange] = useState('Last 7 Days');
  const [dateRangeText, setDateRangeText] = useState('Aug 01 - Aug 31, 2023');

  const handleExportCSV = () => {
    const csvHeader = 'Product,Category,Sold,Revenue,Status\n';
    const csvRows = topCakes
      .map((c) => `"${c.name}","${c.category}",${c.soldCount},$${c.revenue.toFixed(2)},"${c.stockStatus}"`)
      .join('\n');
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bakery_Sales_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full min-h-screen px-6 lg:px-12 py-10 select-none">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h2 className="font-semibold text-[32px] leading-10 text-[#201a18] mb-1">
            Sales Performance
          </h2>
          <p className="text-[14px] leading-5 text-[#605e5a]">
            Real-time overview of your bakery's growth and trends.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 bg-[#f2e6e1] px-4 py-2 rounded-lg border border-[#d7c1c4]/30">
            <span className="material-symbols-outlined text-[#605e5a] text-[20px]">
              calendar_today
            </span>
            <input
              type="text"
              value={dateRangeText}
              onChange={(e) => setDateRangeText(e.target.value)}
              className="bg-transparent border-none text-[12px] font-semibold text-[#524345] focus:outline-none w-36"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="bg-[#f2e6e1] text-[#524345] px-4 py-2 rounded-lg border border-[#d7c1c4]/30 font-semibold text-[12px] flex items-center gap-2 hover:bg-[#e6e2dc] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
            Export CSV
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Total Sales */}
        <div className="bg-[#ffffff] p-6 rounded-xl border border-[#d7c1c4]/20 card-shadow flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#ffb2bf]/20 rounded-xl text-[#8b4b58]">
              <span className="material-symbols-outlined text-[24px]">payments</span>
            </div>
            <span className="text-green-700 bg-green-100 px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">trending_up</span> 12.5%
            </span>
          </div>
          <p className="font-semibold text-[12px] text-[#524345] mb-1 uppercase tracking-wider">
            Total Sales
          </p>
          <h3 className="font-semibold text-[32px] leading-10 text-[#201a18]">$24,482.00</h3>
        </div>

        {/* Total Orders */}
        <div className="bg-[#ffffff] p-6 rounded-xl border border-[#d7c1c4]/20 card-shadow flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#e1bec3]/20 rounded-xl text-[#73575c]">
              <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
            </div>
            <span className="text-green-700 bg-green-100 px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">trending_up</span> 8.2%
            </span>
          </div>
          <p className="font-semibold text-[12px] text-[#524345] mb-1 uppercase tracking-wider">
            Total Orders
          </p>
          <h3 className="font-semibold text-[32px] leading-10 text-[#201a18]">1,248</h3>
        </div>

        {/* Average Order Value */}
        <div className="bg-[#ffffff] p-6 rounded-xl border border-[#d7c1c4]/20 card-shadow flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#e6e2dc]/50 rounded-xl text-[#605e5a]">
              <span className="material-symbols-outlined text-[24px]">receipt_long</span>
            </div>
            <span className="text-red-700 bg-red-100 px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">trending_down</span> 2.1%
            </span>
          </div>
          <p className="font-semibold text-[12px] text-[#524345] mb-1 uppercase tracking-wider">
            Average Order Value
          </p>
          <h3 className="font-semibold text-[32px] leading-10 text-[#201a18]">$19.62</h3>
        </div>
      </section>

      {/* Charts Row */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Weekly Sales Chart */}
        <div className="lg:col-span-2 bg-[#ffffff] p-8 rounded-xl border border-[#d7c1c4]/20 card-shadow">
          <div className="flex justify-between items-center mb-8">
            <h4 className="font-semibold text-[20px] text-[#201a18]">Weekly Sales</h4>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent border-none font-semibold text-[12px] text-[#605e5a] focus:ring-0 cursor-pointer outline-none"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>

          <div className="relative h-[280px] w-full flex items-end justify-between px-4">
            <div className="absolute inset-x-0 bottom-0 top-0 chart-gradient rounded-lg opacity-40 pointer-events-none" />

            {[
              { day: 'Mon', height: 'h-[40%]', val: '$2,100' },
              { day: 'Tue', height: 'h-[65%]', val: '$3,400' },
              { day: 'Wed', height: 'h-[55%]', val: '$2,900' },
              { day: 'Thu', height: 'h-[85%]', val: '$4,800' },
              { day: 'Fri', height: 'h-[70%]', val: '$3,800' },
              { day: 'Sat', height: 'h-[95%]', val: '$5,200' },
              { day: 'Sun', height: 'h-[90%]', val: '$4,900' },
            ].map((col, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 group h-full justify-end flex-1 z-10">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#201a18] text-white text-[10px] py-1 px-2 rounded mb-1 shadow-sm">
                  {col.val}
                </div>
                <div
                  className={`w-2.5 bg-[#8b4b58] rounded-full transition-all duration-300 group-hover:bg-[#d88c9a] ${col.height}`}
                  style={{ boxShadow: '0 0 10px rgba(139, 75, 88, 0.3)' }}
                />
                <span className="font-medium text-[11px] text-[#605e5a]">{col.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Categories Donut */}
        <div className="bg-[#ffffff] p-8 rounded-xl border border-[#d7c1c4]/20 card-shadow flex flex-col items-center">
          <h4 className="font-semibold text-[20px] text-[#201a18] w-full mb-8">
            Popular Categories
          </h4>

          <div className="relative w-48 h-48 mb-8">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#f2e6e1" strokeWidth="3" />
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="transparent"
                stroke="#8b4b58"
                strokeWidth="3"
                strokeDasharray="45 100"
              />
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="transparent"
                stroke="#ba999f"
                strokeWidth="3"
                strokeDasharray="25 100"
                strokeDashoffset="-45"
              />
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="transparent"
                stroke="#5e4449"
                strokeWidth="3"
                strokeDasharray="30 100"
                strokeDashoffset="-70"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-semibold text-[24px] text-[#201a18]">324</span>
              <span className="font-medium text-[11px] text-[#605e5a]">Sold Today</span>
            </div>
          </div>

          <div className="w-full flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#8b4b58]" />
                <span className="text-[14px] text-[#524345]">Custom Cakes</span>
              </div>
              <span className="font-bold text-[12px] text-[#201a18]">45%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ba999f]" />
                <span className="text-[14px] text-[#524345]">Cupcakes</span>
              </div>
              <span className="font-bold text-[12px] text-[#201a18]">25%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#493136]" />
                <span className="text-[14px] text-[#524345]">Artisan Bread</span>
              </div>
              <span className="font-bold text-[12px] text-[#201a18]">30%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Top Performing Cakes Table */}
      <section className="bg-[#ffffff] rounded-xl border border-[#d7c1c4]/20 card-shadow overflow-hidden">
        <div className="p-8 border-b border-[#d7c1c4]/10 flex justify-between items-center">
          <h4 className="font-semibold text-[20px] text-[#201a18]">Top Performing Cakes</h4>
          <button
            onClick={onNavigateToCatalogue}
            className="text-[#8b4b58] font-semibold text-[12px] hover:underline cursor-pointer"
          >
            View All Catalogue
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#fef1ec]">
              <tr>
                <th className="px-8 py-4 font-semibold text-[12px] text-[#605e5a] uppercase tracking-wider">
                  Product
                </th>
                <th className="px-8 py-4 font-semibold text-[12px] text-[#605e5a] uppercase tracking-wider">
                  Category
                </th>
                <th className="px-8 py-4 font-semibold text-[12px] text-[#605e5a] uppercase tracking-wider text-right">
                  Sold
                </th>
                <th className="px-8 py-4 font-semibold text-[12px] text-[#605e5a] uppercase tracking-wider text-right">
                  Revenue
                </th>
                <th className="px-8 py-4 font-semibold text-[12px] text-[#605e5a] uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d7c1c4]/10">
              {topCakes.map((cake) => (
                <tr key={cake.id} className="hover:bg-[#fef1ec]/60 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={cake.image}
                        alt={cake.altText}
                        className="w-12 h-12 rounded-lg object-cover border border-[#d7c1c4]/30"
                      />
                      <div>
                        <p className="font-medium text-[16px] text-[#201a18]">{cake.name}</p>
                        <p className="text-[11px] font-medium text-[#605e5a]">{cake.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-[#ede0db] rounded-full font-medium text-[11px] text-[#524345]">
                      {cake.category}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right font-medium text-[14px] text-[#201a18]">
                    {cake.soldCount}
                  </td>
                  <td className="px-8 py-6 text-right font-semibold text-[14px] text-[#8b4b58]">
                    ${cake.revenue.toFixed(2)}
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold text-[12px] ${
                        cake.stockStatus === 'In Stock'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-[#ffdad6] text-[#ba1a1a]'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          cake.stockStatus === 'In Stock' ? 'bg-green-700' : 'bg-[#ba1a1a]'
                        }`}
                      />
                      {cake.stockStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
