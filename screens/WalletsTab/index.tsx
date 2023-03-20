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

const WalletsTab = ({ data, setData }): JSX.Element => {
  const openBottomSheetTransact = (): boolean => {
    return true
  }

  const { apiData } = useContext(DataContext)

  return (
    <View style={styles.container}>
      {/* Wallet Picker */}
      <View style={{ paddingBottom: 30, paddingTop: 30 }}>
        <WalletAmount isLoaded={apiData} />
      </View>
      <View style={{ paddingBottom: 40 }}>
        <WalletTransact openBottomSheetTransact={openBottomSheetTransact} />
      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <LineGraph
          apiData={apiData}
          data={data}
          isLoaded={apiData}
          setData={setData}
        />
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
