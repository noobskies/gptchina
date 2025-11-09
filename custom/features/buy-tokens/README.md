/\*\*

- CUSTOM: gptchina fork
-
- Feature: Buy Tokens (Stripe Integration)
- Created: 2025-11-09
- Upstream Impact: Minimal (2 files modified)
  \*/

# Buy Tokens Feature

## Overview

This feature integrates Stripe payment processing to allow users to purchase token packages with multiple payment methods. Users can buy tokens directly from the application without leaving the page.

## Features

- 🛒 **Token Packages**: 4 pre-configured packages with volume discounts
- 💳 **Multiple Payment Methods**: Credit Card, Bitcoin, Google Pay, Apple Pay (via Stripe)
- 🔒 **Secure Processing**: Stripe Elements for PCI compliance
- 🔄 **Atomic Operations**: Race condition prevention using MongoDB atomic updates
- 🎯 **User-Friendly UI**: Modal-based interface with package selection
- 📊 **Audit Trail**: Transaction logging for all purchases
- 🌍 **CNY Currency**: Prices displayed in Chinese Yuan (¥)

## Token Packages

| Package     | Tokens     | Price (CNY) | Original Price | Discount |
| ----------- | ---------- | ----------- | -------------- | -------- |
| Basic       | 100,000    | ¥10.00      | -              | -        |
| **Popular** | 500,000    | ¥35.00      | ¥50.00         | 30% off  |
| Pro         | 1,000,000  | ¥55.00      | ¥100.00        | 45% off  |
| Enterprise  | 10,000,000 | ¥280.00     | ¥1,000.00      | 72% off  |

## Architecture

### Directory Structure

```
custom/features/buy-tokens/
├── README.md                           # This file
├── client/                             # Frontend components
│   ├── index.tsx                       # Barrel export
│   ├── BuyTokensButton.tsx            # Sidebar button
│   ├── BuyTokensIcon.tsx              # SVG icon
│   ├── TokenPurchaseModal.tsx         # Main modal
│   ├── TokenPackageCard.tsx           # Package display
│   ├── useBuyTokens.ts                # React hook
├── server/                             # Backend logic
│   ├── routes.js                       # Express routes
│   ├── controller.js                   # Business logic
│   ├── stripe.service.js               # Stripe SDK wrapper
└── shared/                             # Shared code
    ├── constants.js                    # Config & packages
    └── types.ts                        # TypeScript types
```

### Data Flow

```
┌─────────────┐
│   User      │
│  Clicks     │
│ "Buy Tokens"│
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ TokenPurchase   │
│     Modal       │
│ (Package Select)│
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Frontend API    │
│ createPayment   │
│    Intent       │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Backend API     │
│ /stripe/create  │
│ -payment-intent │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│   Stripe API    │
│ PaymentIntent   │
│   Created       │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Stripe Elements │
│ (Card Input)    │
│ User Pays       │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│   Stripe        │
│ Processes       │
│   Payment       │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Stripe Webhook  │
│ payment_intent  │
│ .succeeded      │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Backend Webhook │
│ Handler         │
│ (Signature      │
│  Verified)      │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Atomic Update   │
│ Add Tokens      │
│ (Race-safe)     │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Balance Updated │
│ Transaction Log │
│ Created         │
└─────────────────┘
```

## Installation & Setup

### 1. Install Stripe Packages

```bash
# Install Stripe SDK for backend
npm install stripe

# Install Stripe packages for frontend
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### 2. Environment Variables

Add these to your `.env` file:

```bash
# Backend Stripe Keys
STRIPE_SECRET_KEY=xxx
STRIPE_WEBHOOK_SECRET=xxx  # Get from Stripe Dashboard

# Frontend Stripe Key (Vite)
VITE_STRIPE_PUBLIC_KEY=xxx
```

### 3. Configure Stripe Webhook

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Set URL: `https://your-domain.com/api/custom/stripe/webhook`
4. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

### 4. Build Packages

```bash
npm run build:packages
```

### 5. Start Development Server

```bash
npm run backend:dev
npm run frontend:dev
```

## API Endpoints

### POST /api/custom/stripe/create-payment-intent

Creates a Stripe payment intent for token purchase.

**Authentication**: Required (JWT)

**Request Body**:

```json
{
  "packageId": "package_500k",
  "paymentMethod": "card"
}
```

**Response**:

```json
{
  "success": true,
  "clientSecret": "pi_xxx_secret_xxx",
  "amount": 3500,
  "currency": "cny",
  "paymentIntentId": "pi_xxx"
}
```

### POST /api/custom/stripe/webhook

Handles Stripe webhook events (payment confirmations).

**Authentication**: Webhook signature verification

**Events Handled**:

- `payment_intent.succeeded` - Adds tokens to user balance
- `payment_intent.payment_failed` - Logs error

### GET /api/custom/stripe/payment-methods

Returns available payment methods for user.

**Authentication**: Required (JWT)

**Response**:

```json
{
  "success": true,
  "paymentMethods": ["card", "bitcoin", "google_pay", "apple_pay"]
}
```

## Security Features

