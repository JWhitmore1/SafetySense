import Navigator from './src/navigation/Navigator';
import { useBleServer } from './src/hooks/useBleServer';
import ConnectingScreen from './src/screens/ConnectingScreen';
import { useEffect } from 'react';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

const App = () => {
  const dataAvailable = useBleServer(false);

  useEffect(() => {
    PushNotificationIOS.requestPermissions();
  }, [])

  return dataAvailable ? (
    <Navigator />
  ) : (
    <ConnectingScreen />
  );
};

export default App;















