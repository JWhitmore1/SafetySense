import { NativeModules, NativeEventEmitter, EmitterSubscription } from "react-native";
import BleManager, {Peripheral} from 'react-native-ble-manager';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const SECONDS_TO_SCAN = 5;
const ALLOW_DUPLICATE = false;

const scanNearbyDevices = (filter: string[]): Promise<Map<string, Peripheral>> => {
 return new Promise((resolve, reject) => {

  const devicesMap = new Map<string, Peripheral>();

  let listeners: EmitterSubscription[] = [];

  const onBleManagerDiscoverPeripheral = (peripheral: Peripheral) => {
        if (peripheral.id && peripheral.name) {
          devicesMap.set(peripheral.id, peripheral);
        }
  };

  const onBleManagerStopScan = () => {
        for (const listener of listeners) {
          listener.remove();
        }
        resolve(devicesMap);
  };

  try {

    listeners = [
      bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', onBleManagerDiscoverPeripheral),
      bleManagerEmitter.addListener('BleManagerStopScan', onBleManagerStopScan),
    ];

    BleManager.scan(filter, SECONDS_TO_SCAN, ALLOW_DUPLICATE);

   } catch (error) {
       reject(new Error(error instanceof Error ? error.message : (error as string)));
   }
})
}

export const scanDevices = async (filter: string[]) => {
 return await scanNearbyDevices(filter);
}
