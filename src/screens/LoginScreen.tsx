import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from 'types';
import {useAuth} from 'context/AuthContext';
import {Platform} from 'react-native';
import SocialLoginButton from 'components/SocialLoginButton';

type LoginScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen = ({navigation}: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {login, isLoading} = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      await login('Google');
      // Navigation will be handled by AppNavigator based on auth state
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await login('Google');
    } catch (error) {
      Alert.alert('Google Login Failed', 'Unable to sign in with Google');
    }
  };

  const handleAppleLogin = async () => {
    try {
      await login('Apple');
    } catch (error) {
      Alert.alert('Apple Login Failed', 'Unable to sign in with Apple');
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await login('FaceBook');
    } catch (error) {
      Alert.alert('Facebook Login Failed', 'Unable to sign in with Facebook');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fishonary</Text>
      <View style={styles.form}>
        <Image
          source={require('assets/logo.png')}
          style={{height: 100, width: 150}}
        />
        {/* <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="gray"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="gray"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={isLoading}>
          <Text style={styles.buttonText}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity> */}
        {/* <Text>Don't have an account? Sign up</Text>
        <Text>Forgot Email or Password?</Text> */}

        {/* <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View> */}

        <SocialLoginButton title="Google" onPress={handleGoogleLogin} />
        {Platform.OS === 'ios' && (
          <SocialLoginButton title="Apple" onPress={handleAppleLogin} />
        )}
        <SocialLoginButton title="Facebook" onPress={handleFacebookLogin} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#7eb9cd',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
  },
  form: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    width: '100%',
    backgroundColor: '#7eb9cd',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#666',
    fontSize: 14,
  },
  oauthButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
  },
  oauthButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
  googleButton: {
    backgroundColor: '#4285f4',
    borderColor: '#4285f4',
  },
  appleButton: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  appleButtonText: {
    color: 'white',
  },
  facebookButton: {
    backgroundColor: '#1877f2',
    borderColor: '#1877f2',
  },
});

export default React.memo(LoginScreen);
