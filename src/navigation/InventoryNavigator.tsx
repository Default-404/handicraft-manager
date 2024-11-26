import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import InventoryScreen from '../components/Inventory/InventoryScreen';
import ProductsScreen from '../components/Inventory/ProductsScreen';

const Tab = createMaterialTopTabNavigator();

const InventoryNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Produtos" component={ProductsScreen} />
      <Tab.Screen name="Materiais" component={InventoryScreen} />
    </Tab.Navigator>
  );
};

export default InventoryNavigator;