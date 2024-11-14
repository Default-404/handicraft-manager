import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import InventoryScreen from '../screens/InventoryScreen';
import SalesScreen from '../screens/SalesScreen';
import CashScreen from '../screens/CashScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Inventory" component={InventoryScreen} />
      <Tab.Screen name="Sales" component={SalesScreen} />
      <Tab.Screen name="Cash" component={CashScreen} />
    </Tab.Navigator>
  );
};

export default AppNavigator;
