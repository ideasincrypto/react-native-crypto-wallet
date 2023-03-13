import React, {useContext} from 'react';
import { ActivityIndicator, ColorSchemeName } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthState } from 'react-firebase-hooks/auth';

import NotFoundScreen from '../screens/NotFoundScreen';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Loading from '../screens/Loading';
import { RootStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import { DataContext } from '../providers/DataProvider';
import AddWallet from '../screens/AddWallet';
import ImportWallet from '../screens/ImportWallet';
import {CreateWalletStep1, CreateWalletStep3, CreateWalletStep2} from "../screens/CreateWallet"

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
const Navigation = ({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) => {
  return (
    <NavigationContainer
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

export default Navigation;

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { loading, wallets } = useContext(DataContext)
  if (!loading) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Loading" component={Loading} />
      </Stack.Navigator>
    );
  }
  return (
    <Stack.Navigator>
      {wallets.length > 0 ? (
        <>
          <Stack.Screen name="Root" component={BottomTabNavigator}  />
          <Stack.Screen
            name="NotFound"
            component={NotFoundScreen}
            options={{ title: 'Oops!' }}
          />
        </>
      ) : (
        <>
          <Stack.Screen 
            name="AddWallet" 
            component={AddWallet} 
            options={{
              title: ""
            }}
          />
          <Stack.Screen 
            name="ImportWallet" 
            component={ImportWallet} 
            options={{
              title: "",
              headerBackTitle: "Back"
            }}
          />
          <Stack.Screen 
            name="CreateWalletStep1" 
            component={CreateWalletStep1}
            options={{
              title: "",
              headerBackTitle: "Back"
            }}
          />
          <Stack.Screen 
            name="CreateWalletStep2" 
            component={CreateWalletStep2} 
            options={{
              title: "",
              headerBackTitle: "Back"
            }}
          />
          <Stack.Screen 
            name="CreateWalletStep3" 
            component={CreateWalletStep3} 
            options={{
              title: "",
              headerBackTitle: "Back"
            }}
            />
        </>
      )}
    </Stack.Navigator>
  );
}
