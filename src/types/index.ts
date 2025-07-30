import {useMemo} from 'react';
import {ImageRequireSource} from 'react-native';
export type LocationInfo = {
  latitude: number;
  longitude: number;
  name?: string;
};
export type Fish = {
  id: number;
  name?: string;
  type: string;
  photo: ImageRequireSource;
  latitude: number;
  longitude: number;
  location_name: string;
  date: string;
  notes?: string;
  writer: number;
};

export type User = {
  id: number;
  fish: Fish[];
  name: string;
  email: string;
  isSubscriber: boolean;
  subscribe_at: string;
  subscribe_period: number;
  photo?: string;
};

export type TabParamList = {
  Home: undefined;
  Spots: undefined;
  Record: undefined;
  MyFish: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Main: undefined;
  AddFish: {photo: string; location: LocationInfo};
  FishDetail: {fish: Fish};
  Account: undefined;
  Language: undefined;
  HelpSupport: undefined;
  Privacy: undefined;
};

export const FishImages: Record<string, ImageRequireSource> = {
  // add all your fish types here
  Anglerfish: require('src/assets/Anglerfish.png'),
  Bass: require('src/assets/Bass.png'),
  Bluegill: require('src/assets/Bluegill.png'),
  Catfish: require('src/assets/Catfish.png'),
  Clownfish: require('src/assets/Clownfish.png'),
  Crab: require('src/assets/Crab.png'),
  Flatfish: require('src/assets/Flatfish.png'),
  Lobster: require('src/assets/Lobster.png'),
  Mackerel: require('src/assets/Mackerel.png'),
  Red_Snapper: require('src/assets/Red_Snapper.png'),
  Salmon: require('src/assets/Salmon.png'),
  Sardine: require('src/assets/Sardine.png'),
  Shark: require('src/assets/Shark.png'),
  Trout: require('src/assets/Trout.png'),
  Tuna: require('src/assets/Tuna.png'),
  Yellow_Perch: require('src/assets/Yellow_Perch.png'),
};

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface CalendarLocale {
  monthNames: string[];
  monthNamesShort: string[];
  dayNames: string[];
  dayNamesShort: string[];
  today: string;
}

export type SupportedLanguages =
  | 'en'
  | 'es'
  | 'ko'
  | 'ja'
  | 'zh'
  | 'vn'
  | 'fr'
  | 'de'
  | 'it'
  | 'pt'
  | 'ru';

export type CalendarInitType = {
  [key in SupportedLanguages]: CalendarLocale;
};
