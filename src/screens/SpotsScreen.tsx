import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  ImageRequireSource,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import MapView, {Marker, LatLng} from 'react-native-maps';
import {useAuth} from 'context/AuthContext';
import Geolocation from 'react-native-geolocation-service';
import {Fish} from 'types';
import {useTranslation} from 'react-i18next';
import {useIsFocused} from '@react-navigation/core';
import {useLocationPermission} from 'react-native-vision-camera';
import {BannerAd, TestIds, BannerAdSize} from 'react-native-google-mobile-ads';

const unitID =
  Platform.select({
    ios: process.env.BANNER_IOS_UNIT_ID,
    android: process.env.BANNER_ANDROID_UNIT_ID,
  }) || '';

const adUnitId = __DEV__ ? TestIds.BANNER : unitID;

type CustomMarkerType = {
  coordinate: LatLng;
  image: ImageRequireSource;
  fish: Fish;
};
const SpotsScreen = ({navigation}: any) => {
  const isFocussed: boolean = useIsFocused();
  const locationPermission = useLocationPermission();
  const {t} = useTranslation();
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const {user} = useAuth();
  const isSubscriber = user?.isSubscriber || false;

  const handleFishPress = (fish: any) => {
    navigation.navigate('FishDetail', {fish});
  };

  const CustomMarker = ({coordinate, image, fish}: CustomMarkerType) => (
    <Marker coordinate={coordinate}>
      <TouchableOpacity
        style={styles.markerContainer}
        onPress={() => handleFishPress(fish)}>
        <Image
          source={{uri: `data:image/jpeg;base64,${image}`}}
          style={styles.markerImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </Marker>
  );

  const handleUnlock = () => {
    Alert.alert(
      'Premium Feature',
      'This feature is available only for subscribers. Would you like to upgrade?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Upgrade', onPress: () => console.log('Upgrade pressed')},
      ],
    );
  };

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS == 'android') {
        const permission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (!permission) {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: t('Location Permission'),
              message: t('Location_Permission_msg'),
              buttonPositive: t('OK'),
              buttonNegative: t('Cancel'),
            },
          );
          return;
        }
      }
      const permission = await locationPermission.requestPermission();
      // if (!permission) {
      //   Alert.alert(t('Location Permission'), t('Location_Permission_msg'), [
      //     {text: t('Cancel'), style: 'cancel'},
      //     {text: t('OK'), onPress: () => Linking.openSettings()},
      //   ]);
      // }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      Alert.alert(t('Permission Error'), t('Permission_Error_msg'), [
        {text: t('Cancel'), style: 'cancel'},
        {text: t('OK'), onPress: () => Linking.openSettings()},
      ]);
    }
  };

  const getCurrentLocation = async () => {
    if (!locationPermission.hasPermission) return null;

    return new Promise<{latitude: number; longitude: number}>(
      (resolve, reject) => {
        Geolocation.getCurrentPosition(
          position => {
            const {latitude, longitude} = position.coords;
            console.log(latitude, longitude);

            resolve({latitude, longitude});
          },
          error => reject(error),
          {enableHighAccuracy: true, timeout: 10000, maximumAge: 10000},
        );
      },
    );
  };

  useEffect(() => {
    const checkAndRequestLocationPermission = async () => {
      if (isFocussed && !locationPermission.hasPermission) {
        await requestLocationPermission();
      }
    };
    const setCurrentLocation = async () => {
      const coords = await getCurrentLocation();
      if (coords?.latitude !== undefined && coords?.longitude !== undefined) {
        const {latitude, longitude} = coords;
        setLocation({latitude, longitude});
      }
    };

    checkAndRequestLocationPermission();
    setCurrentLocation();
  }, [isFocussed]);

  return (
    <View style={styles.container}>
      {locationPermission.hasPermission ? (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>{t('Fishing Spots')}</Text>
          </View>
          <BannerAd
            unitId={adUnitId}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          />
          <MapView
            provider={Platform.OS === 'android' ? 'google' : undefined}
            googleMapId={
              Platform.OS === 'android'
                ? process.env.ANDORID_GOOGLE_MAP_ID
                : undefined
            }
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            // onRegionChangeComplete={region => {
            //   const {latitude, longitude, latitudeDelta, longitudeDelta} =
            //     region;

            //   const north = latitude + latitudeDelta / 2;
            //   const south = latitude - latitudeDelta / 2;
            //   const east = longitude + longitudeDelta / 2;
            //   const west = longitude - longitudeDelta / 2;

            //   // console.log('Visible Region:');
            //   // console.log('North:', north);
            //   // console.log('South:', south);
            //   // console.log('East:', east);
            //   // console.log('West:', west);
            // }}
          >
            {user?.fish.map(spot => (
              <CustomMarker
                key={spot.id}
                coordinate={{
                  latitude: spot.latitude,
                  longitude: spot.longitude,
                }}
                fish={spot}
                image={spot.photo}
              />
            ))}
          </MapView>
        </>
      ) : (
        <View style={styles.lockedContainer}>
          <Text style={styles.lockedTitle}>{t('Spots Feature')}</Text>
          <Text style={styles.lockedText}>{t('Spots_Feature_msg')}</Text>
          {/* <View style={styles.buttonContainer}>
            <Text style={styles.unlockButton} onPress={handleUnlock}>
              Unlock Now
            </Text>
          </View> */}
        </View>
      )}
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
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  map: {
    flex: 1,
  },
  lockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  lockedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  lockedText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
  unlockButton: {
    backgroundColor: '#0077c2',
    color: 'white',
    padding: 15,
    borderRadius: 5,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  markerContainer: {
    width: 50,
    height: 50,
    borderRadius: 30, // Makes it a circle
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#649DB1',
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerImage: {
    width: '100%',
    height: '100%',
    // resizeMode: 'cover',
  },
});

export default React.memo(SpotsScreen);
