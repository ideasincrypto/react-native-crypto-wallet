import React from "react"
import { View, Dimensions, useColorScheme } from "react-native"
import { Text } from "native-base"

export const AxisLabel = ({ value, index, selectedPoints }): JSX.Element => {
  const textColor = useColorScheme() === "dark" ? "#fff" : "#000"
  const location =
    (index / selectedPoints.length) * (Dimensions.get("window").width - 40) || 0
  return (
    value && (
      <View style={{ transform: [{ translateX: Math.max(location - 40, 5) }] }}>
        <Text color={textColor}>{`${value.toFixed(6)}`}</Text>
      </View>
    )
  )
}
