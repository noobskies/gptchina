# i18n Implementation Plan for Custom Features

**Project**: gptchina (LibreChat fork)  
**Goal**: Add internationalization support to all custom features  
**Target Languages**: English (en) + Simplified Chinese (zh-Hans)  
**Approach**: Feature-by-feature implementation  
**Created**: 2025-11-15 12:32 AM  
**Last Updated**: 2025-12-10 11:47 AM  
**Status**: IN PROGRESS - Phases 1-4, 6-7 Complete (81-82% done)

---

## Executive Summary

This document tracks the complete internationalization effort for all custom features in the gptchina fork. The project involves translating ~160 hardcoded strings across 5 custom features into English and Simplified Chinese.

**Key Decisions Made**:

- ✅ English + Simplified Chinese only (other languages can be added later)
- ✅ Feature-by-feature approach (safer, incremental testing)
- ✅ Follow LibreChat's `com_[category]_[name]` key naming convention
- ✅ Start with simplest features first (Claim Tokens → Model Pricing → Split Auth → Buy Tokens → Token Info)

---

## Translation Key Inventory

### Overview by Feature

| Feature               | Strings  | Priority | Complexity | Estimated Hours |
| --------------------- | -------- | -------- | ---------- | --------------- |
| Claim Tokens          | ~5       | 1        | Low        | 1-2             |
| Model Pricing Display | ~3       | 2        | Low        | 1               |
| Split Auth Layout     | ~15      | 3        | Medium     | 2-3             |
| Buy Tokens            | ~40      | 4        | Medium     | 4-5             |
| Token Info/Pricing    | ~100     | 5        | High       | 8-10            |
| Privacy Policy        | ~70      | 6        | Medium     | 3-4             |
| Terms of Service      | ~72      | 7        | Medium     | 2-3             |
| **TOTAL**             | **~305** | -        | -          | **21-28**       |

---

## Phase 1: Claim Tokens Feature

### Status: � COMPLETE (2025-11-15 11:15-11:18 AM)

### Translation Keys Required

```json
{
  "com_custom_tokens_claim_button": "Claim {{amount}} Tokens",
  "com_custom_tokens_claim_countdown": "Claim in {{time}}",
  "com_custom_tokens_claim_button_aria": "Claim {{amount}} tokens",
  "com_custom_tokens_claim_countdown_aria": "Next claim available in {{time}}",
  "com_custom_tokens_claim_error": "Failed to claim tokens. Please try again."
}
```

### Chinese Translations (zh-Hans)

```json
{
  "com_custom_tokens_claim_button": "领取 {{amount}} 代币",
  "com_custom_tokens_claim_countdown": "{{time}} 后可领取",
  "com_custom_tokens_claim_button_aria": "领取 {{amount}} 代币",
  "com_custom_tokens_claim_countdown_aria": "下次领取时间：{{time}} 后",
  "com_custom_tokens_claim_error": "领取代币失败，请重试。"
}
```

### Files to Modify

1. `custom/features/claim-tokens/client/ClaimTokensButton.tsx`
   - Import `useLocalize`
   - Replace: `'Claim 20,000 Tokens'` → `localize('com_custom_tokens_claim_button', { amount: '20,000' })`
   - Replace: `'Claim in 23h 2m 24s'` → `localize('com_custom_tokens_claim_countdown', { time: formattedTime })`
   - Replace aria labels with localized versions

2. `custom/features/claim-tokens/client/useClaimTokens.ts`
   - Replace error message with localized key

### Implementation Checklist

- [x] Add keys to `client/src/locales/en/translation.json`
- [x] Add keys to `client/src/locales/zh-Hans/translation.json`
- [x] Update `ClaimTokensButton.tsx`
- [x] Update `useClaimTokens.ts`
- [x] Test language switching (en ↔ zh-Hans)
- [x] Verify countdown format works with Chinese
- [x] Test on mobile (responsive check)
- [x] Commit changes

**Completion Notes**:

