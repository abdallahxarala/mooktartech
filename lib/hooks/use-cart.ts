"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { usePrice } from './use-price';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  maxQuantity?: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getSubtotal: () => number;
  getShippingCost: (region: string) => number;
  getTaxAmount: () => number;
}

const SHIPPING_RATES = {
  dakar: 2000, // 2000 FCFA
  regions: 5000, // 5000 FCFA
  default: 5000,
};

const TAX_RATE = 0.18; // 18% TVA au Sénégal

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find((i) => i.id === item.id);
        
        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;
          if (existingItem.maxQuantity && newQuantity > existingItem.maxQuantity) {
            return; // Ne pas dépasser la quantité maximale
          }
          set({
            items: items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: newQuantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] });
        }
      },

      removeItem: (id) =>
        set({ items: get().items.filter((item) => item.id !== id) }),

      updateQuantity: (id, quantity) => {
        if (quantity < 0) return;
        const item = get().items.find((i) => i.id === id);
        if (item?.maxQuantity && quantity > item.maxQuantity) return;

        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () =>
        get().items.reduce((total, item) => total + item.price * item.quantity, 0),

      getShippingCost: (region = 'default') => SHIPPING_RATES[region as keyof typeof SHIPPING_RATES] || SHIPPING_RATES.default,

      getTaxAmount: () => get().getSubtotal() * TAX_RATE,

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const shipping = get().getShippingCost();
        const tax = get().getTaxAmount();
        return subtotal + shipping + tax;
      },
    }),
    {
      name: 'cart-storage',
      skipHydration: true,
    }
  )
);