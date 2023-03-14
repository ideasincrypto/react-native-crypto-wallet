import React from "react"
import { StyleSheet } from "react-native"
import { View } from "../../components/Themed"
import WalletAmount from "../../components/WalletAmount"
import WalletTransact from "../../components/WalletTransact"
import { WalletGraph } from "../../components/WalletGraph"

const WalletsTab = (): JSX.Element => {

  const openBottomSheetTransact = (): boolean => {
    return true
  }

  return (
    <View style={styles.container}>
      {/* Wallet Picker */}
      <View style={{ paddingBottom: 30, paddingTop: 30 }}>
        <WalletAmount currentPrice={"5.00"} walletTotal={"1.2"} />
      </View>
      <View style={{ paddingBottom: 60 }}>
        <WalletTransact openBottomSheetTransact={openBottomSheetTransact} />
      </View>
      <View>
        <WalletGraph />
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
