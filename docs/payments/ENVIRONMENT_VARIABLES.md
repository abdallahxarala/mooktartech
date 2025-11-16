# Payment Integration - Environment Variables

## Required Variables

### Wave Payment Provider

```env
# Wave API Configuration
WAVE_API_KEY=your_wave_api_key_here
WAVE_API_SECRET=your_wave_api_secret_here          # Optional
WAVE_MERCHANT_ID=your_wave_merchant_id_here        # Optional
WAVE_WEBHOOK_SECRET=your_wave_webhook_secret_here # Required for webhook verification
WAVE_API_URL=https://api-sandbox.wave.com          # Optional, defaults based on NODE_ENV
```

### Orange Money (Future)

```env
# Orange Money API Configuration
ORANGE_MONEY_API_KEY=your_orange_money_api_key_here
ORANGE_MONEY_API_SECRET=your_orange_money_api_secret_here
ORANGE_MONEY_MERCHANT_ID=your_orange_money_merchant_id_here
ORANGE_MONEY_WEBHOOK_SECRET=your_orange_money_webhook_secret_here
ORANGE_MONEY_API_URL=https://api-sandbox.orange.com
```

### Free Money (Future)

```env
# Free Money API Configuration
FREE_MONEY_API_KEY=your_free_money_api_key_here
FREE_MONEY_API_SECRET=your_free_money_api_secret_here
FREE_MONEY_MERCHANT_ID=your_free_money_merchant_id_here
FREE_MONEY_WEBHOOK_SECRET=your_free_money_webhook_secret_here
FREE_MONEY_API_URL=https://api-sandbox.free.sn
```

## Environment-Specific URLs

The system automatically selects URLs based on `NODE_ENV`:

- **Development/Sandbox**: Uses sandbox URLs
- **Production**: Uses production URLs

You can override with explicit `*_API_URL` variables.

## Webhook URLs

Webhooks are automatically configured to:
- `https://yourdomain.com/api/payments/webhook/wave`
- `https://yourdomain.com/api/payments/webhook/orange` (future)
- `https://yourdomain.com/api/payments/webhook/free` (future)

Make sure these URLs are:
1. Publicly accessible
2. Configured in your provider's dashboard
3. Using HTTPS in production

## Security Notes

1. **Never commit** `.env.local` or `.env` files
2. Use **different keys** for sandbox and production
3. **Rotate secrets** regularly
4. Use **environment-specific** configurations
5. **Verify webhook signatures** in production (required)

## Testing

For local testing, you can use:
- Provider sandbox/test accounts
- Mock webhook endpoints
- Test API keys provided by providers

## Getting API Keys

### Wave
1. Sign up at https://wave.com/developers
2. Create a merchant account
3. Generate API keys in dashboard
4. Configure webhook URL

### Orange Money
1. Contact Orange Money Business team
2. Request API access
3. Complete integration documentation
4. Receive test and production credentials

### Free Money
1. Contact Free Money Business team
2. Request API access
3. Complete integration process
4. Receive credentials

