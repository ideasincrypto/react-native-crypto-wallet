import React, { useContext, useEffect, useState } from "react"
import { StyleSheet, View, useColorScheme } from "react-native"
import { Skeleton, Text, Heading } from "native-base"
import { DataContext } from "../providers/DataProvider"

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
  walletTotal = "10238948.212312",
  isLoaded,
}): JSX.Element => {
  const textColor = useColorScheme() === "dark" ? "#fff" : "#000"
  const { apiData } = useContext(DataContext)
  const [skeleton1, setSkeleton1] = useState([0, 0])
  const [skeleton2, setSkeleton2] = useState([0, 0])

  const apiVal = apiData ? apiData : { currentPrice: "0" }

  const setWidthHeight = (event, val): void => {
    const { width, height } = event.nativeEvent.layout
    if (val === 1) {
      setSkeleton1([width, height])
    }
    if (val === 2) {
      setSkeleton2([width, height])
    }
  }

  const { currentPrice } = apiVal
  const value = parseFloat(walletTotal) * parseFloat(currentPrice)
  const walletTotalMonetaryValue = currencyFormatter(value)

  return (
    <View style={styles.container}>
      <View>
        <Skeleton h={58} isLoaded={isLoaded} marginBottom={1} w={310}>
          <Heading color={textColor} size="3xl">
            {walletTotalMonetaryValue}
          </Heading>
        </Skeleton>
      </View>
      <View>
        <Skeleton h={26} isLoaded={isLoaded} w={230}>
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
  },
  skeletonContainer: {
    width: 200,
    marginBottom: 20,
  },
})
