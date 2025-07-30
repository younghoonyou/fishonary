import React, {useEffect, useState, useRef, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from 'react-native';
import {
  Calendar,
  DateData,
  MarkedDates,
  LocaleConfig,
} from 'react-native-calendars';
import {useAuth} from 'context/AuthContext';
import {FishImages, User} from 'types';
import {useTranslation} from 'react-i18next';
import CALENDAR_INIT from 'utils/calendar.json';
import {Fish, SupportedLanguages} from 'types';
import {BannerAd, TestIds, BannerAdSize} from 'react-native-google-mobile-ads';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {getDatabase, getUserInfo} from 'services/db';

const unitID =
  Platform.select({
    ios: process.env.BANNER_IOS_UNIT_ID,
    android: process.env.BANNER_ANDROID_UNIT_ID,
  }) || '';

const adUnitId = __DEV__ ? TestIds.BANNER : unitID;

const SUPPORTED_LANGUAGES: SupportedLanguages[] = [
  'en',
  'es',
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

function isSupportedLanguage(lang: string): lang is SupportedLanguages {
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguages);
}

const HomeScreen = ({navigation}: any) => {
  const {user, setUpdatedUser} = useAuth();
  const {t, i18n} = useTranslation();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showFishList, setShowFishList] = useState<boolean>(false);
  const [calendarKey, setCalendarKey] = useState(i18n.language);

  const animation = useRef(new Animated.Value(0)).current;

  const markedDates: MarkedDates = useMemo(() => {
    return (
      user?.fish?.reduce((acc: MarkedDates, fish: Fish) => {
        if (!fish || !fish.date) return acc;
        acc[fish.date] = {marked: true, dotColor: '#0077c2'};
        return acc;
      }, {}) || {}
    );
  }, [user?.fish]);

  const fishCounts = useMemo(() => {
    type FishArray = {
      type: string;
      count: number;
    };

    const countMap: Record<string, number> = {};

    user?.fish?.forEach((fish: Fish | undefined | null) => {
      // MockData.forEach((fish: Fish | undefined | null) => {
      if (!fish) return;

      if (fish.type in countMap) {
        countMap[fish.type]++;
      } else {
        countMap[fish.type] = 1;
      }
    });

    const fishArray: FishArray[] = Object.entries(countMap).map(
      ([type, count]) => ({type, count}),
    );

    return fishArray;
  }, [user?.fish]);
  // }, [MockData]);

  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [
      0,
      user?.fish
        ? user?.fish.filter(data => data.date === selectedDate).length * 140
        : 0,
      // MockData.filter(data => data.date === selectedDate).length || 0 > 1
      //   ? 120 + 120*(MockData.filter(data => data.date === selectedDate).length)
      //   : 120,
    ], // adjust max height based on your content
  });

  const handleFishPress = (fish: any) => {
    navigation.navigate('FishDetail', {fish});
  };

  useEffect(() => {
    const loadUser = async () => {
      const db: SQLiteDatabase = await getDatabase();
      const user: User | null = await getUserInfo(db, 'fishonary@gmail.com');
      if (user) setUpdatedUser(user);
    };
    loadUser();
  }, []);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: showFishList ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [showFishList]);

  useEffect(() => {
    if (isSupportedLanguage(i18n.language)) {
      LocaleConfig.locales[i18n.language] = CALENDAR_INIT[i18n.language];
      LocaleConfig.defaultLocale = i18n.language;
      setCalendarKey(i18n.language + '-' + Date.now());
    }
  }, [i18n.language]);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('Fishing Calendar')}</Text>
          </View>
          <Calendar
            key={calendarKey}
            markedDates={{
              ...markedDates,
              [selectedDate]: {
                selected: true,
                disableTouchEvent: true,
              },
            }}
            theme={{
              todayTextColor: 'white',
              todayBackgroundColor: '#7eb9cd',
              selectedDayBackgroundColor: '#0077c2',
              dotColor: '#0077c2',
            }}
            onDayPress={(day: DateData) => {
              const dateStr: string = day.dateString;

              if (markedDates[dateStr]) {
                setShowFishList(true);
              } else {
                setShowFishList(false);
              }

              setSelectedDate(dateStr);
            }}
          />
          {showFishList && (
            <Animated.ScrollView
              style={[
                styles.statsContainer,
                {height: heightInterpolate, overflow: 'hidden'},
              ]}>
              {user?.fish
                .filter(data => data.date === selectedDate)
                .map(item => (
                  // {user?.fish.map(item => (
                  <TouchableOpacity
                    key={`${item.date}-${item.type}-${item.location_name}-${
                      item.latitude
                    }-${item.longitude}-${item.name || ''}`}
                    style={{
                      ...styles.fishTypeContainer,
                    }}
                    onPress={() => handleFishPress(item)}>
                    <Image
                      source={{uri: `data:image/jpeg;base64,${item.photo}`}}
                      style={styles.fishImage}
                      resizeMode="contain"
                    />
                    <View style={styles.fishInfo}>
                      <Text style={styles.fishListType}>{item.type}</Text>
                      <Text style={styles.fishDate}>{item.date}</Text>
                      <Text style={styles.fishLocation}>
                        {item.location_name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
            </Animated.ScrollView>
          )}

          <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>{t('Fish Dictionary')}</Text>
            <View style={styles.fishTypeContainer}>
              {fishCounts.length > 0 ? (
                fishCounts.map((fish, index) => (
                  <View key={index} style={styles.fishTypeItem}>
                    <Image
                      source={FishImages[fish.type]}
                      style={{width: 100, height: 50}}
                      resizeMode="contain"
                    />
                    <Text style={styles.fishType}>
                      {fish.type.replace('_', ' ')}
                    </Text>
                    <Text style={styles.fishCount}>{fish.count}</Text>
                  </View>
                ))
              ) : (
                <Text>{t('Not Found Fish')}</Text>
              )}
            </View>
          </View>
        </ScrollView>
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          onAdFailedToLoad={error => {
            console.log('Ad failed to load:', error);
          }}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7eb9cd',
  },
  header: {
    padding: 15,
    backgroundColor: '#7eb9cd',
  },
  greeting: {
    fontSize: 16,
    color: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5,
    marginBottom: 10,
  },
  statsContainer: {
    padding: 15,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  totalCount: {
    fontSize: 16,
    marginBottom: 15,
  },
  fishTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  fishTypeItem: {
    width: '48%',
    padding: 10,
    backgroundColor: '#6fb2cd',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fishIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  fishType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  fishCount: {
    fontSize: 16,
    color: 'white',
  },
  fishCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  fishImage: {
    height: 120,
    width: '48%',
    borderRadius: 8,
  },
  fishInfo: {
    flex: 1,
    padding: 15,
  },
  fishName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  fishListType: {
    fontSize: 16,
    color: '#0077c2',
    marginBottom: 5,
  },
  fishDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  fishLocation: {
    fontSize: 14,
    color: '#666',
  },
});

export default React.memo(HomeScreen);
