import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Switch,
  TextInput,
  StyleSheet,
  Image,
  ImageSourcePropType,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import icons from '../data/icons';
import { getThreshold, updateThreshold } from '../utils/dataUtils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 50,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  label: {
    fontSize: 18,
    flex: 1,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    width: 100,
    textAlign: 'right',
    borderRadius: 5,
  },
  unit: {
    fontSize: 15,
    marginLeft: 5,
    width: 30,
  },
});

interface InputRowProps {
  title: string;
  value: string;
  unit: string;
  image: ImageSourcePropType;
  onChange: (value: string) => void;
}

const InputRow = ({title, value, unit, image, onChange}: InputRowProps) => {
  return (
    <View style={styles.inputRow}>
      <Image source={image} style={styles.icon} />
      <Text style={styles.label}>{title}</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Number"
        value={value}
        onChangeText={onChange}
      />
      <Text style={styles.unit}>{unit}</Text>
    </View>
  );
};

const SettingsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [popUpNotification, setPopUpNotification] = useState(true);
  const [audioAlert, setAudioAlert] = useState(false);
  const [vibrationAlert, setVibrationAlert] = useState(true);
  const [temperature, setTemperature] = useState('35');
  const [soundNoise, setSoundNoise] = useState('120');
  const [airQuality, setAirQuality] = useState('50');

  const fetchThresholds = async () => {
    await getThreshold('Temperature').then((value) => {
      setTemperature(value);
    }).catch(() => {
      return Promise.resolve;
    })
    await getThreshold('Sound Level').then((value) => {
      setSoundNoise(value);
    }).catch(() => {
      return Promise.resolve;
    });
    await getThreshold('Air Quality').then((value) => {
      setAirQuality(value);
    }).catch(() => {
      return Promise.resolve;
    });
  }

  useEffect(() => {
    fetchThresholds().then(() => {
      setLoading(false);
    })
  }, [])

  const handleKeyboardClose = () => {
    Keyboard.dismiss();
    updateThreshold('Temperature', temperature);
    updateThreshold('Sound Level', soundNoise);
    updateThreshold('Air Quality', airQuality);
  }

  return loading ? (
    <View style={styles.container}>
      <Text style={styles.heading}>fetching saved values...</Text>
      <ActivityIndicator size="large" color="#64ab5b" />
    </View>
  ) : (
    <TouchableWithoutFeedback onPress={handleKeyboardClose}>
      <View style={styles.container}>
        <Text style={styles.heading}>Alert Settings</Text>

        <View style={styles.row}>
          <Image source={icons.message} style={styles.icon} />
          <Text style={styles.label}>Pop-up Notification</Text>
          <Switch
            value={popUpNotification}
            onValueChange={setPopUpNotification}
          />
        </View>

        <View style={styles.row}>
          <Image source={icons.audio} style={styles.icon} />
          <Text style={styles.label}>Audio Alert</Text>
          <Switch value={audioAlert} onValueChange={setAudioAlert} />
        </View>

        <View style={styles.row}>
          <Image source={icons.vibration} style={styles.icon} />
          <Text style={styles.label}>Vibration Alert</Text>
          <Switch value={vibrationAlert} onValueChange={setVibrationAlert} />
        </View>

        <Text style={styles.heading}>Thresholds</Text>

        <InputRow
          title={'Temperature'}
          value={temperature}
          unit="°C"
          image={icons.temperature}
          onChange={setTemperature}
        />
        <InputRow
          title={'Noise Level'}
          value={soundNoise}
          unit="dB"
          image={icons.sound}
          onChange={setSoundNoise}
        />
        <InputRow
          title={'Air Quality'}
          value={airQuality}
          unit="%"
          image={icons.air}
          onChange={setAirQuality}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SettingsScreen;
