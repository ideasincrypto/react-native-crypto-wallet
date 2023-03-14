import { StatusBar } from "expo-status-bar"
import React from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { NativeBaseProvider } from "native-base"
import { LinearGradient } from "expo-linear-gradient"

import { DataProvider } from "./providers/DataProvider"

import useCachedResources from "./hooks/useCachedResources"
import useColorScheme from "./hooks/useColorScheme"
import Navigation from "./navigation"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"

const App = (): JSX.Element | null => {
  const isLoadingComplete = useCachedResources()
  const colorScheme = useColorScheme()

  if (!isLoadingComplete) {
    return null
  }
  return (
    <SafeAreaProvider>
      <DataProvider>
        <NativeBaseProvider
          config={{ dependencies: { "linear-gradient": LinearGradient } }}
        >
          <BottomSheetModalProvider>
            <Navigation colorScheme={colorScheme} />
          </BottomSheetModalProvider>
        </NativeBaseProvider>
      </DataProvider>
      <StatusBar />
    </SafeAreaProvider>
  )
}

export default App
