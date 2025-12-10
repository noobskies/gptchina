# Progress

## Project Status

**Current State**: i18n Implementation Phase 5 - Token Info/Pricing Page

**Version**: v0.8.1-rc1 (Release Candidate)

**Production URL**: https://gptchina.io

**Last Updated**: 2025-12-10 11:47 AM CST

---

## What Works

### Custom Features (gptchina fork)

1. **Claim Tokens** ✅ DEPLOYED
   - 20,000 tokens per 24 hours
   - Atomic operations (race condition protected)
   - Blue button when available, countdown with seconds

2. **Buy Tokens** ✅ DEPLOYED
   - Stripe integration (6 payment methods)
   - 4 packages: 100K (¥10), 500K (¥35), 1M (¥55), 10M (¥280)
   - Atomic payment processing, webhook verification
   - Production: https://gptchina.io

3. **Model Pricing Display** ✅ DEPLOYED
   - Shows input/output costs on landing page
   - Format: "Model: X | Input: Y | Output: Z"
   - Single source from `api/models/tx.js`

4. **Split Auth Layout** ✅ DEPLOYED
   - Blue theme, white-labeled
   - 50/50 split with feature cards
   - 6 features: Multi-Provider, Privacy, Cost Savings, Agents, Model Comparison, Web Search

5. **Token Info/Pricing Guide** ✅ DEPLOYED
   - New tab with comprehensive pricing
   - Theme switcher, categorized tables
   - Interactive calculator, package comparisons

6. **Token Usage Guide** ✅ DEPLOYED
   - Educational page for understanding token costs
   - Left nav link ("Learn More" below Buy Tokens)
   - Opens in new tab, 7 comprehensive sections
   - Full i18n (64 keys English + Chinese)
   - Route: `/token-usage-guide`

7. **Privacy Policy** ✅ DEPLOYED
   - Comprehensive 10-section privacy policy
   - GDPR-compliant user rights disclosure
   - Transparent AI provider and payment processor disclosure
   - Full i18n (70 keys English + Chinese)
   - Route: `/privacy-policy`

8. **Terms of Service** ✅ DEPLOYED
   - Comprehensive 11-section legal agreement
   - User agreements, acceptable use policy, liability disclaimers
   - Age requirement (13+), non-refundable token policy with red warning
   - Full i18n (72 keys English + Chinese)
   - Route: `/terms-of-service`
   - ⚠️ Requires legal review before production

9. **i18n Support (Partial)** 🚧 IN PROGRESS
   - ✅ Phases 1-4 Complete (69 strings)
   - ✅ Token Usage Guide (64 strings)
   - ✅ Privacy Policy (70 strings)
   - ✅ Terms of Service (72 strings)
   - ⏳ Phase 5 Pending (~125-140 strings for Token Info/Pricing)
   - English + Simplified Chinese (zh-Hans)
   - **Total Progress**: 275/337-352 strings (81-82%)

---

## What's Left to Build

### Immediate Tasks

1. **Complete i18n Phase 5** - Token Info/Pricing translations
   - ~125-140 strings across 20+ components
   - Estimated 8-10 hours
   - Would complete entire i18n project

2. **Test Recent Fixes** (2025-12-09)
   - Email templates (requires backend restart)
   - Model pricing data (requires backend restart)
   - Plugins removal (requires dev server restart)

### Future Considerations

- Additional language support (zh-Hant, ja, ko, es, pt-BR)
- Performance optimizations
- Upstream sync and merge
- Additional custom features as needed

---

## Key Architectural Decisions

### 1. Fork-Friendly Architecture

**Decision**: Isolate all custom code in `custom/` directory with minimal upstream modifications

**Why**:

- Easier upstream merges
- Clear separation of concerns
- Reduced merge conflicts

**How**:

- Custom features in `custom/features/`
- Mark upstream changes with `// CUSTOM: gptchina`
- Track modifications in `custom/MODIFICATIONS.md`

---

### 2. Atomic Database Operations

**Decision**: Use atomic `findOneAndUpdate()` for financial/credit operations

**Why**: Prevent race conditions in concurrent scenarios

**Example**:

```javascript
await Balance.findOneAndUpdate(
  { user: userId, lastTokenClaim: { $lte: cooldownThreshold } },
  { $inc: { tokenCredits: 20000 }, $set: { lastTokenClaim: now } },
  { new: true, upsert: true },
);
```

