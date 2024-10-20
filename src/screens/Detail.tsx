import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import OptionButton from '../components/OptionButton'; 
import icons from '../data/icons';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
  MainScreen: {
    title: string;
    message: string;
    category: string;
  };
};

const DetailScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const options = [
    { title: 'Temperature', imageSource: icons.temperature },
    { title: 'Air Quality', imageSource: icons.air },
    { title: 'Sound Level', imageSource: icons.sound },
    { title: 'Humidity', imageSource: icons.hum },
  ];

  const handleNavigation = (selectedCategory: string) => {
    let title = '';
    let message = '';

    switch (selectedCategory) {
      case 'Temperature':
        title = 'Temperature';
        message = 'Chilly weather today. Don’t forget to grab your jacket!';
        break;
      case 'Air Quality':
        title = 'Air Quality';
        message = 'Air quality is good. A perfect day for a walk!';
        break;
      case 'Sound Level':
        title = 'Sound Level';
        message = 'Sound levels are within a safe range.';
        break;
        case 'Humidity':
          title = 'Humidity';
          message = 'Humidity levels are high today. Stay hydrated!';
          break;
        default:
          break;
    }

    navigation.navigate('MainScreen', { title, message, category: selectedCategory });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Data</Text> 
      {options.map((option) => (
        <View key={option.title} style={styles.optionContainer}>
          <OptionButton
            title={option.title}
            imageSource={option.imageSource}
            onPress={() => handleNavigation(option.title)}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10, 
  },
  title: {
    fontSize: 30, 
    fontWeight: 'bold', 
    marginBottom: 25, 
    paddingTop: 15,
  },
  optionContainer: {
    marginVertical: 10, 
    width: '100%', 
  },
});

export default DetailScreen;