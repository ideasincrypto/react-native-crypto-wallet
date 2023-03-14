import React, { useCallback, useMemo, useState } from "react"
import { View, StyleSheet, Text, Button, ScrollView } from "react-native"
import * as Haptics from "expo-haptics"

import { LineGraph } from "react-native-graph"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { SelectionDot } from "./selectiondot"
import { generateRandomGraphData, generateSinusGraphData } from "./data"
import { useColors } from "./data"
import { ChartSwitcher } from "./chartswitcher"

const POINT_COUNT = 70
const POINTS = generateRandomGraphData(POINT_COUNT)
const COLOR = "#6a7ee7"
const GRADIENT_FILL_COLORS = ["#7476df5D", "#7476df4D", "#7476df00"]
const SMALL_POINTS = generateSinusGraphData(9)

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

export const WalletGraph = (): JSX.Element => {
  const colors = useColors()

  const [isAnimated, setIsAnimated] = useState(true)
  const [enablePanGesture, setEnablePanGesture] = useState(true)
  const [enableFadeInEffect, setEnableFadeInEffect] = useState(false)
  const [enableCustomSelectionDot, setEnableCustomSelectionDot] = useState(true)
  const [enableGradient, setEnableGradient] = useState(true)
  const [enableRange, setEnableRange] = useState(false)
  const [enableIndicator, setEnableIndicator] = useState(true)

  const [points, setPoints] = useState(POINTS)

  const [graphInterval, setGraphInterval] = useState<GraphIntervalType>(
    GRAPH_INTERVAL_1H_PARAM
  )

  const refreshData = useCallback(() => {
    setPoints(generateRandomGraphData(POINT_COUNT))
    // hapticFeedback("impactLight")
  }, [])

  const highestDate = useMemo(
    () =>
      points.length !== 0 && points[points.length - 1] != null
        ? points[points.length - 1]!.date
        : undefined,
    [points]
  )
  const range: any | undefined = useMemo(() => {
    // if range is disabled, default to infinite range (undefined)
    if (!enableRange) return undefined

    if (points.length !== 0 && highestDate != null) {
      return {
        x: {
          min: points[0]!.date,
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

  return (
    <View
      style={[
        styles.container,
        {
          // height: "100%",
          // flex: 1,
          // backgroundColor: colors.background,
        },
      ]}
    >
      <View
        style={{
          // flex: 1,
          flexDirection: "row",
          justifyContent: "space-evenly",
          width: "100%",
          // paddingBottom: 20,
        }}
      >
        <ChartSwitcher
          enabled={graphInterval === GRAPH_INTERVAL_1H_PARAM}
          label="1H"
          onPress={() => setGraphInterval(GRAPH_INTERVAL_1H_PARAM)}
        />
        <ChartSwitcher
          enabled={graphInterval === GRAPH_INTERVAL_1D_PARAM}
          label="1D"
          onPress={() => setGraphInterval(GRAPH_INTERVAL_1D_PARAM)}
        />
        <ChartSwitcher
          enabled={graphInterval === GRAPH_INTERVAL_1W_PARAM}
          label="1W"
          onPress={() => setGraphInterval(GRAPH_INTERVAL_1W_PARAM)}
        />

        <ChartSwitcher
          enabled={graphInterval === GRAPH_INTERVAL_1M_PARAM}
          label="1M"
          onPress={() => setGraphInterval(GRAPH_INTERVAL_1M_PARAM)}
        />
        <ChartSwitcher
          enabled={graphInterval === GRAPH_INTERVAL_1Y_PARAM}
          label="1Y"
          onPress={() => setGraphInterval(GRAPH_INTERVAL_1Y_PARAM)}
        />
        <ChartSwitcher
          enabled={graphInterval === GRAPH_INTERVAL_ALL_PARAM}
          label="ALL"
          onPress={() => setGraphInterval(GRAPH_INTERVAL_ALL_PARAM)}
        />
      </View>
      <View>
        <LineGraph
          animated={isAnimated}
          color={COLOR}
          enableFadeInMask={enableFadeInEffect}
          enableIndicator={enableIndicator}
          enablePanGesture={enablePanGesture}
          gradientFillColors={enableGradient ? GRADIENT_FILL_COLORS : undefined}
          // horizontalPadding={enableIndicator ? 15 : 0}
          points={points}
          range={range}
          SelectionDot={enableCustomSelectionDot ? SelectionDot : undefined}
          style={styles.graph}
          onGestureStart={() =>
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
          }
          onPointSelected={(p) => null}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor:"red"
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
