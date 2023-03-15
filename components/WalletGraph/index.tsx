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

// const POINT_COUNT = 70
// const POINTS = generateRandomGraphData(POINT_COUNT)
// const COLOR = "#6a7ee7"
const GRADIENT_FILL_COLORS = ["#7476df5D", "#7476df4D", "#7476df00"]

export type GraphIntervalType =
  | typeof GRAPH_INTERVAL_1D_PARAM
  | typeof GRAPH_INTERVAL_1W_PARAM
  | typeof GRAPH_INTERVAL_1M_PARAM
  | typeof GRAPH_INTERVAL_1Y_PARAM
  | typeof GRAPH_INTERVAL_ALL_PARAM

const GRAPH_INTERVAL_1D_PARAM = "1D"
const GRAPH_INTERVAL_1W_PARAM = "1W"
const GRAPH_INTERVAL_1M_PARAM = "1M"
const GRAPH_INTERVAL_1Y_PARAM = "1Y"
const GRAPH_INTERVAL_ALL_PARAM = "ALL"

export const WalletGraph = (): JSX.Element => {
  // const [points, setPoints] = useState([{ date: new Date(), value: 0 }])

  const {
    points1D,
    points1W,
    points1M,
    points1Y,
    pointsALL,
    selectedPoints,
    setSelectedPoints,
  } = useContext(DataContext)

  const isReady =
    selectedPoints!= undefined &&
    points1D !== undefined &&
    points1W !== undefined &&
    points1M !== undefined &&
    points1Y !== undefined &&
    pointsALL !== undefined

  const [enableRange] = useState(false)

  const { pickedColor } = useContext(DataContext)

  const textColor = useColorScheme() === "dark" ? "#fff" : "#000"

  const [value, setValue] = useState<GraphPoint>({
    date: new Date("2000-02-10T08:00:00.000Z"),
    value: 0,
  })

  const [graphInterval, setGraphInterval] = useState<GraphIntervalType>(
    GRAPH_INTERVAL_1D_PARAM
  )

  // console.log(points)

  const highestDate = useMemo(
    () =>
      selectedPoints !== undefined &&
      selectedPoints.length !== 0 &&
      selectedPoints[selectedPoints.length - 1] !== null
        ? selectedPoints[selectedPoints.length - 1]?.date
        : undefined,
    [selectedPoints]
  )
  const range: GraphRange | undefined = useMemo(() => {
    // if range is disabled, default to infinite range (undefined)
    if (!enableRange) return undefined

    if (selectedPoints.length !== 0 && highestDate != null) {
      return {
        x: {
          min: selectedPoints[0]?.date,
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
  }, [enableRange, highestDate, selectedPoints])

  const setPointsInInterval = (interval): void => {
    switch (interval) {
      case "1W":
        setSelectedPoints(points1W)
        break
      case "1M":
        setSelectedPoints(points1M)
        break
      case "1Y":
        setSelectedPoints(points1Y)
        break
      case "ALL":
        setSelectedPoints(pointsALL)
        break
      default:
        // 1D
        setSelectedPoints(points1D)
        break
    }
  }

  console.log("selectedPoints", selectedPoints)

  return (
    <View style={[styles.container]}>
      <View style={styles.chartContainer}>
        <ChartSwitcher
          enabled={graphInterval === GRAPH_INTERVAL_1D_PARAM}
          label="1D"
          onPress={() => {
            setGraphInterval(GRAPH_INTERVAL_1D_PARAM)
            setPointsInInterval("1D")
          }}
        />
        <ChartSwitcher
          enabled={graphInterval === GRAPH_INTERVAL_1W_PARAM}
          label="1W"
          onPress={() => {
            setGraphInterval(GRAPH_INTERVAL_1W_PARAM)
            setPointsInInterval("1W")
          }}
        />

        <ChartSwitcher
          enabled={graphInterval === GRAPH_INTERVAL_1M_PARAM}
          label="1M"
          onPress={() => {
            setGraphInterval(GRAPH_INTERVAL_1M_PARAM)
            setPointsInInterval("1M")
          }}
        />
        <ChartSwitcher
          enabled={graphInterval === GRAPH_INTERVAL_1Y_PARAM}
          label="1Y"
          onPress={() => {
            setGraphInterval(GRAPH_INTERVAL_1Y_PARAM)
            setPointsInInterval("1Y")
          }}
        />
        <ChartSwitcher
          enabled={graphInterval === GRAPH_INTERVAL_ALL_PARAM}
          label="ALL"
          onPress={() => {
            setGraphInterval(GRAPH_INTERVAL_ALL_PARAM)
            setPointsInInterval("ALL")
          }}
        />
      </View>
      <View>
        {!isReady ? (
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
            points={selectedPoints}
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
