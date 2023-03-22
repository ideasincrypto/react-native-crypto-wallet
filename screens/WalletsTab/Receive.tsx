import React, { useContext, useEffect, useState } from "react"
import { Button, Center, Tooltip } from "native-base"
import { View, StyleSheet, Text, useColorScheme, Share } from "react-native"
import QRCode from "react-native-qrcode-svg"
import * as Clipboard from "expo-clipboard"
import { DataContext } from "../../providers/DataProvider"
import isDarkColor from "is-dark-color"

const Recieve = (): JSX.Element => {
  const walletStr = "my4aAnuUSTPYiBVkhFd6EQ3Yss9D3ry32s"
  const [isOpen, setIsOpen] = useState(false)
  const { pickedColor } = useContext(DataContext)
  const textColor = useColorScheme() === "dark" ? "#fff" : "#000"
  const buttonLeftText = isDarkColor(pickedColor) ? "#fff" : "#000"

  const copyOnPress = async (): Promise<void> => {
    await Clipboard.setStringAsync(walletStr)
    setIsOpen(true)
    setTimeout(() => {
      setIsOpen(false)
    }, 3000)
  }

  const shareOnPress = async (): Promise<void> => {
    const result = await Share.share({
      message: walletStr,
      title: "Kaspa Wallet Address",
    })
  }

  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: "white", padding: 40, borderRadius: 20 }}>
        <QRCode
          backgroundColor="transparent"
          color={pickedColor}
          size={200}
          value={walletStr}
        />
      </View>
      <View style={{ paddingTop: 20, margin: "auto" }}>
        <View
          style={{
            alignSelf: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <Tooltip
            isOpen={isOpen}
            label="Copied to clipboard"
            placement="bottom"
            style={{ margin: "auto", alignSelf: "center" }}
          >
            <Button.Group borderColor={pickedColor} isAttached>
              <Button
                _pressed={{ style: { backgroundColor: "#fff", color: "#000" } }}
                _text={{ color: buttonLeftText }}
                alignSelf="center"
                style={{
                  backgroundColor: pickedColor,
                  borderColor: pickedColor,
                }}
                variant="outline"
                onPress={copyOnPress}
              >
                Copy
              </Button>
              <Button
                _text={{ color: textColor }}
                alignSelf="center"
                style={{ borderColor: pickedColor }}
                variant="outline"
                onPress={shareOnPress}
              >
                Share
              </Button>
            </Button.Group>
          </Tooltip>
        </View>
      </View>
      <View
        style={{
          paddingTop: 30,
          justifyContent: "center",
          alignItems: "center",
          width: "70%",
          margin: "auto",
        }}
      >
        <Text style={{ color: textColor, textAlign: "center" }}>
          Scan the QR or tap the above button to copy this wallet address to
          your clipbaord.
        </Text>
      </View>
      <View
        style={{
          width: "70%",
          margin: "auto",
          paddingTop: 30,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: textColor, textAlign: "center" }}>
          **IMPORTANT**
        </Text>
        <Text style={{ color: textColor, textAlign: "center" }}>
          Send only Kaspa (KAS) to this Address.
        </Text>
        <Text style={{ color: textColor, textAlign: "center" }}>
          Sending any other coins will result in permanent loss.
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
})

export default Recieve
