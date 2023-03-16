import React, {
  useMemo,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react"
import { View, StyleSheet, useColorScheme } from "react-native"
import { Text } from "native-base"
import * as Haptics from "expo-haptics"
import * as Device from "expo-device"

import { LineGraph, SelectionDot } from "react-native-graph"
import { ChartSwitcher } from "./ChartSwitcher"
import { GraphRange } from "./types"
import { DataContext } from "../../providers/DataProvider"
import Loading from "../../screens/Loading"
import { AxisLabel } from "./AxisLabel"

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
      let maxVal = selectedPoints[0].value
      let minVal = selectedPoints[0].value
      let minIndex = 0
      let maxIndex = 0

      for (let i = 0; i < selectedPoints.length; i++) {
        if (selectedPoints[i].value > maxVal) {
          maxVal = selectedPoints[i].value
          maxIndex = i
        } else if (selectedPoints[i].value < minVal) {
          minVal = selectedPoints[i].value
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
  const [selectedCoinValue, setSelectedCoinValue] = useState(currentUSDValue)

  useEffect(() => {
    setSelectedCoinValue(currentUSDValue)
  }, [currentUSDValue])

  const { pickedColor } = useContext(DataContext)

  const textColor = useColorScheme() === "dark" ? "#fff" : "#000"

  const [graphInterval, setGraphInterval] = useState<GraphIntervalType>(
    GRAPH_INTERVAL_1D_PARAM
  )

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

  const onPointSelected = useCallback((p) => {
    setSelectedCoinValue(p.value)
  }, [])

  const onGestureEnd = useCallback(() => {
    setSelectedCoinValue(currentUSDValue)
  }, [currentUSDValue])

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
          <View style={styles.loadingView}>
            <Loading />
          </View>
        ) : (
          <LineGraph
            animated={true}
            BottomAxisLabel={() => (
              <AxisLabel
                index={min.index}
                selectedPoints={selectedPoints}
                value={min.value}
              />
            )}
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
            TopAxisLabel={() => (
              <AxisLabel
                index={max.index}
                selectedPoints={selectedPoints}
                value={max.value}
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
        {`1 KASPA ≈ $${selectedCoinValue.toFixed(6)}`}
      </Text>
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
  loadingView: {
    height: 250,
    width: "100%",
  },
  controlsScrollViewContent: {
    justifyContent: "center",
  },
})
