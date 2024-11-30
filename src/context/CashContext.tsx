import React, { createContext, useState, useEffect, useContext } from 'react';

import { CashItem } from '../types/types';
import {
  getCashItemsDatabase,
  addCashItemDatabase,
  updateCashItemDatabase,
  deleteCashItemDatabase,
} from '../utils/database';

type CashContextType = {
  transactions: CashItem[];
  addTransaction: (transaction: Omit<CashItem, 'id'>) => void;
  updateTransaction: (transaction: CashItem) => void;
  deleteTransaction: (id: number) => void;
};

const CashContext = createContext<CashContextType | undefined>(undefined);

export const CashProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<CashItem[]>([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    getCashItemsDatabase((fetchedTransactions) => {
      setTransactions(fetchedTransactions);
    });
  };
  
  const addTransaction = (transaction: Omit<CashItem, 'id'>) => {
    addCashItemDatabase(transaction);
    loadTransactions();
  };

  const updateTransaction = (transaction: CashItem) => {
    updateCashItemDatabase(transaction);
    loadTransactions();
  };

  const deleteTransaction = (id: number) => {
    deleteCashItemDatabase(id);
    loadTransactions();
  };

  return (
    <CashContext.Provider value={{ transactions, addTransaction, updateTransaction, deleteTransaction }}>
      {children}
    </CashContext.Provider>
  );
};

export const useCash = () => {
  const context = useContext(CashContext);
  if (!context) throw new Error('useCash deve ser usado dentro de um CashProvider');
  return context;
};
