/**
 * Unit tests for cart store
 * 
 * Tests cart state management and calculations
 */

import { useCartStore } from '@/lib/store/cart-store'
import type { CartItem } from '@/lib/store/cart-store'

// Mock crypto.randomUUID
jest.spyOn(global.crypto, 'randomUUID').mockReturnValue('test-uuid-123')

describe('Cart Store', () => {
  beforeEach(() => {
    // Clear cart before each test
    useCartStore.getState().clearCart()
  })

  describe('addItem', () => {
    it('should add item to cart', () => {
      const store = useCartStore.getState()
      
      store.addItem({
        productId: 'prod-1',
        name: 'Test Product',
        price: 100000,
        quantity: 1
      })

      expect(store.items).toHaveLength(1)
      expect(store.items[0].name).toBe('Test Product')
      expect(store.items[0].price).toBe(100000)
    })

    it('should add multiple items', () => {
      const store = useCartStore.getState()
      
      store.addItem({
        productId: 'prod-1',
        name: 'Product 1',
        price: 100000,
        quantity: 1
      })

      store.addItem({
        productId: 'prod-2',
        name: 'Product 2',
        price: 50000,
        quantity: 2
      })

      expect(store.items).toHaveLength(2)
    })

    it('should default quantity to 1 if not provided', () => {
      const store = useCartStore.getState()
      
      store.addItem({
        productId: 'prod-1',
        name: 'Test Product',
        price: 100000
      } as any)

      expect(store.items[0].quantity).toBe(1)
    })
  })

  describe('removeItem', () => {
    it('should remove item by productId', () => {
      const store = useCartStore.getState()
      
      store.addItem({
        productId: 'prod-1',
        name: 'Product 1',
        price: 100000,
        quantity: 1
      })

      store.addItem({
        productId: 'prod-2',
        name: 'Product 2',
        price: 50000,
        quantity: 1
      })

      store.removeItem('prod-1')

      expect(store.items).toHaveLength(1)
      expect(store.items[0].productId).toBe('prod-2')
    })
  })

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      const store = useCartStore.getState()
      
      store.addItem({
        productId: 'prod-1',
        name: 'Test Product',
        price: 100000,
        quantity: 1
      })

      store.updateQuantity('prod-1', 3)

      expect(store.items[0].quantity).toBe(3)
    })

    it('should remove item if quantity is 0', () => {
      const store = useCartStore.getState()
      
      store.addItem({
        productId: 'prod-1',
        name: 'Test Product',
        price: 100000,
        quantity: 1
      })

      store.updateQuantity('prod-1', 0)

      expect(store.items).toHaveLength(0)
    })

    it('should remove item if quantity is negative', () => {
      const store = useCartStore.getState()
      
      store.addItem({
        productId: 'prod-1',
        name: 'Test Product',
        price: 100000,
        quantity: 1
      })

      store.updateQuantity('prod-1', -1)

      expect(store.items).toHaveLength(0)
    })
  })

  describe('getItemCount', () => {
    it('should return 0 for empty cart', () => {
      const store = useCartStore.getState()
      expect(store.getItemCount()).toBe(0)
    })

    it('should return total quantity of all items', () => {
      const store = useCartStore.getState()
      
      store.addItem({
        productId: 'prod-1',
        name: 'Product 1',
        price: 100000,
        quantity: 2
      })

      store.addItem({
        productId: 'prod-2',
        name: 'Product 2',
        price: 50000,
        quantity: 3
      })

      expect(store.getItemCount()).toBe(5) // 2 + 3
    })
  })

  describe('getSubtotal', () => {
    it('should return 0 for empty cart', () => {
      const store = useCartStore.getState()
      expect(store.getSubtotal()).toBe(0)
    })

    it('should calculate subtotal correctly', () => {
      const store = useCartStore.getState()
      
      store.addItem({
        productId: 'prod-1',
        name: 'Product 1',
        price: 100000,
        quantity: 2
      })

      store.addItem({
        productId: 'prod-2',
        name: 'Product 2',
        price: 50000,
        quantity: 1
      })

      expect(store.getSubtotal()).toBe(250000) // (100000 * 2) + (50000 * 1)
    })
  })

  describe('getTaxAmount', () => {
    it('should calculate 18% VAT', () => {
      const store = useCartStore.getState()
      
      store.addItem({
        productId: 'prod-1',
        name: 'Product 1',
        price: 100000,
        quantity: 1
      })

      const subtotal = store.getSubtotal()
      const taxAmount = store.getTaxAmount()

      expect(taxAmount).toBe(subtotal * 0.18)
      expect(taxAmount).toBe(18000) // 18% of 100000
    })

    it('should return 0 for empty cart', () => {
      const store = useCartStore.getState()
      expect(store.getTaxAmount()).toBe(0)
    })
  })

  describe('getTotalWithTax', () => {
    it('should return subtotal + tax', () => {
      const store = useCartStore.getState()
      
      store.addItem({
        productId: 'prod-1',
        name: 'Product 1',
        price: 100000,
        quantity: 1
      })

      const subtotal = store.getSubtotal()
      const taxAmount = store.getTaxAmount()
      const totalWithTax = store.getTotalWithTax()

      expect(totalWithTax).toBe(subtotal + taxAmount)
      expect(totalWithTax).toBe(118000) // 100000 + 18000
    })
  })

  describe('getItem', () => {
    it('should return item by productId', () => {
      const store = useCartStore.getState()
      
      store.addItem({
        productId: 'prod-1',
        name: 'Product 1',
        price: 100000,
        quantity: 1
      })

      const item = store.getItem('prod-1')

      expect(item).toBeDefined()
      expect(item?.name).toBe('Product 1')
    })

    it('should return undefined for non-existent item', () => {
      const store = useCartStore.getState()
      expect(store.getItem('non-existent')).toBeUndefined()
    })
  })

  describe('clearCart', () => {
    it('should remove all items', () => {
      const store = useCartStore.getState()
      
      store.addItem({
        productId: 'prod-1',
        name: 'Product 1',
        price: 100000,
        quantity: 1
      })

      store.addItem({
        productId: 'prod-2',
        name: 'Product 2',
        price: 50000,
        quantity: 1
      })

      store.clearCart()

      expect(store.items).toHaveLength(0)
      expect(store.getItemCount()).toBe(0)
    })
  })
})

