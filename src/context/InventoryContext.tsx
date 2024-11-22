import React, { createContext, useState, useEffect, useContext } from 'react';

import { InventoryItem } from '../types/types';
import { 
  getInventoryItemsDatabase,
  addInventoryItemDatabase,
  updateInventoryItemDatabase,
  deleteInventoryItemDatabase,
} from '../utils/database';

type InventoryContextType = {
  items: InventoryItem[];
  addInventoryItem: (item: InventoryItem) => void;
  updateInventoryItem: (item: InventoryItem) => void;
  deleteInventoryItem: (id: string) => void;
};

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    getInventoryItemsDatabase((fetchedItems) => setItems(fetchedItems));
  }, []);

  const addInventoryItem = (item: InventoryItem) => {
    setItems((prevItems) => [...prevItems, item]);
    addInventoryItemDatabase(item);
  };

  const updateInventoryItem = (item: InventoryItem) => {
    setItems((prevItems) =>
      prevItems.map((i) => (i.id === item.id ? item : i))
    );
    updateInventoryItemDatabase(item);
  };

  const deleteInventoryItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    deleteInventoryItemDatabase(id);
  };

  return (
    <InventoryContext.Provider value={{ items, addInventoryItem, updateInventoryItem, deleteInventoryItem }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) throw new Error('useInventory must be used within an InventoryProvider');
  return context;
};
