import React, { Dispatch, SetStateAction, useContext } from "react"
import { View, StyleSheet } from "react-native"
import { PanGestureHandler } from "react-native-gesture-handler"
import * as Haptics from "expo-haptics"
import * as Device from "expo-device"
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  useDerivedValue,
} from "react-native-reanimated"
import { getYForX, Vector } from "react-native-redash"
import { DataContext } from "../../providers/DataProvider"

import { GraphIndex } from "./Model"

const CURSOR = 50

interface CursorProps {
  index: Animated.SharedValue<GraphIndex>
  translation: Vector<Animated.SharedValue<number>>
}

type GraphType = CursorProps & {
  graphs: any
  selectedElementDate: any
  selectedElementValue: any
  setSelectedDate: Dispatch<SetStateAction<Date>>
}


const Cursor = ({
  selectedElementDate,
  selectedElementValue,
  index,
  translation,
  graphs,
  setSelectedDate,
}: GraphType): JSX.Element => {
  const { pickedColor } = useContext(DataContext)

  const styles = StyleSheet.create({
    cursor: {
      width: CURSOR,
      height: CURSOR,
      borderRadius: CURSOR / 2,
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      justifyContent: "center",
      alignItems: "center",
    },
    cursorBody: {
      width: 15,
      height: 15,
      borderRadius: 7.5,
      backgroundColor: pickedColor,
    },
  })

  const setDayData = (value, date) => {
    setSelectedDate(date)
  }

  const isActive = useSharedValue(false)
  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (event, context) => {
      isActive.value = true
    },
    onActive: async (event, context) => {
      translation.x.value = event.x
      translation.y.value =
        getYForX(graphs[index.value].data.path, translation.x.value) || 0
    },
    onEnd: (event, context) => {
      isActive.value = false
      runOnJS(setDayData)("", new Date())
    },
  })

  const style = useAnimatedStyle(() => {
    const translateX = translation.x.value - CURSOR / 2
    const translateY = translation.y.value - CURSOR / 2
    return {
      transform: [
        { translateX },
        { translateY },
        { scale: withSpring(isActive.value ? 1 : 0) },
      ],
    }
  })

  return (
    <View style={StyleSheet.absoluteFill}>
      <PanGestureHandler {...{ onGestureEvent }}>
        <Animated.View style={StyleSheet.absoluteFill}>
          <Animated.View style={[styles.cursor, style]}>
            <View style={styles.cursorBody} />
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  )
}

export default Cursor
