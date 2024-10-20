import Navigator from './src/navigation/Navigator';
import { useBleServer } from './src/hooks/useBleServer';
import ConnectingScreen from './src/screens/ConnectingScreen';
import { useEffect } from 'react';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { useAlarm } from './src/hooks/useAlarm';
import { notify } from './src/utils/notify';
import AsyncStorage from '@react-native-async-storage/async-storage';


const App = () => {
  const dataAvailable = useBleServer(false);
  const { alarm, triggeredBy } = useAlarm();

  useEffect(() => {
    PushNotificationIOS.requestPermissions();

    // console.log('clearing storage');
    // AsyncStorage.clear();
  }, [])

  useEffect(() => {
    if (alarm && triggeredBy != 'none') {
      notify(triggeredBy);
    }
  }, [alarm])

  return dataAvailable ? (
    <Navigator />
  ) : (
    <ConnectingScreen />
  );
};

export default App;















