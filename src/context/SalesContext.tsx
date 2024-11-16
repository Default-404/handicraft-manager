import React, { createContext, useState, useContext } from 'react';

type Sale = {
  id: string;
  itemId: string;
  quantity: number;
  price: number;
  paymentStatus: 'Não pago' | '50% pago' | 'Totalmente pago';
  productionStatus: 'Não iniciada' | 'Em produção' | 'Pronta';
  dueDate?: string;
};

type SalesContextType = {
  sales: Sale[];
  addSale: (sale: Sale) => void;
  updateSaleStatus: (id: string, paymentStatus: Sale['paymentStatus'], productionStatus: Sale['productionStatus']) => void;
};

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sales, setSales] = useState<Sale[]>([]);

  const addSale = (sale: Sale) => {
    setSales([...sales, sale]);
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
