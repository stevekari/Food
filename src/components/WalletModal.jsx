import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Wallet, 
  Sparkles, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  RotateCcw, 
  ShieldCheck, 
  Gift, 
  Check
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useLanguage } from '../context/LanguageContext';
import { logAnalyticsEvent } from '../firebase';

const PACKAGES = [
  { id: 'p1', amount: 25, bonus: 0, label: 'Starter Pack', tag: 'Standard' },
  { id: 'p2', amount: 50, bonus: 5, label: 'Foodie Favorite', tag: '+€5 Bonus Free', isPopular: true },
  { id: 'p3', amount: 100, bonus: 15, label: 'VIP Feast', tag: '+€15 Bonus Free' },
];

export default function WalletModal() {
  const { balance, transactions, topUp, resetCredit, isWalletModalOpen, setIsWalletModalOpen } = useWallet();
  const { t } = useLanguage();
  const [selectedPkg, setSelectedPkg] = useState(PACKAGES[1]);
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isWalletModalOpen) return null;

  const handleTopUp = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 600));

    if (customAmount && Number(customAmount) > 0) {
      const amt = Number(customAmount);
      topUp(amt, 0, 'Instant Top-Up');
      logAnalyticsEvent('top_up_wallet', {
        amount: amt,
        bonus: 0,
        currency: 'EUR',
        type: 'custom'
      });
      setCustomAmount('');
    } else if (selectedPkg) {
      topUp(selectedPkg.amount, selectedPkg.bonus, `${selectedPkg.label} Package`);
      logAnalyticsEvent('top_up_wallet', {
        amount: selectedPkg.amount,
        bonus: selectedPkg.bonus,
        currency: 'EUR',
        package_id: selectedPkg.id,
        type: 'package'
      });
    }

    setIsProcessing(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsWalletModalOpen(false)}
          className="fixed inset-0 bg-stone-950/85 backdrop-blur-md"
        />

        {/* Modal / Bottom Sheet Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 40 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-stone-900 border-t sm:border border-stone-800 rounded-t-[32px] sm:rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[92vh] sm:max-h-[90vh] flex flex-col"
        >
          {/* Mobile Drag Indicator */}
          <div className="w-12 h-1.5 bg-stone-700/80 rounded-full mx-auto mt-2.5 mb-0.5 sm:hidden shrink-0" />
          
          {/* Header with Balance Card */}
          <div className="p-5 sm:p-6 bg-gradient-to-br from-amber-950/60 via-stone-950 to-stone-950 border-b border-stone-800 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-xl text-white">{t('wallet_modal_title', 'Food Credit Wallet')}</h2>
                  <p className="text-xs text-stone-400">{t('wallet_modal_subtitle', 'Pre-loaded dining credits & instant 1-click checkout')}</p>
                </div>
              </div>

              <button
                onClick={() => setIsWalletModalOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-white bg-stone-800/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Glowing Big Balance Display */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-amber-400/90 tracking-wider">{t('wallet_instant_balance', 'Available Credit Balance')}</span>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white mt-0.5">
                  €{balance.toFixed(2)} <span className="text-xs font-sans text-stone-400 font-medium">EUR</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5">
                <span className="text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> {t('wallet_bonus_badge', 'VIP Dining Privilege')}
                </span>
                <button
                  onClick={resetCredit}
                  className="text-[11px] text-stone-400 hover:text-amber-400 transition-colors flex items-center gap-1 mt-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset (€125)
                </button>
              </div>
            </div>
          </div>

          {/* Body: Top-Up Options & Transaction History */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Top-up Packages */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs uppercase font-bold text-stone-400 tracking-wider flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-amber-400" /> {t('wallet_select_pack', 'Choose Top-Up Package')}
                </h3>
                <span className="text-xs text-amber-400 font-medium">Instant balance credit</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PACKAGES.map((pkg) => {
                  const isSelected = !customAmount && selectedPkg?.id === pkg.id;

                  return (
                    <div
                      key={pkg.id}
                      onClick={() => {
                        setSelectedPkg(pkg);
                        setCustomAmount('');
                      }}
                      className={`relative p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500 shadow-lg shadow-amber-500/15'
                          : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      {pkg.isPopular && (
                        <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 text-[9px] font-black text-stone-950 uppercase tracking-wider shadow">
                          Most Popular
                        </span>
                      )}

                      <div>
                        <div className="text-xs font-semibold text-stone-400">{pkg.label}</div>
                        <div className="text-2xl font-mono font-bold text-white mt-1">
                          €{pkg.amount}
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-stone-800/80 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-emerald-400">
                          {pkg.tag}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Top-Up Amount */}
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="number"
                  placeholder={t('wallet_or_custom', 'Or Enter Custom Credit Amount (€)')}
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedPkg(null);
                  }}
                  className="flex-1 px-4 py-2.5 bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl text-sm text-white placeholder-stone-500 font-mono focus:outline-none"
                />
                <button
                  onClick={handleTopUp}
                  disabled={isProcessing || (!customAmount && !selectedPkg)}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-sm transition-all shadow-md"
                >
                  {isProcessing ? 'Processing...' : t('wallet_top_up_cta', 'Load Credits to Wallet')}
                </button>
              </div>
            </div>

            {/* Transactions History Ledger */}
            <div>
              <h3 className="text-xs uppercase font-bold text-stone-400 tracking-wider mb-3">
                {t('wallet_tx_history', 'Recent Credit Activity')}
              </h3>

              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {transactions.map((tx) => {
                  const isCredit = tx.type === 'credit';

                  return (
                    <div
                      key={tx.id}
                      className="p-3 rounded-2xl bg-stone-950/60 border border-stone-800/80 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            isCredit
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {isCredit ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>

                        <div>
                          <div className="font-bold text-white text-xs">{tx.title}</div>
                          <div className="text-[10px] text-stone-500">{tx.date} • {tx.source}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`font-mono font-bold text-sm ${
                            isCredit ? 'text-emerald-400' : 'text-stone-200'
                          }`}
                        >
                          {isCredit ? '+' : '-'}€{tx.amount.toFixed(2)}
                        </div>
                        <span className="text-[9px] text-stone-400">{tx.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              100% Guaranteed Balance Protection
            </span>
            <button
              onClick={() => setIsWalletModalOpen(false)}
              className="px-4 py-1.5 rounded-xl bg-stone-800 text-stone-200 hover:text-white"
            >
              Done
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}

