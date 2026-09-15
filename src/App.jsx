import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, UtensilsCrossed, Search, Flame, ArrowUp } from 'lucide-react';
import { FOOD_ITEMS } from './data/foodData';
import { ToastProvider } from './context/ToastContext';
import { WalletProvider, useWallet } from './context/WalletContext';
import { CartProvider, useCart } from './context/CartContext';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SpecialDeals from './components/SpecialDeals';
import CategoryFilter from './components/CategoryFilter';
import FoodCard from './components/FoodCard';
import FoodDetailModal from './components/FoodDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import WalletModal from './components/WalletModal';
import OrderSuccessModal from './components/OrderSuccessModal';
import CustomerReviews from './components/CustomerReviews';
import Footer from './components/Footer';

import { usePWA } from './hooks/usePWA';
import InstallPwaModal from './components/InstallPwaModal';
import PwaInstallBanner from './components/PwaInstallBanner';
import OfflineToast from './components/OfflineToast';
import MobileBottomNav from './components/MobileBottomNav';

function MainApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDietary, setSelectedDietary] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  // PWA Hook
  const {
    isInstallable,
    isNativeInstallable,
    isInstalled,
    isIOS,
    isOnline,
    isUpdateAvailable,
    isInstallModalOpen,
    setIsInstallModalOpen,
    installApp,
    updateApp
  } = usePWA();

  // Modals state
  const [selectedFoodForModal, setSelectedFoodForModal] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);

  const menuSectionRef = useRef(null);
  const dealsSectionRef = useRef(null);

  const scrollToMenu = () => {
    menuSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDeals = () => {
    const dealsEl = document.getElementById('deals');
    if (dealsEl) {
      dealsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter & Sort Food Items
  const filteredFoodItems = useMemo(() => {
    return FOOD_ITEMS.filter((item) => {
      // Category check
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Dietary tag check
      if (selectedDietary !== 'all') {
        if (!item.dietary || !item.dietary.includes(selectedDietary)) {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesIng = item.ingredients?.some((ing) => ing.toLowerCase().includes(query));
        const matchesCat = item.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesIng && !matchesCat) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'time') {
        const timeA = parseInt(a.prepTime) || 20;
        const timeB = parseInt(b.prepTime) || 20;
        return timeA - timeB;
      }
      return 0; // featured default order
    });
  }, [selectedCategory, selectedDietary, searchQuery, sortBy]);

  const handleOrderSuccess = (orderDetails) => {
    setPlacedOrder(orderDetails);
    setIsOrderSuccessOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 selection:bg-amber-500 selection:text-black pb-20 md:pb-0">
      
      {/* Sticky Navigation Bar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          scrollToMenu();
        }}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
      />

      {/* Hero Section */}
      <Hero onExploreClick={scrollToMenu} />

      {/* Special Deals & Credits Banner */}
      <SpecialDeals />

      {/* Menu Catalog Section */}
      <section ref={menuSectionRef} className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <UtensilsCrossed className="w-3.5 h-3.5" /> Culinary Masterpieces
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
            Explore Handcrafted Menu
          </h2>
          <p className="text-sm text-stone-400 mt-1 max-w-lg">
            Prepared to order by expert chefs using fresh, locally sourced premium ingredients.
          </p>
        </div>

        {/* Category & Dietary Filters */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedDietary={selectedDietary}
          onSelectDietary={setSelectedDietary}
          sortBy={sortBy}
          onSortChange={setSortBy}
          itemsCount={filteredFoodItems.length}
        />

        {/* Food Items Grid */}
        {filteredFoodItems.length === 0 ? (
          <div className="text-center py-20 bg-stone-900/30 border border-stone-800/80 rounded-3xl p-8">
            <div className="w-16 h-16 rounded-2xl bg-stone-800 flex items-center justify-center mx-auto text-2xl mb-4">
              🔍
            </div>
            <h3 className="font-display font-bold text-xl text-white">No dishes found</h3>
            <p className="text-sm text-stone-400 mt-1 max-w-sm mx-auto">
              We couldn't find any dishes matching "{searchQuery}". Try clearing search or selecting a different category.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDietary('all');
              }}
              className="mt-5 px-5 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredFoodItems.map((food) => (
                <FoodCard
                  key={food.id}
                  food={food}
                  onOpenDetails={(item) => setSelectedFoodForModal(item)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </section>

      {/* Customer Reviews Testimonials */}
      <CustomerReviews />

      {/* Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <CartDrawer
        onCheckoutClick={() => setIsCheckoutOpen(true)}
      />

      <FoodDetailModal
        food={selectedFoodForModal}
        isOpen={Boolean(selectedFoodForModal)}
        onClose={() => setSelectedFoodForModal(null)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      <WalletModal />

      <OrderSuccessModal
        order={placedOrder}
        isOpen={isOrderSuccessOpen}
        onClose={() => setIsOrderSuccessOpen(false)}
      />

      {/* PWA Floating Install Banner */}
      <PwaInstallBanner
        isInstallable={isInstallable}
        isInstalled={isInstalled}
        onOpenModal={() => setIsInstallModalOpen(true)}
      />

      {/* PWA Guided Install Modal */}
      <InstallPwaModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onInstall={installApp}
        isNativeInstallable={isNativeInstallable}
        isIOS={isIOS}
      />

      {/* Offline Status & Update Notifications */}
      <OfflineToast
        isOnline={isOnline}
        isUpdateAvailable={isUpdateAvailable}
        onUpdateApp={updateApp}
      />

      {/* Mobile App Dock / Bottom Navigation Bar */}
      <MobileBottomNav
        onExploreClick={scrollToMenu}
        onSearchClick={scrollToMenu}
        onDealsClick={scrollToDeals}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
      />

    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <WalletProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </WalletProvider>
    </ToastProvider>
  );
}