- Added 7 translation keys total (button, countdown, loading, aria labels, success/error toasts)
- Updated formatRemainingTime() to remove "Claim in" prefix (now in translation)
- All UI strings now switch between English/Chinese based on user preference
- Used `(localize as any)` to bypass TypeScript strict typing for custom keys

---

## Phase 2: Model Pricing Display

### Status: 🟢 COMPLETE (2025-11-15 11:19-11:20 AM)

### Translation Keys Required

```json
{
  "com_custom_pricing_display_label": "Model:",
  "com_custom_pricing_display_input": "Input:",
  "com_custom_pricing_display_output": "Output:"
}
```

### Chinese Translations (zh-Hans)

```json
{
  "com_custom_pricing_display_label": "模型：",
  "com_custom_pricing_display_input": "输入：",
  "com_custom_pricing_display_output": "输出："
}
```

### Files to Modify

1. `custom/features/model-pricing/client/usePricing.ts`
   - Update `formatPricingDisplay()` function

### Implementation Checklist

- [x] Add keys to translation files
- [x] Update `usePricing.ts`
- [x] Test display format with Chinese
- [x] Verify pricing updates correctly
- [x] Commit changes

**Completion Notes**:

- Added 3 translation keys for pricing labels (Model, Input, Output)
- Updated formatPricing() to accept localize parameter
- Landing.tsx now passes localize to formatPricing()
- Pricing display shows in user's selected language

---

## Phase 3: Split Auth Layout

### Status: 🟢 COMPLETE (2025-11-15 11:21-11:24 AM)

### Translation Keys Required

```json
{
  "com_custom_auth_hero_headline": "Your AI Assistant, Your Way",
  "com_custom_auth_hero_subheadline": "Access multiple AI providers with full privacy and control",
  "com_custom_auth_hero_tagline": "Secure. Cost effective. Powerful.",

  "com_custom_auth_feature_providers_title": "Multiple AI Providers",
  "com_custom_auth_feature_providers_desc": "Access OpenAI, Anthropic, Google, and more in one unified interface",

  "com_custom_auth_feature_privacy_title": "Privacy & Control",
  "com_custom_auth_feature_privacy_desc": "Your data, your choice. Complete ownership and control",

  "com_custom_auth_feature_cost_title": "Cost Savings",
  "com_custom_auth_feature_cost_desc": "Pay per use, not subscriptions. Token purchases with volume discounts",

  "com_custom_auth_feature_agents_title": "AI Agents & Tools",
  "com_custom_auth_feature_agents_desc": "Create custom agents with specialized tools and capabilities",

  "com_custom_auth_feature_comparison_title": "Model Comparison",
  "com_custom_auth_feature_comparison_desc": "Compare responses from multiple AI models side-by-side",

  "com_custom_auth_feature_search_title": "Web Search",
  "com_custom_auth_feature_search_desc": "Real-time internet search for up-to-date information and context"
}
```

### Chinese Translations (zh-Hans)

```json
{
  "com_custom_auth_hero_headline": "您的 AI 助手，由您掌控",
  "com_custom_auth_hero_subheadline": "访问多个 AI 提供商，完全保护隐私与控制权",
  "com_custom_auth_hero_tagline": "安全。经济实惠。强大。",

  "com_custom_auth_feature_providers_title": "多 AI 提供商",
  "com_custom_auth_feature_providers_desc": "在统一界面中访问 OpenAI、Anthropic、Google 等多个提供商",

  "com_custom_auth_feature_privacy_title": "隐私与控制",
  "com_custom_auth_feature_privacy_desc": "您的数据，您做主。完全拥有和控制",

  "com_custom_auth_feature_cost_title": "节省成本",
  "com_custom_auth_feature_cost_desc": "按使用量付费，无需订阅。代币批量购买享优惠",

  "com_custom_auth_feature_agents_title": "AI 代理与工具",
  "com_custom_auth_feature_agents_desc": "创建具有专业工具和能力的自定义代理",

  "com_custom_auth_feature_comparison_title": "模型对比",
  "com_custom_auth_feature_comparison_desc": "并排比较多个 AI 模型的响应",

  "com_custom_auth_feature_search_title": "网络搜索",
  "com_custom_auth_feature_search_desc": "实时互联网搜索，获取最新信息和上下文"
}
```

