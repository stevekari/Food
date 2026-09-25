import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Wallet, 
  Plus, 
  Search, 
  Sparkles, 
  Flame, 
  Menu as MenuIcon, 
  X, 
  ChefHat,
  Clock,
  MapPin,
  ChevronDown,
  Download
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWallet } from '../context/WalletContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import logoImg from '../assets/kar.png';

export default function Navbar({ 
  searchQuery, 
  setSearchQuery, 
  onSelectCategory,
  onOpenInstallModal,
  isInstallable,
  isInstalled 
}) {
  const { itemCount, openCart, total } = useCart();
  const { balance, setIsWalletModalOpen } = useWallet();
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 15);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-stone-950/90 backdrop-blur-xl border-b border-stone-800/80 shadow-2xl shadow-black/40 py-2.5 sm:py-3'
          : 'bg-gradient-to-b from-stone-950/95 via-stone-950/70 to-transparent py-3 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between gap-2 sm:gap-4 w-full">
          
          {/* Logo & Location */}
          <div className="flex items-center gap-2 sm:gap-6 min-w-0">
            <a href="#" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300 border border-amber-500/30 bg-stone-900 flex items-center justify-center shrink-0">
                <img src={logoImg} alt="STEVE FOOD Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-base sm:text-xl tracking-tight text-white flex items-center gap-1 whitespace-nowrap">
                  STEVE <span className="text-amber-400">FOOD</span>
                </span>
                <span className="hidden sm:flex text-[10px] text-stone-400 tracking-wider font-semibold uppercase items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {t('nav_gourmet_kitchens', 'Gourmet Kitchens')}
                </span>
              </div>
            </a>

            {/* Quick Delivery Pill (Desktop) */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900/80 border border-stone-800 text-xs text-stone-300 shrink-0">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium text-stone-200">{t('nav_delivering_to', 'Downtown Express')}</span>
              <span className="text-stone-600">•</span>
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">{t('nav_est_time', '20-30 min')}</span>
            </div>
          </div>

          {/* Center Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                type="text"
                placeholder={t('nav_search_placeholder', 'Search burgers, pizzas, ramen, bowls, desserts...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-stone-900/90 hover:bg-stone-900 focus:bg-stone-900 border border-stone-800 focus:border-amber-500/60 rounded-full text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 p-0.5 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action Controls: Language, Install App, Credit Wallet & Cart Button */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            {/* Language Selector (Desktop) */}
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>

            {/* Install App Button (Desktop) */}
            {isInstallable && !isInstalled && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onOpenInstallModal}
                className="hidden xl:flex items-center gap-2 px-3.5 py-2 rounded-full bg-stone-900 hover:bg-stone-800 border border-amber-500/40 hover:border-amber-400 text-amber-400 text-xs font-bold transition-all shadow-md group"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-y-0.5 transition-transform" />
                <span>{t('nav_install', 'Install App')}</span>
              </motion.button>
            )}

            {/* Desktop Food Credit Balance Pill */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsWalletModalOpen(true)}
              className="hidden sm:flex relative items-center gap-2.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/10 hover:from-amber-500/25 hover:to-orange-500/20 border border-amber-500/30 hover:border-amber-400/60 transition-all text-left shadow-lg shadow-amber-500/5 group"
            >
              <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-stone-950 transition-colors">
                <Wallet className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-amber-400/90 tracking-wider">
                  {t('nav_credits', 'Credits')}
                </span>
                <span className="text-xs sm:text-sm font-bold text-white font-mono">
                  €{balance.toFixed(2)}
                </span>
              </div>
              <div className="w-5 h-5 rounded-full bg-stone-800 flex items-center justify-center text-stone-300 group-hover:text-white transition-colors">
                <Plus className="w-3 h-3" />
              </div>
            </motion.button>

            {/* Mobile Compact Food Credit Pill */}
            <button
              onClick={() => setIsWalletModalOpen(true)}
              className="sm:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono font-bold text-xs active:scale-95 transition-transform"
              title="Food Credits"
            >
              <Wallet className="w-3.5 h-3.5 text-amber-400" />
              <span>€{balance.toFixed(0)}</span>
            </button>

            {/* Desktop Cart Button */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={openCart}
              className="hidden sm:flex relative items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      key={itemCount}
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-2 -right-2.5 w-5 h-5 rounded-full bg-stone-950 text-amber-400 text-[11px] font-black flex items-center justify-center border-2 border-amber-400 shadow-md"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <span className="text-sm font-extrabold tracking-wide">
                {itemCount > 0 ? `€${total.toFixed(2)}` : t('nav_cart', 'Cart')}
              </span>
            </motion.button>

            {/* Mobile Compact Cart Button */}
            <button
              onClick={openCart}
              className="sm:hidden relative w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 flex items-center justify-center shadow-md active:scale-95 transition-transform shrink-0"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-stone-950 text-amber-400 text-[9px] font-black flex items-center justify-center border border-amber-400">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-8 h-8 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white flex items-center justify-center shrink-0 active:scale-95 transition-colors"
              aria-label="Toggle navigation drawer"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <MenuIcon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Search & Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="md:hidden pt-3 pb-2 flex flex-col gap-2.5 overflow-hidden border-t border-stone-800/80 mt-2.5 max-h-[80vh] overflow-y-auto"
            >
              {/* Mobile Language Selector */}
              <div className="w-full">
                <LanguageSelector isMobile />
              </div>

              {/* Mobile Search Input */}
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder={t('nav_search_placeholder', 'Search burgers, pizzas, ramen, bowls, desserts...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Delivery Info */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900/60 border border-stone-800/60 text-xs text-stone-300">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] font-medium">{t('nav_delivering_to', 'Downtown Express')}</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold">{t('nav_est_time', '20-30 min')}</span>
              </div>

              {/* Install PWA App */}
              {isInstallable && !isInstalled && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenInstallModal();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/40 text-amber-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>{t('nav_install', 'Install App')}</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

