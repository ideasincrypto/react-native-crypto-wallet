import React, { useContext } from "react"
import { StyleSheet, Text, View, Button } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

import { DataContext } from "../../providers/DataProvider"

const CreateWalletStep3 = (): JSX.Element => {
  const { wallets, setWallets } = useContext(DataContext)

  const addWallet = (): void => {
    const newWalletObject = {}
    let newWalletArray = []
    if (wallets.length > 0) {
      newWalletArray = [...wallets, newWalletObject]
    } else {
      newWalletArray.push(newWalletObject)
    }
    setWallets(newWalletArray)
    AsyncStorage.setItem("wallets", JSON.stringify(newWalletArray))
  }

  return (
    <View style={styles.container}>
      <Text>CreateWalletStep3</Text>
      <View>
        <Button title="Continue" onPress={() => addWallet()} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  inputBox: {
    width: "85%",
    margin: 10,
    padding: 15,
    fontSize: 16,
    borderColor: "#d3d3d3",
    color: "#333",
    borderBottomWidth: 1,
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
  buttonWrap: {
    marginTop: 10,
  },
})

export default CreateWalletStep3
