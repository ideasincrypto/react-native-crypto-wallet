import React, { useContext } from "react"
import { StyleSheet, useColorScheme, View } from "react-native"
import { DataContext } from "../providers/DataProvider"
import {
  DarkTheme,
  DefaultTheme,
  useNavigation,
} from "@react-navigation/native"
import { Button, useContrastText } from "native-base"

const WalletTransact = (): JSX.Element => {
  const color = useColorScheme() === "dark" ? "#fff" : "#000"
  const { pickedColor } = useContext(DataContext)
  const navigation = useNavigation()
  const buttonBackgroundColor =
    useColorScheme() === "dark"
      ? DarkTheme.colors.background
      : DefaultTheme.colors.background

  const textColorPressed = useContrastText(pickedColor)

  return (
    <View style={[styles.container, styles.shadow, { shadowColor: color }]}>
      <View style={styles.row}>
        <View style={[styles.iconContainer]}>
          <Button.Group
            borderColor="red"
            borderRadius={15}
            colorScheme="blue"
            shadow="5"
            variant="outline"
            w="70%"
            isAttached
          >
            <Button
              _pressed={{
                style: {
                  backgroundColor: pickedColor,
                  borderColor: pickedColor,
                },
                _text: { color: textColorPressed, borderColor: pickedColor },
              }}
              _text={{ color: color }}
              backgroundColor={buttonBackgroundColor}
              style={{ borderColor: pickedColor }}
              w="50%"
              onPress={() => navigation.navigate("Send")}
            >
              Send
            </Button>
            <Button
              _pressed={{
                style: {
                  backgroundColor: pickedColor,
                  borderColor: pickedColor,
                },
                _text: { color: textColorPressed, borderColor: pickedColor },
              }}
              _text={{ color: color }}
              backgroundColor={buttonBackgroundColor}
              style={{ borderColor: pickedColor }}
              w="50%"
              onPress={() => navigation.navigate("Receive")}
            >
              Receive
            </Button>
          </Button.Group>
        </View>
      </View>
    </View>
  )
}

export default WalletTransact

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  shadow: {
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.35,
    shadowRadius: 3.5,
    elevation: 5,
  },
})
