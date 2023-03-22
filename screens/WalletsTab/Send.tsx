import React from "react"
import { View, StyleSheet, Text } from "react-native"

const Send = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <Text>Send Screen</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
})

export default Send
