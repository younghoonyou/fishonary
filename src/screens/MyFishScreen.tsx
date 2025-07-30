import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from 'types';
import {useAuth} from 'context/AuthContext';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
import {useTranslation} from 'react-i18next';

const unitID =
  Platform.select({
    ios: process.env.BANNER_IOS_UNIT_ID,
    android: process.env.BANNER_ANDROID_UNIT_ID,
  }) || '';

const adUnitId = __DEV__ ? TestIds.BANNER : unitID;

type NavigationProp = StackNavigationProp<RootStackParamList, 'FishDetail'>;

const MyFishScreen = () => {
  const {user} = useAuth();
  const {t} = useTranslation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const navigation = useNavigation<NavigationProp>();

  const handleFishPress = (fish: any) => {
    navigation.navigate('FishDetail', {fish});
  };

  const renderFishItem = ({item}: any) => (
    <TouchableOpacity
      style={styles.fishCard}
      onPress={() => handleFishPress(item)}>
      <Image
        source={{uri: `data:image/jpeg;base64,${item.photo}`}}
        style={styles.fishImage}
        resizeMode="contain"
      />
      <View style={styles.fishInfo}>
        <Text style={styles.fishName}>{item.name}</Text>
        <Text style={styles.fishType}>{item.type}</Text>
        <Text style={styles.fishDate}>{formatDate(item.date)}</Text>
        {item.location_name && (
          <Text style={styles.fishLocation}>{item.location_name}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('Fish Dictionary')}</Text>
      </View>

      {user?.fish.length ? (
        <FlatList
          data={user?.fish}
          renderItem={renderFishItem}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('MyFish_No_Fish_Title')}</Text>
          <Text style={styles.emptySubtext}>
            {t('MyFish_No_Fish_Subtitle')}
          </Text>
        </View>
      )}
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
    </View>
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
  listContainer: {
    padding: 15,
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
    width: 100,
    height: 100,
    alignSelf: 'center',
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
  fishType: {
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default React.memo(MyFishScreen);
