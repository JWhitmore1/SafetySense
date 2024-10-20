import Navigator from './src/navigation/Navigator';
import { useBleServer } from './src/hooks/useBleServer';
import ConnectingScreen from './src/screens/ConnectingScreen';

const App = () => {
  const dataAvailable = useBleServer(false);

  return dataAvailable ? (
    <Navigator />
  ) : (
    <ConnectingScreen />
  );
};

export default App;















