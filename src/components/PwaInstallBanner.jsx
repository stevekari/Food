import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Sparkles, X, Smartphone, ChefHat } from 'lucide-react';
import logoImg from '../assets/kar.png';

export default function PwaInstallBanner({ isInstallable, isInstalled, onOpenModal }) {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('steve_food_pwa_banner_dismissed');
    if (dismissed) {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('steve_food_pwa_banner_dismissed', 'true');
  };

  if (isInstalled || isDismissed || !isInstallable) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 260 }}
        className="fixed bottom-5 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40"
      >
        <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-900/95 backdrop-blur-xl border border-amber-500/40 shadow-2xl shadow-black/80 flex items-center justify-between gap-3 text-stone-100">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md border border-amber-500/30 bg-stone-900 flex items-center justify-center shrink-0">
              <img src={logoImg} alt="STEVE FOOD Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white flex items-center gap-1">
                Install STEVE FOOD App
                <Sparkles className="w-3 h-3 text-amber-400" />
              </span>
              <span className="text-[11px] text-stone-400">
                1-tap ordering, fast offline access & perks
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenModal}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition-all shrink-0 active:scale-95"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Install</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}

