# Token Usage Guide

**CUSTOM: gptchina fork**

## Overview

Educational guide to help users understand token costs, model pricing, and optimization strategies. Provides detailed explanations of Input vs Output costs, real-world calculation examples, and tips for managing token consumption.

## Feature Details

- **Type**: Standalone page route
- **Route**: `/token-usage-guide`
- **Access**: Available to all authenticated users
- **Languages**: English + Simplified Chinese (zh-Hans)

## Components

### TokenUsageGuidePage.tsx

Full-page component containing:

1. Introduction to token pricing
2. Understanding Input vs Output costs
3. Model pricing table (6 models)
4. Reasoning models explanation
5. Real-world calculation examples (3 scenarios)
6. Top tips for saving tokens (3 tips)
7. Parameters guide (Max Context, Max Output, Thinking Budget)

### TokenUsageGuideLink.tsx

Simple link component that appears in the left side navigation below the "Buy Tokens" button. Opens the guide in a new tab.

### data.ts

Constants for model pricing data used in the pricing table.

## Upstream Integration

### Modified Files

1. **client/src/components/Nav/Nav.tsx** (+3 lines)
   - Import: `const TokenUsageGuideLink = lazy(() => import('@custom/features/token-usage-guide/client'));`
   - JSX: Added `<Suspense><TokenUsageGuideLink /></Suspense>` after BuyTokensButton

2. **client/src/routes/index.tsx** (+5 lines)
   - Import: `import { TokenUsageGuidePage } from '@custom/features/token-usage-guide/client';`
   - Route: Added `/token-usage-guide` route definition

### Impact

- **Low**: Minimal upstream modifications
- **Isolated**: All logic in custom/ directory
- **Reversible**: Easy to remove if needed

## i18n Implementation

**Translation Keys**: ~60 keys following pattern `com_custom_usage_guide_[section]_[specific]`

**Critical Terminology Rule**:

- Keep "Token" in English, never translate
- Add space between Chinese characters and "Token"
- Example: "输入 Token" NOT "输入Token" or "输入代币"

## Usage

Users can access the guide by:

1. Clicking the "Learn More" link in the left side navigation (below Buy Tokens)
2. Direct URL: `/token-usage-guide`

The guide opens in a new tab, allowing users to reference pricing while chatting.

## Maintenance Notes

- **Pricing Data**: Update `data.ts` if model pricing changes
- **Content Updates**: Modify TokenUsageGuidePage.tsx sections
- **Translations**: Update both `en/translation.json` and `zh-Hans/translation.json`

## Testing

- [ ] Link appears in nav below Buy Tokens
- [ ] Clicking link opens page in new tab
- [ ] English content displays correctly
- [ ] Chinese content displays correctly
- [ ] Language switching works
- [ ] Dark/light theme support
- [ ] Mobile responsive
- [ ] Token spacing correct in Chinese (space between Chinese and "Token")

## Created

2025-12-09

## Version

1.0.0
