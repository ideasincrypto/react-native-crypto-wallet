import React, { useCallback, useContext, useMemo, useState } from "react"
import { Button, StyleSheet, useColorScheme, View } from "react-native"
// import { LineChart } from "react-native-wagmi-charts"
import { DataContext } from "../providers/DataProvider"
import { LineChart } from "./WagmiCharts"
// import { LineChart } from "react-native-wagmi-charts"
// import { LineChart } from "@colinfran/react-native-wagmi-charts"
import * as Haptics from "expo-haptics"
import { ChartSwitcher } from "./WagmiCharts/components/ChartSwitcher"

const LineGraph = ({ apiData }): JSX.Element => {
  const [data, setData] = useState(apiData.week.prices)
  const { pickedColor } = useContext(DataContext)

  const arrayButtons = [
    { prices: apiData.day.prices, buttonTitle: "Day" },
    { prices: apiData.week.prices, buttonTitle: "Week" },
    { prices: apiData.month.prices, buttonTitle: "Month" },
    { prices: apiData.year.prices, buttonTitle: "Year" },
    { prices: apiData.all.prices, buttonTitle: "All" },
  ]

  const [min, max] = useMemo(() => {
    if (Array.isArray(data)) {
      const values = data.map((d) => d.value)
      // console.log(values)

      const _min = Math.min(...values)
      // console.log(_min)

      const _max = Math.max(...values)
      return [
        values.findLastIndex((v) => v === _min),
        values.findLastIndex((v) => v === _max),
      ]
    }
    return [0, 0]
  }, [data])

  // console.log(min, max)
  const textColor = useColorScheme() === "dark" ? "#fff" : "#000"

  const invokeHaptic = (): void => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  const onCurrentIndexChange = useCallback((index: number) => {
    invokeHaptic()
  }, [])

  const onButtonPress = (element): void => {
    setData(element)
    invokeHaptic()
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {arrayButtons.map(
          (element) =>
            element.prices.lenth !== 0 && (
              <ChartSwitcher
                enabled={element.prices === data}
                key={element.buttonTitle}
                label={element.buttonTitle}
                onPress={() => onButtonPress(element.prices)}
              />
            )
        )}
      </View>
      <View style={styles.graph}>
        <LineChart.Provider
          data={data}
          onCurrentIndexChange={onCurrentIndexChange}
        >
          <LineChart height={250}>
            <LineChart.Path color={pickedColor}>
              <LineChart.Tooltip
                at={max}
                position="top"
                textStyle={{ color: textColor, zIndex: 100 }}
                // xGutter={0}
                yGutter={-5}
              />
              <LineChart.Tooltip
                at={min}
                position="bottom"
                textStyle={{ color: textColor, zIndex: 100 }}
                // xGutter={0}
                yGutter={-5}
              />
              <LineChart.Gradient />
            </LineChart.Path>
            <LineChart.CursorCrosshair color={pickedColor} snapToPoint={true} />
          </LineChart>
          <LineChart.PriceText style={{ color: textColor }} />
          <LineChart.DatetimeText style={{ color: textColor }} />
        </LineChart.Provider>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // alignItems: "center",
    width: "100%",
    padding: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 20,
    paddingTop: 0,
  },
  graph: {
    alignItems: "center",
    justifyContent: "space-evenly",
  },
})

export default LineGraph
