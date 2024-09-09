import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useBleServer } from '../utils/useBleData';

const style = StyleSheet.create({
  title: {
    width: "100%",
    fontSize: 32,
    textAlign: "center",
    color: "#fff",
    paddingTop: 50,
  }
})

const App = () => {
  const { isConnected, temperature: tempData } = useBleServer();

  return (
    <View>
      <Text style={style.title}>Safety Sense App</Text>
      {/* <Button onPress={() => {setBluetoothState('loading')}} title='Reload Bluetooth'/> */}
      <Text style={style.title}>Status: {isConnected.current ? 'connected' : 'not connected'}</Text>
      <Text style={style.title}>Temp Data: {tempData ?? 'none'}</Text>
    </View>
  );
}

export default App;
