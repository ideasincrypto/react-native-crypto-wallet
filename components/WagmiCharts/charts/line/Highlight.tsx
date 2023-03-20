import * as React from "react"
import Animated from "react-native-reanimated"
import { Path, PathProps } from "react-native-svg"

import { LineChartDimensionsContext } from "./Chart"
import { LineChartPathContext } from "./LineChartPathContext"
import useAnimatedPath from "./useAnimatedPath"
import { useLineChart } from "./useLineChart"
import { getPath } from "./utils"

const AnimatedPath = Animated.createAnimatedComponent(Path)

export type LineChartColorProps = Animated.AnimateProps<PathProps> & {
  color?: string
  from: number
  to: number
  showInactiveColor?: boolean
  inactiveColor?: string
  width?: number
}

export const LineChartHighlight = ({
  color = "black",
  inactiveColor,
  showInactiveColor = true,
  from,
  to,
  width: strokeWidth = 3,
  ...props
}: LineChartColorProps): JSX.Element => {
  const { data, yDomain } = useLineChart()
  const { pathWidth, height, gutter, shape } = React.useContext(
    LineChartDimensionsContext
  )
  const { isTransitionEnabled, isInactive: _isInactive } =
    React.useContext(LineChartPathContext)
  const isInactive = showInactiveColor && _isInactive

  ////////////////////////////////////////////////

  const path = React.useMemo(() => {
    if (data && data.length > 0) {
      return getPath({
        data,
        from,
        to,
        width: pathWidth,
        height,
        gutter,
        shape,
        yDomain,
      })
    }
    return ""
  }, [data, from, to, pathWidth, height, gutter, shape, yDomain])

  const { animatedProps } = useAnimatedPath({
    enabled: isTransitionEnabled,
    path,
  })

  ////////////////////////////////////////////////

  return (
    <>
      <AnimatedPath
        animatedProps={animatedProps}
        fill="transparent"
        stroke={isInactive ? inactiveColor || color : color}
        strokeOpacity={isInactive && !inactiveColor ? 0.5 : 1}
        strokeWidth={strokeWidth}
        {...props}
      />
    </>
  )
}

LineChartHighlight.displayName = "LineChartHighlight"