### 1. Atomic Database Operations

Prevents duplicate token additions from concurrent webhook deliveries:

```javascript
const updatedBalance = await Balance.findOneAndUpdate(
  {
    user: userId,
    processedPayments: { $ne: paymentIntentId },
  },
  {
    $inc: { tokenCredits: tokens },
    $push: { processedPayments: paymentIntentId },
  },
  { new: true, upsert: true },
);
```

### 2. Webhook Signature Verification

All webhooks are verified using Stripe's signature:

```javascript
const event = stripe.webhooks.constructEvent(
  req.body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET,
);
```

### 3. Server-Side Validation

- Package validation (ensure package exists)
- Amount verification (prevent tampering)
- User authentication (JWT required)

### 4. PCI Compliance

- Stripe Elements handles sensitive card data
- No card information stored on our servers
- PCI-compliant payment processing

## Database Schema Changes

### Balance Model Updates

Added `processedPayments` field to track processed payment intents:

```typescript
// packages/data-schemas/src/schema/balance.ts
processedPayments: {
  type: [String],
  default: [],
}
```

```typescript
// packages/data-schemas/src/types/balance.ts
processedPayments?: string[];
```

## Upstream Modifications

### Modified Files

1. **client/src/components/Nav/Nav.tsx**

   - Added: Import for BuyTokensButton
   - Added: Render BuyTokensButton below ClaimTokensButton
   - Lines: ~2 lines added
   - Impact: Low (follows existing pattern)

2. **api/server/index.js**

   - Added: Route registration for Buy Tokens
   - Added: `app.use('/api/custom', customBuyTokensRoutes)`
   - Lines: ~4 lines added
   - Impact: Low (isolated route registration)

3. **packages/data-schemas/src/schema/balance.ts**

   - Added: `processedPayments` field
   - Lines: ~5 lines added
   - Impact: Low (optional field, backward compatible)

4. **packages/data-schemas/src/types/balance.ts**
   - Added: `processedPayments?: string[]` type
   - Lines: ~1 line added
   - Impact: Low (optional field)

See `custom/MODIFICATIONS.md` for detailed tracking.

## Testing

### Test Cards (Stripe Test Mode)

```bash
# Successful payment
Card: 4242 4242 4242 4242
Exp: Any future date
CVC: Any 3 digits

# Declined payment
Card: 4000 0000 0000 0002
Exp: Any future date
CVC: Any 3 digits
```

### Test Webhook Locally

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3080/api/custom/stripe/webhook

# Trigger test webhook
stripe trigger payment_intent.succeeded
```

### Manual Testing Checklist

- [ ] Button appears in sidebar below Claim Tokens
- [ ] Modal opens when button clicked
- [ ] All 4 token packages display correctly
- [ ] Can select each package
- [ ] Discount badges show correct percentages
- [ ] Prices display in CNY format
- [ ] Card payment completes successfully
- [ ] Balance updates after successful payment
- [ ] Success message displays
- [ ] Failed payments show error messages
- [ ] Modal closes properly
- [ ] Webhook receives events
- [ ] Duplicate webhooks don't add tokens twice

## Production Deployment

### 1. Switch to Live Keys

Update `.env` with production keys:

```bash
STRIPE_SECRET_KEY=sk_live_xxx
VITE_STRIPE_PUBLIC_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx  # From production webhook
```

### 2. Update Webhook Endpoint

Configure production webhook URL in Stripe Dashboard.

### 3. Enable HTTPS

Stripe requires HTTPS for production webhooks.

### 4. Monitor Transactions

- Check Stripe Dashboard regularly
- Monitor server logs for errors
- Set up alerts for failed payments

## Troubleshooting

### Issue: Payment intent creation fails

**Solution**: Check Stripe API keys are correct and active.

### Issue: Webhook not receiving events

**Solutions**:

1. Verify webhook URL is publicly accessible
2. Check webhook secret matches Stripe Dashboard
3. Ensure HTTPS is enabled (production)
4. Test with Stripe CLI locally

### Issue: Balance not updating after payment

**Solutions**:

1. Check webhook logs for errors
2. Verify payment intent ID in metadata
3. Check Balance model for processed payments
4. Look for race condition issues

### Issue: Duplicate token additions

**Solution**: Atomic operation should prevent this. Check MongoDB logs and ensure `processedPayments` array is working.

## Future Enhancements

- [ ] Add purchase history page
- [ ] Email receipts via Stripe
- [ ] Subscription-based packages
- [ ] Promotional codes/discounts
- [ ] Refund handling
- [ ] More payment methods (Alipay, WeChat Pay)
- [ ] Gift token purchases
- [ ] Tax calculation integration

## Support

For issues or questions:

1. Check Stripe documentation: https://stripe.com/docs
2. Review server logs for errors
3. Test with Stripe CLI for local debugging
4. Contact Stripe support for payment issues

## License

This feature is part of the gptchina fork and follows the same ISC license as LibreChat.

---

**Last Updated**: 2025-11-09  
**Stripe API Version**: 2024-11-20.acacia  
**LibreChat Version**: v0.8.1-rc1
