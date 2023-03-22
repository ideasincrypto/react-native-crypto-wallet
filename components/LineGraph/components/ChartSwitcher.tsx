import React, { useContext } from "react"
import {
  GestureResponderEvent,
  TouchableOpacity,
  useColorScheme,
} from "react-native"
import { Text, useContrastText } from "native-base"

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
  const enabledTextColor = useContrastText(pickedColor)
  return (
    <TouchableOpacity
      disabled={enabled}
      style={{
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        height: 40,
        width: 40,
        flex: 1,
        backgroundColor: enabled ? pickedColor : "transparent",
        ...(enabled && {
          shadowColor: textColor,
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.5,
          elevation: 5,
        }),
      }}
      onPress={onPress}
    >
      <Text color={enabled ? enabledTextColor : textColor}>{label}</Text>
    </TouchableOpacity>
  )
}
