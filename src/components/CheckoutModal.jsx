import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  User, 
  Mail
} from 'lucide-react';
import { useCart } from '../context/CartContext';
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

// Card brand detection helper
function detectCardBrand(number) {
  const clean = (number || '').replace(/\D/g, '');
  if (/^4/.test(clean)) {
    return { name: 'Visa', brand: 'visa', maxDigits: 16, cvvLength: 3, mask: '4-4-4-4', color: 'from-blue-900 via-indigo-950 to-stone-900' };
  }
  if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)/.test(clean)) {
    return { name: 'Mastercard', brand: 'mastercard', maxDigits: 16, cvvLength: 3, mask: '4-4-4-4', color: 'from-red-950 via-stone-900 to-amber-950' };
  }
  if (/^3[47]/.test(clean)) {
    return { name: 'American Express', brand: 'amex', maxDigits: 15, cvvLength: 4, mask: '4-6-5', color: 'from-slate-800 via-cyan-950 to-stone-900' };
  }
  if (/^(6011|65|64[4-9])/.test(clean)) {
    return { name: 'Discover', brand: 'discover', maxDigits: 16, cvvLength: 3, mask: '4-4-4-4', color: 'from-orange-950 via-stone-900 to-amber-900' };
  }
  return { name: 'Credit / Debit', brand: 'generic', maxDigits: 16, cvvLength: 3, mask: '4-4-4-4', color: 'from-stone-900 via-zinc-900 to-stone-950' };
}

// Luhn Algorithm Card Validator
function checkLuhn(cardNum) {
  const digits = (cardNum || '').replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits.charAt(i), 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

// Auto format card number with spaces
function formatCardNumber(value, brandInfo) {
  const digits = value.replace(/\D/g, '').slice(0, brandInfo.maxDigits);
  if (brandInfo.brand === 'amex') {
    const p1 = digits.substring(0, 4);
    const p2 = digits.substring(4, 10);
    const p3 = digits.substring(10, 15);
    return [p1, p2, p3].filter(Boolean).join(' ');
  }
  const parts = digits.match(/.{1,4}/g) || [];
  return parts.join(' ');
}

// Auto format expiry MM/YY
function formatExpiry(value) {
  const clean = value.replace(/\D/g, '').slice(0, 4);
  if (clean.length === 0) return '';
  if (clean.length === 1) {
    if (parseInt(clean, 10) > 1) return `0${clean}/`;
    return clean;
  }
  const month = clean.substring(0, 2);
  const year = clean.substring(2, 4);
  let mNum = parseInt(month, 10);
  if (mNum > 12) mNum = 12;
  if (mNum === 0) mNum = 1;
  const formattedMonth = mNum < 10 ? `0${mNum}` : `${mNum}`;
  return year ? `${formattedMonth}/${year}` : `${formattedMonth}/`;
}

// Validate Expiry Date
function validateExpiry(expiryStr) {
  if (!expiryStr || expiryStr.length < 5) return 'format';
  const [mmStr, yyStr] = expiryStr.split('/');
  const mm = parseInt(mmStr, 10);
  const yy = parseInt(yyStr, 10);
  if (isNaN(mm) || isNaN(yy) || mm < 1 || mm > 12) return 'format';
  
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
    return 'past';
  }
  return null;
}

