import { Ionicons } from "@expo/vector-icons"
import * as Font from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import React, { useEffect, useContext } from "react"
import { DataContext } from "../providers/DataProvider"

const useCachedResources = (): void => {
  // const [isLoadingComplete, setLoadingComplete] = React.useState(false)
  const { setLoading } = useContext(DataContext)
  setLoading(true)

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    const loadResourcesAndDataAsync = async (): Promise<void> => {
      try {
        SplashScreen.preventAutoHideAsync()

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          "space-mono": require("../assets/fonts/SpaceMono-Regular.ttf"),
        })
      } catch (e) {
        // add code here for error reporting service
        console.warn(e)
      } finally {
        SplashScreen.hideAsync()
        setLoading(false)
      }
    }

    loadResourcesAndDataAsync()
    // setTimeout(() => {
    //   console.log("here")
    //   setLoading(false)
    // }, 1000)
  }, [setLoading])
}

export default useCachedResources
