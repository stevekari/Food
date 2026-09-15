import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  X, 
  Smartphone, 
  Zap, 
  WifiOff, 
  Bell, 
  Share2, 
  PlusSquare, 
  CheckCircle2, 
  ChefHat,
  Monitor,
  Laptop
} from 'lucide-react';

export default function InstallPwaModal({ 
  isOpen, 
  onClose, 
  onInstall, 
  isNativeInstallable, 
  isIOS 
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal / Bottom Sheet Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 40 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full max-w-lg bg-stone-900 border-t sm:border border-stone-800 rounded-t-[32px] sm:rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 overflow-hidden text-stone-100 z-10 max-h-[92vh] flex flex-col"
        >
          {/* Mobile Drag Indicator */}
          <div className="w-12 h-1.5 bg-stone-700/80 rounded-full mx-auto -mt-2 mb-3 sm:hidden shrink-0" />
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 flex items-center justify-center text-stone-950 shadow-lg shadow-orange-500/30">
              <ChefHat className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                <Zap className="w-3 h-3" /> PWA Official App
              </div>
              <h3 className="font-display font-black text-2xl text-white">
                Install STEVE FOOD
              </h3>
            </div>
          </div>

          {/* App Benefits List */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-950/60 border border-stone-800/80">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-100">1-Tap Instant Launch</h4>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Access gourmet menus right from your Home Screen or Dock with full-screen immersive view.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-950/60 border border-stone-800/80">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                <WifiOff className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-100">Offline & Fast Caching</h4>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Browse dishes, cached menus, and your food credit wallet even with spotty connectivity.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-950/60 border border-stone-800/80">
              <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-100">Express Order Updates</h4>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Real-time live delivery timer and instant food credit bonus notifications.
                </p>
              </div>
            </div>
          </div>

          {/* Installation Instructions / Action */}
          {isIOS ? (
            /* iOS Safari Instructions */
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-3 mb-6">
              <div className="font-bold text-sm text-amber-300 flex items-center gap-2">
                <Smartphone className="w-4 h-4" /> How to install on iOS / iPhone / iPad:
              </div>
              <ol className="space-y-2 text-stone-300 list-decimal list-inside pl-1">
                <li className="leading-relaxed">
                  Tap the <strong className="text-white inline-flex items-center gap-1 bg-stone-800 px-1.5 py-0.5 rounded"><Share2 className="w-3.5 h-3.5 text-blue-400" /> Share</strong> button at the bottom of Safari.
                </li>
                <li className="leading-relaxed">
                  Scroll down and tap <strong className="text-white inline-flex items-center gap-1 bg-stone-800 px-1.5 py-0.5 rounded"><PlusSquare className="w-3.5 h-3.5 text-amber-400" /> Add to Home Screen</strong>.
                </li>
                <li className="leading-relaxed">
                  Confirm by tapping <strong className="text-white">Add</strong> in the top-right corner.
                </li>
              </ol>
            </div>
          ) : isNativeInstallable ? (
            /* Direct One-Click Install for Chrome / Android / Windows / Mac */
            <button
              onClick={onInstall}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black text-sm tracking-wide shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-98 mb-3"
            >
              <Download className="w-5 h-5 stroke-[2.5]" />
              Install STEVE FOOD App Now
            </button>
          ) : (
            /* Desktop / General Browser fallback */
            <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 text-xs space-y-2 mb-4">
              <div className="font-bold text-stone-200 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-amber-400" /> Install on Desktop or Browser
              </div>
              <p className="text-stone-400 leading-relaxed">
                Click the <strong className="text-stone-200">Install icon (⊕ or ⤓)</strong> in your browser's URL address bar (Chrome, Edge, Brave) to add STEVE FOOD to your desktop application dock.
              </p>
            </div>
          )}

          {/* Compatibility Device Icons */}
          <div className="flex items-center justify-center gap-4 text-[11px] text-stone-500 pt-2 border-t border-stone-800/80">
            <span className="flex items-center gap-1"><Smartphone className="w-3.5 h-3.5 text-stone-400" /> iOS & Android</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Laptop className="w-3.5 h-3.5 text-stone-400" /> macOS & Windows</span>
            <span>•</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 100% Free</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

