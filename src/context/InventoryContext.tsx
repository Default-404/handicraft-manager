import React, { createContext, useState, useContext } from 'react';

type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

type InventoryContextType = {
  items: InventoryItem[];
  addItem: (item: InventoryItem) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
};

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);

  const addItem = (item: InventoryItem) => {
    setItems([...items, item]);
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
