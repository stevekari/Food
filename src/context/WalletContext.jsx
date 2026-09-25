import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const WalletContext = createContext();

const INITIAL_BALANCE = 125.00;
const STORAGE_KEY = 'cravecraft_wallet_balance_v1';
const HISTORY_KEY = 'cravecraft_wallet_history_v1';

export function WalletProvider({ children }) {
  const { addToast } = useToast();

  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved !== null ? parseFloat(saved) : INITIAL_BALANCE;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'tx_init_1',
        type: 'credit',
        title: 'Welcome Gourmet Food Credit',
        amount: INITIAL_BALANCE,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: 'Completed',
        source: 'Promo Gift'
      }
    ];
  });

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const topUp = (amount, bonus = 0, sourceName = 'Debit Card') => {
    const totalAdded = amount + bonus;
    setBalance((prev) => +(prev + totalAdded).toFixed(2));

    const newTx = {
      id: `tx_${Date.now()}`,
      type: 'credit',
      title: bonus > 0 ? `Credit Top-Up (+€${bonus} Bonus)` : 'Credit Top-Up',
      amount: totalAdded,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'Completed',
      source: sourceName
    };

    setTransactions((prev) => [newTx, ...prev]);
    addToast(`Successfully added €${totalAdded.toFixed(2)} to your Credit Wallet!`, 'credit');
  };

  const deductCredit = (amount, orderId) => {
    if (balance < amount) {
      addToast(`Insufficient credit balance. You have €${balance.toFixed(2)}, need €${amount.toFixed(2)}`, 'error');
      return false;
    }

    setBalance((prev) => +(prev - amount).toFixed(2));

    const newTx = {
      id: `tx_${Date.now()}`,
      type: 'debit',
      title: `Food Order #${orderId.slice(-6)}`,
      amount: amount,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'Completed',
      source: 'STEVE FOOD Checkout'
    };

    setTransactions((prev) => [newTx, ...prev]);
    return true;
  };

  const canAfford = (amount) => {
    return balance >= amount;
  };

  const resetCredit = () => {
    setBalance(INITIAL_BALANCE);
    addToast('Credit balance reset to €125.00', 'info');
  };

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        topUp,
        deductCredit,
        canAfford,
        resetCredit,
        isWalletModalOpen,
        setIsWalletModalOpen
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);

