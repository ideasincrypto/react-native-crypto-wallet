import React, { useContext } from "react"
import {
  StyleSheet,
  Linking,
  View,
  Text,
  useColorScheme,
  ScrollView,
} from "react-native"
import { VStack, Divider, HStack } from "native-base"

import Constants from "expo-constants"

const version = Constants.manifest.version
import * as StoreReview from "expo-store-review"

import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons"
import { DataContext } from "../../../providers/DataProvider"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useNavigation } from "@react-navigation/native"

type IconType = {
  name: string
  color: string
  type?: string
}
const Icon = (props: IconType): JSX.Element => {
  if (props.type === "mci") {
    return (
      <MaterialCommunityIcons
        color={props.color}
        name={props.name as any}
        size={30}
      />
    )
  }
  if (props.type === "fa") {
    return (
      <FontAwesome5 color={props.color} name={props.name as any} size={30} />
    )
  }
  return <Ionicons color={props.color} name={props.name as any} size={30} />
}

const goToRating = (): void => {
  if (!StoreReview.isAvailableAsync()) {
    Linking.openURL(
      // eslint-disable-next-line max-len
      "https://apps.apple.com/us/app/wallpaperqr/id1558057109?action=write-review"
    )
  } else {
    StoreReview.requestReview()
  }
}

