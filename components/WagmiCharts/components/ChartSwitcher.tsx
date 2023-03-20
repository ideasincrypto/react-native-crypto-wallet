import React from "react"
import {
  GestureResponderEvent,
  TouchableOpacity,
  useColorScheme,
} from "react-native"
import { Text } from "native-base"

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
        backgroundColor: enabled ? "#6a7ee7" : "transparent",
      }}
      onPress={onPress}
    >
      <Text color={textColor}>{label}</Text>
    </TouchableOpacity>
  )
}