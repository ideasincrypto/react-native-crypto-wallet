import { Ionicons } from "@expo/vector-icons"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import React, { useContext, useEffect } from "react"

import Colors from "../constants/Colors"
import useColorScheme from "../hooks/useColorScheme"
import WalletsTab from "../screens/WalletsTab"
import TransactionsTab from "../screens/TransactionsTab"
import { BottomTabParamList, TabOneParamList, TabTwoParamList } from "../types"
import { DataContext } from "../providers/DataProvider"
import moment from "moment"
import { GraphPoint } from "react-native-graph"
import { GraphIntervalType } from "../components/WalletGraph"

const BottomTab = createBottomTabNavigator<BottomTabParamList>()

const BottomTabNavigator = (): JSX.Element => {
  const colorScheme = useColorScheme()
  const {
    pickedColor,
    setPointsALL,
    setPoints1Y,
    setPoints1M,
    setPoints1W,
    setPoints1D,
    setSelectedPoints,
  } = useContext(DataContext)

  const getCoinData = async (timestamp): Promise<GraphPoint[]> => {

    let timeValue = moment().unix()
    switch (timestamp) {
      case "1W":
        timeValue = moment().subtract(1, "weeks").unix()
        break
      case "1M":
        timeValue = moment().subtract(1, "months").unix()
        break
      case "1Y":
        timeValue = moment().subtract(1, "years").unix()
        break
      case "ALL":
        timeValue = 10000
        break
      default:
        // 1D
        timeValue = moment().subtract(1, "days").unix()
        break
    }

    let arrayOfObjects: GraphPoint[] = []

    try {
      // eslint-disable-next-line max-len
      const url = `https://api.coingecko.com/api/v3/coins/kaspa/market_chart/range?vs_currency=usd&from=${timeValue}&to=${moment().unix()}`
      console.log(url)
      const response = await fetch(url)
      const { prices } = await response.json()
      arrayOfObjects = prices?.map((x: number | Date) => ({
        date: new Date(x[0]),
        value: x[1],
      }))
      return arrayOfObjects
    } catch (error) {
      console.error(error)
      return []
    }
  }

  const getData = async (): Promise<void> => {


    const allData = await getCoinData("ALL")
    const yearData = await getCoinData("1Y")
    const monthData = await getCoinData("1M")
    const weekData = await getCoinData("1W")
    const dayData = await getCoinData("1D")

    setPointsALL(allData)
    setPoints1Y(yearData)
    setPoints1M(monthData)
    setPoints1W(weekData)
    setPoints1D(dayData)
    setSelectedPoints(dayData)

    // console.log("allData", allData.length)
    // console.log("yearData", yearData.length)
    // console.log("monthData", monthData.length)
    // console.log("weekData", weekData.length)
    // console.log("dayData", dayData.length)
    try {
      // eslint-disable-next-line max-len
      const url = `https://api.coingecko.com/api/v3/coins/kaspa/market_chart/range?vs_currency=usd&from=${1000}&to=${moment().unix()}`
      console.log(url)
      const response = await fetch(url)
      const { prices } = await response.json()
      const arrayOfObjects: GraphPoint[] = prices?.map((x: number | Date) => ({
        date: new Date(x[0]),
        value: x[1],
      }))

      // const yearData: GraphPoint[] = []
      // const monthData: GraphPoint[] = []
      // const weekData: GraphPoint[] = []
      // const dayData: GraphPoint[] = []
      // const sixHourData: GraphPoint[] = []

      // const now = new Date()

      // const startDate1D = new Date(new Date().setHours(now.getDay() - 24))
      // const startDate1W = new Date(new Date().setHours(now.getDay() - 24 * 7))
      // const startDate1M = new Date(new Date().setMonth(now.getMonth() - 1))
      // const startDate1Y = new Date(
      //   new Date().setFullYear(now.getFullYear() - 1)
      // )

      // const todayVal = new Date()

      // for (let i = 0; i < arrayOfObjects.length; i++) {
      //   const compareDate = new Date(arrayOfObjects[i].date)
      //   if (compareDate > startDate1D && compareDate < todayVal) {
      //     dayData.push(arrayOfObjects[i])
      //   }
      //   if (compareDate > startDate1W && compareDate < todayVal) {
      //     weekData.push(arrayOfObjects[i])
      //   }
      //   if (compareDate > startDate1M && compareDate < todayVal) {
      //     monthData.push(arrayOfObjects[i])
      //   }
      //   if (compareDate > startDate1Y && compareDate < todayVal) {
      //     yearData.push(arrayOfObjects[i])
      //   }
      //   console.log(arrayOfObjects[i])
      // }

      // const data = {
      //   yearData,
      //   monthData,
      //   weekData,
      //   dayData,
      // }

      // console.log(dayData)

      
    } catch (error) {
      console.error(error)
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
