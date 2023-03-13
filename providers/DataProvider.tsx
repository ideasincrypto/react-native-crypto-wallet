/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, createContext, useEffect } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';

// exposed context for doing awesome things directly in React
export const DataContext = createContext({
  loading: true,
  wallets: [],
  setLoading: (loading: boolean) => {},
  setWallets: (newWallet: any) => {},
})

export const DataProvider = ({ children }): JSX.Element => {

  const [loading, setLoading] = useState(true)
  const [wallets, setWallets] = useState([])

  const getData = async () => {
    const walletData = await AsyncStorage.getItem("wallets")
    if(walletData !== null) {
      setWallets(JSON.parse(walletData))
    }
  }

  useEffect(()=>{
    getData()
  }, [])

  return (
    <DataContext.Provider value={{ loading, setLoading, wallets, setWallets }}>
      {children}
    </DataContext.Provider>
  )
}