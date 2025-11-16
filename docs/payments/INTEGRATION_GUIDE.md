# Payment Integration Guide - Xarala Solutions

## Overview

This guide explains how to integrate real payment providers (Wave, Orange Money, Free Money) into the Xarala Solutions platform.

## Architecture Summary

```
Frontend (Checkout) 
  → POST /api/payments/initiate
    → PaymentServiceFactory.getProvider('wave')
      → WavePaymentProvider.initiatePayment()
        → Wave API
          → Returns checkout_url
            → User redirected to Wave
              → Wave processes payment
                → Webhook to /api/payments/webhook/wave
                  → Updates payment & order status
```

## Implementation Status

- ✅ **Wave**: Fully implemented
- ⏳ **Orange Money**: Architecture ready, implementation pending
- ⏳ **Free Money**: Architecture ready, implementation pending

## Setup Instructions

### 1. Environment Variables

Add to `.env.local`:

```env
# Wave Configuration
WAVE_API_KEY=your_wave_api_key
WAVE_API_SECRET=your_wave_api_secret
WAVE_MERCHANT_ID=your_merchant_id
WAVE_WEBHOOK_SECRET=your_webhook_secret
WAVE_API_URL=https://api-sandbox.wave.com  # Optional
```

See `docs/payments/ENVIRONMENT_VARIABLES.md` for complete list.

### 2. Database Migration

Run the payments table migration:

```bash
npm run db:push
# Or manually apply: supabase/migrations/20250130000000_payments_table.sql
```

### 3. Configure Webhook URLs

In your Wave dashboard, configure webhook URL:
- **Production**: `https://yourdomain.com/api/payments/webhook/wave`
- **Sandbox**: `https://yourdomain.com/api/payments/webhook/wave`

### 4. Test Integration

1. Create a test order
2. Select Wave as payment method
3. Complete checkout flow
4. Verify webhook receives events

## Usage Examples

### From React Component

```typescript
import { usePayment } from '@/lib/hooks/use-payment'
import { PaymentFlow } from '@/components/checkout/payment-flow'

function CheckoutPage() {
  const { initiatePayment, isProcessing } = usePayment()
  
  const handlePayment = async () => {
    const result = await initiatePayment({
      order_id: 'order-123',
      provider: 'wave',
      customer: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+221 77 123 45 67'
      }
    })
    
    if (result) {
      window.location.href = result.checkout_url
    }
  }
  
  return <PaymentFlow {...props} />
}
```

### Direct API Call

```typescript
const response = await fetch('/api/payments/initiate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    order_id: 'order-123',
    provider: 'wave',
    customer: {
      name: 'John Doe',
      phone: '+221 77 123 45 67'
    }
  })
})

const data = await response.json()
if (data.success) {
  window.location.href = data.payment.checkout_url
}
```

## Testing

### Unit Tests

```bash
npm test -- payments/wave.test.ts
```

Tests cover:
- Payment initiation
- Status mapping
- Webhook verification
- Error handling
- Retry logic

### E2E Tests

```bash
npx playwright test checkout-flow.spec.ts
```

Tests cover:
- Full checkout flow
- Payment provider selection
- Error handling
- Payment cancellation

### Manual Testing

1. **Sandbox Testing**:
   - Use Wave sandbox credentials
   - Test with test phone numbers
   - Verify webhook receives events

2. **Webhook Testing**:
   - Use tools like ngrok for local testing
   - Send test webhooks from Wave dashboard
   - Verify idempotency handling

## Adding a New Provider

To add Orange Money or Free Money:

1. **Create Provider Service** (`lib/payments/orange-money.ts`):
   ```typescript
   export class OrangeMoneyPaymentProvider extends BasePaymentProvider {
     async initiatePayment(request) { /* ... */ }
     verifyWebhook(payload, signature) { /* ... */ }
     mapStatus(status) { /* ... */ }
     getWebhookSchema() { /* ... */ }
     parseWebhook(payload) { /* ... */ }
   }
   ```

2. **Register in Factory** (`lib/payments/factory.ts`):
   ```typescript
   case 'orange_money':
     return new OrangeMoneyPaymentProvider(config)
   ```

3. **Create Webhook Route** (`app/api/payments/webhook/orange/route.ts`):
   - Copy structure from `wave/route.ts`
   - Update provider name

4. **Add Environment Variables**:
   - Add `ORANGE_MONEY_*` variables
   - Update `factory.ts` to read them

5. **Update Types**:
   - Add provider to `PaymentProvider` type
   - Update schemas if needed

6. **Enable in UI**:
   - Update `PaymentProviderSelector` to enable provider
   - Add translations

## Troubleshooting

### Webhook Not Receiving Events

1. Check webhook URL is publicly accessible
2. Verify webhook secret matches
3. Check webhook logs in provider dashboard
4. Verify signature verification logic

### Payment Initiation Fails

1. Check API keys are correct
2. Verify order exists and belongs to user
3. Check amount format (smallest currency unit)
4. Review API error messages

### Status Not Updating

1. Verify webhook is being called
2. Check idempotency isn't blocking updates
3. Review audit_logs table
4. Check payment status mapping

## Security Checklist

- ✅ Webhook signature verification
- ✅ Idempotency handling
- ✅ Environment variables for secrets
- ✅ No PII in logs
- ✅ HTTPS in production
- ✅ Rate limiting (TODO)
- ✅ Input validation (Zod)
- ✅ Multi-tenant scoping

## Performance Considerations

- Payment initiation: < 2s target
- Webhook processing: < 500ms target
- Retry logic: Exponential backoff
- Database indexes: On payment_id, order_id, status

## Monitoring

Monitor these metrics:
- Payment initiation success rate
- Webhook processing time
- Failed payment rate
- Average payment completion time

## Support

For issues:
1. Check audit_logs table
2. Review webhook payloads
3. Check provider API status
4. Review error logs

