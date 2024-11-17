import * as SQLite from 'expo-sqlite';

import { InventoryItem } from '../types/inventory';
import { Sale } from '../types/sales';

const database = SQLite.openDatabase('handicraft_manager.database');

export const initializeDatabase = () => {
  database.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS inventory (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL
      );`
    );
    

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS sales (
        id TEXT PRIMARY KEY,
        item_id TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        payment_status TEXT NOT NULL,
        production_status TEXT NOT NULL,
        due_date TEXT,
        FOREIGN KEY (item_id) REFERENCES inventory (id)
      );`
    );
    
  });
};

export const addInventoryItem = (item: InventoryItem) => {
  database.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO inventory (id, name, quantity, price) VALUES (?, ?, ?, ?);',
      [item.id, item.name, item.quantity, item.price]
    );
  });
};

export const getInventoryItems = (callback: (items: InventoryItem[]) => void) => {
  database.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM inventory;',
      [],
      (_, { rows }) => callback(rows._array as InventoryItem[])
    );
  });
};

export const addSaleDB = (sale: Sale) => {
  database.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO sales (id, item_id, quantity, price, payment_status, production_status, due_date) VALUES (?, ?, ?, ?, ?, ?, ?);',
      [
        sale.id,
        sale.itemId,
        sale.quantity,
        sale.price,
        sale.paymentStatus,
        sale.productionStatus,
        sale.dueDate || null,
      ]
    );
  });
};

export const getSales = (callback: (sales: Sale[]) => void) => {
  database.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM sales;',
      [],
      (_, { rows }) => callback(rows._array as Sale[])
    );
  });
};

export const updateItemQuantityDB = (itemId: string, newQuantity: number) => {
  database.transaction((tx) => {
    tx.executeSql(
      'UPDATE inventory SET quantity = ? WHERE id = ?',
      [newQuantity, itemId]
    );
  });
}


export default database;
