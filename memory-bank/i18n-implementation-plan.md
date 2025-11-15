# i18n Implementation Plan for Custom Features

**Project**: gptchina (LibreChat fork)  
**Goal**: Add internationalization support to all custom features  
**Target Languages**: English (en) + Simplified Chinese (zh-Hans)  
**Approach**: Feature-by-feature implementation  
**Created**: 2025-11-15  
**Status**: Planning Complete - Ready for Implementation

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
| **TOTAL**             | **~163** | -        | -          | **16-21**       |

---

## Phase 1: Claim Tokens Feature

### Status: 🟡 Ready to Start

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

- [ ] Add keys to `client/src/locales/en/translation.json`
- [ ] Add keys to `client/src/locales/zh-Hans/translation.json`
- [ ] Update `ClaimTokensButton.tsx`
- [ ] Update `useClaimTokens.ts`
- [ ] Test language switching (en ↔ zh-Hans)
- [ ] Verify countdown format works with Chinese
- [ ] Test on mobile (responsive check)
- [ ] Commit changes

---

## Phase 2: Model Pricing Display

### Status: ⚪ Not Started

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

- [ ] Add keys to translation files
- [ ] Update `usePricing.ts`
- [ ] Test display format with Chinese
- [ ] Verify pricing updates correctly
- [ ] Commit changes

---

## Phase 3: Split Auth Layout

### Status: ⚪ Not Started

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

- [ ] Add keys to translation files
- [ ] Update constants.ts structure to support localization
- [ ] Update FeaturesPanel.tsx
- [ ] Update FeatureCard.tsx
- [ ] Test layout with Chinese (longer text)
- [ ] Verify responsive design
- [ ] Test dark/light mode
- [ ] Commit changes

---

## Phase 4: Buy Tokens Feature

### Status: ⚪ Not Started

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

- [ ] Add all 40+ keys to translation files
- [ ] Update BuyTokensButton
- [ ] Update TokenPurchaseModal
- [ ] Update TokenPackageCard
- [ ] Update PackageSelection
- [ ] Update PaymentMethodSelector
- [ ] Update PaymentForm
- [ ] Update PurchaseReceipt
- [ ] Update error handling utilities
- [ ] Test complete purchase flow in both languages
- [ ] Verify payment method names display correctly
- [ ] Test error messages display correctly
- [ ] Test receipt display in Chinese
- [ ] Verify Stripe integration still works
- [ ] Commit changes

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

## Technical Reference

### Pattern 1: Simple String Replacement

**Before**:

```typescript
<h1>Claim 20,000 Tokens</h1>
```

**After**:

```typescript
import { useLocalize } from '~/hooks';

const localize = useLocalize();

<h1>{localize('com_custom_tokens_claim_button', { amount: '20,000' })}</h1>
```

### Pattern 2: Interpolation with Variables

**Before**:

```typescript
const buttonText = canClaim ? 'Claim 20,000 Tokens' : `Claim in ${formattedTime}`;
```

**After**:

```typescript
const buttonText = canClaim
  ? localize('com_custom_tokens_claim_button', { amount: '20,000' })
  : localize('com_custom_tokens_claim_countdown', { time: formattedTime });
```

### Pattern 3: Dynamic Content with Conditionals

**Before**:

```typescript
{isPopular ? 'Most Popular' : 'Starter'}
```

**After**:

```typescript
{isPopular
  ? localize('com_custom_tokens_buy_package_popular')
  : localize('com_custom_tokens_buy_package_starter')}
```

### Pattern 4: Aria Labels

**Before**:

```typescript
aria-label="Claim 20,000 tokens"
```

**After**:

```typescript
aria-label={localize('com_custom_tokens_claim_button_aria', { amount: '20,000' })}
```

### Pattern 5: Error Messages

**Before**:

```typescript
throw new Error('Failed to claim tokens. Please try again.');
```

**After**:

```typescript
throw new Error(localize('com_custom_tokens_claim_error'));
```

---

## Progress Tracking

### Overall Status

