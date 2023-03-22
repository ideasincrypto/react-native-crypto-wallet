import React from "react"
import { View, StyleSheet } from "react-native"
import { WebView } from "react-native-webview"

const PrivacyPolicyScreen = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <WebView source={{ uri: "https://colinfran.com" }} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    width: "100%",
    padding: 20,
  },
})

export default PrivacyPolicyScreen
