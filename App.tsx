import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { InventoryProvider } from './src/context/InventoryContext';
import { SalesProvider } from './src/context/SalesContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <InventoryProvider>
      <SalesProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SalesProvider>
    </InventoryProvider>
  );
}
