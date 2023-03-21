import React, { useContext } from "react"
import { StyleSheet, View } from "react-native"
import WalletAmount from "../../components/WalletAmount"
import WalletTransact from "../../components/WalletTransact"
import { DataContext } from "../../providers/DataProvider"
import LineGraph from "../../components/LineGraph"

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