export default function CheckoutModal({ isOpen, onClose, onOrderSuccess }) {
  const { items, subtotal, discount, deliveryFee, tax, tip, total, appliedPromo, deliveryAddress, setDeliveryAddress, deliveryType, clearCart } = useCart();
  const { addToast } = useToast();
  const { t } = useLanguage();
  const { user, loginWithGoogle } = useAuth();

  const [customerName, setCustomerName] = useState(user?.displayName || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'apple' | 'cash'
  const [phoneNumber, setPhoneNumber] = useState('+34 612 345 678');
  const [dropoffNotes, setDropoffNotes] = useState('Piso 2º 1ª, código portero #4012, dejar en la puerta');
  
  // Card Details State - Blank initially for client entry
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Field validation & touch states
  const [cardErrors, setCardErrors] = useState({ number: '', holder: '', expiry: '', cvv: '' });
  const [cardTouched, setCardTouched] = useState({ number: false, holder: false, expiry: false, cvv: false });

  // Update customer info automatically when user logs in with Google
  useEffect(() => {
    if (user) {
      if (user.displayName) setCustomerName(user.displayName);
      if (user.email) setCustomerEmail(user.email);
    }
  }, [user]);

  // Detected brand info based on entered number
  const brandInfo = detectCardBrand(cardNumber);

  // Real-time Card Validation Routine
  const validateCardField = (field, value) => {
    let error = '';
    const cleanDigits = (value || '').replace(/\D/g, '');

    if (field === 'number') {
      if (!cleanDigits) {
        error = t('card_err_number_required', 'Card number is required.');
      } else if (cleanDigits.length < (brandInfo.brand === 'amex' ? 15 : 15)) {
        error = t('card_err_number_short', 'Card number is incomplete. Please enter 15 or 16 digits.');
      } else if (!checkLuhn(cleanDigits)) {
        error = t('card_err_number_invalid', 'Invalid card number. Please check the digits on your card.');
      }
    } else if (field === 'holder') {
      const trimmed = (value || '').trim();
      if (!trimmed) {
        error = t('card_err_holder_required', 'Cardholder name is required.');
      } else if (trimmed.length < 2) {
        error = t('card_err_holder_short', 'Please enter the full cardholder name as printed on the card.');
      }
    } else if (field === 'expiry') {
      if (!value) {
        error = t('card_err_expiry_required', 'Expiration date is required (MM/YY).');
      } else {
        const expResult = validateExpiry(value);
        if (expResult === 'format') {
          error = t('card_err_expiry_format', 'Invalid date format. Use MM/YY (e.g. 08/28).');
        } else if (expResult === 'past') {
          error = t('card_err_expiry_past', 'This card has expired. Please use a valid card.');
        }
      }
    } else if (field === 'cvv') {
      if (!cleanDigits) {
        error = t('card_err_cvv_required', 'CVV security code is required.');
      } else if (cleanDigits.length < brandInfo.cvvLength) {
        error = t('card_err_cvv_invalid', `CVV must be ${brandInfo.cvvLength} digits.`);
      }
    }

    setCardErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  };

  // Card input handlers
  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value, detectCardBrand(e.target.value));
    setCardNumber(formatted);
    if (cardTouched.number) {
      validateCardField('number', formatted);
    }
  };

  const handleCardHolderChange = (e) => {
    const val = e.target.value;
    setCardHolder(val);
    if (cardTouched.holder) {
      validateCardField('holder', val);
    }
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value);
    setCardExpiry(formatted);
    if (cardTouched.expiry) {
      validateCardField('expiry', formatted);
    }
  };

  const handleCvvChange = (e) => {
    const clean = e.target.value.replace(/\D/g, '').slice(0, brandInfo.cvvLength);
    setCardCvv(clean);
    if (cardTouched.cvv) {
      validateCardField('cvv', clean);
    }
  };

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

    // 1. STRICT REQUIREMENT: User must be registered / logged in with Google to pay
    if (!user) {
      addToast(t('auth_login_required', 'Please sign in or register with Google to complete your payment.'), 'warning');
      setIsProcessing(true);
      const loggedInUser = await loginWithGoogle();
      setIsProcessing(false);
      if (!loggedInUser) {
        return; // Stopped because login was not completed
      }
    }

    // 2. STRICT CARD VALIDATION when paying with Credit/Debit Card
    if (paymentMethod === 'card') {
      setCardTouched({ number: true, holder: true, expiry: true, cvv: true });
      const numErr = validateCardField('number', cardNumber);
      const holderErr = validateCardField('holder', cardHolder);
      const expErr = validateCardField('expiry', cardExpiry);
      const cvvErr = validateCardField('cvv', cardCvv);

      if (numErr || holderErr || expErr || cvvErr) {
        const firstError = numErr || holderErr || expErr || cvvErr;
        addToast(firstError, 'error');
        return; // Block submission due to invalid card details
      }
    }


    // Simulate direct payment authorization
    await new Promise((res) => setTimeout(res, 900));

    const orderId = `ORD-${Date.now().toString().slice(-8)}`;
    const cleanDigits = cardNumber.replace(/\D/g, '');
    const last4 = cleanDigits ? cleanDigits.slice(-4) : '••••';

    const paymentMethodLabel = paymentMethod === 'card' 
      ? `${brandInfo.name} (••• ${last4}) - Cardholder: ${cardHolder.trim() || 'Client'}` 
      : paymentMethod === 'apple' 
      ? 'Apple Pay / Google Pay' 
      : 'Cash on Delivery';

    const orderDetails = {
      orderId,
      userId: user?.uid || null,
      userDisplayName: user?.displayName || customerName || 'Valued Customer',
      userEmail: user?.email || customerEmail || '',
      userPhotoURL: user?.photoURL || null,
      customerName: customerName.trim() || user?.displayName || 'Valued Customer',
      customerEmail: customerEmail.trim() || user?.email || '',
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
      paymentMethod: paymentMethodLabel,
      cardBrand: brandInfo.brand,
      cardholderName: cardHolder.trim(),
      cardLast4: last4,
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

        {/* Checkout Modal Window */}
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
              
              {/* STEP 1: Google Sign-in / Registration (MANDATORY GATE) */}
              {!user ? (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-500/10 border-2 border-amber-500/50 shadow-xl shadow-amber-500/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-extrabold text-amber-400 tracking-wider flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      {t('auth_step_account_required', '1. Account Sign-In (Required to Pay)')}
                    </span>
                    <span className="text-[10px] uppercase font-bold bg-amber-500 text-stone-950 px-2 py-0.5 rounded-full">
                      Mandatory
                    </span>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed">
                    {t('auth_checkout_prompt', 'Sign in or register with Google (Required to authorize final payment & track order)')}
                  </p>

                  <button
                    type="button"
                    onClick={loginWithGoogle}
                    className="w-full py-3 px-4 rounded-xl bg-white hover:bg-stone-100 active:scale-[0.99] text-stone-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-black/40 transition-all cursor-pointer border border-stone-200"
                  >
                    <GoogleIcon className="w-5 h-5" />
                    <span>{t('auth_sign_in_google', 'Continue with Google')}</span>
                  </button>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-stone-950/80 border border-emerald-500/40 flex items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-3 min-w-0">
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt="" 
                        className="w-9 h-9 rounded-full object-cover border-2 border-emerald-400 shrink-0 shadow" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 font-black flex items-center justify-center text-xs shrink-0 shadow">
                        {user.displayName?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-white truncate">
                        <span>{user.displayName || 'Food Lover'}</span>
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded font-bold border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> {t('auth_verified', 'Verified Account')}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-400 truncate">{user.email}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono font-bold hidden sm:inline-block">
                    Google Connected
                  </span>
                </div>
              )}

              {/* STEP 2: Customer & Delivery Information Section */}
              <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-stone-400 tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" /> {t('checkout_step1', '2. Customer & Delivery Information')}
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

              {/* STEP 3: Payment Method Selector */}
              <div className="space-y-3">
                <span className="text-xs uppercase font-bold text-stone-400 tracking-wider">
                  {t('checkout_step2', '3. Select Payment Method')}
                </span>

                {/* Option 1: Credit / Debit Card (Client Enters Card Details) */}
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
                        <div className="text-xs text-stone-400">Visa, Mastercard, Amex, Discover</div>
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
                      {/* Stylized 3D Card Preview reflecting client inputs */}
                      <div className="perspective-1000 flex justify-center my-2">
                        <motion.div
                          animate={{ rotateY: isCardFlipped ? 180 : 0 }}
                          transition={{ duration: 0.6 }}
                          className={`relative w-full max-w-[320px] h-48 rounded-2xl p-5 text-white shadow-2xl flex flex-col justify-between overflow-hidden bg-gradient-to-tr ${brandInfo.color}`}
                          style={{
                            transformStyle: 'preserve-3d',
                            border: '1px solid rgba(255, 255, 255, 0.15)'
                          }}
                        >
                          {!isCardFlipped ? (
                            // Front of Card
                            <>
                              <div className="flex items-center justify-between">
                                <span className="font-display text-[11px] tracking-widest text-amber-300 font-bold uppercase">
                                  STEVE FOOD GOURMET
                                </span>
                                <span className="font-mono font-black italic text-sm tracking-wider text-white bg-white/10 px-2 py-0.5 rounded border border-white/20">
                                  {brandInfo.name.toUpperCase()}
                                </span>
                              </div>

                              <div className="w-9 h-7 rounded-md bg-gradient-to-tr from-amber-400 to-amber-200 shadow-inner flex items-center justify-center my-1">
                                <div className="w-6 h-4 border border-amber-800/40 rounded-sm opacity-60" />
                              </div>

                              <div>
                                <div className="font-mono text-sm sm:text-base tracking-widest text-stone-100 font-bold drop-shadow">
                                  {cardNumber || '•••• •••• •••• ••••'}
                                </div>
                                <div className="flex justify-between items-end mt-2 text-[10px] text-stone-300">
                                  <div className="max-w-[190px] truncate">
                                    <div className="text-[8px] uppercase tracking-wider text-stone-400">Cardholder</div>
                                    <div className="font-semibold tracking-wide uppercase truncate">
                                      {cardHolder || 'FULL NAME ON CARD'}
                                    </div>
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

                      {/* Interactive Client Card Inputs */}
                      <div className="space-y-3 text-xs">
                        
                        {/* 1. Cardholder Name Input */}
                        <div>
                          <label className="block text-stone-300 font-medium mb-1">
                            {t('card_holder_label', 'Cardholder Name (as printed on card)')}
                          </label>
                          <input
                            type="text"
                            value={cardHolder}
                            onChange={handleCardHolderChange}
                            onBlur={() => {
                              setCardTouched((p) => ({ ...p, holder: true }));
                              validateCardField('holder', cardHolder);
                            }}
                            placeholder={t('card_holder_placeholder', 'e.g. MARIA GARCIA or JOHN SMITH')}
                            className={`w-full px-3 py-2 bg-stone-900 border rounded-xl text-white focus:outline-none transition-colors ${
                              cardTouched.holder && cardErrors.holder 
                                ? 'border-rose-500 focus:border-rose-400 bg-rose-950/20' 
                                : 'border-stone-800 focus:border-amber-500'
                            }`}
                          />
                          {cardTouched.holder && cardErrors.holder && (
                            <div className="flex items-center gap-1 text-[11px] text-rose-400 mt-1">
                              <AlertCircle className="w-3 h-3 shrink-0" />
                              <span>{cardErrors.holder}</span>
                            </div>
                          )}
                        </div>

                        {/* 2. Card Number Input */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-stone-300 font-medium">
                              {t('card_number_label', 'Card Number')}
                            </label>
                            {cardNumber && (
                              <span className="text-[10px] text-amber-400 font-semibold uppercase">
                                {brandInfo.name}
                              </span>
                            )}
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={handleCardNumberChange}
                              onBlur={() => {
                                setCardTouched((p) => ({ ...p, number: true }));
                                validateCardField('number', cardNumber);
                              }}
                              placeholder={t('card_number_placeholder', '4532 •••• •••• ••••')}
                              maxLength={19}
                              className={`w-full px-3 py-2 bg-stone-900 border rounded-xl text-white font-mono focus:outline-none transition-colors ${
                                cardTouched.number && cardErrors.number 
                                ? 'border-rose-500 focus:border-rose-400 bg-rose-950/20' 
                                : 'border-stone-800 focus:border-amber-500'
                              }`}
                            />
                            <CreditCard className="w-4 h-4 text-stone-500 absolute right-3 top-2.5" />
                          </div>
                          {cardTouched.number && cardErrors.number && (
                            <div className="flex items-center gap-1 text-[11px] text-rose-400 mt-1">
                              <AlertCircle className="w-3 h-3 shrink-0" />
                              <span>{cardErrors.number}</span>
                            </div>
                          )}
                        </div>

                        {/* 3. Expiry Date & CVV */}
                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-stone-300 font-medium mb-1">
                              {t('card_expiry_label', 'Exp Date')}
                            </label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={handleExpiryChange}
                              onBlur={() => {
                                setCardTouched((p) => ({ ...p, expiry: true }));
                                validateCardField('expiry', cardExpiry);
                              }}
                              placeholder="MM/YY"
                              maxLength={5}
                              className={`w-full px-3 py-2 bg-stone-900 border rounded-xl text-white font-mono text-center focus:outline-none transition-colors ${
                                cardTouched.expiry && cardErrors.expiry 
                                  ? 'border-rose-500 focus:border-rose-400 bg-rose-950/20' 
                                  : 'border-stone-800 focus:border-amber-500'
                              }`}
                            />
                            {cardTouched.expiry && cardErrors.expiry && (
                              <div className="flex items-center gap-1 text-[10px] text-rose-400 mt-1">
                                <AlertCircle className="w-3 h-3 shrink-0" />
                                <span>{cardErrors.expiry}</span>
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="block text-stone-300 font-medium mb-1">
                              {t('card_cvv_label', 'CVV')}
                            </label>
                            <input
                              type="password"
                              value={cardCvv}
                              onFocus={() => setIsCardFlipped(true)}
                              onBlur={() => {
                                setIsCardFlipped(false);
                                setCardTouched((p) => ({ ...p, cvv: true }));
                                validateCardField('cvv', cardCvv);
                              }}
                              onChange={handleCvvChange}
                              maxLength={brandInfo.cvvLength}
                              placeholder={brandInfo.brand === 'amex' ? '1234' : '123'}
                              className={`w-full px-3 py-2 bg-stone-900 border rounded-xl text-white font-mono text-center focus:outline-none transition-colors ${
                                cardTouched.cvv && cardErrors.cvv 
                                  ? 'border-rose-500 focus:border-rose-400 bg-rose-950/20' 
                                  : 'border-stone-800 focus:border-amber-500'
                              }`}
                            />
                            {cardTouched.cvv && cardErrors.cvv && (
                              <div className="flex items-center gap-1 text-[10px] text-rose-400 mt-1">
                                <AlertCircle className="w-3 h-3 shrink-0" />
                                <span>{cardErrors.cvv}</span>
                              </div>
                            )}
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Option 2: Apple Pay / Google Pay */}
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

                {/* Option 3: Cash on Delivery */}
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

            {/* Right Column: Order Summary & Final Payment Trigger */}
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

              {/* Complete Final Payment / Required Auth Action Button */}
              <div className="space-y-2.5 pt-2">
                {!user ? (
                  /* When NOT logged in: Direct Google Registration / Login CTA Button is REQUIRED */
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isProcessing}
                    onClick={async () => {
                      setIsProcessing(true);
                      const loggedIn = await loginWithGoogle();
                      setIsProcessing(false);
                      if (loggedIn) {
                        addToast(t('auth_ready_to_pay', 'Account verified! You can now complete your payment.'), 'success');
                      }
                    }}
                    className="w-full py-4 rounded-2xl bg-white hover:bg-stone-100 text-stone-950 font-black text-sm sm:text-base shadow-xl shadow-white/10 flex items-center justify-center gap-2.5 transition-all cursor-pointer border border-stone-200"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                        <span>Connecting to Google...</span>
                      </div>
                    ) : (
                      <>
                        <GoogleIcon className="w-5 h-5" />
                        <span>{t('auth_login_to_pay', 'Sign in with Google to Pay')} • €{total.toFixed(2)}</span>
                      </>
                    )}
                  </motion.button>
                ) : (
                  /* When LOGGED IN: Authorized Final Payment Button */
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isProcessing}
                    onClick={handlePlaceOrder}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 disabled:opacity-50 text-stone-950 font-black text-base shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                        <span>Authorizing Payment...</span>
                      </div>
                    ) : paymentMethod === 'card' ? (
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        <span>Pay with Credit Card • €{total.toFixed(2)}</span>
                      </div>
                    ) : paymentMethod === 'apple' ? (
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-5 h-5" />
                        <span>Pay with Apple / Google Pay • €{total.toFixed(2)}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Banknote className="w-5 h-5" />
                        <span>Confirm Cash Order • €{total.toFixed(2)}</span>
                      </div>
                    )}
                  </motion.button>
                )}

                <p className="text-[10px] text-stone-400 text-center flex items-center justify-center gap-1.5 px-2">
                  {!user ? (
                    <>
                      <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{t('auth_account_required_note', 'Google login or registration is required for final payment authorization.')}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Instant order confirmation & live tracking dispatched to kitchen</span>
                    </>
                  )}
                </p>
              </div>

            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
