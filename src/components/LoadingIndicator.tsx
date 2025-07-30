import {useAuth} from 'context/AuthContext';
import React from 'react';
import {View, ActivityIndicator, Dimensions} from 'react-native';

const LoadingIndicator = (): React.JSX.Element => {
  const {isLoading} = useAuth();
  return (
    <>
      {isLoading && (
        <View
          style={{
            width: Dimensions.get('screen').width,
            height: Dimensions.get('screen').height,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
          }}>
          <ActivityIndicator
            size="small"
            color="white"
            style={{transform: [{scale: 50 / 30}]}}
          />
        </View>
      )}
    </>
  );
};

export default React.memo(LoadingIndicator);
