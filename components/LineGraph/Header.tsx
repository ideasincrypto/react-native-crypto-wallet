import React from "react"
import { StyleSheet, View, useColorScheme } from "react-native"
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated"
import { ReText, Vector, round } from "react-native-redash"

import { SIZE, GraphIndex } from "./Model"

interface HeaderProps {
  translation: Vector<Animated.SharedValue<number>>
  index: Animated.SharedValue<GraphIndex>
}

type HeaderType = HeaderProps & {
  graphs: any
}

const Header = ({ graphs, translation, index }: HeaderType): JSX.Element => {
  const data = useDerivedValue(() => graphs[index.value].data)
  const price = useDerivedValue(() => {
    const p = interpolate(
      translation.y.value,
      [0, SIZE],
      [data.value.maxPrice, data.value.minPrice]
    )
    return `$ ${round(p, 6)}`
  })

  const date = useDerivedValue(() => {
    const p = interpolate(
      translation.x.value,
      [0, SIZE],
      [data.value.dates[0], data.value.dates[data.value.dates.length - 1]]
    )
    return `${new Date(p).toLocaleString([], {
      dateStyle: "short",
      timeStyle: "short",
    })}`
  })

  // const date = moment().format("M/D/Y LT")
  const percentChange = useDerivedValue(
    () => `${round(data.value.percentChange, 4)}%`
  )

  const textColor = useColorScheme() === "dark" ? "#fff" : "#000"

  const styles = StyleSheet.create({
    container: {
      paddingBottom: 16,
      color: textColor,
    },
    values: {
      flexDirection: "row",
      justifyContent: "center",
      color: textColor,
      gap: 20,
    },
    value: {
      color: textColor,
    },
    label: {
      // fontSize: 18,
      color: textColor,
    },
  })

  const label = useDerivedValue(() => data.value.label)
  const style = useAnimatedStyle(() => ({
    fontWeight: "500",
    // fontSize: 24,
    color: textColor,
  }))

  return (
    <View style={styles.container}>
      <View style={styles.values}>
        <View>
          <ReText style={styles.value} text={price} />
          <ReText style={styles.value} text={date} />
          {/* <Text style={styles.value}>{date}</Text> */}
        </View>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <ReText style={style} text={percentChange} />
          <ReText style={styles.label} text={label} />
        </View>
      </View>
    </View>
  )
}

export default Header
