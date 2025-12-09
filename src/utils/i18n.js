"use client";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Cookies from "js-cookie";

const LANGUAGE_KEY = "app_language";

// Initialize i18n synchronously with fallback, then load translations
if (!i18n.isInitialized && typeof window !== "undefined") {
  const initialLanguage = Cookies.get(LANGUAGE_KEY) || "pt";

  // Initialize with empty resources first
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: {} },
      pt: { translation: {} },
    },
    lng: initialLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

  // Load translations asynchronously and add them
  Promise.all([
    fetch("/locales/en.json").then((res) => res.json()).catch(() => ({})),
    fetch("/locales/pt.json").then((res) => res.json()).catch(() => ({})),
  ]).then(([enTranslations, ptTranslations]) => {
    i18n.addResourceBundle("en", "translation", enTranslations, true, true);
    i18n.addResourceBundle("pt", "translation", ptTranslations, true, true);
  });

  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("dir", "ltr");
  }
}

// Function to change language and persist in cookie
export const changeLanguage = (lng) => {
  if (typeof window !== "undefined") {
    Cookies.set(LANGUAGE_KEY, lng, { expires: 365 });
    i18n.changeLanguage(lng);
    document.documentElement.setAttribute("dir", "ltr");
  }
};

export default i18n;

