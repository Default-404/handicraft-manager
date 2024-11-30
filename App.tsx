import React, { useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { initializeDatabase } from './src/utils/database';

import AppNavigator from './src/navigation/AppNavigator';
import { InventoryProvider } from './src/context/InventoryContext';
import { SalesProvider } from './src/context/SalesContext';
import { ProductsProvider } from './src/context/ProductsContext';
import { CashProvider } from './src/context/CashContext';

const App = () => {
  useEffect(() => {
    initializeDatabase();
  }, []);
  
  return (
    <InventoryProvider>
      <ProductsProvider>
        <SalesProvider>
          <CashProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </CashProvider>
        </SalesProvider>
      </ProductsProvider>
    </InventoryProvider>
  );
}

export default App;