| Phase | Feature               | Status         | Progress | Last Updated |
| ----- | --------------------- | -------------- | -------- | ------------ |
| 1     | Claim Tokens          | 🟡 Ready       | 0%       | 2025-11-15   |
| 2     | Model Pricing Display | ⚪ Not Started | 0%       | -            |
| 3     | Split Auth Layout     | ⚪ Not Started | 0%       | -            |
| 4     | Buy Tokens            | ⚪ Not Started | 0%       | -            |
| 5     | Token Info/Pricing    | ⚪ Not Started | 0%       | -            |

**Legend**: 🟢 Complete | 🟡 In Progress | ⚪ Not Started | 🔴 Blocked

### Completion Metrics

- **Translation Keys Created**: 0 / ~163 (0%)
- **Chinese Translations Added**: 0 / ~163 (0%)
- **Components Updated**: 0 / ~45 (0%)
- **Features Completed**: 0 / 5 (0%)

---

## Testing Checklist

### Per-Feature Testing

For each feature after implementation:

- [ ] Test language switching (en → zh-Hans → en)
- [ ] Verify all strings translated (no English fallback where not expected)
- [ ] Check layout with Chinese characters (longer/shorter text)
- [ ] Test on mobile (responsive design)
- [ ] Test dark/light mode
- [ ] Verify dynamic content (interpolation) works
- [ ] Test error messages display correctly
- [ ] Check accessibility (screen readers, aria labels)

### Integration Testing

After all features complete:

- [ ] Full app language switch test
- [ ] Test all custom features in Chinese
- [ ] Visual regression check (screenshots before/after)
- [ ] Performance check (no slowdown from i18n)
- [ ] Browser compatibility (Chrome, Firefox, Safari)

---

## Deployment Strategy

### Phase Rollout

Each phase can be deployed independently:

1. **Phase 1 Complete** → Deploy Claim Tokens translations
2. **Phase 2 Complete** → Deploy Model Pricing translations
3. **Phase 3 Complete** → Deploy Auth Layout translations
4. **Phase 4 Complete** → Deploy Buy Tokens translations
5. **Phase 5 Complete** → Deploy Token Info Page translations

### Rollback Plan

If issues arise:

- Each phase is isolated (feature-specific keys)
- Can revert individual feature by removing translation keys
- English always works as fallback

---

## Future Enhancements

### Additional Languages (Post-MVP)

After English + Chinese proven working:

- Traditional Chinese (zh-Hant) - Taiwan/Hong Kong market
- Japanese (ja) - If expanding to Japan
- Korean (ko) - If expanding to Korea
- Spanish (es) - Global reach
- Portuguese (pt-BR) - Brazil market

### Automation Opportunities

- Translation management platform (Crowdin, Lokalise)
- Automated missing key detection in CI/CD
- Translation coverage reports
- AI-assisted translation with human review

---

## Notes & Lessons Learned

### Best Practices Discovered

1. **Start Small**: Beginning with Claim Tokens (5 strings) validates the approach before tackling Token Info (100+ strings)
2. **Keep Keys Consistent**: Following `com_custom_[feature]_[context]_[name]` pattern throughout
3. **Test Interpolation**: Chinese character widths affect layout - test responsive design thoroughly
4. **Document Everything**: This document is essential for multi-session work

### Common Pitfalls to Avoid

1. Don't hard-code currencies (¥) in translation keys - pass as variables
2. Don't assume Chinese text is shorter - it's often longer than English
3. Don't forget aria labels - they need translation too
4. Don't modify upstream LibreChat translation files - only add to them

---

## Questions & Decisions Log

### 2025-11-15 - Initial Planning

- **Q**: Which languages to support?
- **A**: English + Simplified Chinese (zh-Hans) for MVP

- **Q**: All features at once or incremental?
- **A**: Feature-by-feature (safer, easier to test)

- **Q**: Who provides translations?
- **A**: AI-generated with manual review

---

## Contact & Support

For questions about this implementation:

- Reference this document in Memory Bank
- Check LibreChat i18n docs: https://www.librechat.ai/docs/configuration/librechat_yaml/default_interface/internationalization
- Review upstream translation patterns in `client/src/locales/en/translation.json`

---

**Last Updated**: 2025-11-15 12:38 AM CST  
**Next Action**: Begin Phase 1 - Claim Tokens feature implementation  
**Status**: ✅ Plan complete, ready to execute
