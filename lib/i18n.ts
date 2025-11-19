// International configuration for AI Mind OS
export const SUPPORTED_LANGUAGES = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    rtl: false,
    region: 'US',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: 'en-US'
  },
  es: {
    code: 'es', 
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    rtl: false,
    region: 'ES',
    currency: 'EUR',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'es-ES'
  },
  fr: {
    code: 'fr',
    name: 'French', 
    nativeName: 'Français',
    flag: '🇫🇷',
    rtl: false,
    region: 'FR',
    currency: 'EUR',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'fr-FR'
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch', 
    flag: '🇩🇪',
    rtl: false,
    region: 'DE',
    currency: 'EUR',
    dateFormat: 'DD.MM.YYYY',
    numberFormat: 'de-DE'
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵', 
    rtl: false,
    region: 'JP',
    currency: 'JPY',
    dateFormat: 'YYYY/MM/DD',
    numberFormat: 'ja-JP'
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    rtl: false,
    region: 'CN',
    currency: 'CNY',
    dateFormat: 'YYYY/MM/DD', 
    numberFormat: 'zh-CN'
  },
  pt: {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    rtl: false,
    region: 'BR',
    currency: 'BRL',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'pt-BR'
  },
  it: {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    rtl: false,
    region: 'IT', 
    currency: 'EUR',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'it-IT'
  }
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

// Detect user's preferred language
export function detectUserLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'en';
  
  // Check stored preference first
  const stored = localStorage.getItem('aimindos-language') as SupportedLanguage;
  if (stored && SUPPORTED_LANGUAGES[stored]) return stored;
  
  // Check browser language
  const browserLangs = navigator.languages || [navigator.language];
  
  for (const browserLang of browserLangs) {
    const langCode = browserLang.split('-')[0] as SupportedLanguage;
    if (SUPPORTED_LANGUAGES[langCode]) return langCode;
  }
  
  return 'en'; // Default fallback
}

// Store user language preference
export function setUserLanguage(language: SupportedLanguage): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('aimindos-language', language);
}

// Get localized pricing
export function getLocalizedPrice(baseUSD: number, language: SupportedLanguage): { 
  amount: number; 
  currency: string; 
  symbol: string;
  formatted: string;
} {
  const config = SUPPORTED_LANGUAGES[language];
  
  // Exchange rates (in a real app, fetch from API)
  const exchangeRates = {
    USD: 1,
    EUR: 0.85,
    JPY: 110,
    CNY: 6.45,
    BRL: 5.2
  };
  
  const currencySymbols = {
    USD: '$',
    EUR: '€', 
    JPY: '¥',
    CNY: '¥',
    BRL: 'R$'
  };
  
  const rate = exchangeRates[config.currency as keyof typeof exchangeRates] || 1;
  const amount = Math.round(baseUSD * rate);
  const symbol = currencySymbols[config.currency as keyof typeof currencySymbols] || '$';
  
  const formatted = new Intl.NumberFormat(config.numberFormat, {
    style: 'currency',
    currency: config.currency
  }).format(amount);
  
  return {
    amount,
    currency: config.currency,
    symbol,
    formatted
  };
}

// Format date according to language
export function formatDate(date: Date, language: SupportedLanguage): string {
  const config = SUPPORTED_LANGUAGES[language];
  return new Intl.DateTimeFormat(config.numberFormat).format(date);
}

// Get culturally appropriate examples
export function getCulturalExamples(language: SupportedLanguage): {
  businessScenarios: string[];
  techCompanies: string[];
  commonUseCase: string;
} {
  const examples = {
    en: {
      businessScenarios: ['customer service chatbots', 'marketing copy generation', 'product descriptions'],
      techCompanies: ['Google', 'Microsoft', 'Amazon'],
      commonUseCase: 'automating customer support responses'
    },
    es: {
      businessScenarios: ['chatbots de atención al cliente', 'generación de contenido de marketing', 'descripciones de productos'],
      techCompanies: ['Telefónica', 'BBVA', 'Mercado Libre'],
      commonUseCase: 'automatizar respuestas de soporte al cliente'
    },
    fr: {
      businessScenarios: ['chatbots de service client', 'génération de contenu marketing', 'descriptions de produits'],
      techCompanies: ['Orange', 'Capgemini', 'Dassault Systèmes'],
      commonUseCase: 'automatiser les réponses du support client'
    },
    de: {
      businessScenarios: ['Kundenservice-Chatbots', 'Marketing-Content-Generierung', 'Produktbeschreibungen'],
      techCompanies: ['SAP', 'Siemens', 'Bosch'],
      commonUseCase: 'Kundensupport-Antworten automatisieren'
    },
    ja: {
      businessScenarios: ['カスタマーサービスチャットボット', 'マーケティングコンテンツ生成', '商品説明'],
      techCompanies: ['トヨタ', 'ソニー', 'ソフトバンク'],
      commonUseCase: 'カスタマーサポートの回答を自動化'
    },
    zh: {
      businessScenarios: ['客户服务聊天机器人', '营销内容生成', '产品描述'],
      techCompanies: ['阿里巴巴', '腾讯', '百度'],
      commonUseCase: '自动化客户支持回复'
    },
    pt: {
      businessScenarios: ['chatbots de atendimento ao cliente', 'geração de conteúdo de marketing', 'descrições de produtos'],
      techCompanies: ['Nubank', 'Magazine Luiza', 'Itaú'],
      commonUseCase: 'automatizar respostas de suporte ao cliente'
    },
    it: {
      businessScenarios: ['chatbot del servizio clienti', 'generazione di contenuti marketing', 'descrizioni di prodotti'],
      techCompanies: ['Eni', 'Enel', 'Telecom Italia'],
      commonUseCase: 'automatizzare le risposte del supporto clienti'
    }
  };
  
  return examples[language] || examples.en;
}