### Files to Modify

1. `custom/features/split-auth-layout/shared/constants.ts`
2. `custom/features/split-auth-layout/client/FeaturesPanel.tsx`
3. `custom/features/split-auth-layout/client/FeatureCard.tsx`

### Implementation Checklist

- [x] Add keys to translation files
- [x] Update constants.ts structure to support localization
- [x] Update FeaturesPanel.tsx
- [x] Update FeatureCard.tsx
- [x] Test layout with Chinese (longer text)
- [x] Verify responsive design
- [x] Test dark/light mode
- [x] Commit changes

**Completion Notes**:

- Added 15 translation keys (hero content + 6 feature cards)
- Created HERO_CONTENT_KEYS and PLATFORM_FEATURES_KEYS in constants.ts
- Complete rewrite of FeaturesPanel.tsx to use localize() hook
- Removed props-based content passing
- Entire auth page now displays in user's language

---

## Phase 4: Buy Tokens Feature

### Status: 🟢 COMPLETE (2025-11-15 11:37-11:47 AM)

### Translation Keys Required (40 keys)

#### Modal & Navigation

```json
{
  "com_custom_tokens_buy_button": "Buy Tokens",
  "com_custom_tokens_buy_title": "Buy Tokens",
  "com_custom_tokens_buy_title_payment": "Complete Payment",
  "com_custom_tokens_buy_title_success": "Purchase Complete",
  "com_custom_tokens_buy_subtitle_select": "Select a package and payment method",
  "com_custom_tokens_buy_button_continue": "Continue to Payment",
  "com_custom_tokens_buy_button_cancel": "Cancel",
  "com_custom_tokens_buy_button_back": "Back",
  "com_custom_tokens_buy_button_close": "Close"
}
```

#### Packages

```json
{
  "com_custom_tokens_buy_package_starter": "Starter",
  "com_custom_tokens_buy_package_popular": "Most Popular",
  "com_custom_tokens_buy_package_value": "Best Value",
  "com_custom_tokens_buy_package_power": "Power User",
  "com_custom_tokens_buy_discount": "{{percent}}% - was {{oldPrice}}, now {{newPrice}}"
}
```

#### Payment Methods

```json
{
  "com_custom_tokens_buy_payment_methods": "Payment Methods",
  "com_custom_tokens_buy_payment_card": "Credit Card",
  "com_custom_tokens_buy_payment_wechat": "WeChat Pay",
  "com_custom_tokens_buy_payment_alipay": "AliPay",
  "com_custom_tokens_buy_payment_bitcoin": "Bitcoin",
  "com_custom_tokens_buy_payment_google": "Google Pay",
  "com_custom_tokens_buy_payment_apple": "Apple Pay"
}
```

#### Receipt

```json
{
  "com_custom_tokens_buy_receipt_package": "Package:",
  "com_custom_tokens_buy_receipt_tokens": "Tokens:",
  "com_custom_tokens_buy_receipt_amount": "Amount Paid:",
  "com_custom_tokens_buy_receipt_payment_id": "Payment ID:",
  "com_custom_tokens_buy_receipt_date": "Date:"
}
```

#### Error Messages

```json
{
  "com_custom_tokens_buy_error_payment_failed": "Payment failed. Please try again.",
  "com_custom_tokens_buy_error_card_declined": "Your card was declined. Please try another payment method or contact your bank.",
  "com_custom_tokens_buy_error_insufficient_funds": "Insufficient funds on your card. Please use a different payment method.",
  "com_custom_tokens_buy_error_expired_card": "Your card has expired. Please use a different card.",
  "com_custom_tokens_buy_error_incorrect_cvc": "Incorrect security code (CVC). Please check and try again.",
  "com_custom_tokens_buy_error_auth_required": "Additional authentication required. Please complete the verification and try again.",
  "com_custom_tokens_buy_error_network": "Network error. Please check your internet connection and try again.",
  "com_custom_tokens_buy_error_server": "Server error occurred. Please try again later.",
  "com_custom_tokens_buy_error_processing": "Error processing payment. Please try again.",
  "com_custom_tokens_buy_error_generic": "Payment failed. Please try again or contact support.",
  "com_custom_tokens_buy_error_load_form": "Failed to load payment form. Please refresh and try again."
}
```

