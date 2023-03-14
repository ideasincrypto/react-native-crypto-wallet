import { StatusBar } from "expo-status-bar"
import React, { useContext } from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { NativeBaseProvider } from "native-base"
import { LinearGradient } from "expo-linear-gradient"

import { DataContext, DataProvider } from "./providers/DataProvider"

import useCachedResources from "./hooks/useCachedResources"
import useColorScheme from "./hooks/useColorScheme"
import Navigation from "./navigation"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"

const App = (): JSX.Element | null => {
  const { loading, setLoading } = useContext(DataContext)
  // console.log(loading)
  useCachedResources()
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
