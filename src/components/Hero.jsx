import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Flame, 
  ArrowRight, 
  CreditCard, 
  Star, 
  Clock, 
  ShieldCheck, 
  BadgePercent,
  Tag
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Hero({ onExploreClick }) {
  const { t } = useLanguage();

  return (
    <section className="relative pt-24 pb-14 sm:pt-32 sm:pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Glow Ambient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-gradient-to-tr from-amber-600/20 via-orange-600/15 to-red-600/10 rounded-full blur-3xl pointer-events-none -z-10 gpu-layer" />
      <div className="absolute top-10 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10 gpu-layer" />
      <div className="absolute bottom-10 right-10 w-48 sm:w-96 h-48 sm:h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none -z-10 gpu-layer" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: Hero Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Promo Tag Pill */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-transparent border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold mb-4 sm:mb-6 shadow-inner"
            >
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400 shrink-0" />
              <span className="leading-tight">{t('hero_promo_tag', 'Use promo code')} <span className="text-white font-mono font-bold bg-amber-500/30 px-1.5 py-0.5 rounded">STEVE20</span> {t('hero_for_discount', 'for 20% OFF')}</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12] sm:leading-[1.08] font-display"
            >
              {t('hero_headline_1', 'Artisanal Food,')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-500">
                {t('hero_headline_2', 'Lightning Fast.')}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 sm:mt-6 text-sm sm:text-lg text-stone-300 max-w-xl leading-relaxed"
            >
              {t('hero_subtitle', 'Indulge in award-winning smash burgers, 48h fermented sourdough pizzas, and vibrant poke bowls crafted by master chefs. Instant checkout with direct credit card payment.')}
            </motion.p>

            {/* Direct Card Checkout Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              onClick={onExploreClick}
              className="mt-5 sm:mt-6 w-full max-w-lg p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-stone-900/90 via-amber-950/30 to-stone-900/90 border border-amber-500/30 flex items-center justify-between gap-3 cursor-pointer hover:border-amber-400 transition-all shadow-xl group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Direct Card & 1-Touch Checkout</span>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-white mt-0.5">
                    Pay when you order • 100% Encrypted & Safe
                  </div>
                </div>
              </div>

              <span className="text-xs font-bold text-amber-400 group-hover:text-amber-300 flex items-center gap-1 shrink-0">
                Order Now <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto"
            >
              <button
                onClick={onExploreClick}
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-stone-950 font-bold text-sm sm:text-base shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{t('hero_explore_btn', 'Explore Full Menu')}</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('deals');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-700 hover:border-stone-500 font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Tag className="w-4 h-4 text-orange-400" />
                <span>Today's Offers & Deals</span>
              </button>
            </motion.div>

            {/* Social Proof Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="mt-8 sm:mt-10 grid grid-cols-3 gap-2 sm:gap-4 border-t border-stone-800/80 pt-5 sm:pt-6 w-full max-w-lg"
            >
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl font-black text-white font-display">{t('hero_stat_1_val', '18 min')}</span>
                <span className="text-[11px] sm:text-xs text-stone-400">{t('hero_stat_1_lbl', 'Avg Express Delivery')}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl font-black text-amber-400 font-display flex items-center gap-1">
                  {t('hero_stat_2_val', '4.9')} <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 inline" />
                </span>
                <span className="text-[11px] sm:text-xs text-stone-400">{t('hero_stat_2_lbl', '25k+ Foodie Reviews')}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl font-black text-white font-display">{t('hero_stat_3_val', '100%')}</span>
                <span className="text-[11px] sm:text-xs text-stone-400">{t('hero_stat_3_lbl', 'Fresh & Organic')}</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Dynamic Animated Floating Visual Collage */}
          <div className="lg:col-span-5 relative flex items-center justify-center mt-6 lg:mt-0">
            
            {/* Center Main Food Dish Graphic */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0, rotate: -6 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative w-full max-w-[340px] sm:max-w-[420px] aspect-square rounded-3xl overflow-hidden border-2 border-stone-700/60 shadow-2xl shadow-orange-500/20 group"
            >
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80"
                alt="Signature Truffle Burger"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5">
                <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-amber-500 text-stone-950 font-extrabold text-[10px] sm:text-[11px] uppercase tracking-wider inline-block mb-1">
                  {t('hero_card_badge', "Chef's Masterpiece")}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                  Truffle Umami Smash Burger
                </h3>
                <p className="text-[11px] sm:text-xs text-stone-300 mt-0.5 sm:mt-1 line-clamp-1">
                  Double Angus beef patties, aged Gruyère, balsamic onions
                </p>
              </div>
            </motion.div>

            {/* Floating Card 1: Fast Delivery Timer */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute -top-3 sm:-top-6 right-1 sm:-right-8 p-2 sm:p-3.5 rounded-2xl glass-panel-glow border border-amber-500/40 shadow-2xl flex items-center gap-2 sm:gap-3 animate-float max-w-[85%] sm:max-w-none"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="text-[9px] sm:text-[10px] uppercase font-bold text-emerald-400 tracking-wide">{t('hero_hot_fresh', 'Hot & Fresh')}</div>
                <div className="text-xs sm:text-sm font-bold text-white">{t('hero_est_time', 'Estimated 18 Mins')}</div>
              </div>
            </motion.div>

            {/* Floating Card 2: 5-Star Rating Pill */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute -bottom-3 sm:-bottom-6 left-1 sm:-left-8 p-2 sm:p-3.5 rounded-2xl glass-panel border border-stone-700/80 shadow-2xl flex items-center gap-2 sm:gap-3 animate-float-reverse max-w-[85%] sm:max-w-none"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400" />
              </div>
              <div>
                <div className="text-[9px] sm:text-[10px] uppercase font-bold text-amber-400 tracking-wide">{t('hero_gourmet_standard', 'Gourmet Standard')}</div>
                <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1">
                  4.9 / 5.0 ({t('hero_orders_count', '4.2k+ orders')})
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

