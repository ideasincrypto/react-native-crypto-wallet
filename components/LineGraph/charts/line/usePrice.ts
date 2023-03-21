import { useDerivedValue } from "react-native-reanimated"

import { formatPrice } from "../../utils"
import type { TFormatterFn } from "../candle/types"
import { useLineChart } from "./useLineChart"

export const useLineChartPrice = ({
  format,
  precision = 2,
  index,
}: {
  format?: TFormatterFn<string>
  precision?: number
  index?: number
} = {}): any => {
  const { currentIndex, data } = useLineChart()

  const float = useDerivedValue(() => {
    if (
      (typeof currentIndex.value === "undefined" ||
        currentIndex.value === -1) &&
      index == null
    )
      return ""
    let price = 0
    price = data[Math.min(index ?? currentIndex.value, data.length - 1)].value
    return price
  }, [currentIndex, data, precision])
  const formatted = useDerivedValue(() => {
    const value = float.value || ""
    const formattedPrice = value ? formatPrice({ value: `${value}` }) : ""
    return format
      ? format({ value: `${value}`, formatted: formattedPrice })
      : formattedPrice
  }, [float, format])

  return { value: float, formatted }
}
