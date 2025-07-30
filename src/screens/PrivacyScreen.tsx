import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import {BannerAd, TestIds, BannerAdSize} from 'react-native-google-mobile-ads';

const unitID =
  Platform.select({
    ios: process.env.BANNER_IOS_UNIT_ID,
    android: process.env.BANNER_ANDROID_UNIT_ID,
  }) || '';

const adUnitId = __DEV__ ? TestIds.BANNER : unitID;

const PrivacyScreen = ({navigation}: any) => {
  const {t} = useTranslation();
  const handleOpenTerms = () => {
    Linking.openURL('https://fishonary.net/terms.html');
  };
  // https://fishonary.net/terms.html
  const handleOpenPrivacyPolicy = () => {
    Linking.openURL('https://fishonary.net/privacy.html');
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
          <Text style={styles.title}>{t('Privacy & Information')}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Data Collection & Privacy')}
            </Text>
            <Text style={styles.text}>
              {t('Data Collection & Privacy - 1')}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subTitle}>{t('What Data We Collect')}</Text>
            {/* <Text style={styles.bulletPoint}>
            • Account information (username, email)
          </Text> */}
            <Text style={styles.bulletPoint}>
              • {t('What Data We Collect - 1')}
            </Text>
            <Text style={styles.bulletPoint}>
              • {t('What Data We Collect - 2')}
            </Text>
            <Text style={styles.bulletPoint}>
              • {t('What Data We Collect - 3')}
            </Text>
            {/* <Text style={styles.bulletPoint}>
            • Device information for app optimization
          </Text> */}
          </View>

          <View style={styles.section}>
            <Text style={styles.subTitle}>{t('How We Use your Data')}</Text>
            <Text style={styles.bulletPoint}>
              • {t('How We Use your Data - 1')}
            </Text>
            <Text style={styles.bulletPoint}>
              • {t('How We Use your Data - 2')}
            </Text>
            <Text style={styles.bulletPoint}>
              • {t('How We Use your Data - 3')}
            </Text>
            <Text style={styles.bulletPoint}>
              • {t('How We Use your Data - 4')}
            </Text>
            {/* <Text style={styles.bulletPoint}>
            • To analyze app performance and usage
          </Text> */}
          </View>

          <View style={styles.section}>
            <Text style={styles.subTitle}>{t('Data Sharing')}</Text>
            <Text style={styles.text}>{t('Data Sharing - 1')}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subTitle}>{t('Location Data')}</Text>
            <Text style={styles.text}>{t('Location Data - 1')}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subTitle}>{t('Data Security')}</Text>
            <Text style={styles.text}>{t('Data Security - 1')}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subTitle}>{t('Your Rights')}</Text>
            <Text style={styles.bulletPoint}>• {t('Your Rights - 1')}</Text>
            <Text style={styles.bulletPoint}>• {t('Your Rights - 2')}</Text>
            <Text style={styles.bulletPoint}>• {t('Your Rights - 3')}</Text>
            {/* <Text style={styles.bulletPoint}>• Export your fishing records</Text> */}
            {/* <Text style={styles.bulletPoint}>• Opt out of data collection</Text> */}
          </View>

          <View style={styles.linkSection}>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={handleOpenPrivacyPolicy}>
              <Text style={styles.linkText}>{t('Full Privacy Policy')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={handleOpenTerms}>
              <Text style={styles.linkText}>{t('Terms of Service')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contactSection}>
            <Text style={styles.subTitle}>{t('Questions About Privacy?')}</Text>
            <Text style={styles.text}>{t('Questions About Privacy? - 1')}</Text>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  'mailto:support@fishonary.net?subject=Question About Privacy',
                )
              }>
              <Text style={styles.emailLink}>support@fishonary.net</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.appInfoSection}>
            <Text style={styles.sectionTitle}>{t('App Information')}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('Version')}:</Text>
              <Text style={styles.infoValue}>{process.env.APP_VERSION}</Text>
            </View>
            {/* <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Build:</Text>
            <Text style={styles.infoValue}>2025.06.001</Text>
          </View> */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('Developer')}:</Text>
              <Text style={styles.infoValue}>Fishonary {t('Team')}</Text>
            </View>
            {/* <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Updated:</Text>
            <Text style={styles.infoValue}>June 2, 2025</Text>
          </View> */}
          </View>

          <View style={styles.footerSection}>
            <Text style={styles.footerText}>
              © 2025 Fishonary. All rights reserved.
            </Text>
            {/* <Text style={styles.footerText}>Made for fishing enthusiasts</Text> */}
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
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  text: {
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
  linkSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  linkButton: {
    backgroundColor: '#0077c2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  linkText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  emailLink: {
    color: '#0077c2',
    fontSize: 16,
    textDecorationLine: 'underline',
    marginTop: 5,
  },
  appInfoSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  footerSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
    textAlign: 'center',
  },
});

export default React.memo(PrivacyScreen);
