import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LANGUAGE from 'utils/translation.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: LANGUAGE['en'],
    },
    es: {
      translation: LANGUAGE['es'],
    },
    fr: {
      translation: LANGUAGE['fr'],
    },
    de: {
      translation: LANGUAGE['de'],
    },
    it: {
      translation: LANGUAGE['it'],
    },
    pt: {
      translation: LANGUAGE['pt'],
    },
    ja: {
      translation: LANGUAGE['ja'],
    },
    ko: {
      translation: LANGUAGE['ko'],
    },
    zh: {
      translation: LANGUAGE['zh'],
    },
    vn: {
      translation: LANGUAGE['vn'],
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  debug: true,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
