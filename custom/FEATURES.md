# Custom Features - gptchina Fork

This document tracks all custom features implemented in the gptchina fork of LibreChat. Each feature should be documented here along with its status, integration approach, and maintenance information.

## Feature Status Legend

- 🎯 **Planned** - Feature is planned but not yet implemented
- 🚧 **In Progress** - Feature is currently being developed
- ✅ **Complete** - Feature is fully implemented and tested
- 🔧 **Maintenance** - Feature requires updates or fixes
- ⚠️ **Deprecated** - Feature is deprecated and scheduled for removal
- ❌ **Removed** - Feature has been removed

## Current Features

### Status Summary

- **Total Features**: 3
- **Planned**: 0
- **In Progress**: 0
- **Complete**: 3
- **Needs Maintenance**: 0

---

### Model Pricing Display

**Status**: ✅ Complete

**Category**: Full Stack

**Priority**: Medium

**Created**: 2025-11-09

**Last Updated**: 2025-11-09

**Owner**: Development Team

#### Description

Displays AI model pricing information (input/output token costs) on the landing page below the greeting message. Helps users understand the cost implications of their model selection by showing real-time pricing from the backend's pricing database.

#### Integration Approach

- **Pattern Used**: API Endpoint + React Hook
- **Upstream Files Modified**:
  - `api/server/index.js` (route registration - 3 lines)
  - `client/src/components/Chat/Landing.tsx` (UI display - 15 lines)
  - `client/tsconfig.json` (@custom alias - 1 line)
- **Modification Impact**: Low

Uses dedicated API endpoint to fetch pricing data from `api/models/tx.js` and displays it via custom React hook.

#### Configuration

**No configuration needed** - Feature works automatically once routes are registered.

Pricing data is sourced from `api/models/tx.js` which is updated by the LibreChat team as model pricing changes.

#### Location

- **Feature Directory**: `custom/features/model-pricing/`
- **Documentation**: `custom/features/model-pricing/README.md`
- **Frontend**: `custom/features/model-pricing/client/`
- **Backend**: `custom/features/model-pricing/server/`
- **Tests**: None yet (manual testing only)

#### Dependencies

**Upstream Dependencies**:

- `api/models/tx.js`: Source of truth for model pricing
- `conversation.model`: Current model selection
- LibreChat design tokens: For consistent styling

**External Packages**:

- None (uses native fetch API)

**Other Custom Features**:

- None

#### Testing

**Test Coverage**: Manual testing only

**Manual Testing Steps**:

1. Start dev server and log in
2. Navigate to landing page
3. Select different models from dropdown
4. Verify pricing updates correctly (format: "Input: X.XX | Output: X.XX")
5. Test with model that has no pricing data
6. Verify dark/light mode compatibility

**Test Cases**:

- ✅ Model with pricing → Shows rates
- ✅ Model without pricing → No display (graceful)
- ✅ No model selected → No pricing shown
- ✅ Model changes → Pricing updates automatically
- ✅ Dark/light theme → Proper contrast maintained

#### Known Issues

- None currently

#### Maintenance Notes

**Upstream Compatibility**:

- Tested with upstream version: v0.8.1-rc1 (commit: 63ed3a35)
- Depends on stable `tx.js` structure
- Minimal modification to Landing.tsx (well-isolated)

**Update Strategy**:

- When `tx.js` updates: No action needed (API automatically serves new pricing)
- When Landing.tsx updates: Re-apply custom pricing display code
- When route registration pattern changes: Update server/index.js integration

**Todo**:

- [ ] Add caching to reduce API calls
- [ ] Show pricing in token purchase modal
- [ ] Add pricing comparison view
- [ ] Include estimated costs for conversations
- [ ] Show cache pricing for Anthropic models

---

### Claim Tokens

**Status**: ✅ Complete

**Category**: Full Stack

**Priority**: High

**Created**: 2025-11-09

**Last Updated**: 2025-11-09

**Owner**: Development Team

#### Description

Allows users to claim 20,000 free tokens every 24 hours. Includes cooldown enforcement with race condition protection, real-time countdown timer, and audit trail via transaction logs.

#### Integration Approach

- **Pattern Used**: Plugin (dedicated feature module)
- **Upstream Files Modified**:
  - `api/server/index.js` (route registration)
  - `client/src/components/Nav/Nav.tsx` (button placement)
  - `packages/data-schemas/src/schema/balance.ts` (schema addition)
  - `packages/data-schemas/src/types/balance.ts` (type addition)
  - `client/vite.config.ts` (@custom alias)