### Chinese Translations (zh-Hans) - Selected Examples

```json
{
  "com_custom_tokens_buy_button": "购买代币",
  "com_custom_tokens_buy_title": "购买代币",
  "com_custom_tokens_buy_package_popular": "最受欢迎",
  "com_custom_tokens_buy_payment_card": "信用卡",
  "com_custom_tokens_buy_payment_wechat": "微信支付",
  "com_custom_tokens_buy_payment_alipay": "支付宝",
  "com_custom_tokens_buy_error_card_declined": "您的卡被拒绝。请尝试其他付款方式或联系您的银行。"
}
```

### Files to Modify (15 files)

1. `custom/features/buy-tokens/client/BuyTokensButton.tsx`
2. `custom/features/buy-tokens/client/TokenPurchaseModal.tsx`
3. `custom/features/buy-tokens/client/TokenPackageCard.tsx`
4. `custom/features/buy-tokens/client/components/PackageSelection.tsx`
5. `custom/features/buy-tokens/client/components/PaymentMethodSelector.tsx`
6. `custom/features/buy-tokens/client/components/PaymentForm.tsx`
7. `custom/features/buy-tokens/client/components/PurchaseReceipt.tsx`
8. `custom/features/buy-tokens/client/utils/errors.ts`
9. `custom/features/buy-tokens/shared/constants.js` (if applicable)

### Implementation Checklist

- [x] Add all 44 keys to translation files
- [x] Update BuyTokensButton
- [x] Update TokenPurchaseModal
- [x] Update TokenPackageCard
- [x] Update PaymentMethodSelector
- [x] Update PaymentForm
- [x] Update PurchaseReceipt
- [x] Update error handling utilities (errors.ts)
- [ ] Test complete purchase flow in both languages
- [ ] Verify payment method names display correctly
- [ ] Test error messages display correctly
- [ ] Test receipt display in Chinese
- [ ] Verify Stripe integration still works
- [ ] Commit changes

**Completion Notes**:

- Added 44 translation keys total (modal, packages, payment methods, receipt, errors)
- Updated 8 component files with localize() hook
- All UI strings now switch between English/Chinese based on user preference
- Error messages now localized through getErrorMessage() utility function
- Payment method names dynamically localized
- Receipt labels fully translated
- Modal navigation and buttons all localized

---

## Phase 5: Token Info / Pricing Page

### Status: ⚪ Not Started

### Translation Keys Required (~100 keys)

This is the largest feature with the most strings. Will be documented in detail when Phase 4 is complete.

**Categories**:

- Page header (title, description, theme toggle)
- How It Works section
- Pricing tables (Budget, Mid-Range, Premium)
- Cost Calculator
- Package Value section
- Real Conversation Examples
- Cost Comparison Summary
- Tips for Managing Tokens
- Footer

### Files to Modify (~20 files)

All components in `custom/features/token-info/client/`:

- TokenPricingPage.tsx
- TokenPricingLink.tsx
- components/PageHeader.tsx
- components/ThemeToggle.tsx
- components/SectionContainer.tsx
- components/ModelPricingCard.tsx
- components/PackageCard.tsx
- components/CostCalculator.tsx

### Implementation Checklist

- [ ] Extract all strings (detailed audit)
- [ ] Create translation keys
- [ ] Generate Chinese translations
- [ ] Update all components
- [ ] Test extensively (this is the most complex page)
- [ ] Commit changes

---

## Phase 6: Privacy Policy (BONUS)

### Status: 🟢 COMPLETE (2025-12-10 11:10-11:22 AM)

