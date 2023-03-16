import React from "react"
import {
  View,
  GestureResponderEvent,
  TouchableOpacity,
  useColorScheme,
  StyleSheet,
} from "react-native"
import { Text } from "native-base"

const ChartSwitcher = ({
  label,
  enabled,
  onPress,
}: {
  label: string
  enabled: boolean
  onPress?: (event: GestureResponderEvent) => void
}): JSX.Element => {
  const textColor = useColorScheme() === "dark" ? "#fff" : "#000"
  return (
    <TouchableOpacity
      style={{
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 40,
        height: 40,
        width: 40,
        flex: 1,
        backgroundColor: enabled ? "#6a7ee7" : "transparent",
      }}
      onPress={onPress}
    >
      <Text color={textColor}>{label}</Text>
    </TouchableOpacity>
  )
}

const GRAPH_INTERVAL_1D_PARAM = "1D"
const GRAPH_INTERVAL_1W_PARAM = "1W"
const GRAPH_INTERVAL_1M_PARAM = "1M"
const GRAPH_INTERVAL_1Y_PARAM = "1Y"
const GRAPH_INTERVAL_ALL_PARAM = "ALL"

export const ChartSwitcherList = ({
  graphInterval,
  setGraphInterval,
  setGraphLoading,
}): JSX.Element => {
  const switchFunction = (interval): void => {
    setGraphInterval(interval)
    setGraphLoading(true)
    setTimeout(() => {
      setGraphLoading(false)
    }, 1000)
  }
  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <ChartSwitcher
          enabled={graphInterval === GRAPH_INTERVAL_1D_PARAM}
          label="1D"
          onPress={() => {
            switchFunction("1D")
            
          }}
        />
        <ChartSwitcher
          enabled={graphInterval === GRAPH_INTERVAL_1W_PARAM}
          label="1W"
          onPress={() => {
            switchFunction("1W")
          }}
        />

        <ChartSwitcher
          enabled={graphInterval === GRAPH_INTERVAL_1M_PARAM}
          label="1M"
          onPress={() => {
            switchFunction("1M")
          }}
        />
        <ChartSwitcher
          enabled={graphInterval === GRAPH_INTERVAL_1Y_PARAM}
          label="1Y"
          onPress={() => {
            switchFunction("1Y")
          }}
        />
        <ChartSwitcher
          enabled={graphInterval === GRAPH_INTERVAL_ALL_PARAM}
          label="ALL"
          onPress={() => {
            switchFunction("ALL")
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
  },
})
