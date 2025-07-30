import {useAuth} from 'context/AuthContext';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BannerAd, TestIds, BannerAdSize} from 'react-native-google-mobile-ads';

const unitID =
  Platform.select({
    ios: process.env.BANNER_IOS_UNIT_ID,
    android: process.env.BANNER_ANDROID_UNIT_ID,
  }) || '';

const adUnitId = __DEV__ ? TestIds.BANNER : unitID;

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const LanguageScreen = ({navigation}: any) => {
  const {language, setLanguage} = useAuth();
  const {i18n, t} = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const languages: Language[] = useMemo(
    () => [
      {code: 'en', name: 'English', nativeName: 'English'},
      {code: 'es', name: 'Spanish', nativeName: 'Español'},
      {code: 'fr', name: 'French', nativeName: 'Français'},
      {code: 'de', name: 'German', nativeName: 'Deutsch'},
      {code: 'it', name: 'Italian', nativeName: 'Italiano'},
      {code: 'pt', name: 'Portuguese', nativeName: 'Português'},
      {code: 'ja', name: 'Japanese', nativeName: '日本語'},
      {code: 'ko', name: 'Korean', nativeName: '한국어'},
      {code: 'zh', name: 'Chinese', nativeName: '中文'},
      {code: 'ru', name: 'Russian', nativeName: 'Русский'},
      {code: 'vn', name: 'Vietnamese', nativeName: 'tiếng việt'},
    ],
    [],
  );

  const handleLanguageSelect = async (languageCode: any) => {
    setSelectedLanguage(languageCode);
    // console.log(languageCode);
    setLanguage(languageCode);
    await i18n.changeLanguage(languageCode);
    // await EncryptedStorage.
    await EncryptedStorage.setItem('language', languageCode);
    // setSelectedLanguage(languageCode);
    // console.log(languageCode);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={30} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>{t('Language')}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.description}>{t('Language_description')}</Text>

          <View style={styles.languageList}>
            {languages.map(language => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageItem,
                  selectedLanguage === language.code &&
                    styles.selectedLanguageItem,
                ]}
                onPress={() => handleLanguageSelect(language.code)}>
                <View style={styles.languageInfo}>
                  <Text
                    style={[
                      styles.languageName,
                      selectedLanguage === language.code && styles.selectedText,
                    ]}>
                    {language.name}
                  </Text>
                  <Text
                    style={[
                      styles.nativeName,
                      selectedLanguage === language.code &&
                        styles.selectedNativeText,
                    ]}>
                    {language.nativeName}
                  </Text>
                </View>
                {selectedLanguage === language.code && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>{t('About Language Settings')}</Text>
            <Text style={styles.infoText}>
              • {t('About Language Settings - 1')}
            </Text>
            <Text style={styles.infoText}>
              • {t('About Language Settings - 2')}
            </Text>
            <Text style={styles.infoText}>
              • {t('About Language Settings - 3')}
            </Text>
            <Text style={styles.infoText}>
              • {t('About Language Settings - 4')}
            </Text>
          </View>
        </View>
      </ScrollView>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 15,
    backgroundColor: '#7eb9cd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  backText: {
    color: 'white',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    padding: 15,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  languageList: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedLanguageItem: {
    backgroundColor: '#e8f4f8',
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  selectedText: {
    color: '#0077c2',
    fontWeight: 'bold',
  },
  nativeName: {
    fontSize: 14,
    color: '#666',
  },
  selectedNativeText: {
    color: '#0077c2',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0077c2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default React.memo(LanguageScreen);