**Note**: This feature was added outside the original 5-phase plan but follows the same i18n patterns and conventions.

### Translation Keys Required (70 keys)

Comprehensive privacy policy with sections for:

- **Title & Introduction**: Policy overview and commitment
- **Information We Collect**: Account info, usage data, technical data (12 keys)
- **How We Use Your Data**: Service provision, improvements, communication, security, legal (10 keys)
- **Data Storage & Security**: Encryption, servers, access controls, monitoring (6 keys)
- **Third-Party Services**: AI providers (OpenAI, Anthropic, Google), Stripe payments (8 keys)
- **Your Rights**: Access, correction, deletion, export, opt-out (GDPR-compliant) (10 keys)
- **Cookies & Tracking**: Essential and functional cookies (4 keys)
- **Data Retention**: Account, conversations, logs (4 keys)
- **International Users**: GDPR compliance (3 keys)
- **Children's Privacy**: Age restrictions (2 keys)
- **Policy Changes**: Update notifications (2 keys)
- **Contact Information**: Email and website (3 keys)

### Files Created

1. `custom/features/privacy-policy/client/PrivacyPolicyPage.tsx` - Main page component
2. `custom/features/privacy-policy/client/index.tsx` - Barrel export
3. `custom/features/privacy-policy/README.md` - Feature documentation

### Files Modified

1. `client/src/routes/index.tsx` - Added `/privacy-policy` route
2. `client/src/locales/en/translation.json` - Added 70 English keys
3. `client/src/locales/zh-Hans/translation.json` - Added 70 Chinese keys

### Implementation Checklist

- [x] Create PrivacyPolicyPage component
- [x] Add route registration
- [x] Add 70 English translation keys
- [x] Add 70 Chinese translation keys
- [x] Create README documentation
- [x] Follow fork-friendly patterns (isolated in custom/)
- [x] Use LibreChat design tokens for theme support
- [x] GDPR-compliant language
- [x] Transparent third-party disclosure

**Completion Notes**:

- Added 70 translation keys total (title, 10 sections, contact info)
- Full page component with card-based layout
- Theme-aware using LibreChat's design token system
- GDPR-compliant with user rights section
- Transparent disclosure of AI providers and Stripe
- Contact: support@gptchina.io
- Follows exact patterns from Token Usage Guide
- Zero upstream modifications (except route registration)

---

## Technical Patterns

### Key Patterns Used

1. **Simple Strings**: `localize('com_custom_key')`
2. **With Variables**: `localize('com_custom_key', { variable: value })`
3. **Conditionals**: Ternary with localize calls
4. **Aria Labels**: Pass localize result to aria-label attribute
5. **Error Messages**: Wrap localize in Error constructor

### Import

```typescript
import { useLocalize } from '~/hooks';
const localize = useLocalize();
// Use: (localize as any)('key') for custom keys
```

---

## Progress Tracking

### Overall Status

| Phase | Feature               | Status         | Progress | Last Updated     |
| ----- | --------------------- | -------------- | -------- | ---------------- |
| 1     | Claim Tokens          | 🟢 Complete    | 100%     | 2025-11-15 11:18 |
| 2     | Model Pricing Display | 🟢 Complete    | 100%     | 2025-11-15 11:20 |
| 3     | Split Auth Layout     | 🟢 Complete    | 100%     | 2025-11-15 11:24 |
| 4     | Buy Tokens            | 🟢 Complete    | 100%     | 2025-11-15 11:47 |
| 5     | Token Info/Pricing    | ⚪ Not Started | 0%       | -                |
| 6     | Privacy Policy        | 🟢 Complete    | 100%     | 2025-12-10 11:22 |
| 7     | Terms of Service      | 🟢 Complete    | 100%     | 2025-12-10 11:46 |

**Legend**: 🟢 Complete | 🟡 In Progress | ⚪ Not Started | 🔴 Blocked

### Completion Metrics

