import { Ionicons } from "@expo/vector-icons"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import React, { useContext, useEffect } from "react"

import WalletsTab from "../screens/WalletsTab"
import TransactionsTab from "../screens/TransactionsTab"
import {
  BottomTabParamList,
  TabOneParamList,
  TabThreeParamList,
  TabTwoParamList,
} from "../types"
import { ApiType, DataContext } from "../providers/DataProvider"
import SettingsTab from "../screens/SettingsTab"
import SettingsScreen from "../screens/SettingsTab/Settings/SettingsScreen"
import ColorPickerScreen from "../screens/SettingsTab/Settings/ColorPickerScreen"
import { Button } from "react-native"
import FrameworksScreen from "../screens/SettingsTab/Settings/FrameworksScreen"

const BottomTab = createBottomTabNavigator<BottomTabParamList>()

const BottomTabNavigator = (): JSX.Element => {
  const { pickedColor, setApiData } = useContext(DataContext)

  const getApiData = async (): Promise<ApiType> => {
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

  useEffect(() => {
    const getData = async (): Promise<void> => {
      const apiData = await getApiData()
      if (apiData) {
        setApiData(apiData)
      }
    }
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          tabBarIcon: ({ color }) => <TabBarIcon color={color} name="wallet" />,
          tabBarShowLabel: false,
        }}
      />
      <BottomTab.Screen
        component={TabTwoNavigator}
        name="TabTwo"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <TabBarIcon color={color} name="list" />,
          tabBarShowLabel: false,
        }}
      />
      <BottomTab.Screen
        component={TabThreeNavigator}
        name="TabThree"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <TabBarIcon color={color} name="settings-outline" />
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

const TabThreeStack = createStackNavigator<TabThreeParamList>()

const TabThreeNavigator = (): JSX.Element => {
  return (
    <TabThreeStack.Navigator screenOptions={{ headerShown: true }}>
      <TabThreeStack.Screen
        component={SettingsScreen}
        name="SettingsTab"
        options={{ title: "", headerShown: false }}
      />
      <TabThreeStack.Screen
        component={ColorPickerScreen}
        name="ColorPickerScreen"
        options={{ title: "" }}
      />
      <TabThreeStack.Screen
        component={FrameworksScreen}
        name="FrameworksScreen"
        options={{ title: "" }}
      />
    </TabThreeStack.Navigator>
  )
}
