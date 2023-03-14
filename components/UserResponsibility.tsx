import React from "react"
import { StyleSheet, View, Dimensions } from "react-native"
import { Box, Text, Checkbox } from "native-base"

const UserResponsibility = ({
  checkbox1,
  checkbox2,
  checkbox3,
  onCheckboxPress,
}): JSX.Element => {
  return (
    <View>
      <View>
        <Box bg="gray.100" rounded="xl" style={styles.boxCheckbox}>
          <View style={styles.boxCheckboxView}>
            <Box style={{ gap: 40 }} width="100%">
              <Checkbox
                _text={{ width: "100%" }}
                isChecked={checkbox1}
                value="one"
                width={"100%"}
                onChange={() => onCheckboxPress(1)}
              >
                <Text style={styles.checkboxText}>
                  If I lose my secret phrase, I will not be able to recover this
                  wallet
                </Text>
              </Checkbox>
              <Checkbox
                _text={{ width: "100%" }}
                isChecked={checkbox2}
                value="two"
                width={"100%"}
                onChange={() => onCheckboxPress(2)}
              >
                <Text style={styles.checkboxText}>
                  I am responsible for any issue that happens when using this
                  wallet.
                </Text>
              </Checkbox>
              <Checkbox
                _text={{ width: "100%" }}
                isChecked={checkbox3}
                value="three"
                width={"100%"}
                onChange={() => onCheckboxPress(3)}
              >
                <Text style={styles.checkboxText}>
                  I am ready to create my new wallet.
                </Text>
              </Checkbox>
            </Box>
          </View>
        </Box>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  boxLogo: {
    flex: 1,
    width: "100%",
    height: Dimensions.get("window").height / 3,
    justifyContent: "center",
    alignItems: "center",
  },
  boxCheckbox: {
    width: "100%",
  },
  boxCheckboxView: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 30,
    padding: 20,
  },
  checkboxText: {
    flexWrap: "wrap",
    paddingLeft: 20,
    paddingRight: 20,
    flexGrow: 1,
    flexShrink: 1,
  },
})

export default UserResponsibility
