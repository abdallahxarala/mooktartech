import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { PaymentMethod } from '@/types/payment'

export type DeliveryMethod = 'pickup' | 'delivery'

export interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  notes?: string
}

export interface CheckoutState {
  customerInfo: CustomerInfo
  deliveryMethod: DeliveryMethod
  deliveryAddress: string
  paymentMethod: PaymentMethod
  currentStep: number
  setCustomerInfo: (info: CustomerInfo) => void
  setDeliveryMethod: (method: DeliveryMethod) => void
  setDeliveryAddress: (address: string) => void
  setPaymentMethod: (method: PaymentMethod) => void
  setCurrentStep: (step: number) => void
  reset: () => void
}

const defaultState: Omit<CheckoutState, 'setCustomerInfo' | 'setDeliveryMethod' | 'setDeliveryAddress' | 'setPaymentMethod' | 'setCurrentStep' | 'reset'> = {
  customerInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: ''
  },
  deliveryMethod: 'pickup',
  deliveryAddress: '',
  paymentMethod: 'orange_money',
  currentStep: 1
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      ...defaultState,
      setCustomerInfo: (info) =>
        set(() => ({
          customerInfo: { ...info }
        })),
      setDeliveryMethod: (method) =>
        set(() => ({
          deliveryMethod: method
        })),
      setDeliveryAddress: (address) =>
        set(() => ({
          deliveryAddress: address
        })),
      setPaymentMethod: (method) =>
        set(() => ({
          paymentMethod: method
        })),
      setCurrentStep: (step) =>
        set(() => ({
          currentStep: Math.min(Math.max(step, 1), 4)
        })),
      reset: () =>
        set(() => ({
          ...defaultState
        }))
    }),
    {
      name: 'checkout-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