- **Modification Impact**: Low

#### Configuration

**Constants** (in `custom/features/claim-tokens/shared/constants.js`):

- `CLAIM_AMOUNT`: 20,000 tokens
- `COOLDOWN_HOURS`: 24 hours

#### Location

- **Feature Directory**: `custom/features/claim-tokens/`
- **Documentation**: `custom/features/claim-tokens/README.md`
- **Frontend**: `custom/features/claim-tokens/client/`
- **Backend**: `custom/features/claim-tokens/server/`

#### Dependencies

**Upstream Dependencies**:

- Balance model (`packages/data-schemas/src/schema/balance.ts`)
- Transaction model (`api/models/Transaction.js`)

**External Packages**:

- None (uses existing MongoDB and React dependencies)

**Other Custom Features**:

- None

#### Testing

**Test Coverage**: Manual testing

**Known Features**:

- ✅ 24-hour cooldown enforcement
- ✅ Race condition protection (atomic database operations)
- ✅ Real-time countdown with seconds
- ✅ Transaction audit trail
- ✅ Toast notifications on success/error

#### Known Issues

- None currently

#### Maintenance Notes

**Upstream Compatibility**:

- Tested with upstream version: v0.8.1-rc1
- Relies on stable Balance schema
- Minimal upstream modifications

**Update Strategy**:

- Monitor Balance schema changes
- Update atomic operations if MongoDB version changes

---

### Buy Tokens

**Status**: ✅ Complete

**Category**: Full Stack

**Priority**: High

**Created**: 2025-11-09

**Last Updated**: 2025-11-09

**Owner**: Development Team

#### Description

Stripe-integrated payment system allowing users to purchase tokens with multiple payment methods (Credit Card, Bitcoin, Google Pay, Apple Pay, WeChat Pay, Alipay). Includes 4 token packages with volume discounts, atomic payment processing, and webhook verification.

#### Integration Approach

- **Pattern Used**: Plugin (dedicated feature module)
- **Upstream Files Modified**:
  - `api/server/index.js` (route registration - special handling for webhooks)
  - `client/src/components/Nav/Nav.tsx` (button placement)
  - `packages/data-schemas/src/schema/balance.ts` (processedPayments field)
  - `packages/data-schemas/src/types/balance.ts` (type addition)
  - `Dockerfile` (Vite build args for env vars)
  - `docker-compose.override.yml` (created for production builds)
- **Modification Impact**: Low-Medium

#### Configuration

**Environment Variables**:

**Token Packages** (in `shared/constants.js`):

- 100,000 tokens - ¥10.00
- 500,000 tokens - ¥35.00 (30% off) - Popular
- 1,000,000 tokens - ¥55.00 (45% off)
- 10,000,000 tokens - ¥280.00 (72% off)

#### Location

- **Feature Directory**: `custom/features/buy-tokens/`
- **Documentation**: `custom/features/buy-tokens/README.md`
- **Frontend**: `custom/features/buy-tokens/client/`
- **Backend**: `custom/features/buy-tokens/server/`

#### Dependencies

**Upstream Dependencies**:

- Balance model (`packages/data-schemas/src/schema/balance.ts`)
- Transaction model (`api/models/Transaction.js`)

**External Packages**:

- `stripe`: Stripe SDK (backend)
- `@stripe/stripe-js`: Stripe JS library (frontend)
- `@stripe/react-stripe-js`: Stripe React components

**Other Custom Features**:

- None

#### Testing

**Test Coverage**: Manual testing with Stripe test cards

**Test Cards**:

- Success: 4242 4242 4242 4242
- Declined: 4000 0000 0000 0002

**Verified Features**:

- ✅ All 6 payment methods working
- ✅ Atomic payment processing (MongoDB transactions)
- ✅ Webhook signature verification
- ✅ Idempotency (prevents duplicate processing)
- ✅ Production deployment successful

#### Known Issues

- None currently

#### Maintenance Notes

**Upstream Compatibility**:

- Tested with upstream version: v0.8.1-rc1 (commit: 63ed3a35)
- Special handling: Webhook route must be registered BEFORE express.json()
- Relies on stable Balance schema

**Update Strategy**:

- Monitor Express middleware order if upstream changes server setup
- Update Stripe SDK if pricing/features change
- Keep Dockerfile env var handling if upstream changes build process

**Production Status**:

- ✅ Deployed to https://gptafrica.io
- ✅ All payment methods operational
- ✅ Tokens adding correctly to user balances

---

## Feature Template

When adding a new feature, copy this template and fill in the details:

