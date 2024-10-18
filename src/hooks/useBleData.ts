import { useState, useEffect, useRef } from 'react';
import { scanDevices } from '../utils/Scan';
import { connectDevice } from '../utils/Connect';
import BleManager, { Peripheral } from 'react-native-ble-manager';
import { ServerData } from '../data/ServerData';

const READ_INTERVAL = 5_000; //time between value reads in ms
const DEVICE_NAME = "SafetySense"
const SERVICE_UUID = '8b712be9-e6cd-4356-b703-beca1b406f5c';
const CHARACTERISTIC_UUID = '137700a2-86a4-4f8f-8864-b1839db64ef6';

const byteArrayToString = (array: number[]) => {
  var result = "";
  for (var i = 0; i < array.length; i++) {
    result += String.fromCharCode(array[i]);
  }
  return result;
}

export const useBleServer = (mockData: boolean) : ServerData => {
  const peripheralUUID = useRef<string>('5778f008-5ad3-d8d1-01b1-59baf2a6cafb');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [dataAvailable, setDataAvailable] = useState<boolean>(false);
  const [peripherals, setPeripherals] = useState<Map<string, Peripheral>>();
  const [temp, setTemp] = useState<number>(0);
  const [noise, setNoise] = useState<number>(0);
  const [air, setAir] = useState<number>(0);

  const isDeviceConnected = async () => {
    return await BleManager.isPeripheralConnected(peripheralUUID.current, []);
  }

  const queryServer = async () => {
    // console.log('reading value from server');
    isDeviceConnected().then((value) => {
      setIsConnected(value);
    })

    if(isConnected) {
      const data = await BleManager.read(peripheralUUID.current, SERVICE_UUID, CHARACTERISTIC_UUID)
        .catch(async (error) => {
          console.log('Error reading value: ' + error);
          setIsConnected(false);
        });
      if (data) {
        const dataString = byteArrayToString(data);
        const splitData = dataString.split(',');

        console.log("data: " + splitData);
        
        setTemp(parseFloat(splitData[0]));
        setNoise(parseFloat(splitData[1]));
        setAir(parseFloat(splitData[2]));
        setDataAvailable(true);
      }
    }
  }

  useEffect(() => {
    console.log('scanning for peripherals...')
    scanDevices([]).then((result) => {
      setPeripherals(result);
    })

    const interval = setInterval(async () => {
      queryServer();
    }, READ_INTERVAL);
  
    return () => clearInterval(interval);
  }, [isConnected]);

  useEffect(() => {
    if (peripherals) {
      peripheralUUID.current = Array.from(peripherals.values())
        .find((peripheral) => peripheral.name = DEVICE_NAME)?.id ?? '';
      
      if (!isConnected) {
        connectDevice(peripheralUUID.current).then((connected) => {
          setIsConnected(connected);
        }).catch((error) => {
          console.log("Error while connecting: " + error);
        });
      }
    }
  }, [peripherals]);

  if(mockData) {
    return { 
      dataAvailable: true, 
      data: {
        temperature: 26.50, 
        noiseLevel: 78.9, 
        airQuality: 25, 
        uvIndex: 2 
      }
    }
  }

  return { 
    dataAvailable,
    data: {
      temperature: temp, 
      noiseLevel: noise, 
      airQuality: air 
    } 
  };
}

