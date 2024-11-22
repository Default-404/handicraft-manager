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
  itemId: string;
  quantity: number;
  price: number;
  paymentStatus: 'Não pago' | '50% pago' | 'Totalmente pago';
  productionStatus: 'Não iniciada' | 'Em produção' | 'Pronta';
  dueDate?: string;
};