### [Feature Name]

**Status**: 🎯 Planned / 🚧 In Progress / ✅ Complete / 🔧 Maintenance / ⚠️ Deprecated / ❌ Removed

**Category**: Frontend / Backend / Full Stack / Integration / Configuration

**Priority**: Critical / High / Medium / Low

**Created**: [Date]

**Last Updated**: [Date]

**Owner**: [Developer/Team Name]

#### Description

[Brief description of what this feature does and why it exists]

#### Integration Approach

- **Pattern Used**: Plugin / Middleware / Config Extension / Event-Driven / Dependency Injection
- **Upstream Files Modified**: None / List of files
- **Modification Impact**: None / Low / Medium / High

#### Configuration

**Environment Variables**:

```bash
CUSTOM_FEATURE_X_ENABLED=true
CUSTOM_FEATURE_X_API_KEY=xxx
```

**Config File** (`custom/config/librechat.custom.yaml`):

```yaml
features:
  feature_x:
    enabled: true
    setting1: value1
```

#### Location

- **Feature Directory**: `custom/features/[feature-name]/`
- **Documentation**: `custom/features/[feature-name]/README.md`
- **Frontend**: `custom/features/[feature-name]/client/`
- **Backend**: `custom/features/[feature-name]/server/`
- **Tests**: `custom/features/[feature-name]/__tests__/`

#### Dependencies

**Upstream Dependencies**:

- [List any upstream code this feature depends on]

**External Packages**:

- [List any npm packages required]

**Other Custom Features**:

- [List any other custom features this depends on]

#### Testing

**Test Coverage**: [Percentage or status]

**Test Files**:

- Unit tests: `custom/features/[feature-name]/__tests__/feature.test.js`
- Integration tests: `custom/features/[feature-name]/__tests__/integration.test.js`

**Manual Testing Steps**:

1. [Step 1]
2. [Step 2]

#### Known Issues

- [List any known issues or limitations]

#### Maintenance Notes

**Upstream Compatibility**:

- Tested with upstream version: v0.8.1-rc1
- Breaking changes expected in: [Future version if known]

**Update Strategy**:

- [How to handle upstream updates]

**Todo**:

- [ ] [Item 1]
- [ ] [Item 2]

---

## Example Feature Entries

Below are examples of how to document features. These should be removed once real features are added.

### Example: Custom Analytics

**Status**: ✅ Complete

**Category**: Full Stack

**Priority**: Medium

**Created**: 2025-11-09

**Last Updated**: 2025-11-09

**Owner**: Development Team

#### Description

Implements custom analytics tracking for user interactions, conversation metrics, and system performance. Provides insights into usage patterns without compromising user privacy.

#### Integration Approach

- **Pattern Used**: Event-Driven Integration
- **Upstream Files Modified**: None
- **Modification Impact**: None

Listens to upstream events and logs analytics data to external service.

#### Configuration

**Environment Variables**:

```bash
CUSTOM_ENABLE_ANALYTICS=true
CUSTOM_ANALYTICS_ENDPOINT=https://analytics.example.com
CUSTOM_ANALYTICS_API_KEY=xxx
```

**Config File**:

```yaml
features:
  analytics:
    enabled: true
    endpoint: 'https://analytics.example.com'
    batch_size: 100
    flush_interval: 5000
```

#### Location

- **Feature Directory**: `custom/features/analytics/`
- **Documentation**: `custom/features/analytics/README.md`
- **Backend**: `custom/features/analytics/server/`
- **Tests**: `custom/features/analytics/__tests__/`

#### Dependencies

**Upstream Dependencies**:

- Event emitter system (`api/lib/events.js`)
- Message model (`api/models/Message.js`)

**External Packages**:

- `axios`: For API calls to analytics service

**Other Custom Features**:

- None

#### Testing

**Test Coverage**: 85%

**Test Files**:

- Unit tests: `custom/features/analytics/__tests__/analytics.test.js`
- Integration tests: `custom/features/analytics/__tests__/integration.test.js`
- Upstream compatibility: `custom/__tests__/upstream-compatibility/analytics.test.js`

**Manual Testing Steps**:

1. Enable analytics in configuration
2. Perform various user actions (send messages, create conversations)
3. Verify analytics data sent to endpoint
4. Check logs for any errors

#### Known Issues

- None currently

#### Maintenance Notes

**Upstream Compatibility**:

- Tested with upstream version: v0.8.1-rc1
- Relies on stable event emitter pattern
- No breaking changes expected

**Update Strategy**:

- Monitor upstream event emitter changes
- Update event handlers if event signatures change

