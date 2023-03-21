import * as React from "react"
import type { TextProps as RNTextProps } from "react-native"
import type Animated from "react-native-reanimated"

import { useLineChartPrice } from "./usePrice"
import type { TFormatterFn } from "../candle/types"
import { AnimatedText } from "../../components/AnimatedText"

export type LineChartPriceTextProps = {
  format?: TFormatterFn<string>
  precision?: number
  variant?: "formatted" | "value"
  style?: Animated.AnimateProps<RNTextProps>["style"]
  /**
   * By default, it will use the current active index from the chart.
   * If this is set it will use the index provided.
   */
  index?: number
}

export const LineChartPriceText = ({
  format,
  precision = 2,
  variant = "formatted",
  style,
  index,
}: LineChartPriceTextProps): JSX.Element => {
  const price = useLineChartPrice({ format, precision, index })
  return <AnimatedText style={style} text={price[variant]} />
}

LineChartPriceText.displayName = "LineChartPriceText"
