export type Sale = {
  id: string;
  itemId: string;
  quantity: number;
  price: number;
  paymentStatus: 'Não pago' | '50% pago' | 'Totalmente pago';
  productionStatus: 'Não iniciada' | 'Em produção' | 'Pronta';
  dueDate?: string;
};
