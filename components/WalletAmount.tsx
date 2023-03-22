import React, { useContext } from "react"
import { StyleSheet, View, useColorScheme, Dimensions } from "react-native"
import { Skeleton, Text, Heading, useContrastText } from "native-base"
import { DataContext } from "../providers/DataProvider"

const currencyFormatter = (val: number): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  })
  return formatter.format(val)
}

const WalletAmount = ({
  walletTotal = "102389.212312",
  isLoaded,
}): JSX.Element => {
  const { apiData, pickedColor } = useContext(DataContext)
  const textColor = useContrastText(pickedColor)
  const shadowColor = useColorScheme() === "dark" ? "#fff" : "#000"

  const apiVal = apiData ? apiData : { currentPrice: "0" }

  const { currentPrice } = apiVal
  const value = parseFloat(walletTotal) * parseFloat(currentPrice)
  const walletTotalMonetaryValue = currencyFormatter(value)

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: pickedColor, shadowColor: shadowColor },
      ]}
    >
      <View>
        <Skeleton isLoaded={isLoaded} marginBottom={1} w={310}>
          <Heading color={textColor} size="3xl">
            {walletTotalMonetaryValue}
          </Heading>
        </Skeleton>
      </View>
      <View>
        <Skeleton isLoaded={isLoaded} w={230}>
          <Text color={textColor} fontSize="xl">{`${walletTotal} KASPA`}</Text>
        </Skeleton>
      </View>
    </View>
  )
}

export default WalletAmount

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: Dimensions.get("window").height < 800 ? "6%" : "12%",
    paddingTop: Dimensions.get("window").height < 800 ? "6%" : "12%",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
})
