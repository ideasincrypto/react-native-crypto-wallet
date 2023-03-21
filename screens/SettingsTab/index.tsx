import React, { useContext } from "react"
import { StyleSheet, Button, View } from "react-native"
import { Text } from "native-base"
import { DataContext } from "../../providers/DataProvider"
import AsyncStorage from "@react-native-async-storage/async-storage"
import SettingsScreen from "./Settings/SettingsScreen"

const SettingsTab = (): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { wallets, setWallets } = useContext(DataContext)

  const removeWallet = (): void => {
    setWallets([])
    AsyncStorage.setItem("wallets", JSON.stringify([]))
  }
  return (
    <View style={styles.container}>
      <SettingsScreen />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
})

export default SettingsTab
