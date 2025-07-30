import React, {useRef, useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  Alert,
  Linking,
  PermissionsAndroid,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList, LocationInfo} from 'types';
// import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import {useTranslation} from 'react-i18next';
import {
  useCameraDevice,
  useLocationPermission,
  useCameraPermission,
  useCameraFormat,
} from 'react-native-vision-camera';
import {useIsFocused} from '@react-navigation/core';
import {Camera, PhotoFile} from 'react-native-vision-camera';
import PhotoManipulator from 'react-native-photo-manipulator';
import ImageSize from 'react-native-image-size';
// import Reanimated, {useSharedValue} from 'react-native-reanimated';

type RecordScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Main'>;
};

const PHOTO_HEIGHT = 600;
const PHOTO_OFFSET = 50;
const SCREEN_HEIGHT = Platform.select<number>({
  android:
    Dimensions.get('screen').height - StaticSafeAreaInsets.safeAreaInsetsBottom,
  ios: Dimensions.get('window').height,
}) as number;
const SCREEN_WIDTH = Dimensions.get('window').width;

const getGeneralLocation = (components: any[]): string => {
  let locality = '';
  let province = '';
  let country = '';

  for (const c of components) {
    if (c.types.includes('locality')) {
      locality = c.long_name;
    }
    if (c.types.includes('administrative_area_level_1')) {
      province = c.long_name;
    }
    if (c.types.includes('country')) {
      country = c.long_name;
    }
  }

  const parts = [locality, province, country].filter(Boolean);
  return parts.join(', ');
};

// const hasAndroidPermission = async (): Promise<boolean> => {
//   const getCheckPermissionPromise = (): Promise<boolean> => {
//     if (Number(Platform.Version) >= 33) {
//       return Promise.all([
//         PermissionsAndroid.check(
//           PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
//         ),
//         PermissionsAndroid.check(
//           PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
//         ),
//       ]).then(
//         ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
//           hasReadMediaImagesPermission && hasReadMediaVideoPermission,
//       );
//     } else {
//       return PermissionsAndroid.check(
//         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//       );
//     }
//   };
//   const hasPermission: boolean = await getCheckPermissionPromise();

//   if (hasPermission) {
//     return true;
//   } else return false;
// };

