import React, { useState, useRef, useEffect } from "react"
import { StyleSheet, View, Dimensions, useColorScheme } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { Button, Box, Text } from "native-base"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import * as Haptics from "expo-haptics"

import { RootStackParamList } from "../../types"
import BottomSheet from "../../components/BottomSheet"
import UserResponsibility from "../../components/UserResponsibility"

const CreateWalletStep1 = ({
  navigation,
}: StackScreenProps<RootStackParamList, "CreateWalletStep1">): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [checkbox1, setCheckbox1] = useState(false)
  const [checkbox2, setCheckbox2] = useState(false)
  const [checkbox3, setCheckbox3] = useState(false)

  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false)

  const openBottomSheet = (): void => {
    setBottomSheetOpen(true)
    bottomSheetModalRef.current?.present()
  }

  const closeBottomSheet = (): void => {
    setTimeout(() => {
      setBottomSheetOpen(false)
      bottomSheetModalRef.current?.dismiss()
    }, 50)
  }

  const onCheckboxPress = (checkbox: number): void => {
    if (checkbox === 1) {
      setCheckbox1(!checkbox1)
    } else if (checkbox === 2) {
      setCheckbox2(!checkbox2)
    } else {
      setCheckbox3(!checkbox3)
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
  }

  useEffect(() => {
    setCheckbox1(false)
    setCheckbox2(false)
    setCheckbox3(false)
    setBottomSheetOpen(false)
  }, [])

  const DARK_COLORS = ["#4c669f", "#3b5998", "#192f6a"]
  const LIGHT_COLORS = ["#0077c2", "#00a1ff", "#00c2ff"]

  const textColor = useColorScheme() === "dark" ? "#fff" : "#000"

  return (
    <View style={{ position: "relative", flex: 1 }}>
      <View style={styles.componentContainer}>
        <View style={styles.logoContainer}>
          <Box
            _text={{
              fontSize: "md",
              fontWeight: "medium",
              color: "warmGray.50",
            }}
            bg={{
              linearGradient: {
                colors: bottomSheetOpen ? DARK_COLORS : LIGHT_COLORS,
                start: [0, 0],
                end: [1, 0],
              },
            }}
            p="12"
            rounded="xl"
            style={[styles.boxLogo]}
          >
            Vault Logo
          </Box>
        </View>
        <View style={styles.textAndButtonContainer}>
          <View style={styles.textContainer}>
            <Text color={textColor} fontSize="2xl" bold>
              Back up secret phrase
            </Text>
            <Text color={textColor} fontSize="md">
              Your secret phrase is the key to your wallet. Never share it and
              do not lose it.
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              size="lg"
              variant="outline"
              onPress={() => openBottomSheet()}
            >
              Create Wallet
            </Button>
          </View>
        </View>
        <BottomSheet
          bottomSheetModalRef={bottomSheetModalRef}
          handleComponent={() => (
            <View style={styles.headerContainer}>
              <Button
                size="lg"
                variant="link"
                onPress={() => closeBottomSheet()}
              >
                Back
              </Button>
            </View>
          )}
        >
          <View style={styles.contentContainer}>
            <UserResponsibility
              checkbox1={checkbox1}
              checkbox2={checkbox2}
              checkbox3={checkbox3}
              onCheckboxPress={onCheckboxPress}
            />
            <View style={styles.continueButton}>
              <Button
                isDisabled={!(checkbox1 && checkbox2 && checkbox3)}
                onPress={() => {
                  bottomSheetModalRef.current?.dismiss()
                  navigation.navigate("CreateWalletStep2")
                }}
              >
                Continue
              </Button>
            </View>
          </View>
        </BottomSheet>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  componentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    padding: 20,
    zIndex: 0,
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingTop: 40,
    paddingBottom: 40,
    backgroundColor: "transparent",
  },
  textAndButtonContainer: {
    flex: 1,
    width: "100%",
  },
  textContainer: {
    paddingBottom: 40,
  },
  buttonContainer: {
    paddingBottom: 40,
  },
  boxLogo: {
    flex: 1,
    width: "100%",
    height: Dimensions.get("window").height / 3,
    justifyContent: "center",
    alignItems: "center",
  },
  boxCheckbox: {
    width: "100%",
  },
  boxCheckboxView: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 30,
    padding: 20,
  },
  checkboxText: {
    flexWrap: "wrap",
    paddingLeft: 20,
    paddingRight: 20,
    flexGrow: 1,
    flexShrink: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "lightgrey",
    padding: 40,
  },
  headerContainer: {
    backgroundColor: "lightgrey",
    flex: 1,
    alignItems: "flex-start",
    paddingLeft: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  continueButton: {
    width: "100%",
    paddingTop: 40,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
  },
})

export default CreateWalletStep1
