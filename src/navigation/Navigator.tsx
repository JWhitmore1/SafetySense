import React from 'react';
import {View, Image, Text, ImageSourcePropType} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Dashboard from '../screens/Dashboard';
import {NavigationContainer} from '@react-navigation/native';
import icons from '../data/icons';
import Detail from '../screens/Detail';
import { SensorData } from '../data/ServerData';

interface TabIconProps {
  focused: boolean;
  icon: ImageSourcePropType;
  label: string;
}

const TabIcon = ({focused, icon, label}: TabIconProps) => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        width: 80,
        marginBottom: 5,
        backgroundColor: focused ? '#e0e0e0' : 'transparent',
      }}>
      <Image
        source={icon}
        resizeMode="contain"
        style={{
          width: 24,
          height: 24,
        }}
      />
      <Text style={{fontSize: 12, color: 'black', marginTop: 4}}>{label}</Text>
    </View>
  );
};

const tabOptions = (icon: ImageSourcePropType, label: string) => {
  return {
    tabBarIcon: ({focused}: {focused: boolean}) => (
      <TabIcon focused={focused} icon={icon} label={label} />
    ),
    headerTitleStyle: {
      fontSize: 18,
      color: 'black',
    },
    tabBarStyle: {
      backgroundColor: '#f0f0f0',
      height: 60,
      padding: 5,
    },
    tabBarLabel: () => null,
  };
};

const Tab = createBottomTabNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Tab.Screen
          name="Dashboard"
          component={Dashboard}
          options={() => tabOptions(icons.placeholder, 'Dashboard')}
        />
        <Tab.Screen
          name="Detail"
          component={Detail}
          options={() => tabOptions(icons.placeholder, 'Detail')}
        />
        <Tab.Screen
          name="Settings"
          component={Dashboard}
          options={() => tabOptions(icons.placeholder, 'Settings')}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
