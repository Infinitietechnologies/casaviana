import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Cookies from "js-cookie";
import enTranslations from "./public/locales/en.json" with { type: "json" };
import ptTranslations from "./public/locales/pt.json" with { type: "json" };

const LANGUAGE_KEY = "app_language";

// Get initial language only on client side
const getInitialLanguage = () => {
  if (typeof window !== "undefined") {
    return Cookies.get(LANGUAGE_KEY) || "pt";
  }
  return "pt";
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: {
        translation: enTranslations,
      },
      pt: {
        translation: ptTranslations,
      },
    },
    lng: getInitialLanguage(),
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["cookie", "navigator"],
      caches: ["cookie"],
    },
  });
}

// Function to change language and persist in cookie
export const changeLanguage = (lng) => {
  if (typeof window !== "undefined") {
    Cookies.set(LANGUAGE_KEY, lng, { expires: 365 }); // Persist for a year
    i18n.changeLanguage(lng);
    document.documentElement.setAttribute("dir", "ltr");
  }
};

// Update `dir` on initial load (client-side only)
if (typeof document !== "undefined") {
  document.documentElement.setAttribute("dir", "ltr");
}

export default i18n;