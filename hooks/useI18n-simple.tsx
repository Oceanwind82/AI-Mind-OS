'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { SUPPORTED_LANGUAGES, detectUserLanguage, setUserLanguage, type SupportedLanguage } from '../lib/i18n';

// Simplified translations for now - just the essentials
const translations = {
  en: {
    'nav.home': 'Home',
    'nav.lessons': 'Lessons', 
    'nav.certification': 'Certification',
    'nav.pricing': 'Pricing',
    'nav.onboarding': 'Onboarding',
    'home.title': 'Master AI & Prompt Engineering',
    'lessons.title': 'AI Mind OS Lessons',
    'certification.title': 'AI Mind OS Certification Center',
    'onboarding.title': 'Cognitive Assessment',
    'onboarding.subtitle': 'Discover your dangerous mind archetype',
    'pricing.title': 'Choose Your Neural Path',
    'pricing.subtitle': 'Unlock the full power of AI Mind OS',
    'archetype.visionary': 'The Visionary',
    'archetype.strategist': 'The Strategist', 
    'archetype.executor': 'The Executor',
    'archetype.innovator': 'The Innovator',
    'archetype.optimizer': 'The Optimizer',
    'archetype.disruptor': 'The Disruptor',
    'common.loading': 'Loading...',
    'common.language': 'Language',
    'common.continue': 'Continue',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.complete': 'Complete'
  },
  es: {
    'nav.home': 'Inicio',
    'nav.lessons': 'Lecciones',
    'nav.certification': 'Certificación',
    'nav.pricing': 'Precios',
    'nav.onboarding': 'Incorporación',
    'home.title': 'Domina la IA y la Ingeniería de Prompts',
    'lessons.title': 'Lecciones de AI Mind OS',
    'certification.title': 'Centro de Certificación AI Mind OS',
    'onboarding.title': 'Evaluación Cognitiva',
    'onboarding.subtitle': 'Descubre tu arquetipo mental peligroso',
    'pricing.title': 'Elige Tu Camino Neural',
    'pricing.subtitle': 'Desbloquea todo el poder de AI Mind OS',
    'archetype.visionary': 'El Visionario',
    'archetype.strategist': 'El Estratega',
    'archetype.executor': 'El Ejecutor', 
    'archetype.innovator': 'El Innovador',
    'archetype.optimizer': 'El Optimizador',
    'archetype.disruptor': 'El Disruptor',
    'common.loading': 'Cargando...',
    'common.language': 'Idioma',
    'common.continue': 'Continuar',
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.complete': 'Completar'
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.lessons': 'Leçons',
    'nav.certification': 'Certification',
    'nav.pricing': 'Tarification',
    'nav.onboarding': 'Intégration',
    'home.title': 'Maîtrisez l\'IA et l\'Ingénierie des Prompts',
    'lessons.title': 'Leçons AI Mind OS', 
    'certification.title': 'Centre de Certification AI Mind OS',
    'onboarding.title': 'Évaluation Cognitive',
    'onboarding.subtitle': 'Découvrez votre archétype mental dangereux',
    'pricing.title': 'Choisissez Votre Voie Neurale',
    'pricing.subtitle': 'Débloquez toute la puissance d\'AI Mind OS',
    'archetype.visionary': 'Le Visionnaire',
    'archetype.strategist': 'Le Stratège',
    'archetype.executor': 'L\'Exécuteur',
    'archetype.innovator': 'L\'Innovateur', 
    'archetype.optimizer': 'L\'Optimiseur',
    'archetype.disruptor': 'Le Perturbateur',
    'common.loading': 'Chargement...',
    'common.language': 'Langue',
    'common.continue': 'Continuer',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.complete': 'Terminer'
  }
} as const;

type TranslationLanguage = keyof typeof translations;

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
  formatPrice: (amount: number) => string;
  formatDate: (date: Date) => string;
  isRTL: boolean;
  languageInfo: typeof SUPPORTED_LANGUAGES[SupportedLanguage];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
  defaultLanguage?: SupportedLanguage;
}

export function I18nProvider({ children, defaultLanguage }: I18nProviderProps) {
  const [language, setCurrentLanguage] = useState<SupportedLanguage>(
    defaultLanguage || 'en'
  );

  useEffect(() => {
    if (!defaultLanguage) {
      const detectedLang = detectUserLanguage();
      setCurrentLanguage(detectedLang);
    }
  }, [defaultLanguage]);

  const handleSetLanguage = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    setUserLanguage(lang);
    
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = SUPPORTED_LANGUAGES[lang].rtl ? 'rtl' : 'ltr';
    }
  };

  // Translation function with fallback
  const t = (key: string): string => {
    const translationLang = language as TranslationLanguage;
    const translation = translations[translationLang]?.[key as keyof typeof translations[typeof translationLang]];
    
    // Fallback to English
    if (!translation) {
      return translations.en[key as keyof typeof translations.en] || key;
    }
    
    return translation as string;
  };

  // Format price according to locale
  const formatPrice = (amount: number): string => {
    const config = SUPPORTED_LANGUAGES[language];
    return new Intl.NumberFormat(config.numberFormat, {
      style: 'currency',
      currency: config.currency
    }).format(amount);
  };

  // Format date according to locale
  const formatDate = (date: Date): string => {
    const config = SUPPORTED_LANGUAGES[language];
    return new Intl.DateTimeFormat(config.numberFormat).format(date);
  };

  const contextValue: I18nContextType = {
    language,
    setLanguage: handleSetLanguage,
    t,
    formatPrice,
    formatDate,
    isRTL: SUPPORTED_LANGUAGES[language].rtl,
    languageInfo: SUPPORTED_LANGUAGES[language]
  };

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

export function useTranslations() {
  const { t, language } = useI18n();
  return { t, language };
}

// Language selector component
export function LanguageSelector({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useI18n();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
      className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      title="Select Language"
      aria-label="Select Language"
    >
      {Object.entries(SUPPORTED_LANGUAGES).map(([code, info]) => (
        <option key={code} value={code}>
          {info.flag} {info.nativeName}
        </option>
      ))}
    </select>
  );
}
