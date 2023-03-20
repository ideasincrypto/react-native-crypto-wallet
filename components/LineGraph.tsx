import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { Dimensions, StyleSheet, useColorScheme, View } from "react-native"
// import { LineChart } from "react-native-wagmi-charts"
import { DataContext } from "../providers/DataProvider"
import { LineChart } from "./WagmiCharts"
// import { LineChart } from "react-native-wagmi-charts"
// import { LineChart } from "@colinfran/react-native-wagmi-charts"
import * as Haptics from "expo-haptics"
import { ChartSwitcher } from "./WagmiCharts/components/ChartSwitcher"
import { Skeleton } from "native-base"

const LineGraph = ({ apiData, isLoaded }): JSX.Element => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)

  const [data, setData] = useState(
    apiData?.week?.prices || [
      {
        timestamp: 1679246714543,
        value: 0.014540020460445197,
      },
      {
        timestamp: 1679247047789,
        value: 0.014571506674731024,
      },
      {
        timestamp: 1679247288167,
        value: 0.014452072671740143,
      },
    ]
  )

  useEffect(() => {
    if (apiData) {
      if (apiData?.day?.prices) {
        setData(apiData?.day?.prices)
      }
    }
  }, [apiData])

  const { pickedColor } = useContext(DataContext)

  const defaultData = [
    {
      timestamp: 1679246714543,
      value: 0.014540020460445197,
    },
    {
      timestamp: 1679247047789,
      value: 0.014571506674731024,
    },
    {
      timestamp: 1679247288167,
      value: 0.014452072671740143,
    },
  ]

  const dayData = apiData?.day?.prices || defaultData
  const weekData = apiData?.week?.prices || defaultData
  const monthData = apiData?.month?.prices || defaultData
  const yearData = apiData?.year?.prices || defaultData
  const allData = apiData?.all?.prices || defaultData

  const arrayButtons = [
    { prices: dayData, buttonTitle: "Day" },
    { prices: weekData, buttonTitle: "Week" },
    { prices: monthData, buttonTitle: "Month" },
    { prices: yearData, buttonTitle: "Year" },
    { prices: allData, buttonTitle: "All" },
  ]

  // const [minMax, setMinMax] = useState({ min: 0, max: 0 })

  // useEffect(() => {
  //   let obj = { min: 0, max: 0 }
  //   if (Array.isArray(data)) {
  //     const values = data.map((d) => d.value)
  //     const _min = Math.min(...values)
  //     const _max = Math.max(...values)
  //     obj.min = values.findIndex((v) => v === _min)
  //     obj.max = values.findIndex((v) => v === _max)
  //   }
  //   setMinMax(obj)
  // }, [data])

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
    console.log("not an array")
    return [0, 0]
  }, [data])

  // console.log(min, max)
  const textColor = useColorScheme() === "dark" ? "#fff" : "#000"

  const invokeHaptic = (): void => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  const onCurrentIndexChange = useCallback((index: number) => {
    console.log(index)
    invokeHaptic()
  }, [])

  const onButtonPress = (element, index): void => {
    setSelectedVariantIndex(index)
    setData(element)
    invokeHaptic()
  }

  const screenWidth = Dimensions.get("window").width

  // const { min, max } = minMax

  return (
    <View style={styles.container}>
      <Skeleton isLoaded={isLoaded} marginBottom={1} w={screenWidth}>
        <View style={styles.buttonContainer}>
          {arrayButtons.map(
            (element, i) =>
              element.prices.lenth !== 0 && (
                <ChartSwitcher
                  enabled={i === selectedVariantIndex}
                  key={element.buttonTitle}
                  label={element.buttonTitle}
                  onPress={() => onButtonPress(element.prices, i)}
                />
              )
          )}
        </View>
      </Skeleton>
      <View style={styles.graph}>
        <LineChart.Provider
          data={data}
          onCurrentIndexChange={onCurrentIndexChange}
        >
          <Skeleton
            h={250}
            isLoaded={isLoaded}
            w={Dimensions.get("window").width}
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
              <LineChart.CursorCrosshair
                color={pickedColor}
                snapToPoint={true}
              />
            </LineChart>
          </Skeleton>
          <Skeleton h={5} isLoaded={isLoaded} marginTop={1} w={60}>
            <LineChart.PriceText style={{ color: textColor }} />
          </Skeleton>
          <Skeleton h={5} isLoaded={isLoaded} marginTop={1} w={156}>
            <LineChart.DatetimeText style={{ color: textColor }} />
          </Skeleton>
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
