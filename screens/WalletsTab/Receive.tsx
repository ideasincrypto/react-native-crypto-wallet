import { Button } from "native-base"
import React from "react"
import { View, StyleSheet, Text } from "react-native"
import QRCode from "react-native-qrcode-svg"

const Recieve = (): JSX.Element => {
  const walletStr = "my4aAnuUSTPYiBVkhFd6EQ3Yss9D3ry32s"
  return (
    <View style={styles.container}>
      <View>
        <QRCode size={200} value={walletStr} />
      </View>
      <View style={{ paddingTop: 50 }}>
        <Button size="sm" variant="outline">
          {walletStr}
        </Button>
      </View>
      <View style={{ paddingTop: 30, justifyContent:'center', alignItems:"center" }}>
        <Text>Send only Kaspa (KAS) to this Address.</Text>
        <Text>Sending any other coins may result in permanent loss.</Text>
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
