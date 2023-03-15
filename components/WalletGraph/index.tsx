import React, { useMemo, useState, useContext, useEffect } from "react"
import { View, StyleSheet, Text, useColorScheme } from "react-native"
import * as Haptics from "expo-haptics"
import * as Device from "expo-device"

import { GraphPoint, LineGraph } from "react-native-graph"
import { SelectionDot } from "./selectiondot"
import { generateRandomGraphData } from "./data"
import { ChartSwitcher } from "./chartswitcher"
import { GraphRange } from "./types"
import { DataContext } from "../../providers/DataProvider"
import dayjs from "dayjs"
import moment from "moment"
import Loading from "../../screens/Loading"

const POINT_COUNT = 70
const POINTS = generateRandomGraphData(POINT_COUNT)
// const COLOR = "#6a7ee7"
const GRADIENT_FILL_COLORS = ["#7476df5D", "#7476df4D", "#7476df00"]

type GraphIntervalType =
  | typeof GRAPH_INTERVAL_1H_PARAM
  | typeof GRAPH_INTERVAL_1D_PARAM
  | typeof GRAPH_INTERVAL_1W_PARAM
  | typeof GRAPH_INTERVAL_1M_PARAM
  | typeof GRAPH_INTERVAL_1Y_PARAM
  | typeof GRAPH_INTERVAL_ALL_PARAM

const GRAPH_INTERVAL_1H_PARAM = "&interval=1h"
const GRAPH_INTERVAL_1D_PARAM = "&interval=1d"
const GRAPH_INTERVAL_1W_PARAM = "&interval=1w"
const GRAPH_INTERVAL_1M_PARAM = "&interval=1m"
const GRAPH_INTERVAL_1Y_PARAM = "&interval=1y"
const GRAPH_INTERVAL_ALL_PARAM = "&interval=3m"

const minute = 60 * 1000
const hour = 60 * minute
const day = 24 * hour
const week = 7 * day
const month = 30 * day
const year = 12 * month

export const WalletGraph = (): JSX.Element => {
  const [points, setPoints] = useState([{ date: new Date(), value: 0 }])
  const [enableRange] = useState(false)

  const getData = async (range): void => {
    const rangeObj = {
      to: moment().unix(),
      from: moment().unix(),
    }
    switch (range) {
      case "1D":
        rangeObj.from = moment().subtract(1, "days").unix()
        break
      case "1W":
        rangeObj.from = moment().subtract(1, "weeks").unix()
        break
      case "1M":
        rangeObj.from = moment().subtract(1, "months").unix()
        break
      case "1Y":
        rangeObj.from = moment().subtract(1, "years").unix()
        break
      case "ALL":
        rangeObj.from = 10000
        break
      default:
        // 1hr
        rangeObj.from = moment().subtract(1, "hours").unix()
        break
    }
    try {
      // eslint-disable-next-line max-len
      const url = `https://api.coingecko.com/api/v3/coins/kaspa/market_chart/range?vs_currency=usd&from=${rangeObj.from}&to=${rangeObj.to}`
      console.log(url)
      const response = await fetch(url)
      const { prices } = await response.json()
      const arrayOfObjects: GraphPoint[] = prices?.map((x: number | Date) => ({
        date: new Date(x[0]),
        value: x[1],
      }))
      // console.log(prices)
      console.log(arrayOfObjects)
      setPoints(arrayOfObjects)
      // return json.movies
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getData("1H")
  }, [])

  const { pickedColor } = useContext(DataContext)

  const textColor = useColorScheme() === "dark" ? "#fff" : "#000"

  const [value, setValue] = useState<GraphPoint>({
    date: new Date("2000-02-10T08:00:00.000Z"),
    value: 0,
  })

  const [graphInterval, setGraphInterval] = useState<GraphIntervalType>(
    GRAPH_INTERVAL_1H_PARAM
  )

  const highestDate = useMemo(
    () =>
      points.length !== 0 && points[points.length - 1] !== null
        ? points[points.length - 1]?.date
        : undefined,
    [points]
  )
  const range: GraphRange | undefined = useMemo(() => {
    // if range is disabled, default to infinite range (undefined)
    if (!enableRange) return undefined

    if (points.length !== 0 && highestDate != null) {
      return {
        x: {
          min: points[0]?.date,
          max: new Date(highestDate.getTime() + 50 * 1000 * 60 * 60 * 24),
        },
        y: {
          min: -200,
          max: 200,
        },
      }
    } else {
      return {
        y: {
          min: -200,
          max: 200,
        },
      }
    }
  }, [enableRange, highestDate, points])
  // console.log(POINTS)
  return (
    <View style={[styles.container]}>
      <View style={styles.chartContainer}>
        <ChartSwitcher
          enabled={graphInterval === GRAPH_INTERVAL_1H_PARAM}
          label="1H"
          onPress={() => {
            setGraphInterval(GRAPH_INTERVAL_1H_PARAM)
            getData("1H")
          }}
        />
        <ChartSwitcher
          enabled={graphInterval === GRAPH_INTERVAL_1D_PARAM}
          label="1D"
          onPress={() => {
            setGraphInterval(GRAPH_INTERVAL_1D_PARAM)
            getData("1D")
          }}
        />
        <ChartSwitcher
          enabled={graphInterval === GRAPH_INTERVAL_1W_PARAM}
          label="1W"
          onPress={() => {
            setGraphInterval(GRAPH_INTERVAL_1W_PARAM)
            getData("1W")
          }}
        />

        <ChartSwitcher
          enabled={graphInterval === GRAPH_INTERVAL_1M_PARAM}
          label="1M"
          onPress={() => {
            setGraphInterval(GRAPH_INTERVAL_1M_PARAM)
            getData("1M")
          }}
        />
        <ChartSwitcher
          enabled={graphInterval === GRAPH_INTERVAL_1Y_PARAM}
          label="1Y"
          onPress={() => {
            setGraphInterval(GRAPH_INTERVAL_1Y_PARAM)
            getData("1Y")
          }}
        />
        <ChartSwitcher
          enabled={graphInterval === GRAPH_INTERVAL_ALL_PARAM}
          label="ALL"
          onPress={() => {
            setGraphInterval(GRAPH_INTERVAL_ALL_PARAM)
            getData("ALL")
          }}
        />
      </View>
      <View>
        {!points ? (
          <Loading />
        ) : (
          <LineGraph
            animated={true}
            color={pickedColor}
            enableFadeInMask={true}
            enableIndicator={true}
            enablePanGesture={true}
            gradientFillColors={GRADIENT_FILL_COLORS}
            panGestureDelay={0}
            points={points}
            range={range}
            SelectionDot={SelectionDot}
            style={styles.graph}
            onGestureStart={() =>
              Device.isDevice &&
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
            }
            onPointSelected={(p) => setValue(p)}
          />
        )}
      </View>
      <Text style={{ color: textColor }}>Test</Text>
      <Text style={{ color: textColor }}>{value.value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  spacer: {
    flexGrow: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    // paddingHorizontal: 15,
  },
  graph: {
    alignSelf: "center",
    width: "100%",
    aspectRatio: 1.4,
    // backgroundColor: 'green',
  },
  miniGraph: {
    width: 40,
    height: 35,
    marginLeft: 5,
  },
  controlsScrollView: {
    flexGrow: 1,
    // paddingHorizontal: 15,
  },
  controlsScrollViewContent: {
    justifyContent: "center",
  },
})
