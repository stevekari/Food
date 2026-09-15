import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Flame, 
  ArrowRight, 
  Wallet, 
  Star, 
  Clock, 
  ShieldCheck, 
  BadgePercent,
  CheckCircle2
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';

export default function Hero({ onExploreClick }) {
  const { balance, setIsWalletModalOpen } = useWallet();

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Glow Ambient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-600/20 via-orange-600/15 to-red-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Promo Tag Pill */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-transparent border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold mb-6 shadow-inner"
            >
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
              <span>Use promo code <span className="text-white font-mono font-bold bg-amber-500/30 px-2 py-0.5 rounded-md">STEVE20</span> for 20% OFF</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] font-display"
            >
              Artisanal Food,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-500">
                Lightning Fast.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-stone-300 max-w-xl leading-relaxed"
            >
              Indulge in award-winning smash burgers, 48h fermented sourdough pizzas, and vibrant poke bowls crafted by master chefs. Instant checkout with your pre-loaded Food Credit wallet.
            </motion.p>

            {/* Credit Wallet Callout Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              onClick={() => setIsWalletModalOpen(true)}
              className="mt-6 w-full max-w-lg p-3.5 rounded-2xl bg-gradient-to-r from-stone-900/90 via-amber-950/40 to-stone-900/90 border border-amber-500/40 flex items-center justify-between gap-4 cursor-pointer hover:border-amber-400 transition-all shadow-xl group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-stone-400 font-medium">Your Active Credit Balance</div>
                  <div className="text-base font-bold text-white font-mono flex items-center gap-2">
                    ${balance.toFixed(2)} USD
                    <span className="text-[11px] font-sans font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      Ready to spend
                    </span>
                  </div>
                </div>
              </div>

              <span className="text-xs font-semibold text-amber-400 group-hover:text-amber-300 flex items-center gap-1">
                Top Up <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <button
                onClick={onExploreClick}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-stone-950 font-bold text-base shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 group"
              >
                <span>Explore Full Menu</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setIsWalletModalOpen(true)}
                className="px-6 py-4 rounded-2xl bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-700 hover:border-stone-500 font-semibold text-base transition-all flex items-center gap-2.5"
              >
                <Wallet className="w-4 h-4 text-amber-400" />
                <span>Manage Credits</span>
              </button>
            </motion.div>

            {/* Social Proof Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="mt-10 grid grid-cols-3 gap-4 border-t border-stone-800/80 pt-6 w-full max-w-lg"
            >
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black text-white font-display">18 min</span>
                <span className="text-xs text-stone-400">Avg Express Delivery</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black text-amber-400 font-display flex items-center gap-1">
                  4.9 <Star className="w-4 h-4 fill-amber-400 inline" />
                </span>
                <span className="text-xs text-stone-400">25k+ Foodie Reviews</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black text-white font-display">100%</span>
                <span className="text-xs text-stone-400">Fresh & Organic</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Dynamic Animated Floating Visual Collage */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Center Main Food Dish Graphic */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0, rotate: -6 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative w-full max-w-[420px] aspect-square rounded-3xl overflow-hidden border-2 border-stone-700/60 shadow-2xl shadow-orange-500/20 group"
            >
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80"
                alt="Signature Truffle Burger"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent" />
              
              <div className="absolute bottom-5 left-5 right-5">
                <span className="px-2.5 py-1 rounded-md bg-amber-500 text-stone-950 font-extrabold text-[11px] uppercase tracking-wider inline-block mb-1.5">
                  Chef's Masterpiece
                </span>
                <h3 className="text-xl font-bold text-white leading-snug">
                  Truffle Umami Smash Burger
                </h3>
                <p className="text-xs text-stone-300 mt-1 line-clamp-1">
                  Double Angus beef patties, aged Gruyère, balsamic onions
                </p>
              </div>
            </motion.div>

            {/* Floating Card 1: Fast Delivery Timer */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute -top-4 sm:-top-6 right-2 sm:-right-8 p-2.5 sm:p-3.5 rounded-2xl glass-panel-glow border border-amber-500/40 shadow-2xl flex items-center gap-2.5 sm:gap-3 animate-float max-w-[85%] sm:max-w-none"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="text-[9px] sm:text-[10px] uppercase font-bold text-emerald-400 tracking-wide">Hot & Fresh</div>
                <div className="text-xs sm:text-sm font-bold text-white">Estimated 18 Mins</div>
              </div>
            </motion.div>

            {/* Floating Card 2: 5-Star Rating Pill */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute -bottom-4 sm:-bottom-6 left-2 sm:-left-8 p-2.5 sm:p-3.5 rounded-2xl glass-panel border border-stone-700/80 shadow-2xl flex items-center gap-2.5 sm:gap-3 animate-float-reverse max-w-[85%] sm:max-w-none"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400" />
              </div>
              <div>
                <div className="text-[9px] sm:text-[10px] uppercase font-bold text-amber-400 tracking-wide">Gourmet Standard</div>
                <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1">
                  4.9 / 5.0 (4.2k+ orders)
                </div>
              </div>
            </motion.div>

            {/* Floating Promo Tag */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute top-1/2 -left-6 -translate-y-1/2 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-lg shadow-orange-600/40"
            >
              <BadgePercent className="w-4 h-4" />
              <span>20% OFF</span>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

