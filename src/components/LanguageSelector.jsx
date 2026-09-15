import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSelector({ isMobile = false }) {
  const { currentLanguage, currentLangObj, setLanguage, t, LANGUAGES } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (code) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${isMobile ? 'w-full block' : 'inline-block'} text-left`} ref={dropdownRef}>
      
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
          isOpen
            ? 'bg-stone-850 border-amber-400 text-white'
            : 'bg-stone-900/90 hover:bg-stone-850 border-stone-800 hover:border-amber-500/40 text-stone-300 hover:text-white'
        } ${isMobile ? 'w-full justify-between py-2 text-xs' : 'text-xs shadow-sm'}`}
        aria-label="Select language"
      >
        <div className="flex items-center gap-1.5">
          <span className="text-sm leading-none">{currentLangObj.flag}</span>
          <span className="font-bold tracking-wider uppercase font-mono">
            {currentLangObj.code}
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-amber-400' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: isMobile ? 5 : 8 }}
            animate={{ opacity: 1, scale: 1, y: isMobile ? 5 : 8 }}
            exit={{ opacity: 0, scale: 0.95, y: isMobile ? 5 : 8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={`absolute z-50 mt-1 ${
              isMobile ? 'left-0 right-0' : 'right-0 w-52'
            } rounded-2xl bg-stone-900/98 backdrop-blur-2xl border border-stone-800 shadow-2xl shadow-black/80 py-2 overflow-hidden`}
          >
            <div className="px-3.5 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-800/80 mb-1 flex items-center justify-between">
              <span>{t('lang_select_title', 'Select Language')}</span>
              <Globe className="w-3 h-3 text-amber-400" />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-0.5 px-1.5">
              {LANGUAGES.map((lang) => {
                const isSelected = currentLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                        : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base leading-none">{lang.flag}</span>
                      <div className="flex flex-col text-left">
                        <span className="leading-tight">{lang.nativeName}</span>
                        <span
                          className={`text-[9px] ${
                            isSelected ? 'text-stone-900 font-medium' : 'text-stone-500'
                          }`}
                        >
                          {lang.name}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-stone-950 stroke-[3]" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

