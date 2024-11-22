import React, { useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { initializeDatabase } from './src/utils/database';

import AppNavigator from './src/navigation/AppNavigator';
import { InventoryProvider } from './src/context/InventoryContext';
import { SalesProvider } from './src/context/SalesContext';

export default function App() {
  useEffect(() => {
    initializeDatabase();
  }, []);
  
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
