// Firebase Configuration and Initialization
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';
import { getFirestore, collection, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYFSVarEkULF8gPw1fQtrB2exfgHV8UL8",
  authDomain: "daily-5c591.firebaseapp.com",
  projectId: "daily-5c591",
  storageBucket: "daily-5c591.firebasestorage.app",
  messagingSenderId: "273753089132",
  appId: "1:273753089132:web:0ebe4fc073f5751d032449",
  measurementId: "G-4NBWGM7J5C"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore Database
export const db = getFirestore(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firebase Analytics
export let analytics = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
        console.log('✅ Google / Firebase Analytics initialized successfully:', firebaseConfig.measurementId);
      }
    })
    .catch((err) => {
      console.warn('Firebase Analytics is not supported in this environment:', err);
    });
}

/**
 * Log custom or e-commerce events to Firebase Analytics & Google Tag (gtag)
 * @param {string} eventName - Standard or custom event name (e.g., 'purchase', 'add_to_cart', 'login')
 * @param {object} eventParams - Event parameters
 */
export const logAnalyticsEvent = (eventName, eventParams = {}) => {
  try {
    // 1. Firebase Analytics SDK
    if (analytics) {
      logEvent(analytics, eventName, eventParams);
    }

    // 2. Global Google Tag gtag.js
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, eventParams);
    }
  } catch (error) {
    console.warn(`[Analytics] Failed to log event "${eventName}":`, error);
  }
};

/**
 * Sign In / Register with Google Account
 * @returns {Promise<{user: object | null, error: string | null}>}
 */
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Log login event in analytics
    logAnalyticsEvent('login', { method: 'google' });

    // Sync/Upsert user profile in Firestore 'users' collection
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
          uid: user.uid,
          displayName: user.displayName || '',
          email: user.email || '',
          photoURL: user.photoURL || '',
          lastLogin: serverTimestamp(),
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (dbErr) {
        console.warn('Could not upsert user to Firestore:', dbErr);
      }
    }

    return { user, error: null };
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    return { user: null, error: error.message };
  }
};

/**
 * Sign Out Current User
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    logAnalyticsEvent('logout');
    return { success: true };
  } catch (error) {
    console.error('Sign-Out Error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Save customer order details to Cloud Firestore ('orders' collection)
 * @param {object} orderData - Full customer & purchase details
 * @returns {Promise<{success: boolean, id?: string, error?: string}>}
 */
export const saveOrderToFirestore = async (orderData) => {
  try {
    const ordersCollection = collection(db, 'orders');
    
    // Sanitize order details for Firestore
    const orderPayload = {
      orderId: orderData.orderId,
      userId: orderData.userId || (auth.currentUser ? auth.currentUser.uid : null),
      customerName: orderData.customerName || (auth.currentUser ? auth.currentUser.displayName : 'Valued Guest'),
      customerPhone: orderData.phoneNumber || '',
      customerEmail: orderData.customerEmail || (auth.currentUser ? auth.currentUser.email : ''),
      userPhotoURL: auth.currentUser ? auth.currentUser.photoURL : null,
      deliveryAddress: orderData.deliveryAddress || '',
      deliveryType: orderData.deliveryType || 'standard',
      dropoffNotes: orderData.dropoffNotes || '',
      paymentMethod: orderData.paymentMethod || 'Credit Card',
      items: (orderData.items || []).map((item) => ({
        foodId: item.foodId || item.id,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice || item.basePrice || item.price,
        totalPrice: item.totalItemPrice || (item.price * item.quantity),
        category: item.category || 'general',
        addons: item.selectedAddons || [],
        specialInstructions: item.specialInstructions || ''
      })),
      subtotal: Number(orderData.subtotal || 0),
      discount: Number(orderData.discount || 0),
      appliedPromo: orderData.appliedPromo?.code || null,
      deliveryFee: Number(orderData.deliveryFee || 0),
      tax: Number(orderData.tax || 0),
      tip: Number(orderData.tip || 0),
      total: Number(orderData.total || 0),
      currency: 'EUR',
      orderStatus: 'placed',
      placedAt: orderData.placedAt || new Date().toLocaleTimeString(),
      estimatedArrival: orderData.estimatedArrival || '20-30 mins',
      clientTimestamp: new Date().toISOString(),
      createdAt: serverTimestamp(),
      deviceInfo: {
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        platform: typeof navigator !== 'undefined' ? navigator.platform : '',
        language: typeof navigator !== 'undefined' ? navigator.language : 'en'
      }
    };

    const docRef = await addDoc(ordersCollection, orderPayload);
    console.log('✅ Order successfully saved to Cloud Firestore with ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('❌ Error saving order to Firestore:', error);
    return { success: false, error: error.message };
  }
};
