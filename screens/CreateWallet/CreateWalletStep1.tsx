import React, { useState, useRef, useEffect } from "react"
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  useColorScheme,
} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { Button, Box, Text, Checkbox } from "native-base"
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  useBottomSheetTimingConfigs,
} from "@gorhom/bottom-sheet"

import { RootStackParamList } from "../../types"

const CreateWalletStep1 = ({
  navigation,
}: StackScreenProps<RootStackParamList, "CreateWalletStep1">): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [opacity, setOpacity] = useState(new Animated.Value(0))

  const [checkbox1, setCheckbox1] = useState(false)
  const [checkbox2, setCheckbox2] = useState(false)
  const [checkbox3, setCheckbox3] = useState(false)

  const [bottomSheetOpen, setBottomSheetOpen] = useState(false)

  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  // const handleSheetChanges = () => {
  //   setBottomSheetOpen(!bottomSheetOpen)
  // };

  const openBottomSheet = (): void => {
    setBottomSheetOpen(true)
    bottomSheetModalRef.current?.present()
    Animated.timing(opacity, {
      toValue: 0.7,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  const closeBottomSheet = (): void => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start()
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
  }

  useEffect(() => {
    setCheckbox1(false)
    setCheckbox2(false)
    setCheckbox3(false)
  }, [bottomSheetOpen])

  const DARK_COLORS = ["#4c669f", "#3b5998", "#192f6a"]
  const LIGHT_COLORS = ["#0077c2", "#00a1ff", "#00c2ff"]

  const textColor = useColorScheme() === "dark" ? "#fff" : "#000"

  return (
    <View style={{ position: "relative", flex: 1 }}>
      <BottomSheetModalProvider>
        {bottomSheetOpen && (
          <Animated.View style={[styles.backdrop, { opacity }]} />
        )}
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
          <BottomSheetModal
            animationConfigs={useBottomSheetTimingConfigs({
              duration: 100,
            })}
            enableHandlePanningGesture={false}
            enablePanDownToClose={false}
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
            ref={bottomSheetModalRef}
            snapPoints={["80%"]}
            style={{ zIndex: 5 }}
          >
            <View style={styles.contentContainer}>
              <View>
                <View>
                  <Box bg="gray.100" rounded="xl" style={styles.boxCheckbox}>
                    <View style={styles.boxCheckboxView}>
                      <Box style={{ gap: 40 }} width="100%">
                        <Checkbox
                          _text={{ width: "100%" }}
                          isChecked={checkbox1}
                          value="one"
                          width={"100%"}
                          onChange={() => onCheckboxPress(1)}
                        >
                          <Text style={styles.checkboxText}>
                            If I lose my secret phrase, I will not be able to
                            recover this wallet
                          </Text>
                        </Checkbox>
                        <Checkbox
                          _text={{ width: "100%" }}
                          isChecked={checkbox2}
                          value="two"
                          width={"100%"}
                          onChange={() => onCheckboxPress(2)}
                        >
                          <Text style={styles.checkboxText}>
                            I am responsible for any issue that happens when
                            using this wallet.
                          </Text>
                        </Checkbox>
                        <Checkbox
                          _text={{ width: "100%" }}
                          isChecked={checkbox3}
                          value="three"
                          width={"100%"}
                          onChange={() => onCheckboxPress(3)}
                        >
                          <Text style={styles.checkboxText}>
                            I am ready to create my new wallet.
                          </Text>
                        </Checkbox>
                      </Box>
                    </View>
                  </Box>
                </View>
              </View>
              <View style={styles.continueButton}>
                <Button
                  isDisabled={!(checkbox1 && checkbox2 && checkbox3)}
                  onPress={() => navigation.navigate("CreateWalletStep2")}
                >
                  Continue
                </Button>
              </View>
            </View>
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
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
