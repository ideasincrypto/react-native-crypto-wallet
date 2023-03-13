import React, { useCallback, useState, useRef, useEffect } from 'react';
import { StyleSheet, TextInput, View, Dimensions, Animated } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { Button, Box, Text, Checkbox } from "native-base";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  useBottomSheetTimingConfigs
} from '@gorhom/bottom-sheet';
import { Easing } from 'react-native-reanimated';

import { RootStackParamList } from '../../types';
import { background } from 'native-base/lib/typescript/theme/styled-system';


const CreateWalletStep1 = ({
  navigation,
}: StackScreenProps<RootStackParamList, 'CreateWalletStep1'>) => {

  const [opacity, setOpacity] = useState(new Animated.Value(0))

  const [checkbox1, setCheckbox1] = useState(false)
  const [checkbox2, setCheckbox2] = useState(false)
  const [checkbox3, setCheckbox3] = useState(false)

  const [bottomSheetOpen, setBottomSheetOpen] = useState(false)


  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // const handleSheetChanges = () => {
  //   setBottomSheetOpen(!bottomSheetOpen)
  // };

  const openBottomSheet = () => {
    setBottomSheetOpen(true)
      bottomSheetModalRef.current?.present()
    Animated.timing(opacity, {
      toValue: 0.7,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }

  const closeBottomSheet = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      setBottomSheetOpen(false)
      bottomSheetModalRef.current?.dismiss()
    }, 50);
  }

  const onCheckboxPress = (checkbox: number) => {
    console.log(checkbox)
    if (checkbox === 1){
      setCheckbox1(!checkbox1)
    } else if (checkbox === 2){
      setCheckbox2(!checkbox2)
    } else {
      setCheckbox3(!checkbox3)
    }
  }

  useEffect(() => {
    setCheckbox1(false)
    setCheckbox2(false)
    setCheckbox3(false)
  }, [bottomSheetOpen])


  const DARK_COLORS = ["#4c669f", "#3b5998", "#192f6a"];
  const LIGHT_COLORS = ["#0077c2", "#00a1ff", "#00c2ff"];


  return (
    <View style={{position: "relative", flex: 1}}>
      <BottomSheetModalProvider>
        {/* {bottomSheetOpen && (
          <View style={{height: "100%", width: "100%", opacity: .75, zIndex: 1, position: "absolute", top: 0}}></View>
        )} */}
        {bottomSheetOpen && <Animated.View style={[styles.backdrop, {opacity: opacity}]}/>}
        <View style={styles.componentContainer}>
          <View style={styles.logoContainer}>
            <Box 
              // opacity={ bottomSheetOpen ? Number.parseInt(JSON.stringify(opacity)) : 1}
              bg={{
                linearGradient: {
                  colors: bottomSheetOpen ? DARK_COLORS : LIGHT_COLORS,
                  start: [0, 0],
                  end: [1, 0]
                }
              }} 
              p="12" 
              rounded="xl"
              _text={{
                fontSize: 'md',
                fontWeight: 'medium',
                color: 'warmGray.50',
              }} 
              style={[styles.boxLogo]}
              >
            Vault Logo
            </Box>
          </View>
          <View style={styles.textAndButtonContainer}>
            <View style={styles.textContainer}>
              <Text fontSize="2xl" bold>Back up secret phrase</Text>
              <Text fontSize="md">Your secret phrase is the key to your wallet. Never share it and do not lose it.</Text>
            </View>
            <View style={styles.buttonContainer}>
              <Button 
                size="lg" 
                variant="outline" 
                onPress={()=> openBottomSheet()}
              >
                Create Wallet
              </Button>
            </View>
          </View>
          <BottomSheetModal
            animationConfigs={
              useBottomSheetTimingConfigs({
                duration: 100,
              })
            }
            style={{ zIndex: 5}}
            handleComponent={() => (
              <View style={styles.headerContainer}>
                <Button variant="link" size="lg" onPress={()=> closeBottomSheet()}>Back</Button>
              </View>
            )}
            // backdropComponent={(props) => (
            //   <BottomSheetBackdrop
            //     {...props}
            //     pressBehavior="none"
            //     opacity={0.5}
            //   />
            // )}
            ref={bottomSheetModalRef}
            snapPoints={['80%']}
            enablePanDownToClose={false}
            enableHandlePanningGesture={false}
          >
            <View style={styles.contentContainer}>
              <View>
                <View>
                  <Box 
                    bg="gray.100"
                    rounded="xl"
                    style={styles.boxCheckbox}
                    >
                      <View style={styles.boxCheckboxView}>
                        <Checkbox value="one" isChecked={checkbox1} onChange={() => onCheckboxPress(1)}>
                          If I lose my secret phrase, I will not be able to recover this wallet
                        </Checkbox>
                        <Checkbox value="two" isChecked={checkbox2} onChange={() => onCheckboxPress(2)}>
                          I am responsible for an issue that happens when using this wallet. 
                        </Checkbox>
                        <Checkbox value="three" isChecked={checkbox3} onChange={() => onCheckboxPress(3)}>
                          I am responsible for an issue that happens when using this wallet. 
                        </Checkbox>
                      </View>
                  </Box>
                </View>
              </View>
              <View style={styles.continueButton}>
                <Button isDisabled={!(checkbox1 && checkbox2 && checkbox3)} onPress={()=> navigation.navigate("CreateWalletStep2")}>Continue</Button>
              </View>
            </View>
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  componentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: "100%",
    padding: 20,
    zIndex: 0
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    paddingTop: 40,
    paddingBottom: 40,
    backgroundColor : 'transparent',
  },
  textAndButtonContainer: {
    flex: 1,
    width: "100%",
  },
  textContainer: {
    paddingBottom: 40,
  },
  buttonContainer: {
    paddingBottom: 40,
  },
  boxLogo: {
    flex: 1,
    width: "100%",
    height: (Dimensions.get('window').height / 3),
    justifyContent: 'center',
    alignItems: 'center'
  },
  boxCheckbox: {
    width: "100%",
  },
  boxCheckboxView: {
    padding: 20,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 30
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: "lightgrey",
    padding: 40
  },
  headerContainer:{
    backgroundColor: "lightgrey",
    flex:1,
    alignItems: "flex-start",
    paddingLeft: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  continueButton: {
    width: "100%",
    paddingTop: 40
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
  }
});

export default CreateWalletStep1;
