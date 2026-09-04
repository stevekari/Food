import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Sparkles, 
  X, 
  Receipt, 
  Bike, 
  Download, 
  Share2, 
  ArrowRight,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import OrderTracker from './OrderTracker';

export default function OrderSuccessModal({ order, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('tracker'); // 'tracker' | 'receipt'

  useEffect(() => {
    if (isOpen) {
      // Fire festive celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ef4444', '#10b981', '#fbbf24', '#ffffff']
      });

      const timeout = setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#f59e0b', '#fbbf24']
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ef4444', '#10b981']
        });
      }, 400);

      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/85 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[92vh] flex flex-col"
        >
          {/* Header Banner */}
          <div className="p-6 bg-gradient-to-r from-emerald-950/80 via-stone-950 to-stone-950 border-b border-stone-800 text-center relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-white bg-stone-800/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-emerald-500/20 text-emerald-400 mb-3 border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
              Order Confirmed & Sizzling!
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-1">
              Order <strong className="font-mono text-amber-400">{order.orderId}</strong> • Paid via <span className="text-emerald-400 font-semibold">{order.paymentMethod}</span>
            </p>

            {/* View Switcher Tabs */}
            <div className="mt-5 flex justify-center">
              <div className="flex bg-stone-900 border border-stone-800 p-1 rounded-2xl gap-1">
                <button
                  onClick={() => setActiveTab('tracker')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'tracker'
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Bike className="w-3.5 h-3.5" />
                  <span>Live Tracking</span>
                </button>

                <button
                  onClick={() => setActiveTab('receipt')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'receipt'
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Digital Receipt</span>
                </button>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'tracker' ? (
              <OrderTracker order={order} />
            ) : (
              /* Receipt View */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-3">
                  <div className="flex justify-between items-center text-xs pb-3 border-b border-stone-800">
                    <span className="text-stone-400">Order Placed</span>
                    <span className="text-stone-200 font-medium">{order.placedAt}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs pb-3 border-b border-stone-800">
                    <span className="text-stone-400">Deliver To</span>
                    <span className="text-stone-200 font-medium text-right max-w-xs truncate">{order.deliveryAddress}</span>
                  </div>

                  {/* Items list */}
                  <div className="space-y-2 py-2">
                    <div className="text-[11px] uppercase font-bold text-stone-400 tracking-wider">Ordered Items</div>
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-start text-xs">
                        <div>
                          <div className="font-semibold text-white">
                            {item.quantity}x {item.name}
                          </div>
                          {item.selectedAddons && item.selectedAddons.length > 0 && (
                            <div className="text-[10px] text-stone-400">
                              {item.selectedAddons.map(a => a.name).join(', ')}
                            </div>
                          )}
                        </div>
                        <span className="font-mono text-stone-200 font-semibold">
                          ${item.totalItemPrice.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="pt-3 border-t border-stone-800 space-y-1.5 text-xs text-stone-400">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono text-stone-200">${order.subtotal.toFixed(2)}</span>
                    </div>

                    {order.discount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Promo Discount ({order.appliedPromo?.code})</span>
                        <span className="font-mono">-${order.discount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span className="font-mono text-stone-200">{order.deliveryFee === 0 ? 'FREE' : `$${order.deliveryFee.toFixed(2)}`}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span className="font-mono text-stone-200">${order.tax.toFixed(2)}</span>
                    </div>

                    {order.tip > 0 && (
                      <div className="flex justify-between">
                        <span>Driver Tip</span>
                        <span className="font-mono text-stone-200">${order.tip.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-stone-800 flex justify-between items-baseline text-white">
                      <span className="font-bold text-sm">Paid Total</span>
                      <span className="font-mono font-black text-xl text-amber-400">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => alert('Digital Receipt downloaded as PDF')}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Download PDF
                  </button>
                  <button
                    onClick={() => alert('Order details copied to clipboard!')}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Action Button */}
          <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between gap-4">
            <span className="text-xs text-stone-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Guaranteed 100% hot & fresh arrival
            </span>

            <button
              onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Browsing</span>
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}

