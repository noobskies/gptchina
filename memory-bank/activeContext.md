# Active Context

## Current Work Focus

**Status**: Privacy Policy Complete ✅

**Active Task**: None - Ready for next feature

**Recently Completed**: Privacy Policy page implementation with full i18n

**Priority Tasks**:

1. Test Privacy Policy in production
2. Consider adding footer link to Privacy Policy
3. Complete i18n Phase 5 (Token Info/Pricing page)
4. Token Usage Guide design improvements (optional)

**Key Objective**: All core legal/informational pages now complete with i18n support.

---

## Recent Changes (Last 7 Days)

### Privacy Policy Feature (2025-12-10)

**What**: Comprehensive privacy policy page explaining data collection, usage, and user rights

**Files Created**:

- `custom/features/privacy-policy/client/PrivacyPolicyPage.tsx`
- `custom/features/privacy-policy/client/index.tsx`
- `custom/features/privacy-policy/README.md`

**Files Modified**:

- `client/src/routes/index.tsx` - Added `/privacy-policy` route
- `client/src/locales/en/translation.json` - Added 70 English keys
- `client/src/locales/zh-Hans/translation.json` - Added 70 Chinese keys

**Features**:

- Standalone page accessible at `/privacy-policy`
- Full i18n support (English + Simplified Chinese)
- 10 comprehensive sections: Introduction, Information Collection, Data Usage, Storage & Security, Third-Party Services, User Rights, Cookies, Data Retention, International Users, Children's Privacy, Policy Changes, Contact
- GDPR-compliant language
- Theme-aware design matching Token Usage Guide
- Transparent disclosure of AI providers (OpenAI, Anthropic, Google) and payment processing (Stripe)
- Contact email: support@gptchina.io

**Status**: ✅ Complete

**Next**: Test in production, consider adding footer link

---

### Token Usage Guide Feature (2025-12-10)

**What**: New educational page explaining token costs and optimization strategies

**Files Created**:

- `custom/features/token-usage-guide/README.md`
- `custom/features/token-usage-guide/client/data.ts`
- `custom/features/token-usage-guide/client/TokenUsageGuideLink.tsx`
- `custom/features/token-usage-guide/client/TokenUsageGuidePage.tsx`
- `custom/features/token-usage-guide/client/index.tsx`

**Files Modified**:

- `client/src/components/Nav/Nav.tsx` - Added "Learn More" link (left-aligned)
- `client/src/routes/index.tsx` - Added `/token-usage-guide` route
- `client/src/locales/en/translation.json` - Added 64 English keys
- `client/src/locales/zh-Hans/translation.json` - Added 64 Chinese keys

**Features**:

- Standalone page accessible from left nav (below Buy Tokens button)
- Opens in new tab for reference while chatting
- Full i18n support (English + Simplified Chinese)
- 7 content sections: Introduction, Input/Output explanation, Pricing table (6 models), Reasoning models, 3 calculation examples, 3 saving tips, 3 parameter explanations
- Proper Token terminology (kept "Token" in English with space in Chinese: "输入 Token")

**Status**: ✅ Complete, ⏳ Design improvements pending

**Next**: Enhance visual design (better spacing, improved table, section cards, overall polish)

---

### Email Template Fixes (2025-12-09)

**What**: Simplified APP_TITLE and converted all 4 email templates from dark to light theme

**Files Modified**:

- `.env` - Changed APP_TITLE to "GPT China" (removed verbose description)
- 4 email templates (verifyEmail, passwordReset, requestPasswordReset, inviteUser)

**Changes**: Removed dark mode, changed backgrounds to white, text to black, kept green buttons

**Status**: ✅ Complete, ⏳ Requires backend restart

---

### Plugins Endpoint Removal (2025-12-09)

**What**: Removed deprecated gptPlugins from Model Dropdown UI

**File Modified**: `client/src/components/Chat/Menus/Endpoints/components/EndpointItem.tsx`

**Implementation**: Simple filter in `renderEndpoints()` to exclude `gptPlugins` endpoint

**Status**: ✅ Complete, ⏳ Requires dev server restart

---

### Model Pricing Data Fix (2025-12-09)

**What**: Fixed missing Perplexity/DeepSeek pricing + critical lookup bug

**Problem**: DeepSeek models not displaying despite data existing. Root cause: generic `deepseek` fallback blocking specific model lookups.

**Solution**:

- Added 4 Perplexity models (sonar, sonar-pro, sonar-reasoning, sonar-reasoning-pro)
- Added deepseek-coder pricing
- **Critical**: Removed generic `deepseek` fallback to enable pattern matching

**File Modified**: `api/models/tx.js`

**Status**: ✅ Complete, ⏳ Requires backend restart

**Key Learning**: Generic fallback patterns can block specific model lookups in LibreChat's pricing system. Always verify lookup logic flow.

---

## Completed Custom Features

### i18n Implementation (Phases 1-4) ✅

**Phase 1: Claim Tokens** (7 strings) - Complete

- Button text, countdown, aria labels, toast messages
- Format: `com_custom_tokens_claim_[specific]`

**Phase 2: Model Pricing Display** (3 strings) - Complete

- "Model:", "Input:", "Output:" labels
- Format: `com_custom_pricing_display_[specific]`

**Phase 3: Split Auth Layout** (15 strings) - Complete

- Hero headline, tagline + 6 feature cards (titles + descriptions)
- Format: `com_custom_auth_[context]_[specific]`

**Phase 4: Buy Tokens** (44 strings) - Complete

- Modal navigation, package labels, payment methods, receipt, errors
- Format: `com_custom_tokens_buy_[category]_[specific]`

**Pattern Used**: `useLocalize()` hook, `(localize as any)` for TypeScript bypass, i18next interpolation `{{variable}}`

