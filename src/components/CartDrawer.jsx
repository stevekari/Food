import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Sparkles, 
  Check, 
  Percent, 
  Bike, 
  Zap, 
  HeartHandshake,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function CartDrawer({ onCheckoutClick }) {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    itemCount,
    subtotal,
    discount,
    deliveryFee,
    tax,
    tip,
    setTip,
    total,
    deliveryType,
    setDeliveryType,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    promoInput,
    setPromoInput,
    isFreeDeliveryEligible
  } = useCart();

  const { t } = useLanguage();

  const handleApplyPromo = (e) => {
    e.preventDefault();
    applyPromoCode();
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm"
          />

          {/* Drawer Container */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-screen max-w-md bg-stone-900 border-l border-stone-800 shadow-2xl flex flex-col justify-between"
            >
              
              {/* Drawer Header */}
              <div className="p-5 border-b border-stone-800/80 flex items-center justify-between bg-stone-950/70">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-lg text-white">{t('cart_title', 'Your Feast Cart')}</h2>
                    <p className="text-xs text-stone-400">
                      {itemCount} {t('cart_items_count', 'items selected')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {items.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-xs text-stone-400 hover:text-rose-400 transition-colors px-2 py-1 rounded-lg hover:bg-stone-800"
                    >
                      {t('cart_clear', 'Clear')}
                    </button>
                  )}
                  <button
                    onClick={closeCart}
                    className="p-2 rounded-xl text-stone-400 hover:text-white bg-stone-800/80 hover:bg-stone-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Drawer Body: Items or Empty State */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
                    <div className="w-20 h-20 rounded-3xl bg-stone-800/60 border border-stone-700 flex items-center justify-center text-4xl mb-4 shadow-inner">
                      🍔
                    </div>
                    <h3 className="font-display font-bold text-xl text-white">{t('cart_empty_title', 'Your Cart is Empty')}</h3>
                    <p className="text-sm text-stone-400 mt-2 max-w-xs leading-relaxed">
                      {t('cart_empty_desc', 'Explore our handcrafted burgers, wood-fired pizzas, and fresh bowls to start your order!')}
                    </p>
                    <button
                      onClick={closeCart}
                      className="mt-6 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
                    >
                      {t('cart_empty_btn', 'Explore Delicacies')}
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Items List */}
                    <div className="space-y-3">
                      {items.map((item) => (
                        <motion.div
                          layout
                          key={item.cartItemId}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800 flex gap-3 items-start group"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-18 h-18 rounded-xl object-cover flex-shrink-0"
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-sm font-bold text-white line-clamp-1">
                                {item.name}
                              </h4>
                              <button
                                onClick={() => removeItem(item.cartItemId)}
                                className="text-stone-500 hover:text-rose-400 transition-colors p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Addons preview */}
                            {item.selectedAddons && item.selectedAddons.length > 0 && (
                              <div className="text-[11px] text-amber-400/90 mt-0.5 space-y-0.5">
                                {item.selectedAddons.map((addon) => (
                                  <div key={addon.id} className="truncate">
                                    + {addon.name} (€{addon.price.toFixed(2)})
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Note */}
                            {item.specialInstructions && (
                              <div className="text-[11px] text-stone-400 italic mt-1 truncate">
                                Note: "{item.specialInstructions}"
                              </div>
                            )}

                            {/* Quantity & Unit Total */}
                            <div className="mt-2.5 flex items-center justify-between">
                              <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 rounded-xl px-2 py-1">
                                <button
                                  onClick={() => updateQuantity(item.cartItemId, -1)}
                                  className="text-stone-400 hover:text-white p-0.5"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-mono font-bold text-white w-4 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.cartItemId, 1)}
                                  className="text-stone-400 hover:text-white p-0.5"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <span className="text-sm font-mono font-bold text-amber-400">
                                €{item.totalItemPrice.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Delivery Option Toggle */}
                    <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-2">
                      <div className="text-xs font-bold uppercase text-stone-400 tracking-wider">
                        {t('cart_order_type_title', 'Delivery Speed')}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setDeliveryType('standard')}
                          className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                            deliveryType === 'standard'
                              ? 'bg-amber-500/10 border-amber-500/60 text-white'
                              : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:border-stone-700'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 text-xs font-bold">
                            <Bike className="w-3.5 h-3.5 text-amber-400" />
                            <span>{t('cart_standard_del', 'Standard')}</span>
                          </div>
                          <div className="text-[11px] text-stone-400">
                            25-35 min • {isFreeDeliveryEligible ? t('cart_free_delivery', 'FREE') : '€2.99'}
                          </div>
                        </button>

                        <button
                          onClick={() => setDeliveryType('priority')}
                          className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                            deliveryType === 'priority'
                              ? 'bg-amber-500/10 border-amber-500/60 text-white'
                              : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:border-stone-700'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                            <Zap className="w-3.5 h-3.5 fill-amber-400" />
                            <span className="text-white">{t('cart_priority_del', 'Priority Express')}</span>
                          </div>
                          <div className="text-[11px] text-stone-400">
                            15-20 min • {isFreeDeliveryEligible ? '€2.00' : '€4.99'}
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Promo Code Box */}
                    <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-2">
                      <div className="text-xs font-bold uppercase text-stone-400 tracking-wider flex items-center justify-between">
                        <span>{t('cart_promo_title', 'Promo Code')}</span>
                        <div className="flex items-center gap-1 text-[11px] text-amber-400">
                          <Tag className="w-3 h-3" />
                          <span>{t('cart_tap_code', 'Tap code:')}</span>
                          <button
                            onClick={() => applyPromoCode('STEVE20')}
                            className="underline hover:text-white font-mono"
                          >
                            STEVE20
                          </button>
                        </div>
                      </div>

                      {appliedPromo ? (
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200">
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-emerald-400" />
                            <div>
                              <strong className="font-mono">{appliedPromo.code}</strong>: {appliedPromo.description}
                            </div>
                          </div>
                          <button
                            onClick={removePromoCode}
                            className="text-stone-400 hover:text-rose-400 text-xs px-1.5 py-0.5"
                          >
                            {t('cart_remove', 'Remove')}
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleApplyPromo} className="flex gap-2">
                          <input
                            type="text"
                            placeholder={t('cart_promo_placeholder', 'Enter STEVE20, FREEDEL...')}
                            value={promoInput}
                            onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                            className="flex-1 px-3 py-2 bg-stone-900 border border-stone-800 focus:border-amber-500/60 rounded-xl text-xs text-white placeholder-stone-500 font-mono focus:outline-none uppercase"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-amber-400 font-bold text-xs rounded-xl transition-colors"
                          >
                            {t('cart_apply', 'Apply')}
                          </button>
                        </form>
                      )}
                    </div>

                    {/* Driver Tip Selection */}
                    <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-2">
                      <div className="text-xs font-bold uppercase text-stone-400 tracking-wider flex items-center gap-1.5">
                        <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
                        <span>{t('cart_tip_courier', 'Courier Appreciation Tip')}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[0, 2, 3, 5].map((amount) => (
                          <button
                            key={amount}
                            onClick={() => setTip(amount)}
                            className={`py-2 rounded-xl text-xs font-bold transition-all ${
                              tip === amount
                                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                                : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
                            }`}
                          >
                            {amount === 0 ? 'No Tip' : `€${amount}`}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

              </div>

              {/* Drawer Footer: Order Summary & Checkout Trigger */}
              {items.length > 0 && (
                <div className="p-5 pb-[max(1.25rem,env(safe-area-inset-bottom,1.25rem))] border-t border-stone-800 bg-stone-950 space-y-3">
                  
                  {/* Cost Breakdown */}
                  <div className="space-y-1.5 text-xs text-stone-400">
                    <div className="flex justify-between">
                      <span>{t('cart_subtotal', 'Subtotal')}</span>
                      <span className="font-mono text-stone-200">€{subtotal.toFixed(2)}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-400 font-semibold">
                        <span>{t('cart_discount', 'Promo Discount')} ({appliedPromo?.code})</span>
                        <span className="font-mono">-€{discount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>{t('cart_delivery_fee', 'Delivery Fee')}</span>
                      <span className="font-mono text-stone-200">
                        {deliveryFee === 0 ? (
                          <span className="text-emerald-400 font-bold">{t('cart_free_delivery', 'FREE')}</span>
                        ) : (
                          `€${deliveryFee.toFixed(2)}`
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>{t('cart_tax', 'Estimated Tax')}</span>
                      <span className="font-mono text-stone-200">€{tax.toFixed(2)}</span>
                    </div>

                    {tip > 0 && (
                      <div className="flex justify-between">
                        <span>{t('cart_tip', 'Courier Tip')}</span>
                        <span className="font-mono text-stone-200">€{tip.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-stone-800 flex justify-between items-baseline text-white">
                      <span className="font-bold text-sm">{t('cart_total', 'Estimated Total')}</span>
                      <span className="font-mono font-extrabold text-xl text-amber-400">
                        €{total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Secure Direct Checkout Notice */}
                  <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between text-xs text-stone-300">
                    <div className="flex items-center gap-1.5 text-stone-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Direct Card & 1-Touch Checkout</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-medium">100% Secure</span>
                  </div>

                  {/* Checkout CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      closeCart();
                      onCheckoutClick();
                    }}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-stone-950 font-black text-base shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 flex items-center justify-center gap-2 transition-all"
                  >
                    <span>{t('cart_checkout_btn', 'Proceed to Checkout')}</span>
                    <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                  </motion.button>

                </div>
              )}

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

