import React, { useContext } from "react"
import {
  GestureResponderEvent,
  TouchableOpacity,
  useColorScheme,
} from "react-native"
import { Text } from "native-base"
import isDarkColor from "is-dark-color"

import { DataContext } from "../../../providers/DataProvider"

export const ChartSwitcher = ({
  label,
  enabled,
  onPress,
}: {
  label: string
  enabled: boolean
  onPress?: (event: GestureResponderEvent) => void
}): JSX.Element => {
  const textColor = useColorScheme() === "dark" ? "#fff" : "#000"
  const { pickedColor } = useContext(DataContext)
  const enabledTextColor = isDarkColor(pickedColor) ? "#fff" : "#000"
  return (
    <TouchableOpacity
      disabled={enabled}
      style={{
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 40,
        height: 40,
        width: 40,
        flex: 1,
        backgroundColor: enabled ? pickedColor : "transparent",
      }}
      onPress={onPress}
    >
      <Text color={enabled ? enabledTextColor : textColor}>{label}</Text>
    </TouchableOpacity>
  )
}
