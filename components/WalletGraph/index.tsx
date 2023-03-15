import React, { useMemo, useState } from "react"
import { View, StyleSheet } from "react-native"
import * as Haptics from "expo-haptics"

import { LineGraph } from "react-native-graph"
import { SelectionDot } from "./selectiondot"
import { generateRandomGraphData } from "./data"
import { ChartSwitcher } from "./chartswitcher"
import { GraphRange } from "./types"

const POINT_COUNT = 70
const POINTS = generateRandomGraphData(POINT_COUNT)
const COLOR = "#6a7ee7"
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

export const WalletGraph = (): JSX.Element => {
  const [points] = useState(POINTS)
  const [enableRange] = useState(false)

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
  }, [highestDate, points])

  return (
    <View style={[styles.container]}>
      <View style={styles.chartContainer}>
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
          animated={true}
          color={COLOR}
          enableFadeInMask={true}
          enableIndicator={true}
          enablePanGesture={true}
          gradientFillColors={GRADIENT_FILL_COLORS}
          points={points}
          range={range}
          SelectionDot={SelectionDot}
          style={styles.graph}
          onGestureStart={() =>
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
          }
          // onPointSelected={(p) => null}
        />
      </View>
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
