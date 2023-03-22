import { Ionicons } from "@expo/vector-icons"
import { Button } from "native-base"
import React from "react"
import {
  View,
  // StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  Linking,
} from "react-native"
import data from "./frameworks.json"

const FrameworksScreen = (): JSX.Element => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ height: "100%" }}>
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
          renderItem={({ item, index }) => {
            return (
              <View
                style={{
                  marginBottom: 10,
                  flexDirection: "column",
                  alignItems: "center",
                  borderColor: "#000",
                  borderWidth: 2,
                  padding: 10,
                  borderRadius: 10,
                  ...(index === data.length - 1 && { marginBottom: 60 }),
                }}
              >
                <View>
                  <Text style={{ fontSize: 20 }}>{item.key}</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 14 }}>{item.description}</Text>
                </View>
                <Button
                  marginTop={4}
                  size="sm"
                  variant="outline"
                  onPress={async () => await Linking.openURL(item.src)}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Ionicons color={"lightblue"} name="link" size={24} />
                    <Text>Link to source code</Text>
                  </View>
                </Button>
              </View>
            )
          }}
          style={{ paddingHorizontal: 20 }}
        />
      </View>
    </SafeAreaView>
  )
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // alignItems: 'center',
//     // justifyContent: 'center',
//     width: "100%",
//     padding: 20,
//   },
// })

export default FrameworksScreen
