import React from "react"
import { View, StyleSheet } from "react-native"
import { WebView } from "react-native-webview"

const LicenseScreen = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <WebView source={{ uri: "https://reactnative.dev/" }} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
})

export default LicenseScreen
