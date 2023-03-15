/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, createContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { GraphPoint } from "react-native-graph"

// exposed context for doing awesome things directly in React
export const DataContext = createContext({
  loading: true,
  pickedColor: "#6a7ee7",
  wallets: [],
  seed: [],
  setLoading: (loading: boolean) => {},
  setWallets: (newWallet: object) => {},
  setSeed: (seed: string[]) => {},

  selectedPoints: [],
  setSelectedPoints: (points: GraphPoint[]) => {},

  points1D: [],
  setPoints1D: (points: GraphPoint[]) => {},
  points1W: [],
  setPoints1W: (points: GraphPoint[]) => {},
  points1M: [],
  setPoints1M: (points: GraphPoint[]) => {},
  points1Y: [],
  setPoints1Y: (points: GraphPoint[]) => {},
  pointsALL: [],
  setPointsALL: (points: GraphPoint[]) => {},
})

export const DataProvider = ({ children }): JSX.Element => {
  const [loading, setLoading] = useState(true)
  const [seed, setSeed] = useState([])
  const [wallets, setWallets] = useState([])
  const [pickedColor, setPickedColor] = useState("#6a7ee7")

  const [points1D, setPoints1D] = useState<GraphPoint[]>()
  const [points1W, setPoints1W] = useState<GraphPoint[]>()
  const [points1M, setPoints1M] = useState<GraphPoint[]>()
  const [points1Y, setPoints1Y] = useState<GraphPoint[]>()
  const [pointsALL, setPointsALL] = useState<GraphPoint[]>()

  const [selectedPoints, setSelectedPoints] = useState<GraphPoint[]>()


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

        points1D,
        setPoints1D,
        points1W,
        setPoints1W,
        points1M,
        setPoints1M,
        points1Y,
        setPoints1Y,
        pointsALL,
        setPointsALL,

        selectedPoints,
        setSelectedPoints,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
