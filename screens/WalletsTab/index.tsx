import React, { useContext, useState } from "react"
import { StyleSheet, View } from "react-native"
import WalletAmount from "../../components/WalletAmount"
import WalletTransact from "../../components/WalletTransact"
import { GraphIntervalType, WalletGraph } from "../../components/WalletGraph"
import { DataContext } from "../../providers/DataProvider"
import { ChartSwitcherList } from "../../components/WalletGraph/ChartSwitcher"

const GRAPH_INTERVAL_1D_PARAM = "1D"

const WalletsTab = (): JSX.Element => {
  const openBottomSheetTransact = (): boolean => {
    return true
  }

  const { currentUSDValue } = useContext(DataContext)

  const [graphInterval, setGraphInterval] = useState<GraphIntervalType>(
    GRAPH_INTERVAL_1D_PARAM
  )

  const [graphLoading, setGraphLoading] = useState(false)

  return (
    <View style={styles.container}>
      {/* Wallet Picker */}
      <View style={{ paddingBottom: 30, paddingTop: 30 }}>
        <WalletAmount
          currentPrice={`${currentUSDValue}`}
          walletTotal={"10238948.212312"}
        />
      </View>
      <View style={{ paddingBottom: 60 }}>
        <WalletTransact openBottomSheetTransact={openBottomSheetTransact} />
      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <ChartSwitcherList
          graphInterval={graphInterval}
          setGraphInterval={setGraphInterval}
          setGraphLoading={setGraphLoading}
        />
        <WalletGraph
          graphInterval={graphInterval}
          graphLoading={graphLoading}
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
})
