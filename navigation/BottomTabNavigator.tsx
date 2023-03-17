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

const BottomTab = createBottomTabNavigator<BottomTabParamList>()

const BottomTabNavigator = (): JSX.Element => {
  const {
    pickedColor,
    setPointsALL,
    setPoints1Y,
    setPoints1M,
    setPoints1W,
    setPoints1D,
    setSelectedPoints,
    setSelectedUSDValue,
    setCurrentUSDValue,
  } = useContext(DataContext)

  type DataType = {
    value: number
    date: Date
  }

  type GetDataType = {
    currentPrice?: number
    data1D?: [DataType]
    data1W?: [DataType]
    data1M?: [DataType]
    data1Y?: [DataType]
    dataALL?: [DataType]
  }

  const getApiData = async (): Promise<GetDataType> => {
    try {
      // eslint-disable-next-line max-len
      const url = "https://wallet-server-r6l7o.ondigitalocean.app/api/data"
      console.log(url)
      const response = await fetch(url)
      const json = await response.json()
      return json[0]
    } catch (error) {
      console.error(error)
      return {}
    }
  }

  const getData = async (): Promise<void> => {
    const apiData = await getApiData()
    if (
      apiData &&
      apiData.currentPrice &&
      apiData.dataALL &&
      apiData.data1Y &&
      apiData.data1M &&
      apiData.data1W &&
      apiData.data1D
    ) {
      setCurrentUSDValue(apiData.currentPrice)
      setSelectedUSDValue(apiData.currentPrice)
      const allData = apiData.dataALL
      const yearData = apiData.data1Y
      const monthData = apiData.data1M
      const weekData = apiData.data1W
      const dayData = apiData.data1D

      setPointsALL(allData)
      setPoints1Y(yearData)
      setPoints1M(monthData)
      setPoints1W(weekData)
      setPoints1D(dayData)
      setSelectedPoints(dayData)
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
