/* eslint-disable camelcase */
import * as shape from "d3-shape"
import { scaleLinear } from "d3-scale"
import { Dimensions } from "react-native"
import { parse } from "react-native-redash"

// import data from "./data.json"

export const SIZE = Dimensions.get("window").width

export interface Amount {
  amount: string
  currency: string
  scale: string
}

export interface PercentChange {
  day: number
  week: number
  month: number
  year: number
}

export interface LatestPrice {
  amount: Amount
  timestamp: string
  percent_change: PercentChange
}

export type PriceList = [string, number][]

export interface DataPoints {
  percent_change: number
  prices: PriceList
}

export interface Prices {
  latest: string
  latest_price: LatestPrice
  hour: DataPoints
  day: DataPoints
  week: DataPoints
  month: DataPoints
  year: DataPoints
  all: DataPoints
}

const POINTS = 60

export const buildGraph = async (
  datapoints: DataPoints,
  label: string,
  currentPrice: string
): any => {
  const priceList = datapoints.prices.slice(0, POINTS)
  const formattedValues = priceList.map(
    (price) => [parseFloat(price[0]), price[1]] as [number, number]
  )
  const prices = formattedValues.map((value) => value[0])
  const dates = formattedValues.map((value) => value[1])
  const scaleX = await scaleLinear()
    .domain([Math.min(...dates), Math.max(...dates)])
    .range([0, SIZE])
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const scaleY = await scaleLinear()
    .domain([minPrice, maxPrice])
    .range([275, 0])
  return {
    prices,
    dates,
    currentPrice,
    label,
    minPrice,
    maxPrice,
    percentChange: datapoints.percent_change,
    path: parse(
      (await shape
        .line()
        .x(([, x]) => scaleX(x) as number)
        .y(([y]) => scaleY(y) as number)
        .curve(shape.curveBasis)(formattedValues)) as string
    ),
  }
}

export type GraphIndex = 0 | 1 | 2 | 3 | 4
