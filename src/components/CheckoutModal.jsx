import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Wallet, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  MapPin, 
  Phone, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  PlusCircle,
  Lock,
  ChevronRight,
  User,
  Mail
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { saveOrderToFirestore, logAnalyticsEvent } from '../firebase';

function GoogleIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function CheckoutModal({ isOpen, onClose, onOrderSuccess }) {
  const { items, subtotal, discount, deliveryFee, tax, tip, total, appliedPromo, deliveryAddress, setDeliveryAddress, deliveryType, clearCart } = useCart();
  const { balance, deductCredit, setIsWalletModalOpen } = useWallet();
  const { addToast } = useToast();
  const { t } = useLanguage();
  const { user, loginWithGoogle } = useAuth();

  const [customerName, setCustomerName] = useState(user?.displayName || 'Stephen Karikari');
  const [customerEmail, setCustomerEmail] = useState(user?.email || 'stephen@example.com');
  const [paymentMethod, setPaymentMethod] = useState('wallet'); // 'wallet' | 'card' | 'apple' | 'cash'
  const [phoneNumber, setPhoneNumber] = useState('+34 612 345 678');
  const [dropoffNotes, setDropoffNotes] = useState('Piso 2º 1ª, código portero #4012, dejar en la puerta');
  
  // Update customer info automatically when user logs in with Google
  useEffect(() => {
    if (user) {
      if (user.displayName) setCustomerName(user.displayName);
      if (user.email) setCustomerEmail(user.email);
    }
  }, [user]);

  // Card Details State for 3D Card Simulation
  const [cardNumber, setCardNumber] = useState('4532 8920 1142 6790');
  const [cardHolder, setCardHolder] = useState(user?.displayName?.toUpperCase() || 'STEPHEN KARIKARI');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('883');
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Log begin_checkout event when Checkout modal is opened
  useEffect(() => {
    if (isOpen && items.length > 0) {
      logAnalyticsEvent('begin_checkout', {
        currency: 'EUR',
        value: total,
        items_count: items.length,
        items: items.map((i) => ({
          item_id: i.foodId || i.id,
          item_name: i.name,
          price: i.unitPrice,
          quantity: i.quantity
        }))
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      addToast('Your cart is empty', 'error');
      return;
    }

    setIsProcessing(true);

    // Simulate processing latency for realism
    await new Promise((res) => setTimeout(res, 900));

    const orderId = `ORD-${Date.now().toString().slice(-8)}`;

    if (paymentMethod === 'wallet') {
      const success = deductCredit(total, orderId);
      if (!success) {
        setIsProcessing(false);
        return;
      }
    }

    const orderDetails = {
      orderId,
      customerName: customerName.trim() || 'Valued Customer',
      customerEmail: customerEmail.trim() || 'guest@stevefood.com',
      items: [...items],
      subtotal,
      discount,
      deliveryFee,
      tax,
      tip,
      total,
      appliedPromo,
      deliveryAddress,
      deliveryType,
      phoneNumber,
      dropoffNotes,
      paymentMethod: paymentMethod === 'wallet' ? 'Food Credit Wallet' : paymentMethod === 'card' ? 'Credit Card (••• 6790)' : paymentMethod === 'apple' ? 'Apple Pay' : 'Cash on Delivery',
      placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedArrival: deliveryType === 'priority' ? '15-20 mins' : '25-35 mins'
    };

    // 1. Save customer and order details to Google Firebase Cloud Firestore
    saveOrderToFirestore(orderDetails)
      .then((res) => {
        if (res.success) {
          console.log(`Order ${orderId} synced to Firebase Firestore database.`);
        }
      })
      .catch((err) => console.warn('Firestore order sync:', err));

    // 2. Log e-commerce purchase event in Firebase Analytics & Google Analytics
    logAnalyticsEvent('purchase', {
      transaction_id: orderId,
      value: total,
      currency: 'EUR',
      tax: tax,
      shipping: deliveryFee,
      coupon: appliedPromo?.code || '',
      customer_name: orderDetails.customerName,
      customer_email: orderDetails.customerEmail,
      payment_type: orderDetails.paymentMethod,
      items: items.map((i) => ({
        item_id: i.foodId || i.id,
        item_name: i.name,
        price: i.unitPrice,
        quantity: i.quantity,
        item_category: i.category
      }))
    });

    setIsProcessing(false);
    clearCart();
    onClose();
    onOrderSuccess(orderDetails);
  };

  const remainingBalanceAfterOrder = +(balance - total).toFixed(2);
  const hasEnoughCredit = balance >= total;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/85 backdrop-blur-md"
        />

        {/* Checkout Modal / Bottom Sheet Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 40 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-stone-900 border-t sm:border border-stone-800 rounded-t-[32px] sm:rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[94vh] sm:max-h-[92vh] flex flex-col"
        >
          {/* Mobile Drag Indicator */}
          <div className="w-12 h-1.5 bg-stone-700/80 rounded-full mx-auto mt-2.5 mb-0.5 sm:hidden shrink-0" />
          
          {/* Top Bar */}
          <div className="p-4 sm:p-6 border-b border-stone-800 bg-stone-950/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-stone-950">
                <Lock className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-white">{t('checkout_title', 'Express Checkout')}</h2>
                <div className="flex items-center gap-2 text-xs text-stone-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t('checkout_subtitle', '256-Bit Encrypted & Verified')}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white bg-stone-800/80 hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Columns */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Delivery & Payment Options */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Google Sign-in Banner / Verified User Status Card */}
              {!user ? (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-amber-500/5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-md">
                      <GoogleIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{t('auth_sign_in_google', 'Sign in with Google')}</span>
                        <span className="text-[10px] bg-amber-500/30 text-amber-300 px-1.5 py-0.2 rounded font-semibold">1-Tap</span>
                      </div>
                      <div className="text-[11px] text-stone-300 leading-tight">
                        {t('auth_checkout_prompt', 'Sign in to save your Spain delivery address & sync orders live')}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={loginWithGoogle}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow transition-all active:scale-95 shrink-0 cursor-pointer"
                  >
                    <GoogleIcon className="w-4 h-4" />
                    <span>{t('auth_sign_in_google', 'Continue with Google')}</span>
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-stone-950/80 border border-emerald-500/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt="" 
                        className="w-8 h-8 rounded-full object-cover border border-emerald-400 shrink-0 shadow" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 font-bold flex items-center justify-center text-xs shrink-0 shadow">
                        {user.displayName?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-white truncate">
                        <span>{user.displayName || 'Food Lover'}</span>
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded font-medium border border-emerald-500/20">
                          <ShieldCheck className="w-3 h-3" /> {t('auth_verified', 'Verified')}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-400 truncate">{user.email}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono hidden sm:inline-block">Google Synced</span>
                </div>
              )}

              {/* Customer & Delivery Information Section */}
              <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-stone-400 tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" /> {t('checkout_step1', '1. Customer & Delivery Information')}
                  </span>
                  <span className="text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                    {deliveryType === 'priority' ? 'Priority Express (15-20 min)' : 'Standard (25-35 min)'}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {/* Customer Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder={t('checkout_name_label', 'Your Full Name')}
                        className="w-full pl-9 pr-3 py-2 bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none"
                      />
                      <User className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-3" />
                    </div>
                    <div className="relative">
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder={t('checkout_email_label', 'Email Address')}
                        className="w-full pl-9 pr-3 py-2 bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none"
                      />
                      <Mail className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-3" />
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder={t('checkout_street_placeholder', 'Street Address, Apt / Suite')}
                    className="w-full px-3.5 py-2.5 bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none"
                  />

                  {/* Phone & Dropoff Notes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder={t('checkout_phone_label', 'Contact Phone')}
                      className="w-full px-3.5 py-2 bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={dropoffNotes}
                      onChange={(e) => setDropoffNotes(e.target.value)}
                      placeholder={t('checkout_dropoff_label', 'Dropoff instructions')}
                      className="w-full px-3.5 py-2 bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <span className="text-xs uppercase font-bold text-stone-400 tracking-wider">
                  {t('checkout_step2', '2. Select Payment Method')}
                </span>

                {/* Option 1: FOOD CREDIT WALLET (Recommended) */}
                <div
                  onClick={() => setPaymentMethod('wallet')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                    paymentMethod === 'wallet'
                      ? 'bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 border-amber-500 shadow-lg shadow-amber-500/10'
                      : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        paymentMethod === 'wallet' ? 'border-amber-400 bg-amber-400 text-stone-950' : 'border-stone-600'
                      }`}>
                        {paymentMethod === 'wallet' && <div className="w-2 h-2 rounded-full bg-stone-950" />}
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                          <Wallet className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white flex items-center gap-2">
                            {t('checkout_pay_wallet', 'Food Credit Balance')}
                            <span className="text-[10px] bg-amber-500 text-stone-950 px-1.5 py-0.5 rounded font-black tracking-wide">
                              FASTEST
                            </span>
                          </div>
                          <div className="text-xs text-stone-400">
                            {t('checkout_available_bal', 'Available Credit:')} <strong className="text-amber-400 font-mono">€{balance.toFixed(2)}</strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    <span className="font-mono text-sm font-extrabold text-amber-400">
                      €{balance.toFixed(2)}
                    </span>
                  </div>

                  {/* Credit Status Banner when selected */}
                  {paymentMethod === 'wallet' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 pt-3 border-t border-amber-500/20 flex items-center justify-between text-xs"
                    >
                      {hasEnoughCredit ? (
                        <div className="flex items-center gap-2 text-emerald-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <span>
                            {t('checkout_sufficient_bal', 'Instant 1-tap checkout. No bank confirmation required.')}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full text-rose-300">
                          <div className="flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                            <span>Short by €{(total - balance).toFixed(2)}</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsWalletModalOpen(true);
                            }}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg font-bold text-xs flex items-center gap-1 shadow"
                          >
                            <PlusCircle className="w-3.5 h-3.5" /> {t('checkout_top_up_btn', 'Top Up Credit')}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Option 2: Credit / Debit Card (Interactive 3D Flipping Card) */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                    paymentMethod === 'card'
                      ? 'bg-stone-950/90 border-amber-500 shadow-lg shadow-amber-500/10'
                      : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      paymentMethod === 'card' ? 'border-amber-400 bg-amber-400 text-stone-950' : 'border-stone-600'
                    }`}>
                      {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-stone-950" />}
                    </div>

                    <div className="flex items-center gap-2 flex-1">
                      <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{t('checkout_pay_card', 'Credit / Debit Card')}</div>
                        <div className="text-xs text-stone-400">Visa, Mastercard, Amex</div>
                      </div>
                    </div>
                  </div>

                  {/* Card Form & 3D Visual Card when selected */}
                  {paymentMethod === 'card' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 space-y-4 pt-3 border-t border-stone-800"
                    >
                      {/* Stylized 3D Card Preview */}
                      <div className="perspective-1000 flex justify-center my-2">
                        <motion.div
                          animate={{ rotateY: isCardFlipped ? 180 : 0 }}
                          transition={{ duration: 0.6 }}
                          className="relative w-full max-w-[320px] h-48 rounded-2xl p-5 text-white shadow-2xl flex flex-col justify-between overflow-hidden"
                          style={{
                            transformStyle: 'preserve-3d',
                            background: 'linear-gradient(135deg, #1e1b4b 0%, #311042 50%, #431407 100%)',
                            border: '1px solid rgba(255, 255, 255, 0.15)'
                          }}
                        >
                          {!isCardFlipped ? (
                            // Front of Card
                            <>
                              <div className="flex items-center justify-between">
                                <span className="font-display text-xs tracking-widest text-amber-300 font-bold uppercase">
                                  STEVE FOOD VIP
                                </span>
                                <span className="font-mono font-black italic text-base text-stone-200">
                                  VISA
                                </span>
                              </div>

                              <div className="w-9 h-7 rounded-md bg-gradient-to-tr from-amber-400 to-amber-200 shadow-inner flex items-center justify-center my-1">
                                <div className="w-6 h-4 border border-amber-800/40 rounded-sm opacity-60" />
                              </div>

                              <div>
                                <div className="font-mono text-sm tracking-widest text-stone-100 font-bold">
                                  {cardNumber || '•••• •••• •••• ••••'}
                                </div>
                                <div className="flex justify-between items-end mt-2 text-[10px] text-stone-300">
                                  <div>
                                    <div className="text-[8px] uppercase tracking-wider text-stone-400">Cardholder</div>
                                    <div className="font-semibold tracking-wide uppercase">{cardHolder || 'YOUR NAME'}</div>
                                  </div>
                                  <div>
                                    <div className="text-[8px] uppercase tracking-wider text-stone-400">Expires</div>
                                    <div className="font-mono font-semibold">{cardExpiry || 'MM/YY'}</div>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            // Back of Card
                            <div style={{ transform: 'rotateY(180deg)' }} className="h-full flex flex-col justify-between">
                              <div className="w-full h-8 bg-black/80 -mx-5 mt-2" />
                              <div className="flex items-center justify-end gap-2 bg-stone-200 text-stone-900 px-3 py-1.5 rounded text-xs font-mono font-bold">
                                <span>CVV:</span>
                                <span>{cardCvv || '•••'}</span>
                              </div>
                              <div className="text-[9px] text-stone-400 text-center">
                                Authorized Signature • 256-bit Secure
                              </div>
                            </div>
                          )}
                        </motion.div>
                      </div>

                      {/* Inputs */}
                      <div className="space-y-2.5 text-xs">
                        <div>
                          <label className="block text-stone-400 mb-1">Card Number</label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            maxLength={19}
                            className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-white font-mono focus:border-amber-500 focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-stone-400 mb-1">Cardholder Name</label>
                            <input
                              type="text"
                              value={cardHolder}
                              onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                              className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-stone-400 mb-1">Exp Date</label>
                              <input
                                type="text"
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                                placeholder="MM/YY"
                                maxLength={5}
                                className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-white font-mono focus:border-amber-500 focus:outline-none text-center"
                              />
                            </div>
                            <div>
                              <label className="block text-stone-400 mb-1">CVV</label>
                              <input
                                type="password"
                                value={cardCvv}
                                onFocus={() => setIsCardFlipped(true)}
                                onBlur={() => setIsCardFlipped(false)}
                                onChange={(e) => setCardCvv(e.target.value)}
                                maxLength={4}
                                className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-white font-mono focus:border-amber-500 focus:outline-none text-center"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Option 3: Apple Pay / Google Pay */}
                <div
                  onClick={() => setPaymentMethod('apple')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center justify-between ${
                    paymentMethod === 'apple'
                      ? 'bg-stone-950/90 border-amber-500'
                      : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      paymentMethod === 'apple' ? 'border-amber-400 bg-amber-400 text-stone-950' : 'border-stone-600'
                    }`}>
                      {paymentMethod === 'apple' && <div className="w-2 h-2 rounded-full bg-stone-950" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-white">{t('checkout_pay_apple', 'Apple Pay / Google Pay')}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-stone-400">1-Touch Pay</span>
                </div>

                {/* Option 4: Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center justify-between ${
                    paymentMethod === 'cash'
                      ? 'bg-stone-950/90 border-amber-500'
                      : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      paymentMethod === 'cash' ? 'border-amber-400 bg-amber-400 text-stone-950' : 'border-stone-600'
                    }`}>
                      {paymentMethod === 'cash' && <div className="w-2 h-2 rounded-full bg-stone-950" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Banknote className="w-4 h-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-white">{t('checkout_pay_cash', 'Cash on Delivery')}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-stone-400">Pay Courier in Person</span>
                </div>

              </div>

            </div>

            {/* Right Column: Order Summary & Placement */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-stone-950/70 p-5 rounded-2xl border border-stone-800 space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-300 pb-3 border-b border-stone-800">
                  {t('checkout_order_summary', 'Order Summary')} ({items.length} dishes)
                </h3>

                {/* Items Mini List */}
                <div className="mt-3 space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.cartItemId} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span className="w-5 h-5 rounded bg-stone-800 text-stone-300 font-mono font-bold flex items-center justify-center text-[10px]">
                          {item.quantity}x
                        </span>
                        <span className="text-stone-200 truncate">{item.name}</span>
                      </div>
                      <span className="font-mono font-semibold text-stone-300 flex-shrink-0">
                        €{item.totalItemPrice.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pricing Summary */}
                <div className="mt-4 pt-3 border-t border-stone-800 space-y-1.5 text-xs text-stone-400">
                  <div className="flex justify-between">
                    <span>{t('cart_subtotal', 'Subtotal')}</span>
                    <span className="font-mono text-stone-200">€{subtotal.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-medium">
                      <span>{t('cart_discount', 'Promo Discount')} ({appliedPromo?.code})</span>
                      <span className="font-mono">-€{discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>{t('cart_delivery_fee', 'Delivery')}</span>
                    <span className="font-mono text-stone-200">{deliveryFee === 0 ? t('cart_free_delivery', 'FREE') : `€${deliveryFee.toFixed(2)}`}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>{t('cart_tax', 'Tax (8.25%)')}</span>
                    <span className="font-mono text-stone-200">€{tax.toFixed(2)}</span>
                  </div>

                  {tip > 0 && (
                    <div className="flex justify-between">
                      <span>{t('cart_tip', 'Driver Tip')}</span>
                      <span className="font-mono text-stone-200">€{tip.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-stone-800 flex justify-between items-baseline text-white">
                    <span className="font-bold text-sm">{t('cart_total', 'Grand Total')}</span>
                    <span className="font-mono font-black text-2xl text-amber-400">
                      €{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Complete Order Button */}
              <div className="space-y-2 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isProcessing || (paymentMethod === 'wallet' && !hasEnoughCredit)}
                  onClick={handlePlaceOrder}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 disabled:opacity-50 text-stone-950 font-black text-base shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                      <span>Authorizing Payment...</span>
                    </div>
                  ) : paymentMethod === 'wallet' ? (
                    hasEnoughCredit ? (
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        <span>Pay with Food Credit • €{total.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span>Insufficient Credits</span>
                    )
                  ) : (
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      <span>{t('checkout_place_order_btn', 'Place Order')} • €{total.toFixed(2)}</span>
                    </div>
                  )}
                </motion.button>

                <p className="text-[10px] text-stone-500 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Instant order confirmation & live tracking dispatched to kitchen
                </p>
              </div>

            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}

