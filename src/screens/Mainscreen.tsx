import React from 'react';
import icons from '../data/icons';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { useBleServer } from '../hooks/useBleServer';
import { DataCircle } from '../components/DataCircle';
import { useData } from '../hooks/useData';

type RootStackParamList = {
  MainScreen: {
    title: string;
    message: string;
    category: string;
  };
};

type MainScreenRouteProp = RouteProp<RootStackParamList, 'MainScreen'>;

const MainScreen = () => {
  const route = useRoute<MainScreenRouteProp>();
  const { loading, data } = useData();
  const { title = 'No Data', message = 'No message available', category } = route.params || {};

  const renderDataCircle = () => {
    
    switch (category) {
      case 'Temperature':
        return <DataCircle title='' value={data?.temperature} maxValue={35} threshold={30} />;
      case 'Air Quality':
        return <DataCircle title='' value={data?.airQuality} maxValue={100} threshold={60} />;
      case 'Sound Level':
        return <DataCircle title='' value={data?.noiseLevel} maxValue={130} threshold={110} />;
      case 'Humidity':
        return <DataCircle title='' value={0} maxValue={14} threshold={8} />;
      default:
        return null;
    }
  };

  const getTitleIcon = () => {
    switch (category) {
      case 'Temperature':
        return icons.temperature;
      case 'Air Quality':
        return icons.air;
      case 'Sound Level':
        return icons.sound;
      case 'Humidity':
        return icons.hum;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        {getTitleIcon() && (
          <Image 
            source={getTitleIcon()} 
            style={styles.titleImage}
          />
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      {renderDataCircle()}
      <View style={styles.messageContainer}>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 70,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleImage: {
    width: 35,
    height: 35,
    marginRight: 10,
    alignSelf: 'center',
  },
  message: {
    fontSize: 18,
    marginHorizontal:10,
    marginVertical:10,
    lineHeight: 30,
  },
  messageContainer: {
    backgroundColor: '#fff', 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: '#ccc', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 4, 
    elevation: 5, 
    padding: 15,
    marginVertical: 10, 
    width: '88%', 
    alignSelf: 'center',
  },
});

export default MainScreen;