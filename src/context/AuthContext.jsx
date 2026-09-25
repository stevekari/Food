import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, loginWithGoogle, logoutUser } from '../firebase';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const { user: loggedInUser, error } = await loginWithGoogle();
      if (error) {
        // Handle common popup closed or cancellation without error banner spam
        if (error.includes('popup-closed-by-user')) {
          return null;
        }
        addToast(`Google Sign-In failed: ${error}`, 'error');
        return null;
      }
      if (loggedInUser) {
        addToast(`Welcome back, ${loggedInUser.displayName || 'Foodie'}! 👋`, 'success');
        return loggedInUser;
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to sign in with Google. Please try again.', 'error');
    }
    return null;
  };

  const handleLogout = async () => {
    const { success, error } = await logoutUser();
    if (success) {
      addToast('Signed out successfully', 'info');
    } else if (error) {
      addToast(`Error signing out: ${error}`, 'error');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        loginWithGoogle: handleGoogleLogin,
        logout: handleLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
