import React from "react"
import { StatusBar } from "expo-status-bar"
import { useColorScheme } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { NativeBaseProvider } from "native-base"
import { LinearGradient } from "expo-linear-gradient"

import { DataProvider } from "./providers/DataProvider"

import Navigation from "./navigation"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"

const App = (): JSX.Element | null => {
  const colorScheme = useColorScheme()

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
