import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { Dimensions, StyleSheet, useColorScheme, View } from "react-native"
import { DataContext } from "../../providers/DataProvider"
import { LineChart } from "./charts/line"
import * as Haptics from "expo-haptics"
import { ChartSwitcher } from "../LineGraph/components/ChartSwitcher"
import { Skeleton } from "native-base"
import { DefaultValues } from "./components/DefaultValues"

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

const LineGraph = ({ apiData, isLoaded }): JSX.Element => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)
  const [arrayButtonsData, setArrayButtonsData] = useState([
    { prices: apiData?.day?.prices || defaultData, buttonTitle: "Day" },
  ])

  const [data, setData] = useState(apiData?.week?.prices || defaultData)

  useEffect(() => {
    if (apiData) {
      if (apiData?.day?.prices) {
        setData(apiData?.day?.prices)
      }
    }
  }, [apiData])

  const { pickedColor } = useContext(DataContext)

  useEffect(() => {
    const dayData = apiData?.day?.prices || defaultData
    const weekData = apiData?.week?.prices
    const monthData = apiData?.month?.prices
    const yearData = apiData?.year?.prices
    const allData = apiData?.all?.prices
    const arrayButtons = [{ prices: dayData, buttonTitle: "Day" }]
    if (apiData?.week?.prices.length > 0)
      arrayButtons.push({ prices: weekData, buttonTitle: "Week" })
    if (apiData?.month?.prices.length > 0)
      arrayButtons.push({ prices: monthData, buttonTitle: "Month" })
    if (apiData?.year?.prices.length > 0)
      arrayButtons.push({ prices: yearData, buttonTitle: "Year" })
    if (apiData?.all?.prices.length > 0)
      arrayButtons.push({ prices: allData, buttonTitle: "All" })
    setArrayButtonsData(arrayButtons)
  }, [apiData])

  const [min, max] = useMemo(() => {
    if (Array.isArray(data)) {
      const values = data.map((d) => d.value)
      const _min = Math.min(...values)
      const _max = Math.max(...values)
      return [
        values.findLastIndex((v) => v === _min),
        values.findLastIndex((v) => v === _max),
      ]
    }
    return [0, 0]
  }, [data])

  const textColor = useColorScheme() === "dark" ? "#fff" : "#000"

  const invokeHaptic = (): void => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  const onCurrentIndexChange = useCallback(() => {
    invokeHaptic()
  }, [])

  const onButtonPress = (element, index): void => {
    setSelectedVariantIndex(index)
    setData(element)
    invokeHaptic()
  }

  const screenWidth = Dimensions.get("window").width

  // const { min, max } = minMax
  const [showCurrentPrice, setShowCurrentPrice] = useState(true)

  const showHideCurrentPriceFunc = (): void => {
    setShowCurrentPrice(!showCurrentPrice)
  }
  return (
    <View style={styles.container}>
      <Skeleton isLoaded={isLoaded} marginBottom={1} w={screenWidth}>
        <View style={styles.buttonContainer}>
          {arrayButtonsData.map(
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
            <LineChart height={Dimensions.get("window").height < 800 ? 200 : 250}>
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
                <LineChart.Gradient color={textColor} />
              </LineChart.Path>
              <LineChart.CursorCrosshair
                color={pickedColor}
                snapToPoint={true}
                onActivated={showHideCurrentPriceFunc}
                onEnded={showHideCurrentPriceFunc}
              />
            </LineChart>
          </Skeleton>
          <Skeleton h={5} isLoaded={isLoaded} marginTop={1} w={60}>
            {showCurrentPrice ? (
              <DefaultValues
                style={{ color: textColor }}
                text={apiData?.currentPrice}
              />
            ) : (
              <LineChart.PriceText style={{ color: textColor }} />
            )}
          </Skeleton>
          <Skeleton h={5} isLoaded={isLoaded} marginTop={1} w={156}>
            {showCurrentPrice ? (
              <DefaultValues
                style={{ color: textColor }}
                text={new Date().toLocaleString() as any}
              />
            ) : (
              <LineChart.DatetimeText style={{ color: textColor }} />
            )}
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
    paddingTop: 0,
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
