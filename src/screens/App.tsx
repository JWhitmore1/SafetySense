import React from 'react';
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
  const { isConnected, temperature } = useBleServer();

  return (
    <View>
      <Text style={style.title}>Safety Sense App</Text>
      {isConnected ? (
        <Text style={style.title}>Temp Data: {temperature ?? 'none'}</Text>
      ) : (
        <Text style={style.title}>Loading...</Text>
      )}
    </View>
  );
}

export default App;
