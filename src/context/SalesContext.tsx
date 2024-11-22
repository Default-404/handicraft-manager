import React, { createContext, useState, useEffect, useContext } from 'react';

import { SalesItem } from '../types/types';
import { getSales, addSaleDB } from '../utils/database';

type SalesContextType = {
  sales: SalesItem[];
  addSale: (sale: SalesItem) => void;
  updateSaleStatus: (id: string, paymentStatus: SalesItem['paymentStatus'], productionStatus: SalesItem['productionStatus']) => void;
};

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sales, setSales] = useState<SalesItem[]>([]);

  useEffect(() => {
    getSales((fetchedSales) => setSales(fetchedSales));
  }, []);

  const addSale = (sale: SalesItem) => {
    setSales((prevSales) => [...prevSales, sale]);
    addSaleDB(sale);
  };

  const updateSaleStatus = (id: string, paymentStatus: SalesItem['paymentStatus'], productionStatus: SalesItem['productionStatus']) => {
    setSales((prevSales) =>
      prevSales.map((sale) =>
        sale.id === id ? { ...sale, paymentStatus, productionStatus } : sale
      )
    );
  };

  return (
    <SalesContext.Provider value={{ sales, addSale, updateSaleStatus }}>
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => {
  const context = useContext(SalesContext);
  if (!context) throw new Error('useSales must be used within a SalesProvider');
  return context;
};
