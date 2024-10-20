import React from 'react';
import { View, Image, Text, ImageSourcePropType } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../screens/Dashboard';
import { NavigationContainer } from '@react-navigation/native';
import icons from '../data/icons';
import SettingsScreen from '../screens/Setting';
import DetailScreen from '../screens/Detail';
import MainScreen from '../screens/Mainscreen';
import { SensorData } from '../data/ServerData';

interface TabIconProps {
  focused: boolean;
  icon: ImageSourcePropType;
  iconFilled: ImageSourcePropType;
  label: string;
}

const TabIcon = ({ focused, icon, iconFilled, label }: TabIconProps) => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: 80,
        width: 80,
        marginBottom: 0,
        backgroundColor: 'transparent',
      }}>
      <Image
        source={focused ? iconFilled : icon} // Use filled icon if focused
        resizeMode="contain"
        style={{
          width: 24,
          height: 24,
        }}
      />
      <Text style={{ fontSize: 12, color: 'black', marginTop: 4 }}>{label}</Text>
    </View>
  );
};

const tabOptions = (icon: ImageSourcePropType, iconFilled: ImageSourcePropType, label: string) => {
  return {
    tabBarIcon: ({ focused }: { focused: boolean }) => (
      <TabIcon focused={focused} icon={icon} iconFilled={iconFilled} label={label} />
    ),
    headerTitleStyle: {
      fontSize: 18,
      color: 'black',
    },
    tabBarStyle: {
      backgroundColor: '#f0f0f0',
      height: 80,
      padding: 14,
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
          options={() => tabOptions(icons.dashboard, icons.dashboardSolid, 'Dashboard')} 
        />
        <Tab.Screen
          name="Detail"
          component={DetailScreen}
          options={() => tabOptions(icons.detail, icons.detailSolid, 'Detail')} 
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={() => tabOptions(icons.setting, icons.settingSolid, 'Settings')}
        />
        <Tab.Screen
          name="MainScreen"
          component={MainScreen}
          options={{ tabBarButton: () => null }} // hide button
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;