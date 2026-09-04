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
  return (
    <div className="w-full mb-10">
      
      {/* Category Pills Bar (Horizontal Scrollable) */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth">
        {CATEGORIES.map((cat) => {
          const IconComponent = ICONS_MAP[cat.icon] || Sparkles;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`relative flex-shrink-0 flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
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
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Secondary Bar: Dietary Tags & Sort Dropdown */}
      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-stone-800/80">
        
        {/* Dietary Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-stone-400 mr-1 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" /> Filter:
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
                {diet.label}
              </button>
            );
          })}
        </div>

        {/* Sort Controls & Count */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-stone-400">
            Showing <strong className="text-white font-semibold">{itemsCount}</strong> delicacies
          </span>

          <div className="relative flex items-center gap-1.5 bg-stone-900 border border-stone-800 px-3 py-1.5 rounded-xl text-xs text-stone-300">
            <ArrowUpDown className="w-3 h-3 text-amber-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent text-stone-200 focus:outline-none cursor-pointer pr-2 font-medium"
            >
              <option value="featured" className="bg-stone-900 text-white">✨ Featured</option>
              <option value="rating" className="bg-stone-900 text-white">⭐ Highest Rated</option>
              <option value="price-low" className="bg-stone-900 text-white">💲 Price: Low to High</option>
              <option value="price-high" className="bg-stone-900 text-white">💎 Price: High to Low</option>
              <option value="time" className="bg-stone-900 text-white">⚡ Fastest Delivery</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
}

