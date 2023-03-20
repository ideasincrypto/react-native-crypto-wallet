import { Ionicons } from "@expo/vector-icons"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import React, { useContext, useEffect } from "react"

import WalletsTab from "../screens/WalletsTab"
import TransactionsTab from "../screens/TransactionsTab"
import { BottomTabParamList, TabOneParamList, TabTwoParamList } from "../types"
import { DataContext } from "../providers/DataProvider"
import moment from "moment"
import { GraphPoint } from "react-native-graph"
import { buildGraph } from "../components/LineGraph/Model"

const BottomTab = createBottomTabNavigator<BottomTabParamList>()

const BottomTabNavigator = (): JSX.Element => {
  const {
    pickedColor,
    setApiData,
    setGraphData,
    setSelectedPoints,
    setSelectedUSDValue,
    setCurrentUSDValue,
  } = useContext(DataContext)

  type DataType = {
    value: number
    date: Date
  }

  // type GetDataType = {
  //   data1D?: [DataType]
  //   data1W?: [DataType]
  //   data1M?: [DataType]
  //   data1Y?: [DataType]
  //   dataALL?: [DataType]
  // }

  const getApiData = async (): Promise<any> => {
    try {
      // eslint-disable-next-line max-len
      const url = "https://wallet-server-r6l7o.ondigitalocean.app/api/data"
      console.log(url)
      const response = await fetch(url)
      const json = await response.json()
      return json
    } catch (error) {
      console.error(error)
      return {}
    }
  }

  const getCurrentPrice = async (): Promise<number> => {
    try {
      const response = await fetch(
        // eslint-disable-next-line max-len
        "https://api.coingecko.com/api/v3/simple/price?ids=kaspa&vs_currencies=usd"
      )
      const { kaspa } = await response.json()
      return kaspa.usd
    } catch (error) {
      console.error(error)
      return 0
    }
  }

  const getData = async (): Promise<void> => {
    const apiData = await getApiData()
    // console.log("apiData", apiData)

    // console.log("goodToGo", goodToGo)
    if (apiData) {
      const graphs = async () => {
        // "worklet"
        return [
          {
            label: "1D",
            value: 0,
            data: await buildGraph(
              apiData.data.prices.day,
              "Today",
              apiData.data.prices.latest
            ),
          },
          {
            label: "1W",
            value: 1,
            data: await buildGraph(
              apiData.data.prices.week,
              "Last Week",
              apiData.data.prices.latest
            ),
          },
          {
            label: "1M",
            value: 2,
            data: await buildGraph(
              apiData.data.prices.month,
              "Last Month",
              apiData.data.prices.latest
            ),
          },
          {
            label: "1Y",
            value: 3,
            data: await buildGraph(
              apiData.data.prices.year,
              "This Year",
              apiData.data.prices.latest
            ),
          },
          {
            label: "All",
            value: 4,
            data: await buildGraph(
              apiData.data.prices.all,
              "All time",
              apiData.data.prices.latest
            ),
          },
        ] as const
      }
      setGraphData(await graphs())
      setApiData(apiData)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <BottomTab.Navigator
      initialRouteName="WalletsTab"
      screenOptions={{
        tabBarActiveTintColor: pickedColor,
        headerShown: false,
      }}
    >
      <BottomTab.Screen
        component={TabOneNavigator}
        name="WalletTab"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <TabBarIcon color={color} name="ios-wallet" />
          ),
          tabBarShowLabel: false,
        }}
      />
      <BottomTab.Screen
        component={TabTwoNavigator}
        name="TabTwo"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <TabBarIcon color={color} name="ios-list" />
          ),
          tabBarShowLabel: false,
        }}
      />
    </BottomTab.Navigator>
  )
}

export default BottomTabNavigator

const TabBarIcon = (props: { name: string; color: string }): JSX.Element => {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />
}

const TabOneStack = createStackNavigator<TabOneParamList>()

const TabOneNavigator = (): JSX.Element => {
  return (
    <TabOneStack.Navigator screenOptions={{ headerShown: false }}>
      <TabOneStack.Screen
        component={WalletsTab}
        name="WalletsTab"
        options={{ title: "" }}
      />
    </TabOneStack.Navigator>
  )
}

const TabTwoStack = createStackNavigator<TabTwoParamList>()

const TabTwoNavigator = (): JSX.Element => {
  return (
    <TabTwoStack.Navigator screenOptions={{ headerShown: false }}>
      <TabTwoStack.Screen
        component={TransactionsTab}
        name="TransactionsTab"
        options={{ title: "" }}
      />
    </TabTwoStack.Navigator>
  )
}