**Todo**:

- [ ] Add support for custom event types
- [ ] Implement data retention policies
- [ ] Add dashboard for viewing analytics

---

### Example: Enhanced Authentication

**Status**: 🚧 In Progress

**Category**: Backend

**Priority**: High

**Created**: 2025-11-09

**Last Updated**: 2025-11-09

**Owner**: Security Team

#### Description

Adds additional authentication methods and security features including:

- Two-factor authentication (2FA)
- IP whitelisting
- Advanced session management
- Audit logging for authentication events

#### Integration Approach

- **Pattern Used**: Middleware Wrapping
- **Upstream Files Modified**: `api/server/routes/auth.js` (minimal)
- **Modification Impact**: Low

Wraps existing Passport.js authentication middleware to add custom security checks.

#### Configuration

**Environment Variables**:

```bash
CUSTOM_ENABLE_ENHANCED_AUTH=true
CUSTOM_2FA_ENABLED=true
CUSTOM_IP_WHITELIST=192.168.1.0/24,10.0.0.0/8
```

**Config File**:

```yaml
features:
  enhanced_auth:
    enabled: true
    two_factor:
      enabled: true
      issuer: 'gptchina'
    ip_whitelist:
      enabled: true
      ranges:
        - '192.168.1.0/24'
        - '10.0.0.0/8'
    session:
      max_concurrent: 3
      idle_timeout: 3600
```

#### Location

- **Feature Directory**: `custom/features/enhanced-auth/`
- **Documentation**: `custom/features/enhanced-auth/README.md`
- **Backend**: `custom/features/enhanced-auth/server/`
- **Tests**: `custom/features/enhanced-auth/__tests__/`

#### Dependencies

**Upstream Dependencies**:

- Passport.js authentication (`api/strategies/`)
- User model (`api/models/User.js`)
- Session management

**External Packages**:

- `speakeasy`: 2FA TOTP generation
- `qrcode`: QR code generation for 2FA setup
- `ip-range-check`: IP address validation

**Other Custom Features**:

- None

#### Testing

**Test Coverage**: In Progress

**Test Files**:

- Unit tests: `custom/features/enhanced-auth/__tests__/auth.test.js`
- Integration tests: `custom/features/enhanced-auth/__tests__/integration.test.js`

**Manual Testing Steps**:

1. Enable enhanced auth in configuration
2. Test 2FA enrollment and login
3. Test IP whitelist enforcement
4. Verify session limits work correctly
5. Check audit logs

#### Known Issues

- 2FA QR code generation not yet implemented
- IP whitelist needs IPv6 support

#### Maintenance Notes

**Upstream Compatibility**:

- Tested with upstream version: v0.8.1-rc1
- Minimal modification to upstream auth routes
- Should be compatible with future versions

**Update Strategy**:

- If upstream changes Passport strategy implementation, update middleware wrapper
- Monitor for changes to User model schema

**Todo**:

- [x] Implement 2FA TOTP generation
- [x] Add IP whitelist checking middleware
- [ ] Implement QR code generation
- [ ] Add IPv6 support to IP whitelist
- [ ] Create admin UI for managing whitelists
- [ ] Add audit log export functionality

---

## Removed Features

### [Feature Name]

**Status**: ❌ Removed

**Removed Date**: [Date]

**Reason**: [Why the feature was removed]

**Migration Path**: [How users should migrate if applicable]

---

## Feature Categories

### Frontend Features

[List frontend-specific features]

### Backend Features

[List backend-specific features]

### Full Stack Features

[List features spanning both frontend and backend]

### Integration Features

[List third-party integration features]

### Configuration Features

[List configuration and setup features]

---

## Development Roadmap

### Short Term (1-3 months)

- [Planned feature 1]
- [Planned feature 2]

### Medium Term (3-6 months)

- [Planned feature 1]
- [Planned feature 2]

### Long Term (6+ months)

- [Planned feature 1]
- [Planned feature 2]

---

## Feature Request Process

To request a new custom feature:

1. **Assess Necessity**: Could this be implemented as a configuration change or plugin?
2. **Check Upstream**: Is this feature available or planned in upstream LibreChat?
3. **Document**: Create a detailed feature proposal
4. **Discuss**: Review with team for feasibility and priority
5. **Plan**: Determine integration approach to minimize upstream impact
6. **Implement**: Follow development guidelines in `custom/README.md`
7. **Document**: Update this file with feature details

---

**Last Updated**: 2025-11-09

**Next Review**: [Schedule regular reviews to keep this document updated]
