import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Button from '../components/Button';
import icons from '../data/icons';

const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image 
        source={(icons.placeholder)} 
        style={styles.logo} 
        resizeMode="contain"
      />

      {/* Welcome Text */}
      <Text style={styles.welcomeText}>Welcome to SafetySense!</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>Stay safe with real-time hazard alerts.</Text>

      {/* Placeholder for the image below the text */}
      <View style={styles.imagePlaceholder} />

      {/* Start Button */}
      <Button title="Start" onPress={() => console.log('Start pressed')} />
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
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  imagePlaceholder: {
    width: 300,
    height: 150,
    backgroundColor: '#ddd',
    marginBottom: 40,
  },
});

export default HomeScreen;