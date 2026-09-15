import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LANGUAGES, TRANSLATIONS } from '../translations/translations';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'steve_food_app_language_v1';

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguageState] = useState('en');

  // Load initial language from localStorage or browser settings
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY);
      if (savedLang && TRANSLATIONS[savedLang]) {
        setCurrentLanguageState(savedLang);
      } else {
        // Detect browser default language if matching
        const browserLang = navigator.language?.split('-')[0]?.toLowerCase();
        if (browserLang && TRANSLATIONS[browserLang]) {
          setCurrentLanguageState(browserLang);
        }
      }
    } catch (e) {
      console.warn('Unable to access localStorage for language setting', e);
    }
  }, []);

  const setLanguage = useCallback((langCode) => {
    if (TRANSLATIONS[langCode]) {
      setCurrentLanguageState(langCode);
      try {
        localStorage.setItem(STORAGE_KEY, langCode);
        document.documentElement.lang = langCode;
      } catch (e) {
        console.warn('Unable to persist language setting', e);
      }
    }
  }, []);

  // Translation lookup helper
  const t = useCallback((key, fallback = '') => {
    const dict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
    if (dict && dict[key] !== undefined) {
      return dict[key];
    }
    // Fallback to English
    if (TRANSLATIONS.en && TRANSLATIONS.en[key] !== undefined) {
      return TRANSLATIONS.en[key];
    }
    return fallback || key;
  }, [currentLanguage]);

  const currentLangObj = LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        currentLangObj,
        setLanguage,
        t,
        LANGUAGES
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

