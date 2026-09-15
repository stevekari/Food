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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-stone-950/85 backdrop-blur-xl border-b border-stone-800/80 shadow-2xl shadow-black/40 py-3'
          : 'bg-gradient-to-b from-stone-950/90 via-stone-950/60 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Location */}
          <div className="flex items-center gap-6">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform duration-300">
                <ChefHat className="w-5 h-5 text-stone-950 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
                  STEVE <span className="text-amber-400">FOOD</span>
                </span>
                <span className="text-[10px] text-stone-400 tracking-wider font-semibold uppercase flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Gourmet Kitchens
                </span>
              </div>
            </a>

            {/* Quick Delivery Pill (Desktop) */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900/80 border border-stone-800 text-xs text-stone-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium text-stone-200">Downtown Express</span>
              <span className="text-stone-600">•</span>
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">20-30 min</span>
            </div>
          </div>

          {/* Center Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search burgers, pizzas, ramen, bowls, desserts..."
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

          {/* Right Action Controls: Install App, Credit Wallet & Cart Button */}
          <div className="flex items-center gap-3">
            
            {/* Install App Button (Desktop) */}
            {isInstallable && !isInstalled && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onOpenInstallModal}
                className="hidden xl:flex items-center gap-2 px-3.5 py-2 rounded-full bg-stone-900 hover:bg-stone-800 border border-amber-500/40 hover:border-amber-400 text-amber-400 text-xs font-bold transition-all shadow-md group"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-y-0.5 transition-transform" />
                <span>Install App</span>
              </motion.button>
            )}

            {/* Food Credit Balance Pill */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsWalletModalOpen(true)}
              className="relative flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/10 hover:from-amber-500/25 hover:to-orange-500/20 border border-amber-500/30 hover:border-amber-400/60 transition-all text-left shadow-lg shadow-amber-500/5 group"
            >
              <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-stone-950 transition-colors">
                <Wallet className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-amber-400/90 tracking-wider">
                  Credits
                </span>
                <span className="text-xs sm:text-sm font-bold text-white font-mono">
                  ${balance.toFixed(2)}
                </span>
              </div>
              <div className="w-5 h-5 rounded-full bg-stone-800 flex items-center justify-center text-stone-300 group-hover:text-white transition-colors">
                <Plus className="w-3 h-3" />
              </div>
            </motion.button>

            {/* Cart Button */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={openCart}
              className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all"
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

              <span className="hidden sm:inline text-sm font-extrabold tracking-wide">
                {itemCount > 0 ? `$${total.toFixed(2)}` : 'Cart'}
              </span>
            </motion.button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
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
              className="md:hidden pt-4 pb-2 flex flex-col gap-3 overflow-hidden border-t border-stone-800/80 mt-3"
            >
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search gourmet dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-900/60 border border-stone-800/60 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Delivering to <b>Downtown Zone 1</b></span>
                </div>
                <span className="text-emerald-400 font-semibold">20-30 min</span>
              </div>

              {isInstallable && !isInstalled && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenInstallModal();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/40 text-amber-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Install STEVE FOOD App</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

