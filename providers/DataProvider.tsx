/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, createContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

type DataPoint = {
  timestamp: number
  value: number
}

type Prices = DataPoint[]

type Interval = {
  percent_change: number
  prices: Prices
}

export type ApiType = {
  currentPrice: string
  day: Interval
  week: Interval
  month: Interval
  year: Interval
  all: Interval
}

// exposed context for doing awesome things directly in React
export const DataContext = createContext({
  loading: true,
  pickedColor: "#6a7ee7",
  wallets: [],
  seed: [],
  setLoading: (loading: boolean) => {},
  setWallets: (newWallet: object) => {},
  setSeed: (seed: string[]) => {},

  apiData: undefined,
  setApiData: (data) => {},
})

export const DataProvider = ({ children }): JSX.Element => {
  const [loading, setLoading] = useState(true)
  const [seed, setSeed] = useState([])
  const [wallets, setWallets] = useState([])
  const [pickedColor, setPickedColor] = useState("#6a7ee7")

  const [apiData, setApiData] = useState<ApiType>()

  const getData = async () => {
    const walletData = await AsyncStorage.getItem("wallets")
    if (walletData !== null) {
      setWallets(JSON.parse(walletData))
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <DataContext.Provider
      value={{
        loading,
        setLoading,
        wallets,
        setWallets,
        seed,
        setSeed,
        pickedColor,
        setPickedColor,

        apiData,
        setApiData,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
