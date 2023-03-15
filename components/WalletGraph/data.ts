import gaussian from "gaussian"
import { useColorScheme } from "react-native"
import { GraphPoint } from "./types"

function weightedRandom(mean: number, variance: number): number {
  const distribution = gaussian(mean, variance)
  // Take a random sample using inverse transform sampling method.
  return distribution.ppf(Math.random())
}

export function generateRandomGraphData(length: number): GraphPoint[] {
  return Array<number>(length)
    .fill(0)
    .map((_, index) => ({
      date: new Date(
        new Date(2000, 0, 1).getTime() + 1000 * 60 * 60 * 24 * index
      ),
      value: weightedRandom(10, Math.pow(index + 1, 2)),
    }))
}

interface Palette {
  background: string
  foreground: string
}

const dark: Palette = {
  background: "#333",
  foreground: "#eee",
}
const light: Palette = {
  background: "#fff",
  foreground: "#333",
}

export function useColors(): Palette {
  const isDarkMode = useColorScheme() === "dark"

  return isDarkMode ? dark : light
}
