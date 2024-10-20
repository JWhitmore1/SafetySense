import Navigator from './src/navigation/Navigator';
import { useBleServer } from './src/hooks/useBleServer';
import ConnectingScreen from './src/screens/ConnectingScreen';
import { useEffect } from 'react';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { useData } from './src/hooks/useData';
import { getThreshold } from './src/utils/dataUtils';
import { notify } from './src/utils/notify';

const App = () => {
  const dataAvailable = useBleServer(false);
  const { loading, data } = useData();

  const alarmCheck = () => {
    if (!loading) {
      getThreshold('Temperature').then((threshold) => {
        if (data?.temperature && data.temperature > parseInt(threshold)) {
          notify('Temperature');
        }
      });
      getThreshold('Sound Level').then((threshold) => {
        if (data?.noiseLevel && data.noiseLevel > parseInt(threshold)) {
          notify('Sound Level');
        }
      });
      getThreshold('Air Quality').then((threshold) => {
        if (data?.airQuality && data.airQuality > parseInt(threshold)) {
          notify('Air Quality');
        }
      });
    }
  }

  useEffect(() => {
    PushNotificationIOS.requestPermissions();

    const interval = setInterval(() => {
      alarmCheck();
    }, 2_000)

    clearInterval(interval);
  }, [])

  return dataAvailable ? (
    <Navigator />
  ) : (
    <ConnectingScreen />
  );
};

export default App;















