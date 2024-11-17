import React, { createContext, useState, useEffect, useContext } from 'react';

import { InventoryItem } from '../types/inventory';
import { getInventoryItems, addInventoryItem } from '../utils/database';

type InventoryContextType = {
  items: InventoryItem[];
  addItem: (item: InventoryItem) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
};

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    getInventoryItems((fetchedItems) => setItems(fetchedItems));
  }, []);

  const addItem = (item: InventoryItem) => {
    setItems((prevItems) => [...prevItems, item]);
    addInventoryItem(item);
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  return (
    <InventoryContext.Provider value={{ items, addItem, updateItemQuantity }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) throw new Error('useInventory must be used within an InventoryProvider');
  return context;
};
