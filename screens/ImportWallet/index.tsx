import React, { useContext } from "react"
import { StyleSheet, View, Dimensions } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Button, TextArea, Input } from "native-base"

import { DataContext } from "../../providers/DataProvider"

const ImportWallet = (): JSX.Element => {
  const { wallets, setWallets } = useContext(DataContext)

  const importWallet = (): void => {
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
    <View style={styles.componentContainer}>
      <View style={styles.walletNameContainer}>
        <Input mx="3" placeholder="Wallet Name" size="2xl" w="100%" />
      </View>
      <View style={styles.walletSeedContainer}>
        <TextArea
          autoCompleteType={false}
          fontSize="lg"
          h={Dimensions.get("window").height / 3}
          maxW="100%"
          placeholder="Wallet Seed Phrase"
          w="100%"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button size="lg" onPress={() => importWallet()}>
          Import Wallet
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  componentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  walletNameContainer: {
    paddingBottom: 40,
  },
  walletSeedContainer: {
    paddingBottom: 40,
  },
  buttonContainer: {
    width: "100%",
    paddingTop: 40,
  },
})

export default ImportWallet
