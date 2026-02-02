import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "../../public/locales/en.json" assert { type: "json" };
import ptTranslations from "../../public/locales/pt.json" assert { type: "json" };
import zhTranslations from "../../public/locales/zh.json" assert { type: "json" };

const LANGUAGE_KEY = "app_language";

const getInitialLanguage = () => {
  if (typeof document === "undefined") return "pt";
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${LANGUAGE_KEY}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) || "pt" : "pt";
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: enTranslations },
      pt: { translation: ptTranslations },
      zh: { translation: zhTranslations },
    },
    lng: getInitialLanguage(),
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("dir", "ltr");
  }
}

export const changeLanguage = (lng) => {
  if (typeof document !== "undefined") {
    document.cookie = `${LANGUAGE_KEY}=${lng};path=/;max-age=${365 * 24 * 60 * 60
      }`;
    document.documentElement.setAttribute("dir", "ltr");
  }
  i18n.changeLanguage(lng);
};

export default i18n;
