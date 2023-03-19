import React, { useContext, useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import WalletAmount from "../../components/WalletAmount"
import WalletTransact from "../../components/WalletTransact"
import { WalletGraph } from "../../components/WalletGraph"
import { DataContext } from "../../providers/DataProvider"
import { ChartSwitcherList } from "../../components/WalletGraph/ChartSwitcher"
import Loading from "../../screens/Loading"
import BottomData from "../../components/WalletGraph/BottomData"
import moment from "moment"
import LineGraph from "../../components/LineGraph"
import data from "../../components/LineGraph/data.json"

const GRAPH_INTERVAL_1D_PARAM = "1D"

const WalletsTab = (): JSX.Element => {
  const openBottomSheetTransact = (): boolean => {
    return true
  }

  const {
    currentUSDValue,
    selectedPoints,
    apiData,
    points1M,
    points1W,
    points1Y,
    pointsALL,
  } = useContext(DataContext)

  const [graphInterval, setGraphInterval] = useState<any>(
    GRAPH_INTERVAL_1D_PARAM
  )

  const [loading, setLoading] = useState(true)
  const [graphHeight, setGraphHeight] = useState(0)

  const [selectedPointValues, setSelectedPointValues] = useState({
    value: currentUSDValue,
    date: moment(new Date()).format("M/D/Y LT"),
  })

  useEffect(() => {
    const isLoading =
      apiData &&
      JSON.stringify(apiData) !== "{}" &&
      apiData.data.prices &&
      apiData.data.prices.day.prices !== undefined &&
      apiData.data.prices.week.prices !== undefined &&
      apiData.data.prices.month.prices !== undefined &&
      apiData.data.prices.year.prices !== undefined &&
      apiData.data.prices.all.prices !== undefined
    setLoading(!isLoading)
  }, [apiData])

  return (
    <View style={styles.container}>
      {/* Wallet Picker */}
      <View style={{ paddingBottom: 30, paddingTop: 30 }}>
        <WalletAmount
          currentPrice={`${currentUSDValue}`}
          walletTotal={"10238948.212312"}
        />
      </View>
      <View style={{ paddingBottom: 40 }}>
        <WalletTransact openBottomSheetTransact={openBottomSheetTransact} />
      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        {loading ? (
          <View style={[styles.loadingView, { height: 275 }]}>
            <Loading />
          </View>
        ) : (
          <>
            <LineGraph values={apiData} />
            {/* <BottomData selectedPointValues={selectedPointValues} /> */}
          </>
        )}
      </View>
    </View>
  )
}

export default WalletsTab

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  loadingView: {
    width: "100%",
  },
})