const SettingsScreen = (): JSX.Element => {
  const navigation = useNavigation()
  const textColor = useColorScheme() === "dark" ? "#fff" : "#000"
  const boxColor = useColorScheme() === "dark" ? "#555555" : "#C7C6C4"
  const { pickedColor } = useContext(DataContext)
  return (
    <ScrollView style={styles.full}>
      <View style={styles.container}>
        <View style={styles.pageHeader}>
          <Text style={{ color: textColor, fontSize: 32, fontWeight: "bold" }}>
            Settings
          </Text>
        </View>
        <View style={[styles.screen]}>
          <View style={styles.sectionContainer}>
            <View style={[styles.box, { backgroundColor: boxColor }]}>
              <VStack divider={<Divider />} width="100%">
                <TouchableOpacity>
                  <HStack
                    alignItems="center"
                    h={12}
                    justifyContent="space-between"
                    margin="auto"
                    w="90%"
                  >
                    <View style={styles.listItemLeft}>
                      <Icon
                        color={pickedColor}
                        name="vector-selection"
                        type="mci"
                      />
                    </View>
                    <View style={styles.listItemCenter}>
                      <Text
                        style={[
                          styles.listItemCenterText,
                          { color: textColor },
                        ]}
                      >
                        Wallets
                      </Text>
                    </View>
                    <View style={styles.listItemRight}>
                      <Text style={{ fontSize: 14, color: textColor }}>
                        MyWallet1
                      </Text>
                      <Icon color={pickedColor} name="arrow-forward" />
                    </View>
                  </HStack>
                </TouchableOpacity>
              </VStack>
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <View style={[styles.box, { backgroundColor: boxColor }]}>
              <VStack divider={<Divider />} width="100%">
                <TouchableOpacity style={{ width: "100%" }}>
                  <HStack
                    alignItems="center"
                    h={12}
                    justifyContent="center"
                    margin="auto"
                    w="90%"
                  >
                    <View style={styles.listItemLeft}>
                      <Icon color={pickedColor} name="help-circle-outline" />
                    </View>
                    <View style={styles.listItemCenter}>
                      <Text style={{ fontSize: 18, color: textColor }}>
                        FAQ
                      </Text>
                    </View>
                    <View style={styles.listItemRight}>
                      <Icon
                        color={pickedColor}
                        name="arrow-forward"
                        style={styles.align}
                      />
                    </View>
                  </HStack>
                </TouchableOpacity>
                <TouchableOpacity>
                  <HStack
                    alignItems="center"
                    h={12}
                    justifyContent="center"
                    margin="auto"
                    w="90%"
                  >
                    <View style={styles.listItemLeft}>
                      <Icon
                        color={pickedColor}
                        name="information-circle-outline"
                      />
                    </View>
                    <View style={styles.listItemCenter}>
                      <Text style={{ fontSize: 18, color: textColor }}>
                        Guide
                      </Text>
                    </View>
                    <View style={styles.listItemRight}>
                      <Icon color={pickedColor} name="arrow-forward" />
                    </View>
                  </HStack>
                </TouchableOpacity>
              </VStack>
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <View style={[styles.box, { backgroundColor: boxColor }]}>
              <VStack divider={<Divider />} width="100%">
                <TouchableOpacity
                  onPress={() => navigation.navigate("ColorPickerScreen")}
                >
                  <HStack
                    alignItems="center"
                    h={12}
                    justifyContent="center"
                    margin="auto"
                    w="90%"
                  >
                    <View style={styles.listItemLeft}>
                      <Icon color={pickedColor} name="color-palette-outline" />
                    </View>
                    <View style={styles.listItemCenter}>
                      <Text style={{ fontSize: 18, color: textColor }}>
                        Change App Color
                      </Text>
                    </View>
                    <View style={styles.listItemRight}>
                      <Icon color={pickedColor} name="arrow-forward" />
                    </View>
                  </HStack>
                </TouchableOpacity>
                <TouchableOpacity onPress={goToRating}>
                  <HStack
                    alignItems="center"
                    h={12}
                    justifyContent="space-between"
                    margin="auto"
                    w="90%"
                  >
                    <View style={styles.listItemLeft}>
                      <Icon color={pickedColor} name="star-face" type="mci" />
                    </View>
                    <View style={styles.listItemCenter}>
                      <Text style={{ fontSize: 18, color: textColor }}>
                        Rate this app
                      </Text>
                    </View>
                    <View style={styles.listItemRight}>
                      <Icon color={pickedColor} name="arrow-forward" />
                    </View>
                  </HStack>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("LicenseScreen")}
                >
                  <HStack
                    alignItems="center"
                    h={12}
                    justifyContent="space-between"
                    margin="auto"
                    w="90%"
                  >
                    <View style={styles.listItemLeft}>
                      <Icon color={pickedColor} name="copyright" type="mci" />
                    </View>
                    <View style={styles.listItemCenter}>
                      <Text style={{ fontSize: 18, color: textColor }}>
                        License
                      </Text>
                    </View>
                    <View style={styles.listItemRight}>
                      <Icon color={pickedColor} name="arrow-forward" />
                    </View>
                  </HStack>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("PrivacyPolicyScreen")}
                >
                  <HStack
                    alignItems="center"
                    h={12}
                    justifyContent="space-between"
                    margin="auto"
                    w="90%"
                  >
                    <View style={styles.listItemLeft}>
                      <Icon
                        color={pickedColor}
                        name="text-box-outline"
                        type="mci"
                      />
                    </View>
                    <View style={styles.listItemCenter}>
                      <Text style={{ fontSize: 18, color: textColor }}>
                        Privacy Policy
                      </Text>
                    </View>
                    <View style={styles.listItemRight}>
                      <Icon color={pickedColor} name="arrow-forward" />
                    </View>
                  </HStack>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("FrameworksScreen")}
                >
                  <HStack
                    alignItems="center"
                    h={12}
                    justifyContent="space-between"
                    margin="auto"
                    w="90%"
                  >
                    <View style={styles.listItemLeft}>
                      <Icon color={pickedColor} name="code-json" type="mci" />
                    </View>
                    <View style={styles.listItemCenter}>
                      <Text style={{ fontSize: 18, color: textColor }}>
                        Frameworks
                      </Text>
                    </View>
                    <View style={styles.listItemRight}>
                      <Icon color={pickedColor} name="arrow-forward" />
                    </View>
                  </HStack>
                </TouchableOpacity>
              </VStack>
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <View style={styles.headerContainer}>
              <Text style={[styles.header, { color: textColor }]}>
                Join the community
              </Text>
            </View>
            <View style={[styles.box, { backgroundColor: boxColor }]}>
              <VStack divider={<Divider />} width="100%">
                <TouchableOpacity
                  onPress={async () =>
                    await Linking.openURL("https://twitter.com/KaspaCurrency")
                  }
                >
                  <HStack
                    alignItems="center"
                    h={12}
                    justifyContent="center"
                    margin="auto"
                    w="90%"
                  >
                    <View style={styles.listItemLeft}>
                      <Icon color={pickedColor} name="twitter" type="fa" />
                    </View>
                    <View style={styles.listItemCenter}>
                      <Text style={{ fontSize: 18, color: textColor }}>
                        Twitter
                      </Text>
                    </View>
                    <View style={styles.listItemRight}>
                      <Icon color={pickedColor} name="arrow-forward" />
                    </View>
                  </HStack>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () =>
                    await Linking.openURL("https://discord.gg/kS3SK5F36R")
                  }
                >
                  <HStack
                    alignItems="center"
                    h={12}
                    justifyContent="space-between"
                    margin="auto"
                    w="90%"
                  >
                    <View style={styles.listItemLeft}>
                      <Icon color={pickedColor} name="discord" type="fa" />
                    </View>
                    <View style={styles.listItemCenter}>
                      <Text style={{ fontSize: 18, color: textColor }}>
                        Discord
                      </Text>
                    </View>
                    <View style={styles.listItemRight}>
                      <Icon color={pickedColor} name="arrow-forward" />
                    </View>
                  </HStack>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () =>
                    await Linking.openURL("https://www.reddit.com/r/kaspa/")
                  }
                >
                  <HStack
                    alignItems="center"
                    h={12}
                    justifyContent="space-between"
                    margin="auto"
                    w="90%"
                  >
                    <View style={styles.listItemLeft}>
                      <Icon color={pickedColor} name="reddit" type="fa" />
                    </View>
                    <View style={styles.listItemCenter}>
                      <Text style={{ fontSize: 18, color: textColor }}>
                        Reddit
                      </Text>
                    </View>
                    <View style={styles.listItemRight}>
                      <Icon color={pickedColor} name="arrow-forward" />
                    </View>
                  </HStack>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () =>
                    await Linking.openURL("https://t.me/Kaspaenglish")
                  }
                >
                  <HStack
                    alignItems="center"
                    h={12}
                    justifyContent="space-between"
                    margin="auto"
                    w="90%"
                  >
                    <View style={styles.listItemLeft}>
                      <Icon color={pickedColor} name="telegram" type="fa" />
                    </View>
                    <View style={styles.listItemCenter}>
                      <Text style={{ fontSize: 18, color: textColor }}>
                        Telegram
                      </Text>
                    </View>
                    <View style={styles.listItemRight}>
                      <Icon color={pickedColor} name="arrow-forward" />
                    </View>
                  </HStack>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () =>
                    await Linking.openURL(
                      "https://www.facebook.com/KaspaCurrencyh"
                    )
                  }
                >
                  <HStack
                    alignItems="center"
                    h={12}
                    justifyContent="space-between"
                    margin="auto"
                    w="90%"
                  >
                    <View style={styles.listItemLeft}>
                      <Icon
                        color={pickedColor}
                        name="facebook-square"
                        type="fa"
                      />
                    </View>
                    <View style={styles.listItemCenter}>
                      <Text style={{ fontSize: 18, color: textColor }}>
                        Facebook
                      </Text>
                    </View>
                    <View style={styles.listItemRight}>
                      <Icon color={pickedColor} name="arrow-forward" />
                    </View>
                  </HStack>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () =>
                    await Linking.openURL(
                      "https://www.youtube.com/@kaspaCurrency"
                    )
                  }
                >
                  <HStack
                    alignItems="center"
                    h={12}
                    justifyContent="space-between"
                    margin="auto"
                    w="90%"
                  >
                    <View style={styles.listItemLeft}>
                      <Icon color={pickedColor} name="youtube" type="fa" />
                    </View>
                    <View style={styles.listItemCenter}>
                      <Text style={{ fontSize: 18, color: textColor }}>
                        YouTube
                      </Text>
                    </View>
                    <View style={styles.listItemRight}>
                      <Icon color={pickedColor} name="arrow-forward" />
                    </View>
                  </HStack>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () =>
                    await Linking.openURL("https://github.com/kaspanet")
                  }
                >
                  <HStack
                    alignItems="center"
                    h={12}
                    justifyContent="space-between"
                    margin="auto"
                    w="90%"
                  >
                    <View style={styles.listItemLeft}>
                      <Icon color={pickedColor} name="github" type="fa" />
                    </View>
                    <View style={styles.listItemCenter}>
                      <Text style={{ fontSize: 18, color: textColor }}>
                        GitHub
                      </Text>
                    </View>
                    <View style={styles.listItemRight}>
                      <Icon color={pickedColor} name="arrow-forward" />
                    </View>
                  </HStack>
                </TouchableOpacity>
              </VStack>
            </View>
          </View>
        </View>
        <View>
          <View style={{ margin: 30, backgroundColor: "transparent" }}>
            <View style={{ backgroundColor: "transparent" }}>
              <Text style={{ textAlign: "center", color: textColor }}>
                Designed, devloped, and built
              </Text>
              <Text style={{ textAlign: "center", color: textColor }}>
                by Colin Franceschini.
              </Text>
            </View>
            <View
              style={{
                alignItems: "center",
                backgroundColor: "transparent",
              }}
            >
              {/* <Thumbnail source={logo} small square /> */}
            </View>
            <View
              style={{
                backgroundColor: "transparent",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontSize: 12, color: "grey" }}
              >{`v${version}`}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  screen: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 40,
  },
  box: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },

  box2: {
    width: "95%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0b0b0e",
    borderRadius: 10,
    padding: 15,
  },

  boxButton: {
    width: "95%",
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#555554",
    borderRadius: 10,
  },
  align: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
    textAlign: "left",
    alignSelf: "flex-start",
  },
  headerContainer: {
    width: "100%",
    height: 30,
    justifyContent: "flex-start",
  },
  sectionContainer: {
    width: "100%",
  },
  pageHeader: {
    width: "100%",
    justifyContent: "center",
    marginBottom: 30,
  },
  full: {
    width: "100%",
  },
  listItemLeft: {
    width: "25%",
    // backgroundColor: "green",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  listItemCenter: {
    alignItems: "flex-start",
    width: "50%",
    // backgroundColor: "red",
  },
  listItemCenterText: {
    fontSize: 16,
    textAlign: "left",
  },
  listItemRight: {
    alignItems: "center",
    width: "25%",
    flexDirection: "row",
    // backgroundColor: "blue",
    justifyContent: "flex-end",
  },
})

export default SettingsScreen
