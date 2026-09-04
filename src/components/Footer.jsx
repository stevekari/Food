import React from 'react';
import { ChefHat, Heart, ShieldCheck, Clock, Sparkles, Send, Instagram, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-950 border-t border-stone-800 text-stone-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 flex items-center justify-center text-stone-950">
                <ChefHat className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-display font-bold text-xl text-white tracking-tight">
                STEVE <span className="text-amber-400">FOOD</span>
              </span>
            </div>

            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Gourmet dining engineered for speed. Farm-fresh organic ingredients, crafted by master culinary artists and delivered within 20 minutes.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-400 flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-400 flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-400 flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-stone-200 font-bold uppercase tracking-wider text-xs">Cuisines</h4>
            <ul className="space-y-2 text-stone-400">
              <li><a href="#" className="hover:text-amber-400 transition-colors">Smash Burgers</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Wood-Fired Pizza</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Asian Ramen & Bowls</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Power Greens & Salads</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Desserts & Shakes</a></li>
            </ul>
          </div>

          {/* Wallet & Support */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-stone-200 font-bold uppercase tracking-wider text-xs">Account & Perks</h4>
            <ul className="space-y-2 text-stone-400">
              <li><a href="#" className="hover:text-amber-400 transition-colors">Food Credit Wallet</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">VIP Member Rewards</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Live Order Tracker</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Gift Cards</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Newsletter / Promo signup */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-stone-200 font-bold uppercase tracking-wider text-xs">Join Foodie Club</h4>
            <p className="text-stone-400 text-xs">
              Subscribe to unlock secret chef tasting menus and receive an instant $10 food credit voucher.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed! $10 voucher code sent to your email.'); }} className="flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                required
                className="w-full px-3 py-2 bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl text-xs text-white focus:outline-none placeholder-stone-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-colors flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <div>
            © {new Date().getFullYear()} STEVE FOOD Technologies Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Safe & Hygienic Certified
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-stone-400">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> 24/7 Late Night Delivery
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

