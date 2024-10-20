import React, { useState } from 'react';
import { View, Text, Switch, TextInput, StyleSheet, Image } from 'react-native';
import icons from '../data/icons';

const SettingsScreen = () => {
  const [popUpNotification, setPopUpNotification] = useState(true);
  const [audioAlert, setAudioAlert] = useState(false);
  const [vibrationAlert, setVibrationAlert] = useState(true);
  const [temperature, setTemperature] = useState('');
  const [soundNoise, setSoundNoise] = useState('');
  const [airQuality, setAirQuality] = useState('');
  const [uv, setUv] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Alert Settings</Text>

      <View style={styles.row}>
        <Image source={icons.message} style={styles.icon} />
        <Text style={styles.label}>Pop-up Notification</Text>
        <Switch value={popUpNotification} onValueChange={setPopUpNotification} />
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

      <View style={styles.inputRow}>
        <Image source={icons.temperature} style={styles.icon} />
        <Text style={styles.label}>Temperature</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Number"
          value={temperature}
          onChangeText={setTemperature}
        />
        <Text style={styles.unit}>°C</Text>
      </View>

      <View style={styles.inputRow}>
        <Image source={icons.sound} style={styles.icon} />
        <Text style={styles.label}>Sound/Noise</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Number"
          value={soundNoise}
          onChangeText={setSoundNoise}
        />
        <Text style={styles.unit}>dB</Text>
      </View>

      <View style={styles.inputRow}>
        <Image source={icons.air} style={styles.icon} />
        <Text style={styles.label}>Air Quality</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Number"
          value={airQuality}
          onChangeText={setAirQuality}
        />
        <Text style={styles.unit}>AQI</Text> 

      </View>

      <View style={styles.inputRow}>
        <Image source={icons.uv} style={styles.icon} />
        <Text style={styles.label}>UV</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Number"
          value={uv}
          onChangeText={setUv}
        />
        <Text style={styles.unit}>UVI</Text> 

      </View>
    </View>
  );
};

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
    width:30,
  }
});

export default SettingsScreen;