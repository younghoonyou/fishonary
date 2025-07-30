import React, {createContext, useState, useContext, ReactNode} from 'react';
import {Platform} from 'react-native';
import {User} from 'types';
import {
  GoogleSignin,
  isSuccessResponse,
  isCancelledResponse,
  SignInResponse,
} from '@react-native-google-signin/google-signin';
import {
  appleAuth,
  AppleRequestResponse,
  AppleCredentialState,
} from '@invertase/react-native-apple-authentication';
import {LoginManager, AccessToken, Profile} from 'react-native-fbsdk-next';
import {createUser, getDatabase, getUserInfo} from 'services/db';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import EncryptedStorage from 'react-native-encrypted-storage';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  language: string | 'en';
  login: (sns: string) => Promise<void>;
  logout: () => void;
  setLanguage: (lan: string) => void;
  setLoading: (loading: boolean) => void;
  setUpdatedUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: ReactNode}) => {
  // id: number;
  //   fish: Fish[];
  //   name: string;
  //   email: string;
  //   isSubscriber: boolean;
  //   subscribe_at: string;
  //   subscribe_period: number;
  //   photo?: string;
  const [user, setUser] = useState<User | null>({
    id: 1,
    fish: [],
    name: 'fisherman',
    email: 'fishonary@gmail.com',
    isSubscriber: false,
    subscribe_at: '',
    subscribe_period: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('en');

  const login = async (sns: string): Promise<void> => {
    setIsLoading(true);
    try {
      let user: User | null = null;
      switch (sns) {
        case 'Google':
          user = await loginWithGoogle();
          break;
        case 'Apple':
          user = await loginWithApple();
        case 'Facebook':
          user = await loginWithFacebook();
        default:
          break;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(user);
      await EncryptedStorage.setItem('user', JSON.stringify(user));
      const lan: string | null = await EncryptedStorage.getItem('language');
      setLanguage(lan || 'en');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<User | null> => {
    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo: SignInResponse = await GoogleSignin.signIn();
      if (isCancelledResponse(userInfo)) return null;
      if (!isSuccessResponse(userInfo)) return null;
      const db: SQLiteDatabase = await getDatabase();
      let user: User | null = await getUserInfo(db, userInfo?.data.user.email);
      if (!user) {
        user = await createUser(
          db,
          userInfo?.data.user.email,
          userInfo?.data.user.name,
        );
      }
      return user;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithApple = async (): Promise<User | null> => {
    setIsLoading(true);
    try {
      let user: User | null = null;
      const appleAuthRequestResponse: AppleRequestResponse =
        await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.LOGIN,
          requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        });

      const credentialState: AppleCredentialState =
        await appleAuth.getCredentialStateForUser(
          appleAuthRequestResponse.user,
        );

      if (credentialState === appleAuth.State.AUTHORIZED) {
        const db: SQLiteDatabase = await getDatabase();
        user = await getUserInfo(db, appleAuthRequestResponse.email || '');
        if (!user) {
          user = await createUser(
            db,
            appleAuthRequestResponse.email || '',
            appleAuthRequestResponse.fullName?.givenName || '',
          );
        }
      }
      return user;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithFacebook = async (): Promise<User | null> => {
    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo: any = await GoogleSignin.signIn();
      const db: SQLiteDatabase = await getDatabase();
      let user: User | null = await getUserInfo(db, userInfo?.data.email);
      if (!user) {
        user = await createUser(
          db,
          userInfo?.data.user.email,
          userInfo?.data.user.name,
        );
      }
      return user;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    await GoogleSignin.signOut();
    await LoginManager.logOut();
    setUser(null);
    await EncryptedStorage.removeItem('user');
  };

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const setUpdatedUser = (user: User) => {
    setUser(user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        language,
        setLanguage,
        setLoading,
        setUpdatedUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
