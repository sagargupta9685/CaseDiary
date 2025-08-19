import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./src/local/en.json";
import hi from "./src/local/h1.json";
import bn from "./src/local/bn.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    bn: { translation: bn }
  },
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;
