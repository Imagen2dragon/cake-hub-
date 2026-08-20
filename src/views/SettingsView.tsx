import React, { useState } from 'react';

interface SettingsViewProps {
  userName?: string;
  userEmail?: string;
  userRole?: string;
  onUpdateUser?: (name: string, email: string, role: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userName = 'Head Baker',
  userEmail = 'headbaker@artisanbakes.com',
  userRole = 'Head Pastry Chef',
  onUpdateUser,
}) => {
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [role, setRole] = useState(userRole);
  const [bakeryName, setBakeryName] = useState('Artisan Bakes & CakeHub');
  const [currency, setCurrency] = useState('USD ($)');
  const [notifications, setNotifications] = useState(true);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateUser) {
      onUpdateUser(name, email, role);
    }
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="w-full min-h-screen px-6 lg:px-12 py-10 select-none">
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-800 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-slide-in">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span className="text-[13px] font-semibold">Settings saved successfully!</span>
        </div>
      )}

      <header className="mb-8">
        <h2 className="font-semibold text-[32px] text-[#201a18]">Bakery Settings</h2>
        <p className="text-[14px] text-[#524345]">
          Manage store configuration, order alerts, and operational preferences.
        </p>
      </header>

      <form onSubmit={handleSave} className="space-y-6">
        {/* User Profile Card */}
        <div className="bg-[#ffffff] p-6 rounded-2xl border border-[#d7c1c4]/30 shadow-xs space-y-4">
          <h3 className="font-bold text-[18px] text-[#8b4b58] flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">account_circle</span>
            User & Account Profile
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[12px] font-semibold text-[#524345]">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Head Baker, Chef Sara"
                className="w-full px-4 py-2.5 bg-[#f8ebe6] border border-[#d7c1c4] rounded-xl text-[14px] text-[#201a18] outline-none focus:ring-2 focus:ring-[#8b4b58]/40"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-semibold text-[#524345]">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. headbaker@artisanbakes.com"
                className="w-full px-4 py-2.5 bg-[#f8ebe6] border border-[#d7c1c4] rounded-xl text-[14px] text-[#201a18] outline-none focus:ring-2 focus:ring-[#8b4b58]/40"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-semibold text-[#524345]">Role Title</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Master Decorator, Manager"
                className="w-full px-4 py-2.5 bg-[#f8ebe6] border border-[#d7c1c4] rounded-xl text-[14px] text-[#201a18] outline-none focus:ring-2 focus:ring-[#8b4b58]/40"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#ffffff] p-6 rounded-2xl border border-[#d7c1c4]/30 shadow-xs space-y-4">
          <h3 className="font-bold text-[18px] text-[#8b4b58]">Store Profile</h3>

          <div className="space-y-1">
            <label className="text-[12px] font-semibold text-[#524345]">Store Branding Name</label>
            <input
              type="text"
              value={bakeryName}
              onChange={(e) => setBakeryName(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#f8ebe6] border border-[#d7c1c4] rounded-xl text-[14px] text-[#201a18] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[12px] font-semibold text-[#524345]">Operating Hours</label>
              <input
                type="text"
                defaultValue="7:00 AM - 7:00 PM EST"
                className="w-full px-4 py-2.5 bg-[#f8ebe6] border border-[#d7c1c4] rounded-xl text-[14px] text-[#201a18] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-semibold text-[#524345]">Currency Format</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#f8ebe6] border border-[#d7c1c4] rounded-xl text-[14px] text-[#201a18] outline-none cursor-pointer"
              >
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
                <option>CAD ($)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-[#ffffff] p-6 rounded-2xl border border-[#d7c1c4]/30 shadow-xs space-y-4">
          <h3 className="font-bold text-[18px] text-[#8b4b58]">Order Notifications</h3>
          <label className="flex items-center gap-3 text-[14px] text-[#201a18] cursor-pointer">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-5 h-5 accent-[#8b4b58]"
            />
            Receive real-time sound and email alerts for new custom cake requests
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-[#8b4b58] text-white rounded-xl font-bold text-[13px] shadow-md hover:bg-[#8b4b58]/90 transition-all cursor-pointer"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
