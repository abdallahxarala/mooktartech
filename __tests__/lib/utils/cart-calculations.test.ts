/**
 * Unit tests for cart calculation utilities
 */

import {
  calculateSubtotal,
  calculateTaxAmount,
  calculateTotalWithTax,
  calculateShippingCost,
  calculateFinalTotal,
  calculateCartTotals,
  type CartItem
} from '@/lib/utils/cart-calculations'

describe('Cart Calculations', () => {
  describe('calculateSubtotal', () => {
    it('should return 0 for empty cart', () => {
      expect(calculateSubtotal([])).toBe(0)
    })

    it('should calculate subtotal for single item', () => {
      const items: CartItem[] = [
        { price: 100000, quantity: 1 }
      ]
      expect(calculateSubtotal(items)).toBe(100000)
    })

    it('should calculate subtotal for multiple items', () => {
      const items: CartItem[] = [
        { price: 100000, quantity: 2 },
        { price: 50000, quantity: 3 }
      ]
      expect(calculateSubtotal(items)).toBe(350000) // (100000 * 2) + (50000 * 3)
    })

    it('should handle decimal prices correctly', () => {
      const items: CartItem[] = [
        { price: 1000.50, quantity: 2 }
      ]
      expect(calculateSubtotal(items)).toBe(2001)
    })
  })

  describe('calculateTaxAmount', () => {
    it('should calculate 18% VAT by default', () => {
      expect(calculateTaxAmount(100000)).toBe(18000) // 100000 * 0.18
    })

    it('should use custom tax rate', () => {
      expect(calculateTaxAmount(100000, 0.20)).toBe(20000) // 100000 * 0.20
    })

    it('should return 0 for zero subtotal', () => {
      expect(calculateTaxAmount(0)).toBe(0)
    })

    it('should handle decimal amounts', () => {
      expect(calculateTaxAmount(1000.50)).toBeCloseTo(180.09, 2)
    })
  })

  describe('calculateTotalWithTax', () => {
    it('should add tax to subtotal', () => {
      expect(calculateTotalWithTax(100000, 18000)).toBe(118000)
    })

    it('should handle zero tax', () => {
      expect(calculateTotalWithTax(100000, 0)).toBe(100000)
    })
  })

  describe('calculateShippingCost', () => {
    it('should return 0 for orders above free shipping threshold', () => {
      expect(calculateShippingCost(500000)).toBe(0)
      expect(calculateShippingCost(600000)).toBe(0)
    })

    it('should return 5000 for orders below free shipping threshold', () => {
      expect(calculateShippingCost(499999)).toBe(5000)
      expect(calculateShippingCost(100000)).toBe(5000)
      expect(calculateShippingCost(0)).toBe(5000)
    })

    it('should use custom threshold', () => {
      expect(calculateShippingCost(100000, 50000)).toBe(0) // Above custom threshold
      expect(calculateShippingCost(40000, 50000)).toBe(5000) // Below custom threshold
    })
  })

  describe('calculateFinalTotal', () => {
    it('should sum subtotal, tax, and shipping', () => {
      expect(calculateFinalTotal(100000, 18000, 5000)).toBe(123000)
    })

    it('should handle free shipping', () => {
      expect(calculateFinalTotal(100000, 18000, 0)).toBe(118000)
    })

    it('should handle zero values', () => {
      expect(calculateFinalTotal(0, 0, 0)).toBe(0)
    })
  })

  describe('calculateCartTotals', () => {
    it('should calculate all totals correctly for small order', () => {
      const items: CartItem[] = [
        { price: 100000, quantity: 1 }
      ]

      const totals = calculateCartTotals(items)

      expect(totals.subtotal).toBe(100000)
      expect(totals.taxAmount).toBe(18000) // 18% of 100000
      expect(totals.totalWithTax).toBe(118000)
      expect(totals.shippingCost).toBe(5000) // Below threshold
      expect(totals.finalTotal).toBe(123000) // 118000 + 5000
    })

    it('should calculate all totals correctly for large order (free shipping)', () => {
      const items: CartItem[] = [
        { price: 300000, quantity: 2 } // 600000 total
      ]

      const totals = calculateCartTotals(items)

      expect(totals.subtotal).toBe(600000)
      expect(totals.taxAmount).toBe(108000) // 18% of 600000
      expect(totals.totalWithTax).toBe(708000)
      expect(totals.shippingCost).toBe(0) // Above threshold
      expect(totals.finalTotal).toBe(708000) // 708000 + 0
    })

    it('should handle empty cart', () => {
      const totals = calculateCartTotals([])

      expect(totals.subtotal).toBe(0)
      expect(totals.taxAmount).toBe(0)
      expect(totals.totalWithTax).toBe(0)
      expect(totals.shippingCost).toBe(5000) // Still charged for empty cart
      expect(totals.finalTotal).toBe(5000)
    })

    it('should use custom tax rate and threshold', () => {
      const items: CartItem[] = [
        { price: 100000, quantity: 1 }
      ]

      const totals = calculateCartTotals(items, 0.20, 100000)

      expect(totals.taxAmount).toBe(20000) // 20% tax
      expect(totals.shippingCost).toBe(0) // Above custom threshold
    })

    it('should handle multiple items with different quantities', () => {
      const items: CartItem[] = [
        { price: 50000, quantity: 3 },
        { price: 75000, quantity: 2 },
        { price: 100000, quantity: 1 }
      ]

      const totals = calculateCartTotals(items)

      // Subtotal: (50000 * 3) + (75000 * 2) + (100000 * 1) = 400000
      expect(totals.subtotal).toBe(400000)
      expect(totals.taxAmount).toBe(72000) // 18% of 400000
      expect(totals.totalWithTax).toBe(472000)
      expect(totals.shippingCost).toBe(5000) // Below threshold
      expect(totals.finalTotal).toBe(477000)
    })
  })
})

