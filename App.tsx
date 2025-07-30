import React, {useCallback, useEffect} from 'react';
import {StatusBar, SafeAreaView, StyleSheet} from 'react-native';
import {AuthProvider} from 'context/AuthContext';
import AppNavigator from 'navigation/AppNavigator';
import {
  connectToDatabase,
  createTables,
  deleteTables,
  getDatabase,
  getTableNames,
} from 'services/db';
import {useTranslation} from 'react-i18next';
import {getLocales} from 'react-native-localize';
import {ToastProvider} from 'context/ToastAlertContext';
import ToastAlert from 'components/ToastAlert';
import LoadingIndicator from 'components/LoadingIndicator';
// import {GoogleSignin} from '@react-native-google-signin/google-signin';
import EncryptedStorage from 'react-native-encrypted-storage';
import {LocaleConfig} from 'react-native-calendars';
import rawCalendarInit from 'utils/calendar.json';
import {CalendarInitType, SupportedLanguages, User} from 'types';
import mobileAds from 'react-native-google-mobile-ads';
import 'utils/i18n';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const SUPPORTED_LANGUAGES: SupportedLanguages[] = [
  'en',
  'ko',
  'ja',
  'zh',
  'vn',
  'fr',
  'de',
  'it',
  'pt',
  'ru',
];

// GoogleSignin.configure({
//   webClientId: process.env.GOOGLE_WEB_CLNT_ID,
//   iosClientId: process.env.GOOGLE_IOS_CLNT_ID,
//   scopes: ['email'],
//   offlineAccess: false,
//   forceCodeForRefreshToken: false,
// });

function App(): React.JSX.Element {
  const CALENDAR_INIT = rawCalendarInit as CalendarInitType;
  const {i18n} = useTranslation();
  const loadData = useCallback(async () => {
    try {
      const db = await connectToDatabase();
      await createTables(db);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const deleteDB = useCallback(async () => {
    try {
      const db = await getDatabase();
      await deleteTables(db);
      await getTableNames(db);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const isSupportedLanguage = (lang: string): lang is SupportedLanguages => {
    return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguages);
  };

  const LanguageInit = useCallback(async () => {
    let lang =
      (await EncryptedStorage.getItem('language')) ??
      getLocales()[0].languageCode ??
      'en';

    const language: SupportedLanguages = isSupportedLanguage(lang)
      ? lang
      : 'en';

    if (i18n.language !== language) await i18n.changeLanguage(language);
    LocaleConfig.locales[language] = CALENDAR_INIT[language];
    LocaleConfig.defaultLocale = language;
  }, []);

  useEffect(() => {
    LanguageInit();
    loadData();
    const AdMobInit = async () => {
      await mobileAds().initialize();
    };
    AdMobInit();

    // LanguageInit();
    // deleteDB();
  }, []);

  return (
    <AuthProvider>
      <ToastProvider>
        <StatusBar barStyle="light-content" backgroundColor="#0077c2" />
        <SafeAreaView style={styles.container}>
          <AppNavigator />
        </SafeAreaView>
        <ToastAlert />
        <LoadingIndicator />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
