import AsyncStorage from '@react-native-async-storage/async-storage';
import { SensorData } from '../data/sensorTypes';

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
