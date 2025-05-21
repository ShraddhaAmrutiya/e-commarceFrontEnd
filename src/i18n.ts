import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import your translation files
import en from "./locales/en.json";
import hi from "./locales/hi.json";
import he from "./locales/he.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      he: { translation: he }, 
    },
    lng: localStorage.getItem("language") || "en", 
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    
});

export default i18n;
