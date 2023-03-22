import { Ionicons } from "@expo/vector-icons"
import { Box, Input, Button, IconButton } from "native-base"
import React, { useState } from "react"
import { View, StyleSheet, Text, useColorScheme } from "react-native"
import { FontAwesome5 } from "@expo/vector-icons"

const Send = (): JSX.Element => {
  const [address, setAddress] = useState("")
  const [amount, setAmount] = useState("")
  const textColor = useColorScheme() === "dark" ? "#fff" : "#000"
  return (
    <View style={styles.container}>
      {/* <Text>Send Screen</Text> */}
      <View style={{ paddingTop: 50 }}>
        <Box alignItems="center">
          <Input
            color={textColor}
            InputRightElement={
              <>
                <IconButton
                  _icon={{
                    as: FontAwesome5,
                    name: "paste",
                  }}
                />
                <IconButton
                  _icon={{
                    as: Ionicons,
                    name: "qr-code",
                  }}
                />
              </>
            }
            placeholder="Kaspa Address"
            py="0"
            size="2xl"
            w="100%"
            onChangeText={(text) => setAddress(text)}
          />
        </Box>
      </View>
      <View style={{ paddingTop: 20 }}>
        <Box alignItems="center">
          <Input
            color={textColor}
            InputRightElement={
              <Button h="full" rounded="none" w="1/6">
                Max
              </Button>
            }
            keyboardType="number-pad"
            placeholder="Amount"
            py="0"
            returnKeyType="done"
            size="2xl"
            w="100%"
            onChangeText={(val) => setAmount(val)}
          />
        </Box>
      </View>
      <View style={{ paddingTop: 100 }}>
        <Button isDisabled={address === "" || amount === ""} w="full">
          Continue
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 20,
  },
})

export default Send
