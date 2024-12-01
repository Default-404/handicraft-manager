import { CashItem } from '../types/types';

export const calculateBalance = (transactions: CashItem[]): number => {
  return transactions.reduce((balance, transaction) => {
    if (transaction.type === 'Entrada') {
      return balance + transaction.amount;
    } else if (transaction.type === 'Saída') {
      return balance - transaction.amount;
    }
    return balance;
  }, 0);
};
