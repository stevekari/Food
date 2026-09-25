import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Clock, 
  Flame, 
  Plus, 
  Check, 
  Sliders, 
  Sparkles,
  Zap
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function FoodCard({ food, onOpenDetails }) {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [isJustAdded, setIsJustAdded] = useState(false);

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    // If the food has addons, let's open the customization modal so they can customize, or quick add base
    if (food.addons && food.addons.length > 0) {
      onOpenDetails(food);
      return;
    }

    addToCart(food, 1, [], '');
    setIsJustAdded(true);
    setTimeout(() => setIsJustAdded(false), 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.25 }}
      onClick={() => onOpenDetails(food)}
      className="group relative flex flex-col justify-between bg-stone-900/70 hover:bg-stone-900 border border-stone-800 hover:border-amber-500/40 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-orange-950/20"
    >
      {/* Top Image Container */}
      <div className="relative w-full h-52 overflow-hidden bg-stone-950">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent opacity-80" />

        {/* Floating Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 items-start">
          {food.isBestseller && (
            <span className="px-2.5 py-1 rounded-lg bg-orange-500/90 backdrop-blur-md text-stone-950 text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md">
              <Flame className="w-3 h-3 fill-stone-950" /> {t('card_bestseller', 'Bestseller')}
            </span>
          )}
          {food.isChefSpecial && (
            <span className="px-2.5 py-1 rounded-lg bg-amber-400/90 backdrop-blur-md text-stone-950 text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3" /> {t('card_chef_pick', 'Chef Pick')}
            </span>
          )}
        </div>

        {/* Prep Time & Calories Pill */}
        <div className="absolute bottom-3 left-3.5 flex items-center gap-2 text-[11px] font-medium text-stone-300 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-emerald-400" />
            <span>{food.prepTime}</span>
          </div>
          <span className="text-stone-600">•</span>
          <span className="text-stone-400">{food.calories}</span>
        </div>

        {/* Rating Floating Badge */}
        <div className="absolute top-3.5 right-3.5 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-stone-950/85 backdrop-blur-md border border-white/10 text-amber-400 text-xs font-bold shadow-md">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{food.rating.toFixed(1)}</span>
          <span className="text-[10px] text-stone-400 font-normal">({food.reviewsCount})</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Dish Title */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-bold text-lg text-white group-hover:text-amber-400 transition-colors leading-snug line-clamp-1">
              {food.name}
            </h3>
            
            {/* Spice Indicator */}
            {food.spiceLevel > 0 && (
              <div className="flex items-center gap-0.5 flex-shrink-0" title={`Spice Level: ${food.spiceLevel}/3`}>
                {Array.from({ length: food.spiceLevel }).map((_, i) => (
                  <Flame key={i} className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <p className="mt-2 text-xs text-stone-400 line-clamp-2 leading-relaxed">
            {food.description}
          </p>

          {/* Tags preview */}
          {food.ingredients && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {food.ingredients.slice(0, 3).map((ing, i) => (
                <span
                  key={i}
                  className="text-[10px] text-stone-400 bg-stone-800/80 px-2 py-0.5 rounded-md"
                >
                  {ing}
                </span>
              ))}
              {food.ingredients.length > 3 && (
                <span className="text-[10px] text-stone-500 bg-stone-800/40 px-1.5 py-0.5 rounded-md">
                  +{food.ingredients.length - 3} {t('card_more_ingredients', 'more')}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer: Price & Add Button */}
        <div className="mt-5 pt-3.5 border-t border-stone-800/80 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-white font-mono">
              €{food.price.toFixed(2)}
            </span>
            {food.originalPrice && (
              <span className="text-xs text-stone-500 line-through font-mono">
                €{food.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {food.addons && food.addons.length > 0 ? (
              <button
                onClick={handleQuickAdd}
                className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-amber-500 text-stone-200 hover:text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md group/btn"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-400 group-hover/btn:text-stone-950" />
                <span>{t('card_customize', 'Customize')}</span>
              </button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={handleQuickAdd}
                className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${
                  isJustAdded
                    ? 'bg-emerald-500 text-stone-950 shadow-emerald-500/30'
                    : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/20'
                }`}
              >
                {isJustAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>{t('card_added', 'Added!')}</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>{t('card_add', 'Add')}</span>
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
}

