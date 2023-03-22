import React, { useContext } from "react"
import { StyleSheet, View } from "react-native"
import {
  Alert,
  CloseIcon,
  HStack,
  WarningOutlineIcon,
  VStack,
  Text,
  Slide,
  Box,
  CheckIcon,
} from "native-base"
import WalletAmount from "../../components/WalletAmount"
import WalletTransact from "../../components/WalletTransact"
import { DataContext } from "../../providers/DataProvider"
import LineGraph from "../../components/LineGraph"

const WalletsTab = (): JSX.Element => {
  const openBottomSheetTransact = (): boolean => {
    return true
  }

  const { apiData, showAlert, setShowAlert } = useContext(DataContext)

  return (
    <View style={styles.container}>
      {/* Wallet Picker */}
      <View style={{ paddingBottom: 30, paddingTop: 30 }}>
        <WalletAmount isLoaded={apiData} />
      </View>
      <View style={{ paddingBottom: 40 }}>
        <WalletTransact openBottomSheetTransact={openBottomSheetTransact} />
      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <LineGraph apiData={apiData} isLoaded={apiData} />
      </View>
      {/* <Slide in={showAlert} placement="bottom">
        <View style={{ height: "100%", width: "100%", position: "absolute", bottom: 20, left: 20, right: 20 }}>
          <Alert status="error" w="100%">
            <VStack flexShrink={1} space={2} w="100%">
              <HStack flexShrink={1} justifyContent="space-between" space={2}>
                <HStack flexShrink={1} space={2}>
                  <Alert.Icon mt="1" />
                  <Text color="coolGray.800" fontSize="md">
                    {showAlert?.description || ""}
                  </Text>
                </HStack>
                <IconButton
                  _focus={{
                    borderWidth: 0,
                  }}
                  _icon={{
                    color: "coolGray.600",
                  }}
                  icon={<CloseIcon size="3" />}
                  variant="unstyled"
                  onPress={() => setShowAlert(null)}
                />
              </HStack>
            </VStack>
          </Alert>
        </View>
      </Slide> */}
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
          <HStack space={2} paddingLeft={5} paddingRight={5}>
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
    justifyContent: "center",
    padding: 20,
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
