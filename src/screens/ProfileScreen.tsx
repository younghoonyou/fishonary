import React, {useEffect, useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import {useAuth} from 'context/AuthContext';
import EncryptedStorage from 'react-native-encrypted-storage';
import {Fish} from 'types/index';
import {useTranslation} from 'react-i18next';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

const unitID =
  Platform.select({
    ios: process.env.BANNER_IOS_UNIT_ID,
    android: process.env.BANNER_ANDROID_UNIT_ID,
  }) || '';

const adUnitId = __DEV__ ? TestIds.BANNER : unitID;

const ProfileScreen = ({navigation}: any) => {
  const {user, logout} = useAuth();
  const {t} = useTranslation();
  const [fishCaught, setFishCaught] = useState<number>(0);
  const [fishSpecies, setFishSpecies] = useState<number>(0);
  const [fishSpots, setFishSpots] = useState<number>(0);

  const FisherManImage = useMemo(() => {
    return require('src/assets/fisherman.png');
  }, []);

  useEffect(() => {
    setFishCaught(user?.fish ? user?.fish.length : 0);
    if (user?.fish.length) {
      const uniqueTypes = new Set<string>();
      user?.fish.forEach((fish: Fish) => {
        uniqueTypes.add(fish.type);
      });

      setFishSpecies(uniqueTypes.size);
      const uniqueSpots = new Set<string>();
      user?.fish.forEach((fish: Fish) => {
        uniqueSpots.add(`${fish.location_name}`);
      });

      setFishSpecies(uniqueTypes.size);
      setFishSpots(uniqueSpots.size);
    }
  }, [user?.fish]);

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('Profile')}</Text>
        </View>
        <View style={styles.profileContainer}>
          {/* <View style={styles.profileHeader}>
            <Image source={FisherManImage} style={styles.profileImage} />
            <Text style={styles.profileName}>{user?.name || 'Unknown'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'Unknown'}</Text>
            <View style={styles.subscriptionBadge}>
              <Text style={styles.subscriptionText}>
                {user?.isSubscriber ? 'Premium Member' : 'Free Member'}
              </Text>
            </View>
          </View> */}

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{fishCaught}</Text>
              <Text style={styles.statLabel}>{t('Fish Caught')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{fishSpecies}</Text>
              <Text style={styles.statLabel}>{t('Species')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{fishSpots}</Text>
              <Text style={styles.statLabel}>{t('Spots')}</Text>
            </View>
          </View>

          <View style={styles.menuContainer}>
            {/* <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('Account')}>
              <Text style={styles.menuText}>Account</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('Language')}>
              <Text style={styles.menuText}>{t('Language')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('HelpSupport')}>
              <Text style={styles.menuText}>{t('Help & Support')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('Privacy')}>
              <Text style={styles.menuText}>{t('Privacy & Information')}</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Privacy')}>
            <Text style={styles.menuText}>Manage Subscription</Text>
          </TouchableOpacity> */}
            {/* <TouchableOpacity
              style={styles.menuItem}
              onPress={() =>
                Alert.alert('Log out', 'Do you want to log out?', [
                  {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: async () => await logout(),
                  },
                ])
              }>
              <Text style={[styles.menuText, styles.logoutText]}>LogOut</Text>
            </TouchableOpacity> */}
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profileContainer: {
    padding: 15,
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  subscriptionBadge: {
    backgroundColor: '#0077c2',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  subscriptionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0077c2',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 16,
  },
  logoutText: {
    color: '#ff3b30',
  },
});

export default React.memo(ProfileScreen);
