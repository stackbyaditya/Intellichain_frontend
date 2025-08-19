import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { UnitSystem, Currency } from '@/lib/units';

interface SettingsContextType {
  unitSystem: UnitSystem;
  currency: Currency;
  theme: 'light' | 'dark';
  setUnitSystem: (system: UnitSystem) => void;
  setCurrency: (currency: Currency) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>(() => {
    try {
      return (localStorage.getItem('unitSystem') as UnitSystem) || 'metric';
    } catch (error) {
      console.error('Failed to read unitSystem from localStorage:', error);
      return 'metric';
    }
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    try {
      return (localStorage.getItem('currency') as Currency) || 'USD';
    } catch (error) {
      console.error('Failed to read currency from localStorage:', error);
      return 'USD';
    }
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    } catch (error) {
      console.error('Failed to read theme from localStorage:', error);
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('unitSystem', unitSystem);
    } catch (error) {
      console.error('Failed to write unitSystem to localStorage:', error);
    }
  }, [unitSystem]);

  useEffect(() => {
    try {
      localStorage.setItem('currency', currency);
    } catch (error) {
      console.error('Failed to write currency to localStorage:', error);
    }
  }, [currency]);

  useEffect(() => {
    try {
      localStorage.setItem('theme', theme);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
    } catch (error) {
      console.error('Failed to write theme to localStorage:', error);
    }
  }, [theme]);

  const value = {
    unitSystem,
    currency,
    theme,
    setUnitSystem,
    setCurrency,
    setTheme,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
