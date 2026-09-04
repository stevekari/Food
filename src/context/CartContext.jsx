import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { PROMO_CODES } from '../data/foodData';

const CartContext = createContext();
const CART_STORAGE_KEY = 'cravecraft_cart_items_v1';

export function CartProvider({ children }) {
  const { addToast } = useToast();

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoInput, setPromoInput] = useState('');
  const [tip, setTip] = useState(3.00);
  const [deliveryType, setDeliveryType] = useState('standard'); // 'standard' | 'priority'
  const [deliveryAddress, setDeliveryAddress] = useState('742 Evergreen Terrace, Apt 4B');

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (foodItem, quantity = 1, selectedAddons = [], specialInstructions = '') => {
    const addonsKey = selectedAddons.map(a => a.id).sort().join('-');
    const cartItemId = `${foodItem.id}_${addonsKey}_${specialInstructions ? encodeURIComponent(specialInstructions) : 'none'}`;

    const addonsCost = selectedAddons.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = foodItem.price + addonsCost;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.cartItemId === cartItemId);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        updated[existingIndex].totalItemPrice = +(updated[existingIndex].quantity * unitPrice).toFixed(2);
        return updated;
      } else {
        const newItem = {
          cartItemId,
          foodId: foodItem.id,
          name: foodItem.name,
          basePrice: foodItem.price,
          unitPrice: unitPrice,
          totalItemPrice: +(unitPrice * quantity).toFixed(2),
          image: foodItem.image,
          category: foodItem.category,
          quantity,
          selectedAddons,
          specialInstructions
        };
        return [...prevItems, newItem];
      }
    });

    addToast(`Added ${quantity}x "${foodItem.name}" to cart!`, 'success');
  };

  const updateQuantity = (cartItemId, delta) => {
    setItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalItemPrice: +(item.unitPrice * newQty).toFixed(2)
            };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeItem = (cartItemId) => {
    const itemToRemove = items.find((i) => i.cartItemId === cartItemId);
    setItems((prevItems) => prevItems.filter((item) => item.cartItemId !== cartItemId));
    if (itemToRemove) {
      addToast(`Removed "${itemToRemove.name}" from cart`, 'info');
    }
  };

  const clearCart = () => {
    setItems([]);
    setAppliedPromo(null);
  };

  const applyPromoCode = (codeToApply) => {
    const cleanCode = (codeToApply || promoInput).trim().toUpperCase();
    if (!cleanCode) return;

    const promo = PROMO_CODES[cleanCode];
    if (!promo) {
      addToast(`Invalid promo code "${cleanCode}". Try STEVE20 or FREEDEL!`, 'error');
      return false;
    }

    if (promo.minSpend && subtotal < promo.minSpend) {
      addToast(`Promo code "${cleanCode}" requires minimum spend of $${promo.minSpend.toFixed(2)}`, 'error');
      return false;
    }

    setAppliedPromo({ code: cleanCode, ...promo });
    addToast(`Promo code "${cleanCode}" applied! ${promo.description}`, 'success');
    return true;
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoInput('');
    addToast('Promo code removed', 'info');
  };

  // Pricing calculations
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = +items.reduce((sum, item) => sum + item.totalItemPrice, 0).toFixed(2);

  // Discount calculation
  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPercent) {
      discount = +(subtotal * (appliedPromo.discountPercent / 100)).toFixed(2);
    } else if (appliedPromo.discountAmount) {
      discount = +Math.min(subtotal, appliedPromo.discountAmount).toFixed(2);
    }
  }

  // Base delivery fee
  const isFreeDeliveryEligible = subtotal >= 45 || (appliedPromo && appliedPromo.freeDelivery);
  const baseDeliveryFee = deliveryType === 'priority' ? 4.99 : 2.99;
  const deliveryFee = isFreeDeliveryEligible ? (deliveryType === 'priority' ? 2.00 : 0) : baseDeliveryFee;

  const discountedSubtotal = Math.max(0, subtotal - discount);
  const tax = +(discountedSubtotal * 0.0825).toFixed(2);
  const total = +(discountedSubtotal + deliveryFee + tax + (items.length > 0 ? tip : 0)).toFixed(2);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
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
        deliveryAddress,
        setDeliveryAddress,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        promoInput,
        setPromoInput,
        isFreeDeliveryEligible
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

