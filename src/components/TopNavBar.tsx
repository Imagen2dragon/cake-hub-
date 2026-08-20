import React from 'react';
import { TabType, BakeryBranch } from '../types';
import { Language } from '../utils/i18n';

interface TopNavBarProps {
  cartCount: number;
  onOpenCart: () => void;
  setActiveTab: (tab: TabType) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  currentBranch: BakeryBranch;
  onBranchChange: (branch: BakeryBranch) => void;
  onOpenAiAssistant: () => void;
  onOpenCustomBuilder: () => void;
  onOpenTracker: () => void;
  onOpenQrCode: () => void;
  onOpenPaymentGateway?: () => void;
  onToggleMobileMenu?: () => void;
  isSidebarCollapsed?: boolean;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  cartCount,
  onOpenCart,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  currentLanguage,
  onLanguageChange,
  currentBranch,
  onBranchChange,
  onOpenAiAssistant,
  onOpenCustomBuilder,
  onOpenTracker,
  onOpenQrCode,
  onOpenPaymentGateway,
  onToggleMobileMenu,
  isSidebarCollapsed = false,
}) => {
  return (
    <header
      className={`fixed top-0 left-0 ${
        isSidebarCollapsed ? 'md:left-[80px]' : 'md:left-[280px]'
      } right-0 z-30 bg-[#ffffff] border-b border-[#d7c1c4]/40 shadow-xs h-20 flex justify-between items-center pl-5 sm:pl-8 pr-4 lg:pr-8 transition-all duration-300`}
    >
      {/* Left Section */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Mobile Hamburger & Logo */}
        <div className="flex items-center gap-2 md:hidden">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="p-2 text-[#8b4b58] hover:bg-[#f8ebe6] rounded-xl cursor-pointer"
              aria-label="Open Menu"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
          )}
          <button
            onClick={() => setActiveTab('catalogue')}
            className="flex items-center gap-2 text-left cursor-pointer"
          >
            <span className="material-symbols-outlined text-[28px] text-[#8b4b58]">cake</span>
            <span className="font-bold text-[20px] text-[#8b4b58] tracking-tight">
              CakeHub
            </span>
          </button>
        </div>

        {/* Branch Switcher (Desktop / Tablet) */}
        <div className="hidden sm:flex items-center gap-1.5 bg-[#f8ebe6] px-3 py-1.5 rounded-xl border border-[#d7c1c4] shrink-0">
          <span className="material-symbols-outlined text-[18px] text-[#8b4b58]">store</span>
          <select
            value={currentBranch}
            onChange={(e) => onBranchChange(e.target.value as BakeryBranch)}
            className="bg-transparent text-[12px] font-bold text-[#201a18] outline-none cursor-pointer max-w-[150px] lg:max-w-[210px] truncate"
          >
            <option value="Addis Ababa - Bole Medhanialem">📍 Bole Medhanialem</option>
            <option value="Addis Ababa - Kazanchis Main">📍 Kazanchis Main</option>
            <option value="Addis Ababa - Piassa Heritage">📍 Piassa Heritage</option>
            <option value="Hawassa - Lake View">📍 Hawassa Lake View</option>
          </select>
        </div>
      </div>

      {/* Right Controls & Feature Action Buttons */}
      <div className="flex items-center gap-2 lg:gap-3 shrink-0">
        {/* Search */}
        <div className="relative hidden xl:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#847375] text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search cake designs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-1.5 bg-[#f8ebe6] rounded-full border border-[#d7c1c4] focus:ring-2 focus:ring-[#8b4b58] w-36 2xl:w-48 text-[12px] text-[#201a18] outline-none"
          />
        </div>

        {/* Language Switcher */}
        <div className="flex items-center bg-[#f8ebe6] rounded-full p-0.5 border border-[#d7c1c4] shrink-0">
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              currentLanguage === 'en' ? 'bg-[#8b4b58] text-white' : 'text-[#605e5a]'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => onLanguageChange('am')}
            className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              currentLanguage === 'am' ? 'bg-[#8b4b58] text-white' : 'text-[#605e5a]'
            }`}
          >
            አማ
          </button>
          <button
            onClick={() => onLanguageChange('om')}
            className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              currentLanguage === 'om' ? 'bg-[#8b4b58] text-white' : 'text-[#605e5a]'
            }`}
          >
            OM
          </button>
        </div>

        {/* Feature Action Buttons */}
        <div className="hidden md:flex items-center gap-1 shrink-0">
          <button
            onClick={onOpenAiAssistant}
            className="p-2 rounded-xl bg-[#f8ebe6] hover:bg-[#ede0db] text-[#8b4b58] transition-all cursor-pointer flex items-center gap-1 text-[12px] font-bold"
            title="Flavor Assistant"
          >
            <span className="material-symbols-outlined text-[18px]">restaurant</span>
            <span className="hidden 2xl:inline">Flavor Guide</span>
          </button>

          <button
            onClick={onOpenCustomBuilder}
            className="p-2 rounded-xl bg-[#f8ebe6] hover:bg-[#ede0db] text-[#8b4b58] transition-all cursor-pointer flex items-center gap-1 text-[12px] font-bold"
            title="3D Custom Cake Builder"
          >
            <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
            <span className="hidden 2xl:inline">3D Builder</span>
          </button>

          <button
            onClick={onOpenTracker}
            className="p-2 rounded-xl bg-[#f8ebe6] hover:bg-[#ede0db] text-[#8b4b58] transition-all cursor-pointer flex items-center gap-1 text-[12px] font-bold"
            title="Track Order Status"
          >
            <span className="material-symbols-outlined text-[18px]">local_shipping</span>
            <span className="hidden 2xl:inline">Tracker</span>
          </button>

          <button
            onClick={onOpenQrCode}
            className="p-2 rounded-xl bg-[#f8ebe6] hover:bg-[#ede0db] text-[#8b4b58] transition-all cursor-pointer"
            title="Share Storefront QR Code"
          >
            <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
          </button>

          <button
            onClick={onOpenPaymentGateway}
            className="p-2 rounded-xl bg-[#f8ebe6] hover:bg-[#ede0db] text-[#8b4b58] transition-all cursor-pointer flex items-center gap-1 text-[12px] font-bold"
            title="Integrated Payment API Gateway Portal"
          >
            <span className="material-symbols-outlined text-[18px]">payments</span>
            <span className="hidden 2xl:inline">Pay Gateways</span>
          </button>
        </div>

        {/* Cart Button */}
        <button
          onClick={onOpenCart}
          className="relative flex items-center gap-1.5 bg-[#8b4b58] text-white px-3.5 py-2 rounded-full font-bold text-[12px] tracking-wider shadow-sm hover:brightness-110 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
          <span className="hidden sm:inline">Cart</span>
          {cartCount > 0 && (
            <span className="bg-[#ffffff] text-[#8b4b58] font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
