import * as SQLite from 'expo-sqlite';

import { InventoryItem, SalesItem, ProductsItem, CashItem } from '../types/types';

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
        total_price REAL NOT NULL,
        payment_status TEXT NOT NULL,
        production_status TEXT NOT NULL,
        due_date TEXT
      );`
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS sales_products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sale_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (sale_id) REFERENCES sales (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
      );`
    );
    
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS cash (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL
      );`
    );
    
  });
};

//Materiais
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

//Produtos
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

//Vendas
export const addSaleDatabase = (sale: SalesItem) => {
  database.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO sales (id, total_price, payment_status, production_status, due_date) VALUES (?, ?, ?, ?, ?);',
      [sale.id, sale.price, sale.paymentStatus, sale.productionStatus, sale.dueDate || null],
      (_, result) => {
        sale.products.forEach((product) => {
          tx.executeSql(
            'INSERT INTO sales_products (sale_id, product_id, quantity, price) VALUES (?, ?, ?, ?);',
            [sale.id, product.itemId, product.quantity, product.price]
          );
        });
      },
    );
  });
};

export const getSalesDatabase = (callback: (sales: SalesItem[]) => void) => {
  database.transaction((tx) => {
    tx.executeSql(
      `SELECT s.id, s.total_price, s.payment_status, s.production_status, s.due_date, 
              sp.product_id, sp.quantity, sp.price, p.name
       FROM sales s
       LEFT JOIN sales_products sp ON s.id = sp.sale_id
       LEFT JOIN products p ON sp.product_id = p.id;`,
      [],
      (_, { rows }) => {
        const groupedSales = rows._array.reduce((acc, row) => {
          const existingSale = acc.find((sale: { id: any; }) => sale.id === row.id);
          const product = {
            itemId: row.product_id,
            name: row.name,
            quantity: row.quantity,
            price: row.price,
          };
          if (existingSale) {
            existingSale.products.push(product);
          } else {
            acc.push({
              id: row.id,
              price: row.total_price,
              paymentStatus: row.payment_status,
              productionStatus: row.production_status,
              dueDate: row.due_date,
              products: [product],
            });
          }
          return acc;
        }, []);
        callback(groupedSales as SalesItem[]);
      }
    );
  });
};

export const updateSaleDatabase = (sale: SalesItem) => {
  database.transaction((tx) => {
    tx.executeSql(
      'UPDATE sales SET total_price = ?, payment_status = ?, production_status = ?, due_date = ? WHERE id = ?',
      [sale.price, sale.paymentStatus, sale.productionStatus, sale.dueDate || null, sale.id]
    );
    tx.executeSql(
      'DELETE FROM sales_products WHERE sale_id = ?',
      [sale.id],
      () => {
        sale.products.forEach((product) => {
          tx.executeSql(
            'INSERT INTO sales_products (sale_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
            [sale.id, product.itemId, product.quantity, product.price]
          );
        });
      },
    );
  });
};

export const deleteSaleDatabase = (saleId: string) => {
  database.transaction((tx) => {
    tx.executeSql('DELETE FROM sales WHERE id = ?', [saleId]);
    tx.executeSql('DELETE FROM sales_products WHERE sale_id = ?', [saleId]);
  });
};

//Caixa
export const addCashItemDatabase = (transaction: Omit<CashItem, 'id'>) => {
  database.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO cash (type, amount, date) VALUES (?, ?, ?)',
      [transaction.type, transaction.amount, transaction.date],
    );
  });
};

export const getCashItemsDatabase = (callback: (transactions: CashItem[]) => void ) => {
  database.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM cash ORDER BY date DESC',
      [],
      (_, { rows }) => callback(rows._array as CashItem[]),
    );
  });
};

export const updateCashItemDatabase = (transaction: CashItem) => {
  database.transaction((tx) => {
    tx.executeSql(
      'UPDATE cash SET type = ?, amount = ?, date = ? WHERE id = ?',
      [transaction.type, transaction.amount, transaction.date, transaction.id],
    );
  });
};

export const deleteCashItemDatabase = (id: number) => {
  database.transaction((tx) => {
    tx.executeSql('DELETE FROM cash WHERE id = ?', [id]);
  });
};

export default database;
