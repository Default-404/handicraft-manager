import React, { createContext, useState, useEffect, useContext } from 'react';

import { SalesItem } from '../types/types';
import { 
  getSalesDatabase, 
  addSaleDatabase, 
  updateSaleDatabase, 
  deleteSaleDatabase, 
} from '../utils/database';

type SalesContextType = {
  sales: SalesItem[];
  addSale: (sale: Omit<SalesItem, 'id'>) => void;
  updateSale: (sale: SalesItem) => void;
  deleteSale: (saleId: string) => void;
};

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sales, setSales] = useState<SalesItem[]>([]);

  useEffect(() => {
    getSalesDatabase((fetchedSales) => setSales(fetchedSales));
  }, []);

  const addSale = (saleData: Omit<SalesItem, 'id'>) => {
    const newSale: SalesItem = {
      ...saleData,
      id: Date.now().toString(),
    };
    setSales((prevSales) => [...prevSales, newSale]);
    addSaleDatabase(newSale);
  };

  const updateSale = (updatedSale: SalesItem) => {
    setSales((prevSales) =>
      prevSales.map((sale) => (sale.id === updatedSale.id ? updatedSale : sale))
    );
    updateSaleDatabase(updatedSale);
  };

  const deleteSale = (saleId: string) => {
    setSales((prevSales) => prevSales.filter((sale) => sale.id !== saleId));
    deleteSaleDatabase(saleId);
  };
  

  return (
    <SalesContext.Provider value={{ sales, addSale, updateSale, deleteSale }}>
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => {
  const context = useContext(SalesContext);
  if (!context) throw new Error('useSales must be used within a SalesProvider');
  return context;
};
