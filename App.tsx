import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NativeBaseProvider, Box } from "native-base";
const LinearGradient = require('expo-linear-gradient').LinearGradient;

import { DataProvider } from './providers/DataProvider';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

const App = () => {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
        <SafeAreaProvider>
          <DataProvider>
            <NativeBaseProvider config={{dependencies: {'linear-gradient': LinearGradient}}}>
              <Navigation colorScheme={colorScheme} />
            </NativeBaseProvider>
          </DataProvider>
          <StatusBar />
        </SafeAreaProvider>
    );
  }
}

export default App;
