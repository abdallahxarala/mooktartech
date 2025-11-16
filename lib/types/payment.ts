export type PaymentMethod = 'orange-money' | 'wave' | 'free-money' | 'bank-transfer' | 'cash-on-delivery';

export interface PaymentProvider {
  id: PaymentMethod;
  name: string;
  logo: string;
  description: string;
  fees: number;
  minAmount: number;
  maxAmount: number;
  processingTime: string;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  reference: string;
  customerInfo: {
    name: string;
    phone: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}