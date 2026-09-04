import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Flame, Gift, Percent, ArrowRight, Zap, Copy, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWallet } from '../context/WalletContext';

export default function SpecialDeals() {
  const { applyPromoCode } = useCart();
  const { setIsWalletModalOpen } = useWallet();
  const [copiedCode, setCopiedCode] = React.useState(null);

  const handleCopy = (code) => {
    applyPromoCode(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section className="py-12 border-y border-stone-800/80 bg-stone-950/40 relative overflow-hidden">
      {/* Background Subtle Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Exclusive Member Perks
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
              Limited-Time Food Offers & Credits
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 max-w-md mt-2 md:mt-0">
            Stack your pre-loaded food credits with flash coupons for maximum culinary delight.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: 20% OFF */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950/40 border border-amber-500/30 shadow-xl flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-amber-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400">
                  <Percent className="w-5 h-5" />
                </span>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-[10px] uppercase tracking-wider">
                  Sitewide Deal
                </span>
              </div>

              <h3 className="font-display font-bold text-xl text-white">20% Off Entire Order</h3>
              <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
                Applies instantly to all gourmet smash burgers, artisan pizzas, and poke bowls.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-amber-400 bg-stone-950 px-2.5 py-1 rounded-xl border border-amber-500/30">
                STEVE20
              </span>
              <button
                onClick={() => handleCopy('STEVE20')}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow"
              >
                {copiedCode === 'STEVE20' ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === 'STEVE20' ? 'Applied!' : 'Apply Code'}</span>
              </button>
            </div>
          </motion.div>

          {/* Card 2: Wallet Bonus Top-Up */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-orange-950/40 border border-orange-500/30 shadow-xl flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-orange-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 rounded-2xl bg-orange-500/20 text-orange-400">
                  <Gift className="w-5 h-5" />
                </span>
                <span className="px-2.5 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 font-extrabold text-[10px] uppercase tracking-wider">
                  Wallet Boost
                </span>
              </div>

              <h3 className="font-display font-bold text-xl text-white">Get +$15 Free Bonus</h3>
              <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
                Top up $100 in Food Credits today and automatically get $115 total dining power.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between">
              <span className="text-xs text-stone-300 font-semibold">VIP Top-Up Special</span>
              <button
                onClick={() => setIsWalletModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-stone-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow"
              >
                <span>Top-Up Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

          {/* Card 3: Free Express Delivery */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-emerald-950/40 border border-emerald-500/30 shadow-xl flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-emerald-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400">
                  <Zap className="w-5 h-5" />
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-extrabold text-[10px] uppercase tracking-wider">
                  Express VIP
                </span>
              </div>

              <h3 className="font-display font-bold text-xl text-white">Free Express Delivery</h3>
              <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
                Enjoy complimentary priority courier delivery on all orders over $45.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-emerald-400 bg-stone-950 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                FREEDEL
              </span>
              <button
                onClick={() => handleCopy('FREEDEL')}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow"
              >
                {copiedCode === 'FREEDEL' ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === 'FREEDEL' ? 'Applied!' : 'Apply Code'}</span>
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

