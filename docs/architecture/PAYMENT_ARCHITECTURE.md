# Payment Integration Architecture - Xarala Solutions

## Overview

Clean, extensible architecture for real payment integrations (Wave, Orange Money, Free Money) for the Senegal market.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Checkout Components                                     │  │
│  │  - PaymentMethodSelector                                 │  │
│  │  - PaymentForm (Wave/Orange/Free)                        │  │
│  │  - PaymentStatus                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          │                                      │
│                          ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Payment Store (Zustand)                                │  │
│  │  - currentPayment                                        │  │
│  │  - initiatePayment()                                    │  │
│  │  - pollPaymentStatus()                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                          │
                          │ HTTP POST
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Routes Layer                          │
│  ┌──────────────────────────┐  ┌──────────────────────────┐   │
│  │  POST /api/payments/    │  │  POST /api/payments/     │   │
│  │      initiate            │  │      webhook/:provider    │   │
│  │                          │  │                          │   │
│  │  - Validates request     │  │  - Validates webhook     │   │
│  │  - Creates payment record│  │  - Updates payment       │   │
│  │  - Calls provider service│  │  - Updates order         │   │
│  │  - Returns checkout URL  │  │  - Idempotency check    │   │
│  └──────────────────────────┘  └──────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                          │
                          │ Service calls
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Payment Service Layer                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  BasePaymentProvider (abstract)                          │  │
│  │  - initiatePayment()                                    │  │
│  │  - verifyWebhook()                                      │  │
│  │  - mapStatus()                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          │                                      │
│        ┌─────────────────┼─────────────────┐                 │
│        ▼                 ▼                 ▼                   │
│  ┌──────────┐    ┌──────────────┐   ┌──────────────┐         │
│  │  Wave    │    │ Orange Money │   │  Free Money  │         │
│  │  Service │    │   Service    │   │   Service    │         │
│  └──────────┘    └──────────────┘   └──────────────┘         │
│        │                 │                 │                   │
│        └─────────────────┼─────────────────┘                 │
│                          │                                      │
│                          ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  PaymentServiceFactory                                  │  │
│  │  - getProvider(provider: string)                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                          │
                          │ HTTP calls to providers
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Providers                           │
│  ┌──────────┐    ┌──────────────┐   ┌──────────────┐         │
│  │  Wave    │    │ Orange Money │   │  Free Money  │         │
│  │  API     │    │     API      │   │     API      │         │
│  └──────────┘    └──────────────┘   └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                          │
                          │ Webhooks
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Database Layer                             │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                │
│  │ payments │    │  orders  │    │audit_logs│                │
│  │          │    │          │    │          │                │
│  │ - id     │    │ - id     │    │ - id     │                │
│  │ - order_id│   │ - payment_│   │ - event_ │                │
│  │ - provider│   │   status │    │   type   │                │
│  │ - amount │    │ - payment_│   │ - payload│                │
│  │ - status │    │   id     │    │          │                │
│  │ - transaction_id│         │    │          │                │
│  └──────────┘    └──────────┘    └──────────┘                │
└─────────────────────────────────────────────────────────────────┘
```

## File Structure

```
lib/
├── payments/
│   ├── base.ts              # Abstract base provider
│   ├── wave.ts              # Wave implementation
│   ├── orange-money.ts      # Orange Money implementation (future)
│   ├── free-money.ts        # Free Money implementation (future)
│   ├── factory.ts           # Provider factory
│   └── types.ts             # Shared types and enums

app/api/
├── payments/
│   ├── initiate/
│   │   └── route.ts         # POST /api/payments/initiate
│   └── webhook/
│       ├── wave/
│       │   └── route.ts      # POST /api/payments/webhook/wave
│       ├── orange/
│       │   └── route.ts      # POST /api/payments/webhook/orange (future)
│       └── free/
│           └── route.ts     # POST /api/payments/webhook/free (future)

components/
└── checkout/
    ├── payment-provider-selector.tsx
    ├── wave-payment-form.tsx
    └── payment-status.tsx

supabase/migrations/
└── (existing payments table)
```

## Data Flow

### 1. Payment Initiation Flow

```
User selects payment method
    ↓
Frontend calls POST /api/payments/initiate
    ↓
API validates request (Zod)
    ↓
API creates payment record (status: 'pending')
    ↓
API calls PaymentServiceFactory.getProvider('wave')
    ↓
WaveService.initiatePayment()
    ↓
HTTP POST to Wave API
    ↓
Wave returns checkout URL + payment ID
    ↓
API updates payment record (provider_payment_id, checkout_url)
    ↓
API returns checkout URL to frontend
    ↓
Frontend redirects user to Wave checkout
```

### 2. Webhook Flow

```
Wave sends webhook to /api/payments/webhook/wave
    ↓
API validates webhook signature
    ↓
API checks idempotency (audit_logs)
    ↓
API calls WaveService.verifyWebhook()
    ↓
WaveService maps provider status to internal status
    ↓
API updates payment record
    ↓
API updates order (payment_status, transaction_id)
    ↓
API logs event in audit_logs
    ↓
API returns 200 OK to Wave
```

## Status Mapping

### Internal Statuses (payments table)
- `pending` - Payment initiated, awaiting user action
- `processing` - Payment submitted, awaiting provider confirmation
- `completed` - Payment successful
- `failed` - Payment failed
- `cancelled` - Payment cancelled by user
- `refunded` - Payment refunded

### Wave Status Mapping
- `PENDING` → `pending`
- `PROCESSING` → `processing`
- `SUCCESS` → `completed`
- `FAILED` → `failed`
- `CANCELLED` → `cancelled`

## Security Considerations

1. **Webhook Verification**: Each provider must verify webhook signatures
2. **Idempotency**: Use `transaction_id` + `provider` as unique key
3. **Environment Variables**: All secrets in `.env`, never hardcoded
4. **Rate Limiting**: Implement rate limiting on webhook endpoints
5. **Audit Logging**: All payment events logged in `audit_logs` table

## Error Handling

- **Provider API Errors**: Retry with exponential backoff (max 3 retries)
- **Webhook Failures**: Log error, return 500 to trigger provider retry
- **Idempotency Conflicts**: Return 200 OK (already processed)
- **Invalid Webhooks**: Return 400 Bad Request

## Testing Strategy

1. **Unit Tests**: Test each payment service independently
2. **Integration Tests**: Test API routes with mocked providers
3. **E2E Tests**: Playwright tests for full checkout flow
4. **Webhook Tests**: Test webhook handling with sample payloads

## Extension Points

To add a new provider:
1. Create new service file extending `BasePaymentProvider`
2. Implement `initiatePayment()` and `verifyWebhook()`
3. Add webhook route in `app/api/payments/webhook/<provider>/`
4. Register provider in `PaymentServiceFactory`
5. Add environment variables
6. Update types and schemas