---

### Production-Ready Features

**Claim Tokens** (Nov 2025)

- 20,000 tokens per 24 hours
- Atomic database operations (race condition protected)
- Blue button styling when available

**Buy Tokens** (Nov 2025)

- Stripe integration (Card, WeChat, Alipay, Bitcoin, Google Pay, Apple Pay)
- 4 token packages with volume discounts (100K to 10M)
- Atomic payment processing, webhook verification
- **Status**: Live on https://gptchina.io

**Model Pricing Display** (Nov 2025)

- Shows input/output costs on landing page
- Single source of truth from `api/models/tx.js`
- Format: "Model: gpt-4.1 | Input: 2.00 | Output: 8.00"

**Split Auth Layout** (Nov 2025)

- Blue theme, white-labeled content
- 50/50 split screen with feature cards
- Glass-morphism effects

**Token Info/Pricing Guide** (Nov 2025)

- Comprehensive pricing page with theme switcher
- Categorized pricing tables, interactive calculator
- Package value comparisons, conversation examples

**Token Usage Guide** (Dec 2025)

- Educational guide for understanding token costs
- Accessible from left nav ("Learn More" link below Buy Tokens)
- Opens in new tab for easy reference while chatting
- 7 sections: Introduction, Input/Output costs, Pricing table, Reasoning models, Calculation examples, Saving tips, Parameter controls
- Full i18n (64 keys in English + Chinese)
- Proper Token terminology maintained

---

## Active Decisions & Fork-Friendly Patterns

### Key Architectural Decisions

1. **Atomic Database Operations**
   - **When**: Financial/credit operations (Claim Tokens, Buy Tokens)
   - **Why**: Prevent race conditions and duplicate transactions
   - **Pattern**: `findOneAndUpdate()` with conditional queries

   ```javascript
   const result = await Balance.findOneAndUpdate(
     { user: userId, condition: true },
     { $inc: { tokenCredits: amount } },
     { new: true, upsert: true },
   );
   ```

2. **Module System Separation**
   - **Backend**: CommonJS (`constants.js`, `module.exports`)
   - **Frontend**: ES6 (`types.ts`, `export const`)
   - **Why**: Node.js requires CommonJS, Vite requires ES6
   - **Pattern**: Duplicate data if needed, never try to share files

3. **Fork-Friendly Integration**
   - **Principle**: Minimal upstream modifications
   - **Pattern**: Isolate custom code in `custom/` directory
   - **Marking**: `// CUSTOM: gptchina - [description]`
   - **Documentation**: Track all changes in `custom/MODIFICATIONS.md`

4. **i18n Implementation**
   - **Key Format**: `com_custom_[feature]_[context]_[specific]`
   - **TypeScript Bypass**: `(localize as any)` for custom keys
   - **Variables**: i18next interpolation `{{variable}}`

### Important Patterns

**Authentication in Custom Features**:

- Use `request.post()` / `request.get()` from `librechat-data-provider`
- Never use native `fetch()` - missing JWT headers
- Automatic token refresh via axios interceptor

**Theme Integration**:

- Use `useTheme()` hook from `@librechat/client`
- Use design tokens: `bg-surface-*`, `text-text-*`, `border-border-*`
- Never hardcode colors - always use LibreChat's token system

**Modal Components**:

- Use `@headlessui/react` Dialog for portals
- State management in parent component (not Recoil for simple modals)
- Follow existing patterns (examine Settings modal as reference)

**Express Middleware Order**:

- Webhook routes BEFORE `express.json()` (require raw Buffer)
- Use `express.raw({ type: 'application/json' })` for webhooks only

---

## Next Steps

### Immediate Priorities

1. **Complete i18n Phase 5** - Token Info/Pricing page (~125-140 strings)
   - Most complex feature with 20+ components
   - Estimated 8-10 hours of work
   - Would complete entire i18n effort

2. **Test Recent Changes**
   - Restart backend (email templates, model pricing)
   - Restart dev server (plugins removal)
   - Verify all fixes working correctly

### Future Considerations

- Monitor upstream LibreChat for updates
- Consider additional language support (Traditional Chinese, Japanese, Korean)
- Performance optimization opportunities
- Additional custom features as needed

---

## Key Learnings

### Technical Insights

1. **LibreChat's Pricing Lookup**: Generic fallbacks in `tokenValues` can block pattern matching. Endpoint-based matching skips `findMatchingPattern()` if endpoint exists.

2. **Vite Environment Variables**: `VITE_*` vars are build-time, not runtime. Must be Docker build arguments (ARG → ENV) before frontend build.

3. **Stripe Webhooks**: Dashboard webhooks bypass CLI even in test mode. Raw body (Buffer) required for signature verification - route must come before `express.json()`.

4. **Atomic Operations Essential**: Financial transactions must use atomic database operations. MongoDB sessions ensure all-or-nothing commits with automatic rollback.

5. **Module System Conflicts**: Cannot share files between Node.js (CommonJS) and Vite (ES6). Keep separate: `constants.js` for backend, `types.ts` for frontend.

### Fork-Friendly Best Practices

1. **Always Isolate**: Custom features in `custom/` directory when possible
2. **Minimal Upstream Changes**: Track every modification in `custom/MODIFICATIONS.md`
3. **Clear Marking**: Use `// CUSTOM: gptchina` comments on all changes
4. **Follow Patterns**: Study existing LibreChat code before implementing
5. **Design Token Usage**: Never hardcode colors - use LibreChat's token system

---

**Last Updated**: 2025-12-10 11:22 AM CST

**Current Focus**: Privacy Policy complete - ready for next feature

**Production Status**: All features deployed and operational on https://gptchina.io
