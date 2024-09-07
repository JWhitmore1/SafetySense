import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { scanDevices } from '../utils/Scan';
import { connectDevice } from '../utils/Connect';
import BleManager, { Peripheral } from 'react-native-ble-manager';

const READ_INTERVAL = 5_000; //time between value reads in ms
const DEVICE_NAME = "SafetySense"
const SERVICE_UUID = '8b712be9-e6cd-4356-b703-beca1b406f5c';
const CHARACTERISTIC_UUID = '137700a2-86a4-4f8f-8864-b1839db64ef6';

const style = StyleSheet.create({
  title: {
    width: "100%",
    fontSize: 32,
    textAlign: "center",
    color: "#fff",
    paddingTop: 50,
  }
})

function byteArrayToString(array: number[]) {
  var result = "";
  for (var i = 0; i < array.length; i++) {
    result += String.fromCharCode(array[i]);
  }
  return result;
}

const App = () => {
  const peripheralUUID = useRef<string>('5778f008-5ad3-d8d1-01b1-59baf2a6cafb');
  const [peripherals, setPeripherals] = useState<Map<string, Peripheral>>();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [tempData, setTempData] = useState<string>('');

  const readTempValue = async () => {
    console.log('reading value');
    const data = await BleManager.read(peripheralUUID.current, SERVICE_UUID, CHARACTERISTIC_UUID)
      .catch(async (error) => {
        console.log('Error reading value: ' + error);
        console.log((await BleManager.getConnectedPeripherals())[0].id);
      });
    if (data) {
      const tempData = byteArrayToString(data);
      console.log(tempData);
      setTempData(tempData);
    }
  }

  useEffect(() => {
    scanDevices([]).then((result)  => {
      setPeripherals(result);
    })

    const interval = setInterval(async () => {
      readTempValue();
    }, READ_INTERVAL);
  
    // return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (peripherals) {
      // if
      // let peripheralId = peripheralUUID.current = Array.from(peripherals.values())
      //   .find((peripheral) => peripheral.name = DEVICE_NAME)?.id ?? '';
      
      // if (!isConnected) {
      //   // TODO: check if connected already.
      //   connectDevice(peripheralUUID.current).then((connected) => {
      //     setIsConnected(connected);
      //   }).catch((error) => {
      //     console.log("Error while connecting: " + error);
      //   });
      // } 
      // console.log(await BleManager.retrieveServices(peripheralUUID.current));
    }
  }, [peripherals]);

  return (
    <View>
      <Text style={style.title}>Safety Sense App</Text>
      {/* <Button onPress={() => {setBluetoothState('loading')}} title='Reload Bluetooth'/> */}
      <Text style={style.title}>Status: {isConnected ? 'connected' : 'not connected'}</Text>
      <Text style={style.title}>Temp Data: {tempData}</Text>
    </View>
  );
}

export default App;
