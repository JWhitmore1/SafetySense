import React from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import icons from '../data/icons';

const ConnectingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Welcome Text */}
      <Text style={styles.welcomeText}>Welcome to SafetySense!</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>Stay safe with real-time hazard alerts.</Text>

      {/* Logo */}
      <Image 
        source={(icons.logo)} 
        style={styles.logo} 
        resizeMode="contain"
      />

      <Text style={styles.subtitle}>Connecting to device...</Text>
      <ActivityIndicator size="large" color="#64ab5b" />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  button: {
    backgroundColor: '#34A253',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default ConnectingScreen;