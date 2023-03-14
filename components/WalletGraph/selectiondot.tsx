import React, { useCallback } from "react"
import { runOnJS, useAnimatedReaction } from "react-native-reanimated"
import { runSpring, useValue, Circle } from "@shopify/react-native-skia"
import type { SelectionDotProps } from "react-native-graph"

export const SelectionDot = ({
  isActive,
  color,
  circleX,
  circleY,
}: SelectionDotProps): JSX.Element => {
  const circleRadius = useValue(0)

  const setIsActive = useCallback(
    (active: boolean) => {
      runSpring(circleRadius, active ? 5 : 0, {
        mass: 1,
        stiffness: 1000,
        damping: 50,
        velocity: 0,
      })
    },
    [circleRadius]
  )

  useAnimatedReaction(
    () => isActive.value,
    (active) => {
      runOnJS(setIsActive)(active)
    },
    [isActive, setIsActive]
  )

  return <Circle color={color} cx={circleX} cy={circleY} r={circleRadius} />
}
