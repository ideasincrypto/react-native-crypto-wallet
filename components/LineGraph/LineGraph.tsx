import React from "react"
import { StyleSheet, View } from "react-native"

import Graph from "./Graph"

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
  },
})

const LineGraph = ({ values, graphs }): JSX.Element => {
  return (
    <View style={styles.container}>
      <Graph data={values} graphs={graphs} />
    </View>
  )
}

export default LineGraph
