import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import i18n from 'utils/i18n';
import {BannerAd, TestIds, BannerAdSize} from 'react-native-google-mobile-ads';

const unitID =
  Platform.select({
    ios: process.env.BANNER_IOS_UNIT_ID,
    android: process.env.BANNER_ANDROID_UNIT_ID,
  }) || '';

const adUnitId = __DEV__ ? TestIds.BANNER : unitID;

interface FAQItem {
  question: string;
  answer: string;
}

const HelpSupportScreen = ({navigation}: any) => {
  const {t} = useTranslation();
  const [expandedFAQ, setExpandedFAQ] = useState<number[]>([]);
  const faqData: FAQItem[] = useMemo(
    () => [
      {
        question: t('FAQ title - 1'),
        answer: t('FAQ answer - 1'),
      },
      {
        question: t('FAQ title - 2'),
        answer: t('FAQ answer - 2'),
      },
      {
        question: t('FAQ title - 3'),
        answer: t('FAQ answer - 3'),
      },
      // {
      //   question: 'Can I use the app offline?',
      //   answer:
      //     'Yes, you can record fish catches offline. The data will sync when you reconnect to the internet.',
      // },
      {
        question: t('FAQ title - 4'),
        answer: t('FAQ answer - 4'),
      },
      // {
      //   question: 'Is my data secure?',
      //   answer:
      //     'Yes, we take data security seriously. All your information is encrypted and stored securely. See our Privacy Policy for more details.',
      // },
    ],
    [i18n.language],
  );

  const toggleFAQ = useCallback(
    (index: number) => {
      if (expandedFAQ.includes(index)) {
        setExpandedFAQ(expandedFAQ.filter((faq: number) => faq !== index));
      } else setExpandedFAQ([...expandedFAQ, index]);
    },
    [expandedFAQ],
  );

  const handleContactSupport = () => {
    () =>
      Linking.openURL('mailto:support@fishonary.net?subject=Contact Support');
  };

  const handleReportBug = () => {
    Alert.alert(t('Report a Bug'), undefined, [
      {
        text: t('OK'),
        onPress: () =>
          Linking.openURL('mailto:support@fishonary.net?subject=Bug Report'),
      },
      {text: t('Cancel'), style: 'cancel'},
    ]);
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
          <Text style={styles.title}>{t('Help & Support')}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.aboutSection}>
            <Text style={styles.sectionTitle}>{t('About Fishonary')}</Text>
            <Text style={styles.aboutText}>
              {t('About Fishonary description')}
            </Text>
            <Text style={styles.aboutText}>{t('Features include')}</Text>
            <Text style={styles.bulletPoint}>
              • {t('Features include - 1')}
            </Text>
            <Text style={styles.bulletPoint}>
              • {t('Features include - 2')}
            </Text>
            <Text style={styles.bulletPoint}>
              • {t('Features include - 3')}
            </Text>
            <Text style={styles.bulletPoint}>
              • {t('Features include - 4')}
            </Text>
            {/* <Text style={styles.bulletPoint}>• Species identification guide</Text> */}
          </View>

          <View style={styles.faqSection}>
            <Text style={styles.sectionTitle}>
              {t('Frequently Asked Questions')}
            </Text>
            {faqData.map((faq, index) => (
              <View
                key={index}
                style={{
                  ...styles.faqItem,
                  borderBottomWidth: index === faqData.length - 1 ? 0 : 1,
                  marginBottom: index === faqData.length - 1 ? 0 : 10,
                  paddingBottom: index === faqData.length - 1 ? 0 : 10,
                }}>
                <TouchableOpacity
                  style={styles.faqQuestion}
                  onPress={() => toggleFAQ(index)}>
                  <Text style={styles.questionText}>{faq.question}</Text>
                  <Text style={styles.expandIcon}>
                    {expandedFAQ.includes(index) ? '-' : '+'}
                  </Text>
                </TouchableOpacity>
                {expandedFAQ.includes(index) && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.answerText}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          <View style={styles.supportSection}>
            <Text style={styles.sectionTitle}>{t('Need More Help?')}</Text>

            <TouchableOpacity
              style={styles.supportButton}
              onPress={() =>
                Linking.openURL(
                  'mailto:support@fishonary.net?subject=Contact Support',
                )
              }>
              <Text style={styles.supportButtonText}>
                {t('Contact Support')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.supportButton}
              onPress={() =>
                Linking.openURL(
                  'mailto:support@fishonary.net?subject=Bug Report',
                )
              }>
              <Text style={styles.supportButtonText}>{t('Report a Bug')}</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
            style={styles.supportButton}
            onPress={() => Linking.openURL('https://fishonary.com/user-guide')}>
            <Text style={styles.supportButtonText}>User Guide</Text>
          </TouchableOpacity> */}
          </View>

          <View style={styles.versionSection}>
            <Text style={styles.versionText}>{t('Version')} 1.0.0</Text>
            <Text style={styles.copyrightText}>
              © 2025 Fishonary. All rights reserved.
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
    gap: 20,
  },
  aboutSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 5,
    marginLeft: 10,
  },
  faqSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  faqItem: {
    borderBottomColor: '#f0f0f0',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  expandIcon: {
    fontSize: 20,
    color: '#0077c2',
    fontWeight: 'bold',
  },
  faqAnswer: {
    paddingTop: 10,
  },
  answerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  supportSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  supportButton: {
    backgroundColor: '#0077c2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  supportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  copyrightText: {
    fontSize: 12,
    color: '#999',
  },
});

export default React.memo(HelpSupportScreen);
