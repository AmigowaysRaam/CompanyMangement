import React, { createContext, useState, useContext, useEffect } from 'react';
import i18n from '../resources/config/i18';
import useSetLanguage from '../hooks/useSetLanguage'; // ✅
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(i18n.language);

  // ✅ use the dynamic fetch + update logic
  useSetLanguage(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
