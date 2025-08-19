import React from "react";
import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="p-2">
      <button onClick={() => i18n.changeLanguage("en")} className="btn btn-primary mx-1">English</button>
      <button onClick={() => i18n.changeLanguage("hi")} className="btn btn-success mx-1">हिंदी</button>
      <button onClick={() => i18n.changeLanguage("bn")} className="btn btn-warning mx-1">বাংলা</button>
    </div>
  );
}

export default LanguageSwitcher;
