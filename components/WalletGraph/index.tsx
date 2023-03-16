import React, {
  useMemo,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react"
import { View, StyleSheet, useColorScheme, Dimensions } from "react-native"
import { Text } from "native-base"
import * as Haptics from "expo-haptics"
import * as Device from "expo-device"

import { LineGraph, SelectionDot } from "react-native-graph"
import { ChartSwitcher } from "./ChartSwitcher"
import { GraphRange } from "./types"
import { DataContext } from "../../providers/DataProvider"
import Loading from "../../screens/Loading"
import { AxisLabel } from "./AxisLabel"
import moment from "moment"

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

export const WalletGraph = ({ graphInterval, graphLoading }): JSX.Element => {
  const {
    points1D,
    points1W,
    points1M,
    points1Y,
    pointsALL,
    selectedPoints,
    currentUSDValue,
    setSelectedPoints,
  } = useContext(DataContext)

  const [min, setMin] = useState({})
  const [max, setMax] = useState({})

  useEffect(() => {
    if (selectedPoints?.length > 1) {
      let maxVal = (selectedPoints[0] as MaxMinType).value
      let minVal = (selectedPoints[0] as MaxMinType).value
      let minIndex = 0
      let maxIndex = 0

      for (let i = 0; i < selectedPoints.length; i++) {
        if ((selectedPoints[i] as MaxMinType).value > maxVal) {
          maxVal = (selectedPoints[i] as MaxMinType).value
          maxIndex = i
        } else if ((selectedPoints[i] as MaxMinType).value < minVal) {
          minVal = (selectedPoints[i] as MaxMinType).value
          minIndex = i
        }
      }

      setMin({
        value: minVal,
        index: minIndex,
      })
      setMax({
        value: maxVal,
        index: maxIndex,
      })
    }
  }, [selectedPoints])

  const isReady =
    selectedPoints != undefined &&
    points1D !== undefined &&
    points1W !== undefined &&
    points1M !== undefined &&
    points1Y !== undefined &&
    pointsALL !== undefined

  const [enableRange] = useState(false)

  const [selectedPointValues, setSelectedPointValues] = useState({
    value: currentUSDValue,
    date: moment(new Date()).format("M/D/Y LT"),
  })

  useEffect(() => {
    setSelectedPointValues({
      value: currentUSDValue,
      date: moment(new Date()).format("M/D/Y LT"),
    })
  }, [currentUSDValue])

  const { pickedColor } = useContext(DataContext)

  const textColor = useColorScheme() === "dark" ? "#fff" : "#000"

  const highestDate = useMemo(
    () =>
      selectedPoints !== undefined &&
      selectedPoints.length !== 0 &&
      selectedPoints[selectedPoints.length - 1] !== null
        ? (selectedPoints[selectedPoints.length - 1] as MaxMinType)?.date
        : undefined,
    [selectedPoints]
  )
  const range: GraphRange | undefined = useMemo(() => {
    if (!enableRange) return undefined

    if (selectedPoints.length !== 0 && highestDate != null) {
      return {
        x: {
          min: (selectedPoints[0] as MaxMinType)?.date,
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

  useEffect(() => {
    setTimeout(() => {
      switch (graphInterval) {
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
    }, 500)
  }, [
    graphInterval,
    points1D,
    points1M,
    points1W,
    points1Y,
    pointsALL,
    setSelectedPoints,
  ])

  const onPointSelected = useCallback((p) => {
    // console.log("here", p.date)
    setSelectedPointValues({
      value: p.value,
      date: moment(p.date).format("M/D/Y LT"),
    })
  }, [])

  const onGestureEnd = useCallback(() => {
    setSelectedPointValues({
      value: currentUSDValue,
      date: moment(new Date()).format("M/D/Y LT"),
    })
  }, [currentUSDValue])

  type MaxMinType = {
    index: number
    value: number
    date: Date
  }

  return (
    <View style={[styles.container]}>
      <View>
        {!isReady || graphLoading ? (
          <View style={styles.loadingView}>
            <Loading />
          </View>
        ) : (
          <LineGraph
            animated={true}
            BottomAxisLabel={() => (
              <AxisLabel
                index={(min as MaxMinType).index}
                selectedPoints={selectedPoints}
                value={(min as MaxMinType).value}
              />
            )}
            color={pickedColor}
            enableFadeInMask={true}
            enableIndicator={true}
            enablePanGesture={true}
            gradientFillColors={GRADIENT_FILL_COLORS}
            horizontalPadding={20}
            panGestureDelay={0}
            points={selectedPoints}
            range={range}
            SelectionDot={SelectionDot}
            style={[styles.graph, graphLoading && { opacity: 0 }]}
            TopAxisLabel={() => (
              <AxisLabel
                index={(max as MaxMinType).index}
                selectedPoints={selectedPoints}
                value={(max as MaxMinType).value}
              />
            )}
            onGestureEnd={onGestureEnd}
            onGestureStart={() =>
              Device.isDevice &&
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            }
            onPointSelected={onPointSelected}
          />
        )}
      </View>
      <Text
        color={textColor}
        style={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {`1 KASPA ≈ $${selectedPointValues.value.toFixed(6)}`}
      </Text>
      <Text
        color={textColor}
        style={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {selectedPointValues.date}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
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
  },
  graph: {
    alignSelf: "center",
    width: Dimensions.get("screen").width,
    justifyContent: "center",
    aspectRatio: 1.4,
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
  loadingView: {
    height: 260,
    width: "100%",
  },
  controlsScrollViewContent: {
    justifyContent: "center",
  },
})
