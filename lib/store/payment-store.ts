import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PaymentMethod = 'wave' | 'orange_money' | 'free_money' | 'cash' | 'transfer'
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'

export interface Payment {
  id: string
  orderId: string
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  phone?: string
  reference?: string
  transactionId?: string
  createdAt: string
  updatedAt: string
  metadata?: {
    customerName?: string
    customerEmail?: string
    items?: any[]
  }
}

interface PaymentState {
  payments: Payment[]
  currentPayment: Payment | null
  
  // Actions
  createPayment: (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => Payment
  updatePayment: (id: string, updates: Partial<Payment>) => void
  getPayment: (id: string) => Payment | undefined
  setCurrentPayment: (payment: Payment | null) => void
  clearCurrentPayment: () => void
}

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set, get) => ({
      payments: [],
      currentPayment: null,
      
      createPayment: (paymentData) => {
        const payment: Payment = {
          ...paymentData,
          id: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        set((state) => ({
          payments: [...state.payments, payment],
          currentPayment: payment
        }))
        
        return payment
      },
      
      updatePayment: (id, updates) => {
        set((state) => ({
          payments: state.payments.map((p) =>
            p.id === id
              ? { ...p, ...updates, updatedAt: new Date().toISOString() }
              : p
          ),
          currentPayment:
            state.currentPayment?.id === id
              ? { ...state.currentPayment, ...updates, updatedAt: new Date().toISOString() }
              : state.currentPayment
        }))
      },
      
      getPayment: (id) => {
        return get().payments.find((p) => p.id === id)
      },
      
      setCurrentPayment: (payment) => {
        set({ currentPayment: payment })
      },
      
      clearCurrentPayment: () => {
        set({ currentPayment: null })
      }
    }),
    {
      name: 'payment-storage'
    }
  )
)


