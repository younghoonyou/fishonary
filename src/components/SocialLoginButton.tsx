import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  TouchableOpacity,
  Image,
  useColorScheme,
  Text,
  View,
  StyleSheet,
} from 'react-native';

type SocialLoginButtonProps = PropsWithChildren<{
  title: string;
  onPress: any;
}>;
const SocialLoginButton = ({
  title,
  onPress,
}: SocialLoginButtonProps): React.JSX.Element => {
  const LogoImage = (title: string) => {
    switch (title) {
      case 'Google':
        return require('src/assets/Google.png');
      case 'Apple':
        return require('src/assets/Apple.png');
      case 'Facebook':
        return require('src/assets/Facebook.png');
      default:
        return require('src/assets/Apple.png');
    }
  };
  return (
    <TouchableOpacity style={styles.Container} onPress={onPress}>
      <Image
        source={LogoImage(title)}
        resizeMode="contain"
        style={{...styles.Image, height: title === 'Facebook' ? 35 : 50}}
      />
      <View style={styles.TextContainer}>
        <Text
          style={{
            fontSize: 14,
            color: 'black',
            fontFamily: 'Robot',
            fontWeight: 'bold',
          }}>
          Continue with {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(SocialLoginButton);

const styles = StyleSheet.create({
  Container: {
    width: 300,
    height: 54,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 40,
    borderRadius: 15,
    borderWidth: 0.5,
    backgroundColor: 'white',
  },
  TextContainer: {
    width: 170,
  },
  Image: {
    height: 50,
    width: 50,
    verticalAlign: 'middle',
    borderRadius: 15,
  },
});
