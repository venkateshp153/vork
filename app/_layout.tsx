import { Slot } from 'expo-router';
import { Provider } from 'react-redux';
import { persistor, store } from '../redux/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect } from 'react';


function LoadingIndicator() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingIndicator />} persistor={persistor}>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <Slot />
        </View>
      </PersistGate>
    </Provider>
  );
}