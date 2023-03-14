import React, { useContext, useState } from "react"
import { StyleSheet, View, Dimensions, useColorScheme } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Button, TextArea, Input, Icon } from "native-base"

import { DataContext } from "../../providers/DataProvider"
import { Ionicons } from "@expo/vector-icons"

const ImportWallet = (): JSX.Element => {
  const { wallets, setWallets } = useContext(DataContext)
  const [walletName, setWalletName] = useState("")
  const [walletSeed, setWalletSeed] = useState("")

  const importWallet = (): void => {
    const newWalletObject = {
      walletName,
      walletSeed,
    }
    let newWalletArray = []
    if (wallets.length > 0) {
      newWalletArray = [...wallets, newWalletObject]
    } else {
      newWalletArray.push(newWalletObject)
    }
    setWallets(newWalletArray)
    AsyncStorage.setItem("wallets", JSON.stringify(newWalletArray))
  }

  const validSeedPhrase = (): boolean => {
    // run seed phrase validation here,
    // return true if valid seed phrase
    return walletSeed !== ""
  }

  const valid = walletName !== "" && validSeedPhrase()

  const textColor = useColorScheme() === "dark" ? "#fff" : "#000"

  return (
    <View style={styles.componentContainer}>
      <View style={styles.walletNameContainer}>
        <Input
          color={textColor}
          mx="3"
          placeholder="Wallet Name"
          returnKeyType="done"
          size="2xl"
          w="100%"
          onChangeText={(e) => setWalletName(e)}
        />
      </View>
      <View style={styles.walletSeedContainer}>
        <TextArea
          autoCompleteType={false}
          blurOnSubmit={true}
          color={textColor}
          fontSize="lg"
          h={Dimensions.get("window").height / 3}
          maxW="100%"
          placeholder="Wallet Seed Phrase"
          returnKeyType="done"
          w="100%"
          onChangeText={(e) => setWalletSeed(e)}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          isDisabled={!valid}
          leftIcon={
            <Icon
              as={Ionicons}
              name={valid ? "checkmark-circle-outline" : "warning-outline"}
              size="sm"
            />
          }
          size="lg"
          onPress={() => importWallet()}
        >
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
