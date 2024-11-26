import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../components/Home/HomeScreen';
import InventoryNavigator from './InventoryNavigator';
import SalesScreen from '../components/Sales/SalesScreen';
import CashScreen from '../components/Cash/CashScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Inventory" component={InventoryNavigator} />
      <Tab.Screen name="Sales" component={SalesScreen} />
      <Tab.Screen name="Cash" component={CashScreen} />
    </Tab.Navigator>
  );
};

export default AppNavigator;
