import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {useNavigation, useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Fish, User} from 'types';
import {useAuth} from 'context/AuthContext';
import {useTranslation} from 'react-i18next';
import {deleteFish, getDatabase, updateUser} from 'services/db';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {useToast} from 'context/ToastAlertContext';
import {BannerAd, TestIds, BannerAdSize} from 'react-native-google-mobile-ads';

const unitID =
  Platform.select({
    ios: process.env.BANNER_IOS_UNIT_ID,
    android: process.env.BANNER_ANDROID_UNIT_ID,
  }) || '';

const adUnitId = __DEV__ ? TestIds.BANNER : unitID;

type FishDetailRouteParams = {
  fish: Fish;
};

const FishDetailScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const {showAlert} = useToast();
  const {fish} = route.params as FishDetailRouteParams;
  const {user, setUpdatedUser} = useAuth();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en', {
      hour: '2-digit',
      minute: '2-digit',
    });
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
          <Text style={styles.title}>{fish.name}</Text>
          {/* {fish.writer === user?.id && ( */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              Alert.alert(t('Delete Fish Information'), t('Delete_Fish_msg'), [
                {text: t('Cancel'), onPress: () => {}, style: 'cancel'},
                {
                  text: t('OK'),
                  onPress: async () => {
                    const db: SQLiteDatabase = await getDatabase();
                    await deleteFish(db, fish.id, user?.id || 1);
                    showAlert({
                      type: 'success',
                      message: t('Delete_Fish_msg_complete'),
                    });
                    navigation.goBack();
                    const fish_list: Fish[] =
                      user?.fish.filter(item => item.id !== fish.id) || [];
                    const updatedUser: User = {
                      ...user,
                      fish: fish_list,
                    };
                    if (updatedUser) setUpdatedUser(updatedUser);
                  },
                },
              ])
            }>
            <Ionicons name="trash" size={30} color="white" />
          </TouchableOpacity>
          {/* )} */}
        </View>

        {/* Fish Photo */}
        <View style={styles.photoContainer}>
          <Image
            source={{uri: `data:image/jpeg;base64,${fish.photo}`}}
            style={styles.fishPhoto}
            resizeMode="contain"
          />
        </View>

        {/* Fish Information */}
        <View style={styles.infoContainer}>
          {fish.type && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('Fish Type') + ':'}</Text>
              <Text style={styles.infoValue}>{fish.type}</Text>
            </View>
          )}

          {fish.date && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('Time') + ':'}</Text>
              <Text style={styles.infoValue}>
                {formatDate(fish.date)}
                {'  '} {formatTime(fish.date)}
              </Text>
            </View>
          )}

          {fish.location_name && (
            <View
              style={{
                ...styles.infoRow,
                borderBottomWidth: 0,
                marginBottom: 0,
                paddingBottom: 0,
              }}>
              <Text style={styles.infoLabel}>{t('Location') + ':'}</Text>
              <Text style={styles.infoValue}>{fish.location_name}</Text>
            </View>
          )}
        </View>

        {/* Map */}
        <View style={styles.mapContainer}>
          <Text style={styles.mapTitle}>{t('Location')}</Text>
          <MapView
            style={styles.map}
            mapType={Platform.OS === 'android' ? 'none' : 'standard'}
            initialRegion={{
              latitude: fish.latitude,
              longitude: fish.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}>
            <Marker
              coordinate={{
                latitude: fish.latitude,
                longitude: fish.longitude,
              }}
              title={fish.name}
              description={`Caught on ${formatDate(fish.date)}`}
            />
          </MapView>
        </View>

        {/* Notes if available */}
        {/* {fish.notes && fish.writer === user?.id && ( */}

        {fish.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesTitle}>{t('Notes')}</Text>
            <Text style={styles.notesText}>{fish.notes}</Text>
          </View>
        )}
        {/* )} */}
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
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  photoContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 20,
  },
  fishPhoto: {
    borderRadius: 10,
    width: '95%',
    aspectRatio: 4 / 3,
    alignSelf: 'center',
  },
  infoContainer: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexWrap: 'wrap',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  infoValue: {
    fontSize: 16,
    color: '#0077c2',
    fontWeight: '500',
  },
  mapContainer: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingBottom: 15,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  map: {
    height: 200,
  },
  notesContainer: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 30,
  },
  notesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  notesText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});

export default React.memo(FishDetailScreen);
