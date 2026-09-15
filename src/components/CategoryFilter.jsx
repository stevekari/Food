import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Beef, 
  Pizza, 
  Soup, 
  Salad, 
  Cake, 
  Coffee, 
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';
import { CATEGORIES, DIETARY_FILTERS } from '../data/foodData';
import { useLanguage } from '../context/LanguageContext';

const ICONS_MAP = {
  Sparkles,
  Beef,
  Pizza,
  Soup,
  Salad,
  Cake,
  Coffee,
};

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
  selectedDietary,
  onSelectDietary,
  sortBy,
  onSortChange,
  itemsCount
}) {
  const { t } = useLanguage();

  const getCategoryName = (cat) => {
    return t(`cat_${cat.id}`, cat.name);
  };

  const getDietaryLabel = (diet) => {
    return t(`filter_${diet.id.replace('-', '_')}`, diet.label);
  };

  return (
    <div className="w-full mb-10">
      
      {/* Category Pills Bar (Horizontal Scrollable with Touch Snapping) */}
      <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
        {CATEGORIES.map((cat) => {
          const IconComponent = ICONS_MAP[cat.icon] || Sparkles;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`relative flex-shrink-0 snap-start flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 active:scale-95 ${
                isSelected
                  ? 'text-stone-950 font-bold shadow-lg shadow-amber-500/20'
                  : 'bg-stone-900/80 hover:bg-stone-850 text-stone-300 hover:text-white border border-stone-800'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeCategoryBg"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 rounded-2xl -z-10"
                />
              )}

              <IconComponent className={`w-4 h-4 ${isSelected ? 'text-stone-950' : 'text-amber-400'}`} />
              <span>{getCategoryName(cat)}</span>
            </button>
          );
        })}
      </div>

      {/* Secondary Bar: Dietary Tags & Sort Dropdown */}
      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-stone-800/80">
        
        {/* Dietary Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-stone-400 mr-1 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" /> {t('filter_label', 'Filter:')}
          </span>
          {DIETARY_FILTERS.map((diet) => {
            const isDietSelected = selectedDietary === diet.id;
            return (
              <button
                key={diet.id}
                onClick={() => onSelectDietary(diet.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isDietSelected
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                    : 'bg-stone-900/60 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800/70'
                }`}
              >
                {getDietaryLabel(diet)}
              </button>
            );
          })}
        </div>

        {/* Sort Controls & Count */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-stone-400">
            {t('showing_items', 'Showing')} <strong className="text-white font-semibold">{itemsCount}</strong> {t('delicacies_count', 'delicacies')}
          </span>

          <div className="relative flex items-center gap-1.5 bg-stone-900 border border-stone-800 px-3 py-1.5 rounded-xl text-xs text-stone-300">
            <ArrowUpDown className="w-3 h-3 text-amber-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent text-stone-200 focus:outline-none cursor-pointer pr-2 font-medium"
            >
              <option value="featured" className="bg-stone-900 text-white">{t('sort_featured', '✨ Featured')}</option>
              <option value="rating" className="bg-stone-900 text-white">{t('sort_rating', '⭐ Highest Rated')}</option>
              <option value="price-low" className="bg-stone-900 text-white">{t('sort_price_low', '💲 Price: Low to High')}</option>
              <option value="price-high" className="bg-stone-900 text-white">{t('sort_price_high', '💎 Price: High to Low')}</option>
              <option value="time" className="bg-stone-900 text-white">{t('sort_time', '⚡ Fastest Delivery')}</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
}

