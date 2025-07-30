import React, {useEffect, useMemo} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useToast, AlertItem} from 'context/ToastAlertContext';

type ToastComponentProps = {
  item: AlertItem;
};

const ToastComponent = React.memo(
  ({item}: ToastComponentProps): React.JSX.Element => {
    const {hideAlert} = useToast();
    const opacity = useMemo(() => new Animated.Value(0), []);
    const backgroundColorMap = {
      success: '#6fcf97',
      error: '#f76c6c',
      warning: '#f4a261',
      info: '#56ccf2',
    };

    useEffect(() => {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => hideAlert(item.id));
      }, 2000);

      return () => clearTimeout(timer);
    }, []);

    return (
      <Animated.View
        style={{
          backgroundColor: backgroundColorMap[item.type],
          opacity,
          borderRadius: 8,
          padding: 16,
          marginBottom: 20,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Ionicons
            name={
              item.type === 'success'
                ? 'checkmark-circle'
                : item.type === 'error'
                ? 'close-circle'
                : item.type === 'warning'
                ? 'warning'
                : 'information-circle'
            }
            size={24}
            color="#fff"
          />
          <Text style={styles.alertText}>{item.message}</Text>
        </View>
      </Animated.View>
    );
  },
);

const ToastAlert: React.FC = () => {
  const {alerts} = useToast();
  return (
    <View style={styles.alertBox}>
      {alerts.map((alert: AlertItem) => (
        <ToastComponent key={alert.id} item={alert} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  alertBox: {
    position: 'absolute',
    top: 90,
    left: '10%',
    right: '10%',
    zIndex: 20,
  },
  alertText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default React.memo(ToastAlert);
