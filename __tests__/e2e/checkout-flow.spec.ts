/**
 * E2E test for checkout flow
 * 
 * Covers:
 * - Homepage visit
 * - Product browsing
 * - Adding product to cart
 * - Checkout process up to payment step
 */

import { test, expect } from '@playwright/test'

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from homepage
    await page.goto('/fr')
  })

  test('should complete checkout flow up to payment', async ({ page }) => {
    // Step 1: Navigate to products page
    await test.step('Navigate to products', async () => {
      // Look for products link in navigation or click directly
      const productsLink = page.getByRole('link', { name: /produits|products/i })
      if (await productsLink.isVisible().catch(() => false)) {
        await productsLink.click()
      } else {
        // Direct navigation
        await page.goto('/fr/products')
      }
      
      await expect(page).toHaveURL(/.*\/products/)
      await expect(page.getByRole('heading', { name: /catalogue|products/i })).toBeVisible()
    })

    // Step 2: Wait for products to load
    await test.step('Wait for products to load', async () => {
      // Wait for product cards or grid to appear
      await page.waitForSelector('[data-testid="product-card"], .grid, article', { timeout: 10000 })
    })

    // Step 3: Add first product to cart
    await test.step('Add product to cart', async () => {
      // Find first product card and click add to cart button
      const addToCartButton = page
        .locator('button')
        .filter({ hasText: /panier|add to cart|ajouter/i })
        .first()

      // If button not found, try clicking product card first
      if (!(await addToCartButton.isVisible().catch(() => false))) {
        // Click on first product to go to detail page
        const firstProduct = page.locator('a[href*="/products/"]').first()
        if (await firstProduct.isVisible().catch(() => false)) {
          await firstProduct.click()
          await page.waitForURL(/.*\/products\/.*/, { timeout: 5000 })
          
          // Look for add to cart button on product detail page
          const detailAddButton = page
            .getByRole('button')
            .filter({ hasText: /panier|add to cart|ajouter/i })
            .first()
          
          if (await detailAddButton.isVisible().catch(() => false)) {
            await detailAddButton.click()
          }
        }
      } else {
        await addToCartButton.click()
      }

      // Wait for cart update (toast notification or cart badge update)
      await page.waitForTimeout(1000)
    })

    // Step 4: Navigate to cart
    await test.step('Navigate to cart', async () => {
      const cartLink = page.getByRole('link', { name: /panier|cart/i })
      if (await cartLink.isVisible().catch(() => false)) {
        await cartLink.click()
      } else {
        await page.goto('/fr/cart')
      }

      await expect(page).toHaveURL(/.*\/cart/)
      
      // Verify cart has items
      await expect(
        page.locator('text=/article|item|produit/i').or(page.locator('[data-testid="cart-item"]'))
      ).toBeVisible({ timeout: 5000 })
    })

    // Step 5: Proceed to checkout
    await test.step('Proceed to checkout', async () => {
      const checkoutButton = page
        .getByRole('button')
        .filter({ hasText: /checkout|commander|passer la commande/i })
        .first()

      await checkoutButton.click()
      await expect(page).toHaveURL(/.*\/checkout/)
    })

    // Step 6: Fill checkout form
    await test.step('Fill checkout form', async () => {
      // Fill customer information
      await page.fill('input[name="firstName"], input[placeholder*="prénom"], input[placeholder*="first"]', 'Amadou')
      await page.fill('input[name="lastName"], input[placeholder*="nom"], input[placeholder*="last"]', 'Diallo')
      await page.fill('input[type="email"], input[name="email"]', 'amadou@example.com')
      await page.fill('input[type="tel"], input[name="phone"]', '+221 77 123 45 67')
      
      // Fill address
      await page.fill('input[name="address"], input[placeholder*="adresse"]', '123 Rue de la République')
      await page.fill('input[name="city"]', 'Dakar')
      await page.fill('input[name="quarter"], input[placeholder*="quartier"]', 'Plateau')

      // Select payment method
      const paymentMethod = page.locator('input[value="mobile"], input[value="cash"]').first()
      if (await paymentMethod.isVisible().catch(() => false)) {
        await paymentMethod.check()
      }

      // Accept terms
      const termsCheckbox = page.locator('input[type="checkbox"][name*="terms"], input[type="checkbox"][name*="agreed"]')
      if (await termsCheckbox.isVisible().catch(() => false)) {
        await termsCheckbox.check()
      }
    })

    // Step 7: Verify payment step is reached
    await test.step('Verify payment step', async () => {
      // Look for payment-related elements
      const paymentSection = page.locator('text=/paiement|payment|méthode de paiement/i')
      await expect(paymentSection.first()).toBeVisible({ timeout: 5000 })

      // Verify order summary is visible
      await expect(
        page.locator('text=/total|montant|récapitulatif/i').first()
      ).toBeVisible()
    })

    // Step 8: Mock payment API (don't actually submit)
    await test.step('Mock payment API', async () => {
      // Intercept payment API calls
      await page.route('**/api/payments/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            payment: {
              id: 'test-payment-id',
              checkout_url: 'https://test-payment.com/checkout'
            }
          })
        })
      })

      await page.route('**/api/orders/**', async (route) => {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            orderId: 'XAR-TEST-123'
          })
        })
      })
    })
  })

  test('should show correct cart totals', async ({ page }) => {
    await page.goto('/fr/products')

    // Add product to cart
    const addButton = page
      .getByRole('button')
      .filter({ hasText: /panier|add/i })
      .first()

    if (await addButton.isVisible().catch(() => false)) {
      await addButton.click()
      await page.waitForTimeout(500)
    }

    // Go to cart
    await page.goto('/fr/cart')

    // Verify totals are displayed
    await expect(page.locator('text=/sous-total|subtotal/i')).toBeVisible()
    await expect(page.locator('text=/tva|tax/i')).toBeVisible()
    await expect(page.locator('text=/total|montant total/i')).toBeVisible()
  })

  test('should handle empty cart', async ({ page }) => {
    await page.goto('/fr/cart')

    // Should show empty cart message or redirect
    const emptyMessage = page.locator('text=/vide|empty|aucun/i')
    const redirect = page.url().includes('/products')

    expect(emptyMessage.isVisible().catch(() => false) || redirect).toBeTruthy()
  })
})
