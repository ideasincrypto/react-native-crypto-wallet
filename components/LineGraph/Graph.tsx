import React, { useContext, useState } from "react"
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  useColorScheme,
} from "react-native"
import Svg, { Path } from "react-native-svg"
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { TouchableWithoutFeedback } from "react-native-gesture-handler"
import { mixPath, useVector } from "react-native-redash"

import { buildGraph, GraphIndex, Prices, SIZE } from "./Model"
import Header from "./Header"
import Cursor from "./Cursor"
import { DataContext } from "../../providers/DataProvider"
import moment from "moment"

const { width } = Dimensions.get("window")
const AnimatedPath = Animated.createAnimatedComponent(Path)

const SELECTION_WIDTH = width - 32

const Graph = ({ data }): JSX.Element => {
  const values = data.data.prices as Prices
  const { pickedColor } = useContext(DataContext)
  const textColor = useColorScheme() === "dark" ? "#fff" : "#000"

  const graphs = [
    {
      label: "1D",
      value: 0,
      data: buildGraph(values.day, "Today", values.latest),
    },
    {
      label: "1M",
      value: 1,
      data: buildGraph(values.month, "Last Month", values.latest),
    },
    {
      label: "1Y",
      value: 2,
      data: buildGraph(values.year, "This Year", values.latest),
    },
    {
      label: "All",
      value: 3,
      data: buildGraph(values.all, "All time", values.latest),
    },
  ] as const

  const BUTTON_WIDTH = (width - 32) / graphs.length
  const styles = StyleSheet.create({
    container: {
      backgroundColor: "transparent",
    },
    backgroundSelection: {
      backgroundColor: pickedColor,
      ...StyleSheet.absoluteFillObject,
      width: BUTTON_WIDTH,
      borderRadius: 8,
    },
    selection: {
      flexDirection: "row",
      width: SELECTION_WIDTH,
      alignSelf: "center",
    },
    labelContainer: {
      padding: 16,
      width: BUTTON_WIDTH,
    },
    label: {
      fontSize: 16,
      color: textColor,
      fontWeight: "bold",
      textAlign: "center",
    },
  })

  const translation = useVector()
  const transition = useSharedValue(0)
  const previous = useSharedValue<GraphIndex>(0)
  const current = useSharedValue<GraphIndex>(0)

  const selectedElementDate = useSharedValue(new Date())
  const selectedElementValue = useSharedValue(values.latest)

  const [selectedDate, setSelectedDate] = useState(new Date())

  const animatedProps = useAnimatedProps(() => {
    const previousPath = graphs[previous.value].data.path
    const currentPath = graphs[current.value].data.path
    return {
      d: mixPath(transition.value, previousPath, currentPath),
    }
  })
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(BUTTON_WIDTH * current.value) }],
  }))
  return (
    <View style={styles.container}>
      <View style={styles.selection}>
        <View style={StyleSheet.absoluteFill}>
          <Animated.View style={[styles.backgroundSelection, style]} />
        </View>
        {graphs.map((graph, index) => {
          return (
            <TouchableWithoutFeedback
              key={graph.label}
              onPress={() => {
                previous.value = current.value
                transition.value = 0
                current.value = index as GraphIndex
                transition.value = withTiming(1)
              }}
            >
              <Animated.View style={[styles.labelContainer]}>
                <Text style={styles.label}>{graph.label}</Text>
              </Animated.View>
            </TouchableWithoutFeedback>
          )
        })}
      </View>
      <View>
        <Svg height={275} width={SIZE}>
          <AnimatedPath
            animatedProps={animatedProps}
            fill="transparent"
            stroke={pickedColor}
            strokeWidth={3}
          />
        </Svg>
        <Cursor
          graphs={graphs}
          index={current}
          selectedElementDate={selectedElementDate}
          selectedElementValue={selectedElementValue}
          setSelectedDate={setSelectedDate}
          translation={translation}
        />
      </View>
      <View>
        <Header
          date={selectedDate}
          graphs={graphs}
          index={current}
          selectedElementDate={selectedElementDate}
          selectedElementValue={selectedElementValue}
          translation={translation}
        />
      </View>
    </View>
  )
}

export default Graph
