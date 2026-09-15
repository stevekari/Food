import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Star, 
  Clock, 
  Flame, 
  Plus, 
  Minus, 
  Check, 
  Sparkles, 
  ShoppingBag,
  Info,
  Heart
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function FoodDetailModal({ food, isOpen, onClose }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [instructions, setInstructions] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedAddons([]);
      setInstructions('');
    }
  }, [isOpen, food]);

  if (!isOpen || !food) return null;

  const toggleAddon = (addon) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = food.price + addonsTotal;
  const totalPrice = +(unitPrice * quantity).toFixed(2);

  const handleAddToCart = () => {
    addToCart(food, quantity, selectedAddons, instructions);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/80 backdrop-blur-md"
        />

        {/* Modal / Bottom Sheet Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 40 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="relative w-full max-w-2xl bg-stone-900 border-t sm:border border-stone-800 rounded-t-[32px] sm:rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[92vh] sm:max-h-[90vh] flex flex-col"
        >
          {/* Mobile Sheet Drag Handle Indicator */}
          <div className="w-12 h-1.5 bg-stone-700/80 rounded-full mx-auto mt-2.5 mb-0.5 sm:hidden shrink-0" />

          {/* Close & Favorite Top Floating Buttons */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2.5 rounded-full bg-stone-950/70 backdrop-blur-md text-stone-300 hover:text-rose-400 border border-white/10 transition-colors"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-stone-950/70 backdrop-blur-md text-stone-300 hover:text-white border border-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="overflow-y-auto flex-1">
            {/* Header Media Banner */}
            <div className="relative h-64 sm:h-72 w-full bg-stone-950">
              <img
                src={food.image}
                alt={food.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
              
              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-center gap-2 mb-2">
                  {food.isBestseller && (
                    <span className="px-2.5 py-1 rounded-md bg-orange-500 text-stone-950 text-[11px] font-extrabold uppercase">
                      Bestseller
                    </span>
                  )}
                  {food.isChefSpecial && (
                    <span className="px-2.5 py-1 rounded-md bg-amber-400 text-stone-950 text-[11px] font-extrabold uppercase">
                      Chef Special
                    </span>
                  )}
                </div>

                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {food.name}
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Quick Info Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-stone-950/60 border border-stone-800">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{food.rating.toFixed(1)}</span>
                  <span className="text-stone-400 font-normal">({food.reviewsCount} reviews)</span>
                </div>

                <div className="flex items-center gap-1.5 text-stone-300 text-sm">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>{food.prepTime}</span>
                </div>

                <div className="flex items-center gap-1.5 text-stone-300 text-sm">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span>{food.calories}</span>
                </div>

                {food.spiceLevel > 0 && (
                  <div className="flex items-center gap-1 text-rose-400 text-sm font-semibold">
                    <span>Spice:</span>
                    {Array.from({ length: food.spiceLevel }).map((_, i) => (
                      <Flame key={i} className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs uppercase font-bold text-stone-400 tracking-wider mb-2">Description</h4>
                <p className="text-stone-300 text-sm leading-relaxed">
                  {food.description}
                </p>
              </div>

              {/* Key Ingredients */}
              {food.ingredients && (
                <div>
                  <h4 className="text-xs uppercase font-bold text-stone-400 tracking-wider mb-2.5">Fresh Ingredients</h4>
                  <div className="flex flex-wrap gap-2">
                    {food.ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-xl bg-stone-800/80 border border-stone-700/60 text-xs text-stone-200"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Addons / Extras */}
              {food.addons && food.addons.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs uppercase font-bold text-stone-400 tracking-wider">Customize Your Order</h4>
                    <span className="text-xs text-stone-500">Optional extras</span>
                  </div>

                  <div className="space-y-2.5">
                    {food.addons.map((addon) => {
                      const isSelected = selectedAddons.some((a) => a.id === addon.id);

                      return (
                        <div
                          key={addon.id}
                          onClick={() => toggleAddon(addon)}
                          className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-amber-500/10 border-amber-500/50 text-white'
                              : 'bg-stone-950/40 border-stone-800 text-stone-300 hover:border-stone-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                                isSelected
                                  ? 'bg-amber-500 border-amber-500 text-stone-950'
                                  : 'border-stone-600 bg-stone-800'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <span className="text-sm font-medium">{addon.name}</span>
                          </div>

                          <span className="text-sm font-bold font-mono text-amber-400">
                            +${addon.price.toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Special Instructions Note */}
              <div>
                <h4 className="text-xs uppercase font-bold text-stone-400 tracking-wider mb-2">Special Chef Note</h4>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Sauce on the side, extra crispy fries, no onions..."
                  className="w-full p-3.5 bg-stone-950/60 border border-stone-800 focus:border-amber-500/60 rounded-2xl text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:ring-1 focus:ring-amber-500/30 resize-none"
                />
              </div>

            </div>
          </div>

          {/* Sticky Bottom Action Bar */}
          <div className="p-4 sm:p-5 pb-[max(1rem,env(safe-area-inset-bottom,1rem))] bg-stone-950 border-t border-stone-800 flex items-center justify-between gap-4">
            
            {/* Quantity Stepper */}
            <div className="flex items-center gap-3 bg-stone-900 border border-stone-800 px-3 py-2 rounded-2xl">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-xl bg-stone-800 hover:bg-stone-700 disabled:opacity-40 flex items-center justify-center text-stone-200 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono font-bold text-base text-white w-6 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-xl bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add to Cart Submit Button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAddToCart}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-stone-950 font-bold text-sm sm:text-base flex items-center justify-between shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
                <span>Add to Cart</span>
              </div>
              <span className="font-mono font-black text-stone-950 text-base">
                ${totalPrice.toFixed(2)}
              </span>
            </motion.button>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

