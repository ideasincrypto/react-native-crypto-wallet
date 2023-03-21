import React, { useContext } from "react"
import { View, StyleSheet, Text } from "react-native"
import ColorPicker, {
  Panel1,
  Swatches,
  Preview,
  OpacitySlider,
  HueSlider,
} from "reanimated-color-picker"
import { DataContext } from "../../../providers/DataProvider"

const ColorPickerScreen = (): JSX.Element => {
  const { pickedColor, setPickedColor } = useContext(DataContext)
  return (
    <View style={styles.container}>
      <ColorPicker
        style={{ width: "70%" }}
        value={pickedColor}
        onComplete={ ({ hex }) => setPickedColor(hex)}
      >
        <Preview hideInitialColor={true} />
        <Panel1 />
        <HueSlider />
        <OpacitySlider />
        <Swatches />
      </ColorPicker>
    </View>
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

export default ColorPickerScreen
