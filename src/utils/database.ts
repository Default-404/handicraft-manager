import * as SQLite from 'expo-sqlite';

import { InventoryItem, SalesItem, ProductsItem } from '../types/types';

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
      `CREATE TABLE IF NOT EXISTS products (
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
        FOREIGN KEY (item_id) REFERENCES products (id)
      );`
    );
    
  });
};


export const addInventoryItemDatabase = (item: InventoryItem) => {
  database.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO inventory (id, name, quantity, price) VALUES (?, ?, ?, ?);',
      [item.id, item.name, item.quantity, item.price]
    );
  });
};

export const getInventoryItemsDatabase = (callback: (items: InventoryItem[]) => void) => {
  database.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM inventory;',
      [],
      (_, { rows }) => callback(rows._array as InventoryItem[])
    );
  });
};

export const updateInventoryItemDatabase = (item: InventoryItem) => {
  database.transaction((tx) => {
    tx.executeSql(
      'UPDATE inventory SET name = ?, quantity = ?, price = ? WHERE id = ?',
      [item.name, item.quantity, item.price, item.id]
    );
  });
};

export const deleteInventoryItemDatabase = (id: string) => {
  database.transaction((tx) => {
    tx.executeSql('DELETE FROM inventory WHERE id = ?', [id]);
  });
};


export const addProductsItemDatabase = (product: ProductsItem) => {
  database.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO products (id, name, quantity, price) VALUES (?, ?, ?, ?);',
      [product.id, product.name, product.quantity, product.price]
    );
  });
};

export const getProductsItemsDatabase = (callback: (products: ProductsItem[]) => void) => {
  database.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM products;',
      [],
      (_, { rows }) => callback(rows._array as ProductsItem[])
    );
  });
};

export const updateProductsItemDatabase = (product: ProductsItem) => {
  database.transaction((tx) => {
    tx.executeSql(
      'UPDATE products SET name = ?, quantity = ?, price = ? WHERE id = ?',
      [product.name, product.quantity, product.price, product.id]
    );
  });
};

export const deleteProductsItemDatabase = (id: string) => {
  database.transaction((tx) => {
    tx.executeSql('DELETE FROM products WHERE id = ?', [id]);
  });
};


export const addSaleDB = (sale: SalesItem) => {
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

export const getSales = (callback: (sales: SalesItem[]) => void) => {
  database.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM sales;',
      [],
      (_, { rows }) => callback(rows._array as SalesItem[])
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


export const deleteTables = () => {
  database.transaction((tx) => {
    tx.executeSql('DROP TABLE IF EXISTS inventory;', [], 
      () => console.log('Tabela inventory deletada com sucesso.'),
      (_, error) => {
        console.error('Erro ao deletar a tabela inventory:', error);
        return false;
      }
    );

    tx.executeSql('DROP TABLE IF EXISTS products;', [], 
      () => console.log('Tabela products deletada com sucesso.'),
      (_, error) => {
        console.error('Erro ao deletar a tabela products:', error);
        return false;
      }
    );

    tx.executeSql('DROP TABLE IF EXISTS sales;', [], 
      () => console.log('Tabela sales deletada com sucesso.'),
      (_, error) => {
        console.error('Erro ao deletar a tabela sales:', error);
        return false;
      }
    );
  });
};



export default database;
