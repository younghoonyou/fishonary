import React, {useEffect, useCallback} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from '../types';

// import SplashScreen from 'screens/SplashScreen';
import LoginScreen from 'screens/LoginScreen';
import AddFishScreen from 'screens/AddFishScreen';
import FishDetailScreen from 'screens/FishDetailScreen';
import AccountScreen from 'screens/AccountScreen';
import LanguageScreen from 'screens/LanguageScreen';
import HelpSupportScreen from 'screens/HelpSupportScreen';
import PrivacyScreen from 'screens/PrivacyScreen';
import BottomTabNavigator from 'navigation/BottomTabNavigator';
import {useAuth} from 'context/AuthContext';
import EncryptedStorage from 'react-native-encrypted-storage';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const {user, setUpdatedUser} = useAuth();
  const cacheLogin = useCallback(async () => {
    const user = await EncryptedStorage.getItem('user');
    if (user) {
      setUpdatedUser(JSON.parse(user));
    }
  }, []);

  useEffect(() => {
    cacheLogin();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false, gestureEnabled: false}}>
        <>
          <Stack.Screen name="Main" component={BottomTabNavigator} />
          <Stack.Screen
            name="AddFish"
            component={AddFishScreen}
            options={{gestureEnabled: true}}
          />
          <Stack.Screen
            name="FishDetail"
            component={FishDetailScreen}
            options={{gestureEnabled: true}}
          />
          <Stack.Screen name="Account" component={AccountScreen} />
          <Stack.Screen
            name="Language"
            component={LanguageScreen}
            options={{gestureEnabled: true}}
          />
          <Stack.Screen
            name="HelpSupport"
            component={HelpSupportScreen}
            options={{gestureEnabled: true}}
          />
          <Stack.Screen
            name="Privacy"
            component={PrivacyScreen}
            options={{gestureEnabled: true}}
          />
        </>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

// {!user ? (
//   <>
//     {/* <Stack.Screen name="Splash" component={SplashScreen} /> */}
//     <Stack.Screen name="Login" component={LoginScreen} />
//   </>
// ) : (
//   <>
//     <Stack.Screen name="Main" component={BottomTabNavigator} />
//     <Stack.Screen name="AddFish" component={AddFishScreen} />
//     <Stack.Screen name="FishDetail" component={FishDetailScreen} />
//     <Stack.Screen name="Account" component={AccountScreen} />
//     <Stack.Screen name="Language" component={LanguageScreen} />
//     <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
//     <Stack.Screen name="Privacy" component={PrivacyScreen} />
//   </>
// )}
