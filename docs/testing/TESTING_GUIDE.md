# Testing Guide - Xarala Solutions

## Overview

Xarala Solutions uses two testing frameworks:
- **Jest** for unit tests
- **Playwright** for end-to-end (E2E) tests

## Setup

### Install Dependencies

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @playwright/test
```

### Install Playwright Browsers

```bash
npx playwright install
```

## Unit Tests (Jest)

### Configuration

- **Config file:** `jest.config.js`
- **Setup file:** `jest.setup.js`
- **Test directory:** `__tests__/`

### Running Tests

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Structure

```
__tests__/
  ├── lib/
  │   ├── utils/
  │   │   └── cart-calculations.test.ts
  │   └── store/
  │       └── cart-store.test.ts
  └── api/
      └── leads/
          └── route.test.ts
```

### Example Test

```typescript
import { calculateSubtotal } from '@/lib/utils/cart-calculations'

describe('Cart Calculations', () => {
  it('should calculate subtotal correctly', () => {
    const items = [
      { price: 100000, quantity: 2 },
      { price: 50000, quantity: 1 }
    ]
    expect(calculateSubtotal(items)).toBe(250000)
  })
})
```

## E2E Tests (Playwright)

### Configuration

- **Config file:** `playwright.config.ts`
- **Test directory:** `__tests__/e2e/`
- **Base URL:** `http://localhost:3000` (dev server)

### Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Debug mode
npm run test:e2e:debug
```

### Test Structure

```
__tests__/
  └── e2e/
      └── checkout-flow.spec.ts
```

### Example Test

```typescript
import { test, expect } from '@playwright/test'

test('should complete checkout flow', async ({ page }) => {
  await page.goto('/fr/products')
  // ... test steps
})
```

## Test Coverage

### Unit Tests

- ✅ Cart calculations (subtotal, tax, shipping)
- ✅ Cart store (add, remove, update)
- ✅ Payment providers (Wave)
- ✅ API routes (leads)

### E2E Tests

- ✅ Checkout flow (homepage → products → cart → checkout)
- ✅ Cart totals display
- ✅ Empty cart handling

## Writing Tests

### Unit Test Best Practices

1. **Test pure functions** - Functions without side effects
2. **Mock external dependencies** - API calls, localStorage, etc.
3. **Test edge cases** - Empty arrays, null values, boundary conditions
4. **Use descriptive test names** - `should calculate tax correctly`
5. **One assertion per test** - When possible

### E2E Test Best Practices

1. **Use test.step()** - Organize test steps
2. **Wait for elements** - Use `waitForSelector` instead of `waitForTimeout`
3. **Use data-testid** - For stable selectors
4. **Mock API calls** - Use `page.route()` for external APIs
5. **Clean up** - Reset state between tests

## Test Utilities

### Cart Calculations (`lib/utils/cart-calculations.ts`)

Pure functions for cart calculations:
- `calculateSubtotal(items)`
- `calculateTaxAmount(subtotal, taxRate)`
- `calculateShippingCost(subtotal, threshold)`
- `calculateCartTotals(items, taxRate, threshold)`

### Mock Utilities

Located in `jest.setup.js`:
- Next.js router mocks
- next-intl mocks
- window.matchMedia mock
- crypto.randomUUID mock

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

## Troubleshooting

### Jest Issues

**Tests not finding modules:**
- Check `jest.config.js` moduleNameMapper
- Verify `tsconfig.json` paths match

**TypeScript errors:**
- Ensure `@types/jest` is installed
- Check `tsconfig.json` includes test files

### Playwright Issues

**Tests timing out:**
- Increase timeout in `playwright.config.ts`
- Check dev server is running
- Verify base URL is correct

**Element not found:**
- Use `page.waitForSelector()` before interaction
- Check selector is correct
- Verify element is visible

## Next Steps

- [ ] Add more unit tests for utilities
- [ ] Add E2E tests for product pages
- [ ] Add E2E tests for NFC editor
- [ ] Add visual regression tests
- [ ] Add performance tests
- [ ] Set up CI/CD pipeline

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)

