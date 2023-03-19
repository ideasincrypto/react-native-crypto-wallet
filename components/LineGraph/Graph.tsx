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
import GradientPath from "react-native-svg-path-gradient"

import { buildGraph, GraphIndex, Prices, SIZE } from "./Model"
import Header from "./Header"
import Cursor from "./Cursor"
import { DataContext } from "../../providers/DataProvider"

const { width } = Dimensions.get("window")
const AnimatedPath = Animated.createAnimatedComponent(Path)

const SELECTION_WIDTH = width - 32

const Graph = ({ data, graphs }): JSX.Element => {
  const values = data.data.prices as Prices
  const { pickedColor } = useContext(DataContext)
  const textColor = useColorScheme() === "dark" ? "#fff" : "#000"


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
        <Cursor graphs={graphs} index={current} translation={translation} />
      </View>
      <View>
        <Header graphs={graphs} index={current} translation={translation} />
      </View>
    </View>
  )
}

export default Graph
