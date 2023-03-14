import * as WebBrowser from "expo-web-browser"
import React from "react"
import { StyleSheet, TouchableOpacity } from "react-native"

import Colors from "../constants/Colors"
import { MonoText } from "./StyledText"
import { Text, View } from "./Themed"

const EditScreenInfo = ({ path }: { path: string }): JSX.Element => {
  return (
    <View>
      <View style={styles.getStartedContainer}>
        <Text
          darkColor="rgba(255,255,255,0.8)"
          lightColor="rgba(0,0,0,0.8)"
          style={styles.getStartedText}
        >
          Open up the code for this screen:
        </Text>

        <View
          darkColor="rgba(255,255,255,0.05)"
          lightColor="rgba(0,0,0,0.05)"
          style={[styles.codeHighlightContainer, styles.homeScreenFilename]}
        >
          <MonoText>{path}</MonoText>
        </View>

        <Text
          darkColor="rgba(255,255,255,0.8)"
          lightColor="rgba(0,0,0,0.8)"
          style={styles.getStartedText}
        >
          Change any of the text, save the file, and your app will automatically
          update.
        </Text>
      </View>

      <View style={styles.helpContainer}>
        <TouchableOpacity style={styles.helpLink} onPress={handleHelpPress}>
          <Text lightColor={Colors.light.tint} style={styles.helpLinkText}>
            Tap here if your app doesn&apos;t automatically update after making
            changes
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default EditScreenInfo

const handleHelpPress = (): void => {
  WebBrowser.openBrowserAsync(
    "https://docs.expo.io/get-started/create-a-new-app"
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  developmentModeText: {
    marginBottom: 20,
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center",
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)",
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: "center",
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: "center",
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: "center",
  },
})
