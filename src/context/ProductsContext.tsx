import React, { createContext, useState, useEffect, useContext } from 'react';

import { ProductsItem } from '../types/types';
import { 
  getProductsItemsDatabase,
  addProductsItemDatabase,
  updateProductsItemDatabase,
  deleteProductsItemDatabase,
} from '../utils/database';

type ProductsContextType = {
  items: ProductsItem[];
  addProductsItem: (item: ProductsItem) => void;
  updateProductsItem: (item: ProductsItem) => void;
  deleteProductsItem: (id: string) => void;
};

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ProductsItem[]>([]);

  useEffect(() => {
    getProductsItemsDatabase((fetchedItems) => setItems(fetchedItems));
  }, []);

  const addProductsItem = (item: ProductsItem) => {
    setItems((prevItems) => [...prevItems, item]);
    addProductsItemDatabase(item);
  };

  const updateProductsItem = (item: ProductsItem) => {
    setItems((prevItems) =>
      prevItems.map((i) => (i.id === item.id ? item : i))
    );
    updateProductsItemDatabase(item);
  };

  const deleteProductsItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    deleteProductsItemDatabase(id);
  };

  return (
    <ProductsContext.Provider value={{ items, addProductsItem, updateProductsItem, deleteProductsItem }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) throw new Error('useProducts must be used within an ProductsProvider');
  return context;
};
