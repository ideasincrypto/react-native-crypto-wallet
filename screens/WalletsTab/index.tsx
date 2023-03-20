import React, { useContext, useEffect, useState } from "react"
import { Button, StyleSheet, View } from "react-native"
import WalletAmount from "../../components/WalletAmount"
import WalletTransact from "../../components/WalletTransact"
import { WalletGraph } from "../../components/WalletGraph"
import { DataContext } from "../../providers/DataProvider"
import { ChartSwitcherList } from "../../components/WalletGraph/ChartSwitcher"
import Loading from "../../screens/Loading"
import LineGraph from "../../components/LineGraph"

const GRAPH_INTERVAL_1D_PARAM = "1D"

const WalletsTab = (): JSX.Element => {
  const openBottomSheetTransact = (): boolean => {
    return true
  }

  const { apiData } = useContext(DataContext)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // console.log(graphData)
    const isLoading = apiData && JSON.stringify(apiData) !== "{}"
    setLoading(!isLoading)
  }, [apiData])

  return (
    <View style={styles.container}>
      {/* Wallet Picker */}
      <View style={{ paddingBottom: 30, paddingTop: 30 }}>
        <WalletAmount
          currentPrice={`${apiData.currentPrice}`}
          walletTotal={"10238948.212312"}
        />
      </View>
      <View style={{ paddingBottom: 40 }}>
        <WalletTransact openBottomSheetTransact={openBottomSheetTransact} />
      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        {loading ? (
          <View style={[styles.loadingView, { height: 375 }]}>
            <Loading />
          </View>
        ) : (
          <LineGraph apiData={apiData} />
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
