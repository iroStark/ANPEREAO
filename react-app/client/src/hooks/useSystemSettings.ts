import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'auto';
export type Language = 'pt' | 'en' | 'es';

export interface SystemSettings {
  theme: Theme;
  language: Language;
  notifications: boolean;
  compactMode: boolean;
  autoSave: boolean;
  dateFormat: 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy-mm-dd';
  timeFormat: '12h' | '24h';
}

const DEFAULT_SETTINGS: SystemSettings = {
  theme: 'auto',
  language: 'pt',
  notifications: true,
  compactMode: false,
  autoSave: true,
  dateFormat: 'dd/mm/yyyy',
  timeFormat: '24h',
};

const STORAGE_KEY = 'anpere-system-settings';

export const useSystemSettings = () => {
  const [settings, setSettings] = useState<SystemSettings>(() => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    
    return DEFAULT_SETTINGS;
  });

  // Aplicar tema quando mudar
  useEffect(() => {
    const root = document.documentElement;
    
    if (settings.theme === 'dark' || (settings.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  // Listener para mudanças no sistema (quando theme é 'auto')
  useEffect(() => {
    if (settings.theme !== 'auto') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const root = document.documentElement;
      if (mediaQuery.matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.theme]);

  const updateSetting = <K extends keyof SystemSettings>(
    key: K,
    value: SystemSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error resetting settings:', error);
    }
  };

  return {
    settings,
    updateSetting,
    resetSettings,
  };
};

