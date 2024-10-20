import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { DataCircle } from '../components/DataCircle';
import icons from '../data/icons';
import { useData } from '../hooks/useData';
import { notify } from '../utils/notify';
import { warningCategories } from "../data/sensorTypes";


/**
 * TODO: use jsonfile package to store and read thresholds
 * then check each threshold to trigger warnings
 */


const style = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#e8f5e9",
    color: "#000",
    height: "100%",
    paddingTop: 40,
  },
  statusBar: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
    maxWidth: '80%',
    textAlign: 'center', 
  },
  messageBar: {
    padding: 15,
    marginBottom: 20,
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FFF',
  },
  dialContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignContent: "space-around",
    padding: 20,
  },
});

const Dashboard = () => {
  const { loading, data } = useData();
  const [warning, setWarning] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      const { temperature, noiseLevel, airQuality } = data;
      let warningCategory: warningCategories | null = null;

      if (temperature > 30) {
        warningCategory = 'Temperature';
      } else if (noiseLevel > 110) {
        warningCategory = 'Sound Level';
      } else if (airQuality > 1400) {
        warningCategory = 'Air Quality';
      }

      if (warningCategory) {
        setWarning(true);
        notify(warningCategory);
      } else {
        setWarning(false);
      }
    }
  }, [data]);

  const getStatusBarStyle = () => ({
    ...style.statusBar,
    backgroundColor: warning ? '#FEE2E2' : '#DCFCE7',
  });

  const getMessageBarStyle = () => ({
    ...style.messageBar,
    backgroundColor: warning ? '#DC2626' : '#16A34A',
  });

  return (
    <View style={style.mainContainer}>
      <View style={getStatusBarStyle()}>
        <Image
          source={warning ? icons.alert : icons.check}
          style={{ width: 24, height: 24 }}
        />
        <Text style={style.statusText}>{warning ? 'Warning!' : 'Safe'}</Text>
      </View>

      <View style={getMessageBarStyle()}>
        <Text style={style.messageText}>
          {warning ? 'Warning! Check sensor values' : 'Everything Under Control :)'}
        </Text>
      </View>

      <View style={style.dialContainer}>
        <DataCircle title='Temperature' value={data?.temperature} maxValue={35} threshold={30} />
        <DataCircle title='Noise Level' value={data?.noiseLevel} maxValue={130} threshold={110} />
        <DataCircle title='Air Quality' value={data?.airQuality} maxValue={1600} threshold={1400} />
        <DataCircle title='Humidity' value={data?.humidity} maxValue={100} />
      </View>
    </View>
  );
};

export default Dashboard;