import { useState } from 'react';
import { TabType, Order, CakeItem, CartItem, InventoryItem, OrderStatus, BakeryBranch } from './types';
import { INITIAL_ORDERS, CAKE_CATALOGUE, INVENTORY_ITEMS } from './data/mockData';
import { SideNavBar } from './components/SideNavBar';
import { TopNavBar } from './components/TopNavBar';
import { NewOrderModal } from './components/NewOrderModal';
import { OrderDetailsModal } from './components/OrderDetailsModal';
import { ManageInventoryModal } from './components/ManageInventoryModal';
import { CartDrawer } from './components/CartDrawer';

import { AiCakeAssistantModal } from './components/AiCakeAssistantModal';
import { CustomCakeBuilderModal } from './components/CustomCakeBuilderModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { QrCodeShareModal } from './components/QrCodeShareModal';
import { PaymentGatewayModal } from './components/PaymentGatewayModal';

import { DashboardView } from './views/DashboardView';
import { OrdersView } from './views/OrdersView';
import { AnalyticsView } from './views/AnalyticsView';
import { CatalogueView } from './views/CatalogueView';
import { LoginView } from './views/LoginView';
import { SettingsView } from './views/SettingsView';
import { BookingCalendarView } from './views/BookingCalendarView';
import { Language } from './utils/i18n';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('catalogue');
  const [userName, setUserName] = useState<string>('Head Baker');
  const [userEmail, setUserEmail] = useState<string>('headbaker@artisanbakes.com');
  const [userRole, setUserRole] = useState<string>('Head Pastry Chef');

  const handleUpdateUser = (name: string, email: string, role: string) => {
    setUserName(name);
    setUserEmail(email);
    setUserRole(role);
  };
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [currentBranch, setCurrentBranch] = useState<BakeryBranch>('Addis Ababa - Bole Medhanialem');

  // Datasets state
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INVENTORY_ITEMS);
  const [cakes] = useState<CakeItem[]>(CAKE_CATALOGUE);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Search in TopNavBar
  const [catalogueSearch, setCatalogueSearch] = useState('');

  // Modals & Navigation state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [isManageInventoryOpen, setIsManageInventoryOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Feature Modals
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isCustomBuilderOpen, setIsCustomBuilderOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isQrCodeOpen, setIsQrCodeOpen] = useState(false);
  const [isPaymentGatewayOpen, setIsPaymentGatewayOpen] = useState(false);

  // Handlers
  const handleAddOrder = (newOrder: Order) => {
    setOrders((prev) => [{ ...newOrder, branch: currentBranch }, ...prev]);
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
    if (selectedOrderDetails?.id === orderId) {
      setSelectedOrderDetails((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const handleUpdateStock = (invId: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === invId) {
          const newStock = Math.max(0, item.stock + delta);
          let newStatus: InventoryItem['status'] = 'High';
          if (newStock < 5) newStatus = 'Critical';
          else if (newStock < 20) newStatus = 'Low Stock';
          else if (newStock < 50) newStatus = 'Medium';
          return { ...item, stock: newStock, status: newStatus };
        }
        return item;
      })
    );
  };

  const handleAddToCart = (cake: CakeItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.cake.id === cake.id);
      if (existing) {
        return prev.map((item) =>
          item.cake.id === cake.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { cake, quantity: 1 }];
    });
  };

  const handleAddToCartWithCustomization = (cake: CakeItem, customizationText: string) => {
    setCart((prev) => [
      ...prev,
      {
        cake: {
          ...cake,
          description: `${cake.description} (${customizationText})`,
        },
        quantity: 1,
        customization: {
          inscription: customizationText,
        },
      },
    ]);
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (cakeId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cake.id === cakeId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (cakeId: string) => {
    setCart((prev) => prev.filter((item) => item.cake.id !== cakeId));
  };

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email);
    const lower = email.toLowerCase();
    if (lower.includes('headbaker')) {
      setUserName('Head Baker');
      setUserRole('Head Pastry Chef');
    } else {
      const namePart = email.split('@')[0];
      const formatted = namePart
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[._\d-]+/g, ' ')
        .trim()
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
      setUserName(formatted || namePart);
      setUserRole('Bakery Staff');
    }
    setActiveTab('dashboard');
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Filter cakes for search
  const searchFilteredCakes = cakes.filter((c) =>
    c.name.toLowerCase().includes(catalogueSearch.toLowerCase()) ||
    c.category.toLowerCase().includes(catalogueSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fff8f6] text-[#201a18] font-['Montserrat',sans-serif]">
      {/* View router rendering */}
      {activeTab === 'login' ? (
        <LoginView onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div className="min-h-screen flex flex-col">
          {/* Top Bar Navigation */}
          <TopNavBar
            cartCount={totalCartCount}
            onOpenCart={() => setIsCartOpen(true)}
            setActiveTab={setActiveTab}
            searchQuery={catalogueSearch}
            setSearchQuery={setCatalogueSearch}
            currentLanguage={currentLanguage}
            onLanguageChange={setCurrentLanguage}
            currentBranch={currentBranch}
            onBranchChange={setCurrentBranch}
            onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
            onOpenCustomBuilder={() => setIsCustomBuilderOpen(true)}
            onOpenTracker={() => setIsTrackerOpen(true)}
            onOpenQrCode={() => setIsQrCodeOpen(true)}
            onOpenPaymentGateway={() => setIsPaymentGatewayOpen(true)}
            onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
            isSidebarCollapsed={isSidebarCollapsed}
          />

          {/* Mobile Navigation Drawer */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden">
              <div
                className="fixed inset-0 bg-black/40 backdrop-blur-xs"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <div className="relative z-10 w-[280px] bg-[#f8ebe6] h-full shadow-2xl">
                <SideNavBar
                  activeTab={activeTab}
                  setActiveTab={(tab) => {
                    setActiveTab(tab);
                    setIsMobileMenuOpen(false);
                  }}
                  onOpenNewOrderModal={() => {
                    setIsNewOrderModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  userName={userName}
                  userEmail={userEmail}
                  userRole={userRole}
                  onUpdateUser={handleUpdateUser}
                />
              </div>
            </div>
          )}

          <div className="flex flex-1 pt-20">
            {/* Side Navigation Bar for quick tab access */}
            <div className="hidden md:block">
              <SideNavBar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onOpenNewOrderModal={() => setIsNewOrderModalOpen(true)}
                userName={userName}
                userEmail={userEmail}
                userRole={userRole}
                onUpdateUser={handleUpdateUser}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
              />
            </div>

            {/* Main Content Area */}
            <main
              className={`flex-1 ${
                isSidebarCollapsed ? 'md:ml-[80px]' : 'md:ml-[280px]'
              } bg-[#fff8f6] min-h-screen overflow-x-hidden transition-all duration-300`}
            >
              {activeTab === 'catalogue' && (
                <CatalogueView
                  cakes={searchFilteredCakes}
                  onAddToCart={handleAddToCart}
                  onAddToCartWithCustomization={handleAddToCartWithCustomization}
                  onOpenCart={() => setIsCartOpen(true)}
                  onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
                  onOpenCustomBuilder={() => setIsCustomBuilderOpen(true)}
                  onOpenPaymentGateway={() => setIsPaymentGatewayOpen(true)}
                />
              )}

              {activeTab === 'orders' && (
                <OrdersView
                  orders={orders}
                  onSelectOrder={(ord) => setSelectedOrderDetails(ord)}
                  onOpenNewOrderModal={() => setIsNewOrderModalOpen(true)}
                />
              )}

              {activeTab === 'calendar' && (
                <BookingCalendarView
                  orders={orders}
                  onSelectOrder={(ord) => setSelectedOrderDetails(ord)}
                  onOpenNewOrderModal={() => setIsNewOrderModalOpen(true)}
                />
              )}

              {activeTab === 'dashboard' && (
                <DashboardView
                  orders={orders}
                  inventory={inventory}
                  onNavigateToOrders={() => setActiveTab('orders')}
                  onOpenManageInventory={() => setIsManageInventoryOpen(true)}
                  onSelectOrder={(ord) => setSelectedOrderDetails(ord)}
                  userName={userName}
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsView
                  topCakes={cakes}
                  onNavigateToCatalogue={() => setActiveTab('catalogue')}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsView
                  userName={userName}
                  userEmail={userEmail}
                  userRole={userRole}
                  onUpdateUser={handleUpdateUser}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* Global Modals & Overlay Drawers */}
      <NewOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        onAddOrder={handleAddOrder}
      />

      <OrderDetailsModal
        order={selectedOrderDetails}
        onClose={() => setSelectedOrderDetails(null)}
        onUpdateStatus={handleUpdateOrderStatus}
      />

      <ManageInventoryModal
        isOpen={isManageInventoryOpen}
        onClose={() => setIsManageInventoryOpen(false)}
        inventory={inventory}
        onUpdateStock={handleUpdateStock}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={() => setCart([])}
      />

      {/* SaaS Feature Modals */}
      <AiCakeAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        onAddRecommendationToCart={handleAddToCartWithCustomization}
      />

      <CustomCakeBuilderModal
        isOpen={isCustomBuilderOpen}
        onClose={() => setIsCustomBuilderOpen(false)}
        onAddCustomCakeToCart={handleAddToCartWithCustomization}
      />

      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        orders={orders}
      />

      <QrCodeShareModal
        isOpen={isQrCodeOpen}
        onClose={() => setIsQrCodeOpen(false)}
      />

      <PaymentGatewayModal
        isOpen={isPaymentGatewayOpen}
        onClose={() => setIsPaymentGatewayOpen(false)}
      />
    </div>
  );
}

export default App;
