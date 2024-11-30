export type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

export type ProductsItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

export type SalesItem = {
  id: string;
  price: number;
  paymentStatus: 'Não pago' | '50% pago' | 'Totalmente pago';
  productionStatus: 'Não iniciada' | 'Em produção' | 'Pronta';
  dueDate?: string;
  products: {
    itemId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
};

export type CashItem = {
  id: number;
  type: 'Entrada' | 'Saída';
  amount: number;
  date: string;
};