const RecordScreen = ({navigation}: RecordScreenProps) => {
  const camera = useRef<Camera>(null);
  const locationPermission = useLocationPermission();
  const cameraPermission = useCameraPermission();
  const [cameraPosition, setCameraPosition] = useState<'back'>('back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [enableNightMode, setEnableNightMode] = useState(false);
  const {t} = useTranslation();

  let device = useCameraDevice(cameraPosition);

  const format = useCameraFormat(device, [
    {photoResolution: {width: SCREEN_WIDTH, height: SCREEN_HEIGHT}},
  ]);

  const requestCameraPermission = async () => {
    try {
      if (Platform.OS == 'android') {
        const permission: boolean = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        if (!permission) {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: t('Camera Permission'),
              message: t('Camera_Permission_msg'),
              buttonPositive: t('OK'),
              buttonNegative: t('Cancel'),
            },
          );
          return;
        }
        return;
      }
      const permission = await cameraPermission.requestPermission();
      // if (!permission) {
      //   Alert.alert(t('Camera Permission'), t('Camera_Permission_msg'), [
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
            resolve({latitude, longitude});
          },
          error => reject(error),
          {enableHighAccuracy: true, timeout: 10000, maximumAge: 10000},
        );
      },
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

  const isFocussed: boolean = useIsFocused();
  const isActive: boolean = isFocussed && cameraPermission.hasPermission;

  const handleTakePhoto = async () => {
    if (!cameraPermission.hasPermission) {
      await requestCameraPermission();
      return;
    }

    if (!locationPermission.hasPermission) {
      await requestLocationPermission();
      return;
    }

    if (!device || !camera.current) {
      Alert.alert('Error', 'Camera not available');
      return;
    }

    try {
      const photo: PhotoFile = await camera.current.takePhoto({
        flash: flash,
        enableShutterSound: true,
      });
      const {latitude, longitude} = (await getCurrentLocation()) || {};
      if (latitude === undefined || longitude === undefined) {
        Alert.alert('Error', 'Failed to get location.');
        return;
      }

      const GeoCodeResult: Geocoder.GeocoderResponse = await Geocoder.from(
        latitude,
        longitude,
      );
      // const GeoCodeResult = {
      //   results: [
      //     {address_components: ['9834 David Dr, Burnaby, BC V3J 1H3, Canada']},
      //   ],
      // };
      // const GeoCodeResult = {
      //   results: [
      //     {formatted_address: '9834 David Dr, Burnaby, BC V3J 1H3, Canada'},
      //   ],
      // };

      // const location: string =
      //   GeoCodeResult.results[0].formatted_address || 'Fail to fetch location';

      const format_address =
        GeoCodeResult.results[0]?.formatted_address || 'Unknown Location';

      // const AmbiguousLocation =
      //   getGeneralLocation(formatted) || 'Unknown Location';

      const location: LocationInfo = {
        latitude,
        longitude,
        name: format_address,
      };

      photo.height = PHOTO_HEIGHT;
      const photoUri: string =
        Platform.OS == 'ios' ? photo.path : `file://${photo.path}`;

      // const cropRegion = {
      //   x: (SCREEN_HEIGHT - PHOTO_HEIGHT) / 2 - PHOTO_OFFSET,
      //   y: (SCREEN_HEIGHT - PHOTO_HEIGHT) / 2 - PHOTO_OFFSET,
      //   height: PHOTO_HEIGHT,
      //   width: SCREEN_WIDTH,
      // };
      const targetSize = {height: PHOTO_HEIGHT * 2, width: SCREEN_WIDTH};

      const {width, height} = await ImageSize.getSize(photoUri);
      const cropHeight = (width * 3) / 4;
      const y = (SCREEN_HEIGHT - PHOTO_HEIGHT) / 2 - PHOTO_OFFSET + 30;
      const cropRegion = {
        x: 0,
        y,
        width,
        height: PHOTO_HEIGHT + PHOTO_OFFSET + PHOTO_OFFSET,
      };

      // const croppedImage = await PhotoManipulator.crop(photoUri, {
      //   x: 0,
      //   y: 100,
      //   width: photo.width,
      //   height: photo.height - 200,
      // });

      const croppedImage = await PhotoManipulator.crop(photoUri, cropRegion);

      // const resizedImage = await ImageResizer.createResizedImage(
      //   photoUri,
      //   SCREEN_WIDTH,
      //   300,
      //   'JPEG',
      //   70, // quality
      // );
      // resizedImage.uri

      navigation.navigate('AddFish', {photo: croppedImage, location});
    } catch (error) {
      console.error('Failed to take photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  useEffect(() => {
    Geocoder.init(process.env.GOOGLE_GEOCODER_KEY || '');
  }, []);

  useEffect(() => {
    const checkAndRequestCameraPermission = async () => {
      if (isFocussed && !cameraPermission.hasPermission) {
        await requestCameraPermission();
      }
    };

    const checkAndRequestLocationPermission = async () => {
      if (isFocussed && !locationPermission.hasPermission) {
        await requestLocationPermission();
      }
    };

    checkAndRequestCameraPermission();
    checkAndRequestLocationPermission();
  }, [
    isFocussed,
    cameraPermission.hasPermission,
    locationPermission.hasPermission,
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('Record Fish')}</Text>
      </View>

      <View style={styles.cameraContainer}>
        {!(
          cameraPermission.hasPermission && locationPermission.hasPermission
        ) ? (
          <View style={styles.cameraPreview}>
            <Text style={styles.cameraText}>
              {t('Request Camera Permission')}
            </Text>
            <Text style={styles.subText}>
              {t('Request_Camera_Permission_msg')}
            </Text>
          </View>
        ) : device != null ? (
          <>
            <View
              style={{
                ...styles.cameraHideTopFrame,
                height: (SCREEN_HEIGHT - PHOTO_HEIGHT) / 2 - PHOTO_OFFSET,
              }}
            />
            <Camera
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                width: SCREEN_WIDTH,
                height: SCREEN_HEIGHT,
              }}
              device={device}
              isActive={isActive}
              ref={camera}
              format={format}
              photo
              enableLocation={locationPermission.hasPermission}
            />
            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={handleTakePhoto}>
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                ...styles.cameraHideBottomFrame,
                height: (SCREEN_HEIGHT - PHOTO_HEIGHT) / 2 + PHOTO_OFFSET,
              }}
            />
          </>
        ) : (
          <View style={styles.cameraPreview}>
            <Text style={styles.cameraText}>{t('Device_msg')}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
  cameraContainer: {
    flex: 1,
    // justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  cameraPreview: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 10,
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  cameraText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
  },
  subText: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 30,
    zIndex: 5,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  instructions: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    borderRadius: 10,
  },
  instructionText: {
    color: 'white',
    textAlign: 'center',
  },
  cameraHideTopFrame: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    top: 0,
    left: 0,
    right: 0,
    width: SCREEN_WIDTH,
    zIndex: 3,
  },
  cameraHideBottomFrame: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    bottom: 0,
    left: 0,
    right: 0,
    width: SCREEN_WIDTH,
    zIndex: 3,
  },
});

export default React.memo(RecordScreen);
