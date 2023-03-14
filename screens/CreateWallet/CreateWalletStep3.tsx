import React, { useContext, useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Button, Text, Input, Icon } from "native-base"
import ordinal from "ordinal"
import { Ionicons } from "@expo/vector-icons"

import { DataContext } from "../../providers/DataProvider"
import { useColorScheme } from "react-native"

const randomUniqueIntegers = (total, quantity): number[] => {
  const numbers = Array(total)
    .fill(null)
    .map((_, i) => i + 1)

  return numbers
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
    .slice(0, quantity)
}

const CreateWalletStep3 = (): JSX.Element => {
  const { wallets, setWallets, seed } = useContext(DataContext)
  const [input1, setInput1] = useState("")
  const [input2, setInput2] = useState("")
  const [input3, setInput3] = useState("")

  const [seedArrayIndexes, setSeedArrayIndexes] = useState<number[]>([])
  const [seedArrayValues, setSeedArrayValues] = useState<string[]>([])

  const [walletName, setWalletName] = useState("")

  useEffect(() => {
    // Generate Random Seed Phrase

    // pick 3 random indexes between 0 and 11 (1-12)
    const arrayIndexes = randomUniqueIntegers(12, 3)
    setSeedArrayIndexes(arrayIndexes)
    // those 3 random indexes will be used as the
    // nth seed value for the user to input and match
    const arrayValues = (): string[] => arrayIndexes.map((idx) => seed[idx - 1])
    setSeedArrayValues(arrayValues())
  }, [seed])

  // dirt cash post pause use beyond actual view autumn near panel empower
  const addWallet = (): void => {
    const newWalletObject = {
      walletName,
      walletSeed: seed.join(" "),
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
  const validInputtedSeed =
    input1 === seedArrayValues[0] &&
    input2 === seedArrayValues[1] &&
    input3 === seedArrayValues[2] &&
    walletName !== ""

  const textColor = useColorScheme() === "dark" ? "#fff" : "#000"
  console.log("seedArrayIndexes", seedArrayIndexes)
  console.log("seedArrayValues", seedArrayValues)
  console.log("\n")
  return (
    <View style={styles.container}>
      <View>
        <Text color={textColor} fontSize="2xl" bold>
          Verify your new phrase
        </Text>
      </View>
      {seedArrayValues.length !== 0 && seedArrayIndexes.length !== 0 && (
        <View style={styles.inputContainerWrapper}>
          <View style={styles.inputContainerWrapper}>
            <View style={styles.inputContainer}>
              <Input
                autoCapitalize="none"
                placeholder={`${ordinal(seedArrayIndexes[0])} word`}
                size="lg"
                variant="outline"
                onChangeText={(e) => setInput1(e)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Input
                autoCapitalize="none"
                placeholder={`${ordinal(seedArrayIndexes[1])} word`}
                size="lg"
                variant="outline"
                onChangeText={(e) => setInput2(e)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Input
                autoCapitalize="none"
                placeholder={`${ordinal(seedArrayIndexes[2])} word`}
                size="lg"
                variant="outline"
                onChangeText={(e) => setInput3(e)}
              />
            </View>
          </View>
          <View style={styles.walletName}>
            <View style={styles.walletNameView}>
              <Text color={textColor} fontSize="2xl" bold>
                Wallet Name
              </Text>
            </View>
            <View style={styles.walletNameInput}>
              <Input
                autoCapitalize="none"
                placeholder="Wallet 1"
                size="lg"
                variant="outline"
                onChangeText={(e) => setWalletName(e)}
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              isDisabled={!validInputtedSeed}
              leftIcon={
                <Icon
                  as={Ionicons}
                  name={
                    validInputtedSeed
                      ? "checkmark-circle-outline"
                      : "warning-outline"
                  }
                  size="sm"
                />
              }
              onPress={() => addWallet()}
            >
              Continue
            </Button>
          </View>
        </View>
      )}
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
  inputContainerWrapper: {
    width: "100%",
  },
  inputContainer: {
    paddingTop: 40,
  },
  buttonContainer: {
    paddingTop: 40,
    justifyContent: "center",
    textAlign: "center",
  },
  walletName: {
    paddingTop: 60,
    paddingBottom: 20,
    justifyContent: "center",
    textAlign: "center",
  },
  walletNameInput: {
    paddingTop: 40,
  },
  walletNameView: {
    alignItems: "center",
    justifyContent: "center",
  },
})

export default CreateWalletStep3
