import React, { createContext, useState, useEffect, useContext } from 'react';

import { Sale } from '../types/sales';
import { getSales, addSaleDB } from '../utils/database';

type SalesContextType = {
  sales: Sale[];
  addSale: (sale: Sale) => void;
  updateSaleStatus: (id: string, paymentStatus: Sale['paymentStatus'], productionStatus: Sale['productionStatus']) => void;
};

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    getSales((fetchedSales) => setSales(fetchedSales));
  }, []);

  const addSale = (sale: Sale) => {
    setSales((prevSales) => [...prevSales, sale]);
    addSaleDB(sale);
  };

  const updateSaleStatus = (id: string, paymentStatus: Sale['paymentStatus'], productionStatus: Sale['productionStatus']) => {
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
