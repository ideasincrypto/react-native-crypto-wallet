import React from "react"
import { StyleSheet, View, useColorScheme } from "react-native"
import { Skeleton, Text, Heading } from "native-base"

type WalletAmountType = {
  walletTotal: string | undefined
  currentPrice: string | undefined
}

const currencyFormatter = (val: number): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  })
  return formatter.format(val)
}

const WalletAmount = ({
  walletTotal,
  currentPrice,
}: WalletAmountType): JSX.Element => {
  const textColor = useColorScheme() === "dark" ? "#fff" : "#000"

  if (walletTotal === undefined || currentPrice === undefined) {
    return (
      <View style={styles.container}>
        <View style={styles.skeletonContainer}>
          <Skeleton h="75" />
        </View>
        <View style={styles.skeletonContainer}>
          <Skeleton h="10" />
        </View>
      </View>
    )
  }

  const value = parseFloat(walletTotal) * parseFloat(currentPrice)
  const walletTotalMonetaryValue = currencyFormatter(value)
  return (
    <View style={styles.container}>
      <View>
        <Heading color={textColor} size="3xl">
          {walletTotalMonetaryValue}
        </Heading>
      </View>
      <View>
        <Text color={textColor} fontSize="xl">{`${walletTotal} KASPA`}</Text>
      </View>
    </View>
  )
}

export default WalletAmount

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  skeletonContainer: {
    width: 200,
    marginBottom: 20,
  },
})
