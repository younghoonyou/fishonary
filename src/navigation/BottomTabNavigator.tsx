import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TabParamList} from 'types';
import {useTranslation} from 'react-i18next';
import HomeScreen from 'screens/HomeScreen';
import SpotsScreen from 'screens/SpotsScreen';
import RecordScreen from 'screens/RecordScreen';
import MyFishScreen from 'screens/MyFishScreen';
import ProfileScreen from 'screens/ProfileScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator<TabParamList>();

const BottomTabNavigator = () => {
  const {t} = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={({route}: any) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#649DB1',
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',

        tabBarIcon: ({focused}: any) => {
          let iconName: any;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Spots') iconName = 'location';
          else if (route.name === 'Record') iconName = 'camera';
          else if (route.name === 'MyFish') iconName = 'fish';
          else if (route.name === 'Profile') iconName = 'person';
          return (
            <Ionicons
              name={iconName}
              size={30}
              color={focused ? 'white' : '#4F7482'}
            />
          );
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: t('Home_Tab'),
        }}
      />
      <Tab.Screen
        name="Spots"
        component={SpotsScreen}
        options={{
          tabBarLabel: t('Spots_Tab'),
        }}
      />
      <Tab.Screen
        name="Record"
        component={RecordScreen}
        options={{
          tabBarLabel: t('Record_Tab'),
        }}
      />
      <Tab.Screen
        name="MyFish"
        component={MyFishScreen}
        options={{
          tabBarLabel: t('MyFish_Tab'),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: t('Profile_Tab'),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