**Applied To**: Claim Tokens, Buy Tokens payment processing

---

### 3. Module System Separation

**Decision**: Keep CommonJS (backend) and ES6 (frontend) separate

**Why**: Node.js requires CommonJS, Vite requires ES6 - cannot share files

**Pattern**:

- Backend: `constants.js` with `module.exports`
- Frontend: `types.ts` with `export const`
- Duplicate data if needed, keep in sync via comments

**Applied To**: Buy Tokens, all custom features

---

### 4. Single Source of Truth for Pricing

**Decision**: Pull pricing from `api/models/tx.js` instead of duplicating

**Why**:

- Automatic sync when pricing changes
- No manual updates needed
- Reduces errors and inconsistencies

**Applied To**: Model Pricing Display, Token Info/Pricing Guide

**Key Learning**: Generic fallback patterns can block specific model lookups - remove when not needed

---

### 5. i18n Key Naming Convention

**Decision**: Use `com_custom_[feature]_[context]_[specific]` pattern

**Why**:

- Consistent with LibreChat's naming
- Clear organization at scale
- Easy to find and update

**Example**: `com_custom_tokens_buy_payment_card` for "Credit Card" payment method

**Applied To**: All i18n implementations (Phases 1-4 complete, Phase 5 pending)

---

## Known Issues

### From Recent Changes (2025-12-09)

⏳ **Requires Restart**:

- Email template changes (backend restart needed)
- Model pricing data (backend restart needed)
- Plugins removal (dev server restart needed)

### From Release Candidate Status

⚠️ **v0.8.1-rc1**: May contain undiscovered bugs, features may be incomplete

---

## Milestones

### 2025-12-10 (Afternoon)

- ✅ Terms of Service: Complete implementation with full i18n
- ✅ 72 translation keys added (English + Chinese)
- ✅ 11 comprehensive sections covering user agreements, acceptable use, liability
- ✅ Legal compliance language (age 13+, non-refundable policy with visual warning)
- ⚠️ Requires legal counsel review before production deployment

- ✅ Privacy Policy: Complete implementation with full i18n
- ✅ 70 translation keys added (English + Chinese)
- ✅ 10 comprehensive sections covering data privacy, rights, and compliance
- ✅ GDPR-compliant language included

### 2025-12-10 (Morning)

- ✅ Token Usage Guide: Complete implementation with full i18n
- ✅ 64 translation keys added (English + Chinese)
- ✅ Left-aligned "Learn More" button in nav
- ⏳ Design improvements pending

### 2025-12-09

- ✅ Email templates: Simplified branding, light theme
- ✅ Plugins endpoint removed from UI
- ✅ Model pricing: Added Perplexity/DeepSeek, fixed lookup bug

### 2025-11-15

- ✅ i18n Phases 1-4 complete (69 strings translated)
- ✅ Token Info page redesigned (theme integration, modular components)

### 2025-11-14

- ✅ Token Info/Pricing Guide implemented

### 2025-11-09

- ✅ Buy Tokens deployed to production
- ✅ Split Auth Layout complete
- ✅ Model Pricing Display complete
- ✅ Claim Tokens race condition fixed
- ✅ Fork-friendly architecture documented

### 2025-11-09 (Initial)

- ✅ Memory bank initialized
- ✅ Project fully documented

---

## Success Metrics

### Current Status

- **Custom Features**: 8 deployed, 1 in progress (i18n Phase 5)
- **Production Uptime**: All features operational on https://gptchina.io
- **Fork Maintenance**: Clean architecture, documented modifications
- **i18n Progress**: 81-82% complete (275/337-352 strings including Terms of Service)

### Quality Indicators

- ✅ Zero-downtime deployments
- ✅ All payment methods functional
- ✅ Atomic operations prevent data corruption
- ✅ Fork-friendly patterns maintained throughout

---

## Development Notes

### Testing Checklist (Pending)

- [ ] Restart backend server
- [ ] Verify email template branding ("GPT China" only)
- [ ] Test email light theme in multiple clients
- [ ] Verify DeepSeek/Perplexity pricing displays
- [ ] Confirm Plugins endpoint hidden in dropdown

### Next Session Priorities

1. Execute testing checklist above
2. Begin i18n Phase 5 implementation
3. Update memory bank after Phase 5 complete

---

**Current Focus**: Memory bank cleanup complete, ready for i18n Phase 5

**Team Status**: Solo development, relying on Memory Bank for context preservation
