/* tslint:disable */
// forked from
// https://github.com/wcandillon/react-native-redash/blob/master/src/ReText.tsx

import React from "react"
import { Platform, StyleSheet, TextProps as RNTextProps } from "react-native"
import { TextInput } from "react-native"
import Animated, {
  useAnimatedProps,
  useAnimatedReaction,
} from "react-native-reanimated"

Animated.addWhitelistedNativeProps({ text: true })

interface AnimatedTextProps {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  text: Animated.SharedValue<any>
  style?: Animated.AnimateProps<RNTextProps>["style"]
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)

export const AnimatedText = ({
  text,
  style,
}: AnimatedTextProps): JSX.Element => {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const inputRef = React.useRef<any>(null)

  if (Platform.OS === "web") {
    // For some reason, the worklet reaction evaluates upfront regardless of any
    // conditionals within it, causing Android to crash upon the invokation of
    // `setNativeProps`. We are going to break the rules of hooks here so it
    // doesn't invoke `useAnimatedReaction` for platforms outside of the web.

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAnimatedReaction(
      () => {
        return text.value
      },
      (data, prevData) => {
        if (data !== prevData && inputRef.current) {
          inputRef.current.value = data
        }
      },
      [text]
    )
  }
  const animatedProps = useAnimatedProps(() => {
    return {
      text: text.value,
      // Here we use any because the text prop is not available in the type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any
  })
  return (
    <AnimatedTextInput
      animatedProps={animatedProps}
      editable={false}
      ref={Platform.select({ web: inputRef })}
      style={[styles.text, style]}
      underlineColorAndroid="transparent"
      value={text.value}
    />
  )
}

const styles = StyleSheet.create({
  text: {
    color: "black",
  },
})
