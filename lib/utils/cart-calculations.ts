/**
 * Pure utility functions for cart calculations
 * 
 * These functions are pure and can be easily unit tested
 */

export interface CartItem {
  price: number
  quantity: number
}

export interface CartTotals {
  subtotal: number
  taxAmount: number
  totalWithTax: number
  shippingCost: number
  finalTotal: number
}

/**
 * Calculate subtotal from cart items
 */
export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}

/**
 * Calculate tax amount (18% VAT for Senegal)
 */
export function calculateTaxAmount(subtotal: number, taxRate: number = 0.18): number {
  return subtotal * taxRate
}

/**
 * Calculate total with tax
 */
export function calculateTotalWithTax(subtotal: number, taxAmount: number): number {
  return subtotal + taxAmount
}

/**
 * Calculate shipping cost
 * 
 * Rules:
 * - Free shipping if subtotal >= 500,000 XOF
 * - Otherwise 5,000 XOF
 */
export function calculateShippingCost(subtotal: number, freeShippingThreshold: number = 500000): number {
  return subtotal >= freeShippingThreshold ? 0 : 5000
}

/**
 * Calculate final total (subtotal + tax + shipping)
 */
export function calculateFinalTotal(subtotal: number, taxAmount: number, shippingCost: number): number {
  return subtotal + taxAmount + shippingCost
}

/**
 * Calculate all cart totals at once
 */
export function calculateCartTotals(
  items: CartItem[],
  taxRate: number = 0.18,
  freeShippingThreshold: number = 500000
): CartTotals {
  const subtotal = calculateSubtotal(items)
  const taxAmount = calculateTaxAmount(subtotal, taxRate)
  const totalWithTax = calculateTotalWithTax(subtotal, taxAmount)
  const shippingCost = calculateShippingCost(subtotal, freeShippingThreshold)
  const finalTotal = calculateFinalTotal(subtotal, taxAmount, shippingCost)

  return {
    subtotal,
    taxAmount,
    totalWithTax,
    shippingCost,
    finalTotal
  }
}

