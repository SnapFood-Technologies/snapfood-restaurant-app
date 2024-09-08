import React,{useEffect} from 'react';
import {Keyboard, TouchableWithoutFeedback } from 'react-native';
import {Provider} from 'react-redux';
import store from './src/index';
import IntroScreen from './IntroScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';

console.disableYellowBox = true;

const App = () => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);
  return (
    <SafeAreaProvider>
        <Provider store={store}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <IntroScreen />
            </TouchableWithoutFeedback>
        </Provider>
      </SafeAreaProvider>
  );
}

export default App;
