import { Ionicons } from "@expo/vector-icons"
import React, { useContext } from "react"
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  Button,
  Linking,
} from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import ColorPicker, {
  Panel1,
  Swatches,
  Preview,
  OpacitySlider,
  HueSlider,
} from "reanimated-color-picker"
import { DataContext } from "../../../providers/DataProvider"

const FrameworksScreen = (): JSX.Element => {
  const data = [
    { key: "React Native", src: "https://github.com/facebook/react-native" },
    { key: "React", src: "https://github.com/facebook/react" },
    { key: "Expo", src: "https://github.com/expo/expo" },
    { key: "Native Base", src: "https://github.com/GeekyAnts/NativeBase" },
    {
      key: "React Native Wagmi Charts",
      src: "https://github.com/coinjar/react-native-wagmi-charts",
    },
    {
      key: "Bottom Sheet",
      src: "https://github.com/gorhom/react-native-bottom-sheet",
    },
  ]

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 20, height: "100%" }}>
        <FlatList
          data={data}
          ListHeaderComponent={
            <View style={{ paddingTop: 20 }}>
              <Text style={{ fontSize: 30 }}>Frameworks</Text>
              <Text style={{ fontSize: 16, marginBottom: 20 }}>
                Listed below are the open-sourced frameworks that were used to
                build this application. Their efforts are much appreciated.
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  marginBottom: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 20 }}>{`\u2023 ${item.key}`}</Text>
                <TouchableOpacity
                  style={{ paddingLeft: 10 }}
                  onPress={async () => await Linking.openURL(item.src)}
                >
                  <Ionicons color={"blue"} name="link" size={24} />
                </TouchableOpacity>
              </View>
            )
          }}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    width: "100%",
    padding: 20,
  },
})

export default FrameworksScreen
