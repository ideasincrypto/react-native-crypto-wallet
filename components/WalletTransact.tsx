import React, { useContext } from "react"
import { StyleSheet, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { TouchableOpacity } from "react-native-gesture-handler"
import { DataContext } from "../providers/DataProvider"

const WalletTransact = ({ openBottomSheetTransact }): JSX.Element => {
  // const color = useColorScheme() === "dark" ? "#fff" : "#000"
  const { pickedColor } = useContext(DataContext)

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => openBottomSheetTransact("send")}>
            <Ionicons
              color={pickedColor}
              name="arrow-up-circle"
              size={80}
              style={{ marginBottom: -3 }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => openBottomSheetTransact("receive")}>
            <Ionicons
              color={pickedColor}
              name="arrow-down-circle"
              size={80}
              style={{ marginBottom: -3 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default WalletTransact

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
})