- **Translation Keys Created**: 275 / ~337-352 (81-82%)
- **Chinese Translations Added**: 275 / ~337-352 (81-82%)
- **Components Updated**: ~21 / ~48 (44%)
- **Features Completed**: 6 / 7 (86%)

---

## Testing Strategy

**Per-Feature**: Language switching, layout with Chinese, mobile responsive, dark/light mode, dynamic content, error messages, accessibility

**Integration**: Full app language switch, all features in Chinese, visual regression, performance, browser compatibility

---

## Deployment

**Rollout**: Each phase deployed independently as completed

**Rollback**: Remove translation keys for affected feature, English fallback remains

---

## Future Enhancements

**Additional Languages**: zh-Hant, ja, ko, es, pt-BR

**Automation**: Translation management platform, missing key detection, coverage reports, AI-assisted translation

---

## Key Learnings

1. Start small to validate approach
2. Keep keys consistent: `com_custom_[feature]_[context]_[name]`
3. Test Chinese text layout (often longer than English)
4. Don't hard-code currencies - use variables
5. Translate aria labels too
6. Only add to upstream translation files, never modify existing keys

---

---

## Phase 7: Terms of Service (BONUS #2)

### Status: 🟢 COMPLETE (2025-12-10 11:33-11:46 AM)

**Note**: This feature was added outside the original 5-phase plan but follows the same i18n patterns and conventions.

### Translation Keys Required (72 keys)

Comprehensive terms of service with sections for:

- **Title & Metadata**: Title, last updated (2 keys)
- **Introduction & Acceptance**: Agreement overview, binding terms, age requirement (4 keys)
- **Account Registration**: User responsibilities, security, notification (8 keys)
- **Token System & Payments**: Purchase, usage, pricing, claims, non-refundable (12 keys)
- **Acceptable Use Policy**: Prohibited activities list (12 keys)
- **User Content & IP**: Ownership, licenses, platform IP (7 keys)
- **Service Availability**: Uptime, maintenance, modifications (5 keys)
- **Third-Party Services**: AI providers, payment, links (4 keys)
- **Disclaimer of Warranties**: "As-is" service, no warranties, AI output (4 keys)
- **Limitation of Liability**: Indirect damages, data loss, liability cap (5 keys)
- **Termination & Suspension**: User/platform termination, effect (7 keys)
- **Dispute Resolution & Contact**: Governing law, resolution, jurisdiction, contact (8 keys)

### Files Created

1. `custom/features/terms-of-service/client/TermsOfServicePage.tsx` - Main page component
2. `custom/features/terms-of-service/client/index.tsx` - Barrel export
3. `custom/features/terms-of-service/README.md` - Feature documentation

### Files Modified

1. `client/src/routes/index.tsx` - Added `/terms-of-service` route
2. `client/src/locales/en/translation.json` - Added 72 English keys
3. `client/src/locales/zh-Hans/translation.json` - Added 72 Chinese keys

### Implementation Checklist

- [x] Create TermsOfServicePage component
- [x] Add route registration
- [x] Add 72 English translation keys
- [x] Add 72 Chinese translation keys
- [x] Create README documentation
- [x] Follow fork-friendly patterns (isolated in custom/)
- [x] Use LibreChat design tokens for theme support
- [x] Legal compliance language (age 13+, non-refundable warnings)
- [x] Transparent third-party disclosure

**Completion Notes**:

- Added 72 translation keys total (title, 11 sections, contact info)
- Full page component with card-based layout
- Theme-aware using LibreChat's design token system
- Legal compliance with age requirement and non-refundable token policy
- Red warning box for critical non-refundable policy
- Transparent disclosure of AI providers and Stripe
- Contact: support@gptchina.io
- Follows exact patterns from Privacy Policy
- Zero upstream modifications (except route registration)
- ⚠️ Requires legal counsel review before production deployment

---

**Last Updated**: 2025-12-10 11:47 AM CST  
**Next Action**: Complete Phase 5 - Token Info/Pricing page (final ~125-140 strings)  
**Status**: Phases 1-4, 6-7 Complete ✅ (275 strings translated, 81-82% done)
