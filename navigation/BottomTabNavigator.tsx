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
import SettingsScreen from "../screens/SettingsTab/Settings/SettingsScreen"
// eslint-disable-next-line max-len
import ColorPickerScreen from "../screens/SettingsTab/Settings/ColorPickerScreen"
import FrameworksScreen from "../screens/SettingsTab/Settings/FrameworksScreen"
import LicenseScreen from "../screens/SettingsTab/Settings/LicenseScreen"
// eslint-disable-next-line max-len
import PrivacyPolicyScreen from "../screens/SettingsTab/Settings/PrivacyPolicyScreen"
import Recieve from "../screens/WalletsTab/Receive"
import Send from "../screens/WalletsTab/Send"

const BottomTab = createBottomTabNavigator<BottomTabParamList>()

const BottomTabNavigator = (): JSX.Element => {
  const { pickedColor, setApiData, setShowAlert } = useContext(DataContext)

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
      return { error: true, errorDescription: "" }
    }
  }

  useEffect(() => {
    const getData = async (): Promise<void> => {
      const apiData = await getApiData()
      if (apiData && !apiData.error) {
        setApiData(apiData)
      }
      if (apiData.error) {
        setShowAlert({
          description:
            // eslint-disable-next-line max-len
            "An error occurred while trying to fetch data for the wallet. Please close the app and try running the app again.",
        })
      }
    }
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={{
        tabBarActiveTintColor: pickedColor,
        headerShown: false,
      }}
    >
      <BottomTab.Screen
        component={TabOneNavigator}
        name="TabOne"
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
  return (
    <Ionicons
      color={props.color}
      name={props.name as any}
      size={30}
      style={{ marginBottom: -3 }}
    />
  )
}

const TabOneStack = createStackNavigator<TabOneParamList>()

const TabOneNavigator = (): JSX.Element => {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        component={WalletsTab}
        name="WalletsTab"
        options={{ title: "", headerShown: false }}
      />
      <TabOneStack.Screen
        component={Recieve}
        name="Receive"
        options={{ title: "" }}
      />
      <TabOneStack.Screen
        component={Send}
        name="Send"
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
        component={LicenseScreen}
        name="LicenseScreen"
        options={{ title: "" }}
      />
      <TabThreeStack.Screen
        component={PrivacyPolicyScreen}
        name="PrivacyPolicyScreen"
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
