import React, { useContext, useEffect, useState } from "react"
import { Button, StyleSheet, View } from "react-native"
import WalletAmount from "../../components/WalletAmount"
import WalletTransact from "../../components/WalletTransact"
import { WalletGraph } from "../../components/WalletGraph"
import { DataContext } from "../../providers/DataProvider"
import { ChartSwitcherList } from "../../components/WalletGraph/ChartSwitcher"
import Loading from "../../screens/Loading"
import BottomData from "../../components/WalletGraph/BottomData"
import moment from "moment"
import LineGraph from "../../components/LineGraph"
// import data from "../../components/LineGraph/data.json"
import { LineChart } from "react-native-wagmi-charts"

const GRAPH_INTERVAL_1D_PARAM = "1D"

const WalletsTab = (): JSX.Element => {
  const openBottomSheetTransact = (): boolean => {
    return true
  }

  const { currentUSDValue, selectedPoints, apiData, graphData } =
    useContext(DataContext)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // console.log(graphData)
    const isLoading =
      graphData &&
      apiData &&
      JSON.stringify(apiData) !== "{}" &&
      apiData.data.prices &&
      apiData.data.prices.day.prices !== undefined &&
      apiData.data.prices.week.prices !== undefined &&
      apiData.data.prices.month.prices !== undefined &&
      apiData.data.prices.year.prices !== undefined &&
      apiData.data.prices.all.prices !== undefined
    setLoading(!isLoading)
  }, [apiData, graphData])

  const val = [
    {
      "timestamp": 1626945400000,
      "value": 33575.25
    },
    {
      "timestamp": 1626946300000,
      "value": 33545.25
    },
    {
      "timestamp": 1626947200000,
      "value": 33510.15
    },
    {
      "timestamp": 1626948100000,
      "value": 33215.61
    },
    {
      "timestamp": 1626949000000,
      "value": 33445.23
    },
    {
      "timestamp": 1626949900000,
      "value": 33435.51
    },
    {
      "timestamp": 1626950800000,
      "value": 33480.66
    },
    {
      "timestamp": 1626951700000,
      "value": 33440.25
    },
    {
      "timestamp": 1626952600000,
      "value": 33485.23
    },
    {
      "timestamp": 1626953500000,
      "value": 33515.21
    },
    {
      "timestamp": 1626954400000,
      "value": 33570.77
    },
    {
      "timestamp": 1626955300000,
      "value": 33640.45
    },
    {
      "timestamp": 1626956200000,
      "value": 33645.34
    },
    {
      "timestamp": 1626957100000,
      "value": 33670.33
    },
    {
      "timestamp": 1626958000000,
      "value": 33740.25
    },
    {
      "timestamp": 1626958900000,
      "value": 33770.25
    },
    {
      "timestamp": 1626959800000,
      "value": 33705.25
    },
    {
      "timestamp": 1626960700000,
      "value": 33760.25
    },
    {
      "timestamp": 1626961600000,
      "value": 33670.25
    },
    {
      "timestamp": 1626962500000,
      "value": 33870.25
    }
  ]

  const val2 = [
    {
      "timestamp": 1625962500000,
      "value": 33870.25
    },
    {
      "timestamp": 1625961600000,
      "value": 33670.25
    },
    {
      "timestamp": 1625960700000,
      "value": 33760.25
    },
    {
      "timestamp": 1625959800000,
      "value": 33705.25
    },
    {
      "timestamp": 1625958900000,
      "value": 33770.25
    },
    {
      "timestamp": 1625958000000,
      "value": 33740.25
    },
    {
      "timestamp": 1625957100000,
      "value": 33670.25
    },
    {
      "timestamp": 1625956200000,
      "value": 33645.25
    },
    {
      "timestamp": 1625955300000,
      "value": 33640.25
    },
    {
      "timestamp": 1625954400000,
      "value": 33570.25
    },
    {
      "timestamp": 1625953500000,
      "value": 33515.25
    },
    {
      "timestamp": 1625952600000,
      "value": 33485.25
    },
    {
      "timestamp": 1625951700000,
      "value": 33440.25
    },
    {
      "timestamp": 1625950800000,
      "value": 33480.25
    },
    {
      "timestamp": 1625949900000,
      "value": 33435.25
    },
    {
      "timestamp": 1625949000000,
      "value": 33445.25
    },
    {
      "timestamp": 1625948100000,
      "value": 33215.25
    },
    {
      "timestamp": 1625947200000,
      "value": 33510.25
    },
    {
      "timestamp": 1625946300000,
      "value": 33545.25
    },
    {
      "timestamp": 1625945400000,
      "value": 33575.25
    }
  ]

  const [data, setData] = useState(val)

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
          <View style={[styles.loadingView, { height: 375 }]}>
            <Loading />
          </View>
        ) : (
          <>
            <LineChart.Provider data={data}>
              <LineChart>
                <LineChart.Path />
                <LineChart.CursorCrosshair />
              </LineChart>
              <LineChart.PriceText />
              <LineChart.DatetimeText />
            </LineChart.Provider>
          </>
        )}
      </View>
      <Button
        title="Change Data"
        onPress={() => setData(val2)}
      />
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
