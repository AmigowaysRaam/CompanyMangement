// src/hooks/useSetLanguage.js
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import i18n from '../resources/config/i18';
import { setLanguageSelected } from '../redux/authActions'; // adjust path

const useSetLanguage = (language) => {
  const dispatch = useDispatch();
  useEffect(() => {
    // if (language ) return;
    dispatch(setLanguageSelected(language, (response) => {
      if (response.success && response.data) {
        const translations = response.data;
        i18n.addResourceBundle(
          language,
          'translation',
          translations,
          true,
          true
        );

        i18n.changeLanguage(language);
        console.log(`Language switched to ${language}`);
      } else {
        console.warn('Invalid translation response');
      }
    }));
  }, [language]);
};

export default useSetLanguage;
