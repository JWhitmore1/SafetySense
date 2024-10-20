import AsyncStorage from '@react-native-async-storage/async-storage';
import { SensorData, warningCategories } from '../data/sensorTypes';

export const storeData = async (value: SensorData) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('sensorData', jsonValue);
  } catch (e) {
    console.log(`Error saving data: ${e}`);
  }
};

export const getData = async (): Promise<SensorData> => {
  try {
    const jsonValue = await AsyncStorage.getItem('sensorData');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    return Promise.reject(e);
  }
};

export const updateThreshold = async (sensor: warningCategories, value: string) => {
  try {
    await AsyncStorage.setItem(`${sensor.toLowerCase()}Threshold`, value);
  } catch (e) {
    console.log(`Error saving threshold: ${e}`);
  }
}

export const getThreshold = async (sensor: warningCategories): Promise<string> => {
  try {
    const value = await AsyncStorage.getItem(`${sensor.toLowerCase()}Threshold`);
    if (value) {
      return value;
    } else {
      return Promise.reject(`Could not find threshold for ${sensor}`);
    }
  } catch (e) {
    return Promise.reject(e);
  }
};
