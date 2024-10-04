import { useState, useEffect, useRef } from 'react';
import { scanDevices } from '../utils/Scan';
import { connectDevice } from '../utils/Connect';
import BleManager, { Peripheral } from 'react-native-ble-manager';

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

export const useBleServer = (mockData: boolean) => {
  const peripheralUUID = useRef<string>('5778f008-5ad3-d8d1-01b1-59baf2a6cafb');
  const isConnected = useRef(false);
  const [peripherals, setPeripherals] = useState<Map<string, Peripheral>>();
  const [temp, setTemp] = useState<string>('');

  const readTempValue = async () => {
    // console.log('reading value from server');
    if(isConnected.current) {
      const data = await BleManager.read(peripheralUUID.current, SERVICE_UUID, CHARACTERISTIC_UUID)
        .catch(async (error) => {
          console.log('Error reading value: ' + error);
          console.log((await BleManager.getConnectedPeripherals())[0].id);
        });
      if (data) {
        const tempData = byteArrayToString(data);
        console.log(tempData);
        setTemp(tempData);
      }
    }
  }

  useEffect(() => {
    scanDevices([]).then((result)  => {
      setPeripherals(result);
    })

    const interval = setInterval(async () => {
      readTempValue();
    }, READ_INTERVAL);
  
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (peripherals) {
      peripheralUUID.current = Array.from(peripherals.values())
        .find((peripheral) => peripheral.name = DEVICE_NAME)?.id ?? '';
      
      if (!isConnected.current) {
        // TODO: check if connected already.
        connectDevice(peripheralUUID.current).then((connected) => {
          isConnected.current = connected;
        }).catch((error) => {
          console.log("Error while connecting: " + error);
        });
      }
    }
  }, [peripherals]);

  if(mockData) {
    return { 
      isConnected: { current: true }, 
      temperature: '26.50', 
      noiseLevel: '78.9', 
      airQuality: '25', 
      uvIndex: '2' }
  }

  return { isConnected, temperature: temp };
}

