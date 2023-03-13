import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Dimensions } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { Button, Box } from "native-base";
import { RootStackParamList } from '../../types';


const AddWallet = ({
  navigation,
}: StackScreenProps<RootStackParamList, 'AddWallet'>) => {
  return (
    <View style={styles.componentContainer}>
      <View style={styles.logoContainer}>
        <Box 
          bg={{
            linearGradient: {
              colors: ['lightBlue.300', 'violet.800'],
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
          style={styles.box}
          >
        Coin Logo
        </Box>
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <Button 
            size="lg" 
            variant="outline" 
            onPress={()=> navigation.navigate('ImportWallet')}
          >
            Import Existing Wallet
          </Button>
        </View>
        <View style={styles.buttonContainer}>
          <Button 
            size="lg" 
            variant="outline" 
            colorScheme="secondary" 
            onPress={()=> navigation.navigate('CreateWalletStep1')}
          >
            Create New Wallet
          </Button>
        </View>
      </View>
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
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    paddingTop: 40,
    paddingBottom: 40,
  },
  buttonsContainer: {
    flex: 1,
    width: "100%",
  },
  buttonContainer: {
    paddingBottom: 40,
  },
  box: {
    flex: 1,
    width: "100%",
    height: (Dimensions.get('window').height / 3),
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default AddWallet;