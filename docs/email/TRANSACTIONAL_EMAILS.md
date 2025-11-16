# Transactional Emails with Resend

## Overview

Xarala Solutions uses Resend for sending transactional emails. This includes order confirmations and lead notifications.

## Setup

### 1. Environment Variables

Add to `.env.local`:

```env
RESEND_API_KEY=re_your_resend_api_key_here
RESEND_FROM_EMAIL=Xarala Solutions <notifications@mail.xarala.sn>
```

### 2. Resend Account Setup

1. Sign up at https://resend.com
2. Verify your domain (e.g., `mail.xarala.sn`)
3. Get your API key from dashboard
4. Add API key to environment variables

## Email Service

**File:** `lib/email/transactional.ts`

### Functions

#### `sendOrderConfirmationEmail(orderId: string, locale?: string)`

Sends order confirmation email to customer.

**Usage:**
```typescript
import { sendOrderConfirmationEmail } from '@/lib/email/transactional'

const result = await sendOrderConfirmationEmail(orderId, 'fr')
if (result.success) {
  console.log('Email sent:', result.messageId)
} else {
  console.error('Email failed:', result.error)
}
```

**Features:**
- Fetches order details from database
- Includes order items, totals, shipping info
- Generates tracking URL
- Supports i18n (FR, EN, WO)

#### `sendLeadNotificationEmail(leadId: string, locale?: string)`

Sends notification email to organization owner when a new lead is captured.

**Usage:**
```typescript
import { sendLeadNotificationEmail } from '@/lib/email/transactional'

const result = await sendLeadNotificationEmail(leadId, 'fr')
```

**Features:**
- Notifies organization owner
- Includes lead details (name, email, phone, company)
- Shows source (NFC scan, manual, etc.)
- Links to lead management dashboard

## Email Templates

### Order Confirmation

**File:** `lib/email/templates/order-confirmation.ts`

**Content:**
- Order number and date
- Payment method and status
- Order items table
- Totals breakdown
- Shipping address
- Tracking link
- Contact information

**Design:**
- Premium gradient header (orange to pink)
- Clean, readable layout
- Mobile-responsive
- Brand colors (#FF7A00, #FF6B9D)

### Lead Notification

**File:** `lib/email/templates/lead-notification.ts`

**Content:**
- Lead name and contact info
- Source (NFC scan, manual, etc.)
- Associated card (if any)
- Capture timestamp
- Link to lead dashboard

**Design:**
- Same premium style as order confirmation
- Highlighted lead details
- Clear call-to-action button

## Integration Points

### Order Confirmation

**Triggered in:**
1. `app/api/payments/webhook/wave/route.ts` - When payment completes
2. `app/api/orders/create/route.ts` - When order is created (if payment already completed)

**Non-blocking:**
- Email sending doesn't block order creation
- Errors are logged but don't fail the request
- Uses dynamic import to avoid blocking

### Lead Notification

**Triggered in:**
1. `app/api/leads/route.ts` - When new lead is created

**Non-blocking:**
- Email sending doesn't block lead creation
- Errors are logged but don't fail the request

## Error Handling

### Graceful Failure

Emails are sent asynchronously and don't block the main flow:

```typescript
// Non-blocking email send
import('@/lib/email/transactional')
  .then(({ sendOrderConfirmationEmail }) => {
    sendOrderConfirmationEmail(orderId, 'fr').catch((error) => {
      console.error('Email failed:', error)
      // Don't throw - order creation succeeded
    })
  })
```

### Error Logging

All email errors are logged:
- Missing recipient email
- Resend API errors
- Template rendering errors
- Database query errors

## Internationalization

### Current Support

- **French (fr)** - Fully implemented
- **English (en)** - Templates ready, needs translation keys
- **Wolof (wo)** - Structure ready, needs translation keys

### Adding New Locale

1. Add translations to template files:
   ```typescript
   const translations = {
     fr: { ... },
     en: { ... },
     wo: { ... }  // Add here
   }
   ```

2. Pass locale to email function:
   ```typescript
   sendOrderConfirmationEmail(orderId, 'wo')
   ```

## Email Content

### Order Confirmation

**Subject:** `Confirmation de commande {orderNumber} - Xarala Solutions`

**Includes:**
- Order number
- Order date
- Payment method and status
- Itemized list of products
- Subtotal, tax, shipping, total
- Shipping address
- Tracking URL
- Contact information

### Lead Notification

**Subject:** `Nouveau contact : {leadName} - Xarala Solutions`

**Includes:**
- Lead name
- Contact information (email, phone, company)
- Source (NFC scan, manual, import)
- Associated card (if any)
- Capture timestamp
- Link to lead dashboard

## Testing

### Local Testing

1. Set `RESEND_API_KEY` in `.env.local`
2. Use Resend test API key for development
3. Check Resend dashboard for sent emails

### Production Testing

1. Verify domain in Resend dashboard
2. Test with real order/lead creation
3. Monitor Resend dashboard for delivery status
4. Check spam folder if emails not received

## Monitoring

### Resend Dashboard

- View sent emails
- Check delivery status
- Monitor bounce rates
- View analytics

### Application Logs

- Email send attempts logged
- Errors logged with context
- Success logged with message ID

## Best Practices

1. **Non-blocking**: Never block order/lead creation for email
2. **Error handling**: Log errors but don't fail requests
3. **Retry logic**: Consider adding retry for failed sends (future)
4. **Rate limiting**: Resend handles rate limiting
5. **Unsubscribe**: Not applicable for transactional emails

## Troubleshooting

### Email Not Sending

1. Check `RESEND_API_KEY` is set
2. Verify domain is verified in Resend
3. Check Resend dashboard for errors
4. Review application logs

### Email Not Received

1. Check spam folder
2. Verify recipient email is correct
3. Check Resend delivery status
4. Verify domain reputation

### Template Errors

1. Check template rendering logs
2. Verify data structure matches template
3. Test template with sample data
4. Check HTML validity

## Future Enhancements

1. **Email Queue**: Add queue system for retries
2. **Templates**: More email types (password reset, etc.)
3. **Analytics**: Track open rates, clicks
4. **A/B Testing**: Test different subject lines
5. **Scheduled Emails**: Reminder emails, follow-ups

## References

- [Resend Documentation](https://resend.com/docs)
- [Resend API Reference](https://resend.com/docs/api-reference)
- [Email Best Practices](https://resend.com/docs/send-emails/best-practices)

