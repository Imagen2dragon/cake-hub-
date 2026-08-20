import React from 'react';
import { TabType } from '../types';

interface SideNavBarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenNewOrderModal: () => void;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  onUpdateUser?: (name: string, email: string, role: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const SideNavBar: React.FC<SideNavBarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewOrderModal,
  userName = 'Head Baker',
  userEmail = 'headbaker@artisanbakes.com',
  userRole = 'Head Pastry Chef',
  onUpdateUser,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const [showProfileSwitcher, setShowProfileSwitcher] = React.useState(false);

  const navItems: { id: TabType; label: string; icon: string }[] = [
    { id: 'catalogue', label: 'Catalogue', icon: 'cake' },
    { id: 'orders', label: 'Orders & Deposits', icon: 'shopping_bag' },
    { id: 'calendar', label: 'Booking Calendar', icon: 'calendar_month' },
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'analytics', label: 'Analytics', icon: 'analytics' },
  ];

  const presetProfiles = [
    { name: 'Head Baker', email: 'headbaker@artisanbakes.com', role: 'Head Pastry Chef' },
    { name: 'Chef Sara', email: 'sara.cakes@artisanbakes.com', role: 'Master Decorator' },
    { name: 'Order Manager', email: 'orders@artisanbakes.com', role: 'Operations Lead' },
  ];

  const displayName = userName || (userEmail ? userEmail.split('@')[0] : 'Head Baker');

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-[#f8ebe6] text-[#201a18] flex flex-col py-6 px-3 gap-2 z-40 border-r border-[#d7c1c4]/30 shrink-0 select-none transition-all duration-300 ${
        isCollapsed ? 'w-[80px]' : 'w-[280px]'
      }`}
    >
      {/* Floating Border Edge Toggle Button */}
      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3.5 top-6 z-50 bg-[#ffffff] text-[#8b4b58] border border-[#d7c1c4] shadow-md w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#f8ebe6] hover:scale-110 active:scale-95 transition-all cursor-pointer"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <span className="material-symbols-outlined text-[16px]">
            {isCollapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
      )}

      {/* Header Section */}
      <div className={`mb-4 flex items-center ${isCollapsed ? 'justify-center' : 'px-2'}`}>
        {!isCollapsed ? (
          <div>
            <h1 className="font-semibold text-[22px] leading-7 text-[#8b4b58] tracking-tight">
              CakeHub Admin
            </h1>
            <p className="font-semibold text-[11px] leading-4 text-[#605e5a] tracking-wider opacity-80 mt-0.5">
              Bakery Operations & SaaS
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center p-1 text-[#8b4b58]" title="CakeHub Admin">
            <span className="material-symbols-outlined text-[28px]">cake</span>
          </div>
        )}
      </div>

      {/* New Order CTA */}
      {isCollapsed ? (
        <button
          onClick={onOpenNewOrderModal}
          title="New Custom Booking"
          className="mb-4 flex items-center justify-center bg-[#8b4b58] text-white w-12 h-12 rounded-xl hover:bg-[#8b4b58]/90 transition-all active:scale-[0.98] shadow-md cursor-pointer mx-auto shrink-0"
        >
          <span className="material-symbols-outlined text-[22px]">add</span>
        </button>
      ) : (
        <button
          onClick={onOpenNewOrderModal}
          className="mb-4 flex items-center justify-center gap-2 bg-[#8b4b58] text-white py-3 px-6 rounded-xl font-semibold text-[12px] tracking-wider hover:bg-[#8b4b58]/90 transition-all active:scale-[0.98] shadow-md cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          New Custom Booking
        </button>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-1.5">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`flex items-center text-left transition-all cursor-pointer ${
                isCollapsed
                  ? `justify-center w-12 h-12 mx-auto rounded-xl ${
                      isActive
                        ? 'bg-[#d88c9a] text-[#5d2633]'
                        : 'text-[#605e5a] hover:bg-[#ede0db] hover:text-[#201a18]'
                    }`
                  : `w-full px-4 py-3 rounded-lg font-semibold text-[12px] tracking-wider gap-3 ${
                      isActive
                        ? 'bg-[#d88c9a] text-[#5d2633] border-l-4 border-[#8b4b58]'
                        : 'text-[#605e5a] hover:bg-[#ede0db] hover:text-[#201a18]'
                    }`
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="mt-auto pt-4 border-t border-[#d7c1c4]/40 flex flex-col gap-1 relative">
        {/* Quick Profile Switcher Popover */}
        {showProfileSwitcher && (
          <div className="absolute bottom-full left-0 mb-2 w-full bg-[#ffffff] border border-[#d7c1c4] rounded-xl shadow-xl p-3 z-50 text-[#201a18]">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#f3e5e2]">
              <span className="text-[11px] font-bold text-[#8b4b58] uppercase tracking-wider">
                Switch Profile
              </span>
              <button
                onClick={() => setShowProfileSwitcher(false)}
                className="text-[#8b4b58] hover:bg-[#f8ebe6] rounded p-0.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
            <div className="space-y-1">
              {presetProfiles.map((prof) => (
                <button
                  key={prof.email}
                  onClick={() => {
                    if (onUpdateUser) onUpdateUser(prof.name, prof.email, prof.role);
                    setShowProfileSwitcher(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg text-[12px] transition-colors flex items-center justify-between cursor-pointer ${
                    userEmail === prof.email ? 'bg-[#f8ebe6] font-bold text-[#8b4b58]' : 'hover:bg-[#fef1ec]'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-[12px]">{prof.name}</p>
                    <p className="text-[10px] text-[#605e5a] truncate">{prof.email}</p>
                  </div>
                  {userEmail === prof.email && (
                    <span className="material-symbols-outlined text-[16px] text-[#8b4b58]">check</span>
                  )}
                </button>
              ))}
            </div>
            <div className="pt-2 mt-2 border-t border-[#f3e5e2]">
              <button
                onClick={() => {
                  setShowProfileSwitcher(false);
                  setActiveTab('settings');
                }}
                className="w-full text-center py-1.5 bg-[#8b4b58] text-white rounded-lg text-[11px] font-bold hover:bg-[#8b4b58]/90 cursor-pointer"
              >
                Edit Custom Profile in Settings
              </button>
            </div>
          </div>
        )}

        {!isCollapsed ? (
          <>
            <div
              onClick={() => setShowProfileSwitcher(!showProfileSwitcher)}
              className="px-4 py-2 mb-1 bg-[#fef1ec] hover:bg-[#fce5dd] rounded-lg flex items-center justify-between cursor-pointer transition-colors border border-transparent hover:border-[#d7c1c4]/50 group"
              title="Click to switch profile or edit name"
            >
              <div className="truncate">
                <p className="text-[11px] font-medium text-[#524345] truncate">Logged in as:</p>
                <p className="text-[13px] font-bold text-[#8b4b58] truncate" title={`${displayName} (${userEmail})`}>
                  {displayName}
                </p>
                {userRole && <p className="text-[10px] text-[#605e5a] truncate">{userRole}</p>}
              </div>
              <span className="material-symbols-outlined text-[18px] text-[#8b4b58] opacity-70 group-hover:opacity-100 transition-opacity">
                unfold_more
              </span>
            </div>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 text-left w-full px-4 py-2.5 rounded-lg font-semibold text-[12px] tracking-wider transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#d88c9a] text-[#5d2633]'
                  : 'text-[#605e5a] hover:bg-[#ede0db]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">settings</span>
              Settings
            </button>

            <button
              onClick={() => setActiveTab('login')}
              className="flex items-center gap-3 text-left w-full px-4 py-2.5 rounded-lg font-semibold text-[12px] tracking-wider text-[#605e5a] hover:bg-[#ede0db] hover:text-[#ba1a1a] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Logout
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div
              onClick={() => setShowProfileSwitcher(!showProfileSwitcher)}
              title={`Logged in as: ${displayName} (${userEmail}) - Click to switch profile`}
              className="w-10 h-10 rounded-full bg-[#fef1ec] hover:bg-[#fce5dd] border border-[#d7c1c4] flex items-center justify-center text-[#8b4b58] font-bold text-[13px] mb-1 cursor-pointer transition-colors"
            >
              {displayName.charAt(0).toUpperCase()}
            </div>

            <button
              onClick={() => setActiveTab('settings')}
              title="Settings"
              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#d88c9a] text-[#5d2633]'
                  : 'text-[#605e5a] hover:bg-[#ede0db]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">settings</span>
            </button>

            <button
              onClick={() => setActiveTab('login')}
              title="Logout"
              className="w-10 h-10 flex items-center justify-center rounded-xl text-[#605e5a] hover:bg-[#ede0db] hover:text-[#ba1a1a] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

