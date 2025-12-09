import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const LANGUAGE_KEY = "app_language";

// Make the module safe to import during SSR by performing any
// browser-only work inside a client-only runtime check and using
// dynamic imports for browser-only libraries (like `js-cookie`).
if (!i18n.isInitialized && typeof window !== "undefined") {
  (async () => {
    let Cookies;
    try {
      const mod = await import("js-cookie");
      Cookies = mod && (mod.default || mod);
    } catch (e) {
      Cookies = null;
    }

    const initialLanguage = (Cookies && Cookies.get(LANGUAGE_KEY)) || "pt";

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
    try {
      const [enTranslations, ptTranslations] = await Promise.all([
        fetch("/locales/en.json")
          .then((res) => res.json())
          .catch(() => ({})),
        fetch("/locales/pt.json")
          .then((res) => res.json())
          .catch(() => ({})),
      ]);

      i18n.addResourceBundle("en", "translation", enTranslations, true, true);
      i18n.addResourceBundle("pt", "translation", ptTranslations, true, true);
    } catch (e) {
      // ignore fetch errors in client init
    }

    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("dir", "ltr");
    }
  })();
}

// Function to change language and persist in cookie. Uses dynamic import
// so this function can be called from components without forcing a
// server-side error at module-evaluation time.
export const changeLanguage = async (lng) => {
  if (typeof window !== "undefined") {
    try {
      const mod = await import("js-cookie");
      const Cookies = mod && (mod.default || mod);
      if (Cookies) {
        Cookies.set(LANGUAGE_KEY, lng, { expires: 365 });
      } else {
        // fallback to a simple cookie write
        document.cookie = `${LANGUAGE_KEY}=${lng};path=/;max-age=${
          365 * 24 * 60 * 60
        }`;
      }
    } catch (e) {
      document.cookie = `${LANGUAGE_KEY}=${lng};path=/;max-age=${
        365 * 24 * 60 * 60
      }`;
    }

    i18n.changeLanguage(lng);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("dir", "ltr");
    }
  }
};

export default i18n;
