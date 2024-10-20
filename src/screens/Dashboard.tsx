import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {DataCircle} from '../components/DataCircle';
import icons from '../data/icons';
import {useData} from '../hooks/useData';
import {notify} from '../utils/notify';
import {warningCategories} from '../data/sensorTypes';
import {useAlarm} from '../hooks/useAlarm';
import {getThreshold} from '../utils/dataUtils';

const style = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#e8f5e9',
    color: '#000',
    height: '100%',
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
    display: 'flex',
    height: 500,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignContent: 'space-between',
    padding: 10,
  },
});

const Dashboard = () => {
  const {loading, data} = useData();
  const {alarm: warning, triggeredBy} = useAlarm();
  const [thresholds, setThresholds] = useState<number[]>();

  useEffect(() => {
    const tempThreshold = getThreshold('Temperature');
    const noiseThreshold = getThreshold('Sound Level');
    const airThreshold = getThreshold('Air Quality');
    Promise.all([tempThreshold, noiseThreshold, airThreshold]).then(values => {
      const thresholds = values.map(threshold => parseInt(threshold));
      setThresholds(thresholds);
    });
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
          style={{width: 24, height: 24}}
        />
        <Text style={style.statusText}>{warning ? 'Warning!' : 'Safe'}</Text>
      </View>

      <View style={getMessageBarStyle()}>
        <Text style={style.messageText}>
          {warning
            ? 'Warning! Check sensor values'
            : 'Everything Under Control :)'}
        </Text>
      </View>

      <View style={style.dialContainer}>
        <DataCircle
          title="Temperature"
          value={data?.temperature}
          maxValue={40}
          unit="°c"
          threshold={thresholds?.[0]}
        />
        <DataCircle
          title="Noise Level"
          value={data?.noiseLevel}
          maxValue={130}
          unit="dB"
          threshold={thresholds?.[1]}
        />
        <DataCircle
          title="Air Quality"
          value={data?.airQuality}
          maxValue={100}
          unit="%"
          threshold={thresholds?.[2]}
        />
        <DataCircle
          title="Humidity"
          value={data?.humidity}
          unit="%"
          maxValue={100}
        />
      </View>
    </View>
  );
};

export default Dashboard;
