import React, { useContext } from "react"
import { StyleSheet, View } from "react-native"
import { HStack, WarningOutlineIcon, Text, Slide, Box } from "native-base"
import WalletAmount from "../../components/WalletAmount"
import WalletTransact from "../../components/WalletTransact"
import { DataContext } from "../../providers/DataProvider"
import LineGraph from "../../components/LineGraph"

const WalletsTab = (): JSX.Element => {
  const openBottomSheetTransact = (): boolean => {
    return true
  }

  const { apiData, showAlert, pickedColor } = useContext(DataContext)

  return (
    <View style={styles.container}>
      {/* Wallet Picker */}
      <View
        style={{
          alignSelf: "flex-start",
          // paddingBottom: 30,
          // paddingTop: 30,
          // backgroundColor: pickedColor,
          width: "100%",
          // height: "100%",
        }}
      >
        <WalletAmount isLoaded={apiData} />
      </View>
      <View>
        <WalletTransact />
      </View>
      <View
        style={{
          // justifyContent: "center",
          // justifyContent: "flex-end",
          // alignSelf: "flex-end",
        }}
      >
        <LineGraph apiData={apiData} isLoaded={apiData} />
      </View>
      <Slide in={showAlert} placement="top">
        <Box
          alignItems="center"
          bg="red.400"
          borderRadius="xs"
          justifyContent="center"
          p="2"
          position="absolute"
          w="100%"
          safeArea
        >
          <HStack paddingLeft={5} paddingRight={5} space={2}>
            <WarningOutlineIcon color="white" mt="1" size="4" />
            <Text color="white" fontWeight="medium" textAlign="center">
              {showAlert?.description}
            </Text>
          </HStack>
        </Box>
      </Slide>
    </View>
  )
}

export default WalletsTab

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    // padding: 20,
    position: "relative",
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
