import React, { useEffect } from 'react';
import { Alert, SafeAreaView, StatusBar, StyleSheet, Platform } from 'react-native';

import AppNavigation from './src/navigations/AppNavigation';
import { Provider } from 'react-redux';
import { store, persistor } from './src/rtk/Store';
import { PersistGate } from 'redux-persist/integration/react';
import { BottomSheetProvider } from './src/context/BottomSheetContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { SocketProvider } from './src/context/socketContext';
enableScreens();


function App(): React.JSX.Element {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <SocketProvider>
            <BottomSheetProvider>
              <SafeAreaView style={styles.container}>
                <StatusBar />
                <AppNavigation />
              </SafeAreaView>
            </BottomSheetProvider>
          </SocketProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
});

export default App;
