import React from "react"
import { StyleSheet, Text, View, Button } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"

import { RootStackParamList } from "../../types"

const CreateWalletStep2 = ({
  navigation,
}: StackScreenProps<RootStackParamList, "CreateWalletStep2">): JSX.Element => {
  return (
    <View style={styles.container}>
      <Text>CreateWalletStep2</Text>
      <View>
        <Button
          title="Continue"
          onPress={() => navigation.navigate("CreateWalletStep3")}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  inputBox: {
    width: "85%",
    margin: 10,
    padding: 15,
    fontSize: 16,
    borderColor: "#d3d3d3",
    color: "#333",
    borderBottomWidth: 1,
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
  buttonWrap: {
    marginTop: 10,
  },
})

export default CreateWalletStep2
