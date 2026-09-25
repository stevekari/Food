import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Utensils, 
  Search, 
  ShoppingBag, 
  Tag, 
  Sparkles,
  Download
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function MobileBottomNav({ 
  onExploreClick, 
  onSearchClick, 
  onDealsClick,
  onOpenInstallModal,
  isInstallable,
  isInstalled,
  activeTab = 'menu'
}) {
  const { itemCount, openCart, total } = useCart();
  const { t } = useLanguage();

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-950/92 backdrop-blur-xl border-t border-stone-800/80 shadow-2xl shadow-black transition-all pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]"
      aria-label="Mobile Navigation"
    >
      <div className="max-w-md mx-auto px-3 py-1.5 flex items-center justify-around">
        
        {/* 1. Explore Menu Button */}
        <button
          onClick={onExploreClick}
          className="flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-2xl text-stone-400 hover:text-amber-400 active:scale-95 transition-all cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center justify-center text-amber-400">
            <Utensils className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">{t('dock_menu', 'Menu')}</span>
        </button>

        {/* 2. Deals / Discounts Button */}
        <button
          onClick={onDealsClick}
          className="flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-2xl text-stone-400 hover:text-amber-400 active:scale-95 transition-all cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center justify-center text-orange-400">
            <Tag className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">{t('dock_deals', 'Deals')}</span>
        </button>

        {/* 3. Center Cart Button with Animated Floating Pill */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={openCart}
          className="relative -top-2 flex flex-col items-center justify-center group cursor-pointer"
        >
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 text-stone-950 flex items-center justify-center shadow-lg shadow-orange-500/30 border-2 border-stone-950">
            <ShoppingBag className="w-6 h-6 stroke-[2.5]" />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-stone-950 text-amber-400 text-[10px] font-black flex items-center justify-center border-2 border-amber-400 shadow-md"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <span className="text-[10px] font-extrabold text-amber-400 mt-1 font-mono">
            {itemCount > 0 ? `€${total.toFixed(2)}` : t('dock_cart', 'Cart')}
          </span>
        </motion.button>

        {/* 4. Search Dishes Button */}
        <button
          onClick={onSearchClick}
          className="flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-2xl text-stone-400 hover:text-amber-400 active:scale-95 transition-all cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center justify-center text-stone-300">
            <Search className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">{t('dock_search', 'Search')}</span>
        </button>

        {/* 5. Install App (or Express Badge) */}
        {isInstallable && !isInstalled ? (
          <button
            onClick={onOpenInstallModal}
            className="flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-2xl text-stone-400 hover:text-amber-400 active:scale-95 transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Download className="w-4 h-4 animate-bounce" />
            </div>
            <span className="text-[10px] font-bold tracking-tight text-amber-400">{t('dock_install', 'Install')}</span>
          </button>
        ) : (
          <button
            onClick={onExploreClick}
            className="flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-2xl text-stone-400 hover:text-amber-400 active:scale-95 transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold tracking-tight text-emerald-400">Gourmet</span>
          </button>
        )}

      </div>
    </nav>
  );
}

