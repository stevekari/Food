import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, UtensilsCrossed, Search, Flame, ArrowUp } from 'lucide-react';
import { FOOD_ITEMS } from './data/foodData';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SpecialDeals from './components/SpecialDeals';
import CategoryFilter from './components/CategoryFilter';
import FoodCard from './components/FoodCard';
import FoodDetailModal from './components/FoodDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderSuccessModal from './components/OrderSuccessModal';
import CustomerReviews from './components/CustomerReviews';
import Footer from './components/Footer';

import { usePWA } from './hooks/usePWA';
import InstallPwaModal from './components/InstallPwaModal';
import PwaInstallBanner from './components/PwaInstallBanner';
import OfflineToast from './components/OfflineToast';
import MobileBottomNav from './components/MobileBottomNav';
import { logAnalyticsEvent } from './firebase';

function MainApp() {
  const { t } = useLanguage();
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
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Log site visit page view
  useEffect(() => {
    logAnalyticsEvent('page_view', {
      page_title: 'STEVE FOOD - Gourmet Food Delivery',
      page_location: window.location.href,
      page_path: window.location.pathname
    });
  }, []);

  // Debounced search analytics
  useEffect(() => {
    if (searchQuery.trim().length >= 3) {
      const timer = setTimeout(() => {
        logAnalyticsEvent('search', {
          search_term: searchQuery.trim()
        });
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  useEffect(() => {
    let ticking = false;
    const checkScrollTop = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowScrollTop(window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', checkScrollTop, { passive: true });
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, []);

  const smoothScrollTo = (target) => {
    const el = typeof target === 'string' ? document.getElementById(target) : target;
    if (!el) return;
    const headerOffset = 76;
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };

  const scrollToMenu = () => {
    smoothScrollTo(menuSectionRef.current);
  };

  const scrollToDeals = () => {
    smoothScrollTo('deals');
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
    <div className="min-h-screen bg-stone-950 text-stone-100 selection:bg-amber-500 selection:text-black pb-20 md:pb-0 overflow-x-clip">
      
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
            <UtensilsCrossed className="w-3.5 h-3.5" /> {t('menu_section_tag', 'Culinary Masterpieces')}
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
            {t('menu_section_title', 'Explore Handcrafted Menu')}
          </h2>
          <p className="text-sm text-stone-400 mt-1 max-w-lg">
            {t('menu_section_subtitle', 'Prepared to order by expert chefs using fresh, locally sourced premium ingredients.')}
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
            <h3 className="font-display font-bold text-xl text-white">{t('no_dishes_found', 'No dishes found')}</h3>
            <p className="text-sm text-stone-400 mt-1 max-w-sm mx-auto">
              {t('no_dishes_desc', 'We couldn\'t find any dishes matching your search. Try clearing filters.')}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDietary('all');
              }}
              className="mt-5 px-5 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-colors"
            >
              {t('reset_filters', 'Reset All Filters')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredFoodItems.map((food) => (
                <FoodCard
                  key={food.id}
                  food={food}
                  onOpenDetails={(item) => setSelectedFoodForModal(item)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

      </section>

      {/* Customer Reviews Testimonials */}
      <CustomerReviews />

      {/* Footer */}
      <Footer />

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-20 right-5 md:bottom-8 md:right-8 z-30 w-11 h-11 rounded-2xl bg-stone-900/90 hover:bg-amber-500 border border-amber-500/40 text-amber-400 hover:text-stone-950 shadow-2xl backdrop-blur-md flex items-center justify-center transition-colors group"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

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
    <LanguageProvider>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <MainApp />
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}

