import { useRef } from 'react';
import BleManager, { BleState, }  from 'react-native-ble-manager';
import { NativeModules, NativeEventEmitter, Platform } from "react-native";

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const MAX_CONNECT_WAITING_PERIOD = 30000;
const serviceUUID = '8b712be9-e6cd-4356-b703-beca1b406f5c';
const characteristicUUID = '137700a2-86a4-4f8f-8864-b1839db64ef6';

const enableBluetooth = async () => {
   //before connecting try to enable bluetooth if not enabled already
    if (Platform.OS === 'android' && await BleManager.checkState() === BleState.Off) {
      try {
        await BleManager.enableBluetooth().then(() => console.info('Bluetooth is enabled'));
        //go ahead to connect to the device.
        return true;
      } catch (e) {
        console.error("Bluetooth is disabled");
        //prompt user to enable bluetooth manually and also give them the option to navigate to bluetooth settings directly.
        return false;
      }
    } else if(Platform.OS === 'ios' && await BleManager.checkState() === BleState.Off){
      //For ios, if bluetooth is disabled, don't let user connect to device.
      return false;
  }
}

const isDeviceConnected = async (deviceId: string) => {
    return await BleManager.isPeripheralConnected(deviceId, []);
}

export const connectDevice = (deviceId: string): Promise<boolean> => {
    return new Promise<boolean>(async (resolve, reject) => {
        let failedToConnectTimer: NodeJS.Timeout;
         
        //For android always ensure to enable the bluetooth again before connecting.
        // const isEnabled = await enableBluetooth();
        // if(!isEnabled) {
        //   console.log('not enabled');
        //   //if blutooth is somehow off, first prompt user to turn on the bluetooth
        //   return resolve(false);
        // }

        //before connecting, ensure if app is already connected to device or not.
        let isConnected = await isDeviceConnected(deviceId);

        if (!isConnected) {
          //if not connected already, set the timer such that after some time connection process automatically stops if its failed to connect.
          failedToConnectTimer = setTimeout(() => {
              return resolve(false);
          }, MAX_CONNECT_WAITING_PERIOD);

          await BleManager.connect(deviceId).then(() => {
            //if connected successfully, stop the previous set timer.
            clearTimeout(failedToConnectTimer);
          });

          isConnected = await isDeviceConnected(deviceId);
        }

        if (!isConnected) {
          //now if its not connected somehow, just close the process.
          return resolve(false);
        } else {
          //Connection success
          console.log("connected to: " + deviceId);

          //get the services and characteristics information for the connected hardware device.
          const peripheralInformation = await BleManager.retrieveServices(deviceId);

          /**
           * Check for supported services and characteristics from device info
           */
          const deviceSupportedServices = (peripheralInformation.services || []).map(item => item?.uuid?.toUpperCase());
          const deviceSupportedCharacteristics = (peripheralInformation.characteristics || []).map(_char =>
            _char.characteristic.toUpperCase(),
          );
          console.log(deviceSupportedCharacteristics);

          if (
            !deviceSupportedServices.includes(serviceUUID.toUpperCase()) ||
            !deviceSupportedCharacteristics.includes(characteristicUUID.toUpperCase())
          ) { 
            //if required service ID and Char ID is not supported by hardware, close the connection.
            isConnected = false;
            await BleManager.disconnect(deviceId);
            return reject('Connected device does not have required service and characteristic.');
          }

          await BleManager
            .startNotification(deviceId, serviceUUID, characteristicUUID)
            .then(response => {
              console.log('Started notification successfully on ', characteristicUUID);
            })
            .catch(async () => {
              isConnected = false;
              await BleManager.disconnect(deviceId);
              return reject('Failed to start notification on required service and characteristic.');
            });

      
            let disconnectListener = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', async () => {
              //add the code to execute after hardware disconnects.
              if(deviceId){
                await BleManager.disconnect(deviceId);
              }
              disconnectListener.remove();
            });

          return resolve(isConnected);
          }
    })
}