import React, { useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { DataCircle } from '../components/DataCircle';
import { useBleServer } from '../hooks/useBleData';
import icons from '../data/icons';
import HomeScreen from './Homepage';
import { SensorData, ServerData } from '../data/ServerData';

/**
 * TODO: use jsonfile package to store and read thresholds
 * then foreach over each threshold to find warnings
 */

const style = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#FFF",
    color: "#000",
    height: "100%",
  },
  title: {
    fontSize: 32,
    textAlign: "center",
    color: "#000",
  },
  dialContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignContent: "space-around",
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 120,
  }
  
})

const Dashboard = () => {
  const { dataAvailable, data }: ServerData = useBleServer(false);
  const { temperature, noiseLevel, airQuality }: SensorData = data;

  return dataAvailable ? (
    <View style={style.mainContainer}>
      <View style={style.titleContainer}>
        <Image 
          source={icons.check}  
          style={{
            width: 35,
            height: 35,
          }}
        />
        <Text style={style.title}> Safe </Text>
      </View>
      <View style={style.dialContainer}>
        <DataCircle title='Temperature' value={temperature} maxValue={35} threshold={30} />
        <DataCircle title='Noise Level' value={noiseLevel} maxValue={130} threshold={110} />
        <DataCircle title='Air Quality' value={airQuality} maxValue={1600} threshold={1400} />
        <DataCircle title='UV Radiation' value={7} maxValue={14} threshold={8} />
      </View>
    </View>
  ) : (
    <HomeScreen />
  );
}

export default Dashboard;
