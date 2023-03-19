import React from "react"
import { StyleSheet, View } from "react-native"

import Graph from "./Graph"

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "white",
    justifyContent: "space-between",
  },
})

const LineGraph = ({ values }): JSX.Element => {
  return (
    <View style={styles.container}>
      <Graph data={values} />
    </View>
  )
}

export default LineGraph