# Custom Modifications to Upstream Files

This document tracks all modifications made to upstream LibreChat files for the gptchina fork.

## Theme Color Change: Green to Blue (2025-11-10)

### Overview

Changed the primary theme color from green to blue sitewide to match the brand identity and align with the blue Split Auth Layout.

### Modified Files

#### 1. client/src/style.css

- **Lines**: 19-30, 90-91, 154-155
- **Reason**: Replace CSS custom property values for green color palette with blue equivalents
- **Upstream Version**: v0.8.1-rc1
- **Impact**: Medium (affects all components using CSS variables)
- **Changes**:
  - Replaced 11 green color shades (--green-50 through --green-950) with blue equivalents (--blue-50 through --blue-950)
  - Updated `--surface-submit` from `var(--green-700)` to `var(--blue-700)`
  - Updated `--surface-submit-hover` from `var(--green-800)` to `var(--blue-800)`
- **Alternative Considered**: Keep variable names as "green" but assign blue values (rejected for semantic clarity)

#### 2. client/tailwind.config.cjs

- **Lines**: 58-68
- **Reason**: Update Tailwind color palette to provide blue utility classes
- **Upstream Version**: v0.8.1-rc1
- **Impact**: Medium (provides blue classes for all components)
- **Changes**:
  - Replaced green color object with blue color object
  - Added blue-950 shade for completeness
- **Alternative Considered**: Add blue alongside green (rejected to avoid confusion and reduce bundle size)

#### 3. Component Files (76 files)

- **Pattern**: All files in `client/src/**/*.{ts,tsx,js,jsx}`
- **Reason**: Replace Tailwind utility class usage from green to blue
- **Upstream Version**: v0.8.1-rc1
- **Impact**: Low per file (cosmetic changes only, no logic affected)
- **Changes**: Automated replacement of the following patterns:
  - `bg-green-*` → `bg-blue-*`
  - `text-green-*` → `text-blue-*`
  - `border-green-*` → `border-blue-*`
  - `hover:bg-green-*` → `hover:bg-blue-*`
  - `hover:text-green-*` → `hover:text-blue-*`
  - `focus:bg-green-*` → `focus:bg-blue-*`
  - `focus:text-green-*` → `focus:text-blue-*`
  - `focus:border-green-*` → `focus:border-blue-*`
  - `dark:*-green-*` → `dark:*-blue-*` (all dark mode variants)
  - `from-green-*` → `from-blue-*` (gradients)
  - `to-green-*` → `to-blue-*` (gradients)
  - `ring-green-*` → `ring-blue-*`
  - `focus:ring-green-*` → `focus:ring-blue-*`
  - `peer-focus:text-green-*` → `peer-focus:text-blue-*`
- **Alternative Considered**: Manual file-by-file updates (rejected for efficiency)

### Affected Components

- Authentication pages (Login, Registration, Password Reset, Verify Email)
- Buttons and submit actions throughout the app
- Form input focus states
- Links and navigation elements
- Status indicators (success messages, active states)
- Hover effects
- Agent and prompt management interfaces
- MCP configuration dialogs
- Sharing and permissions interfaces
- All other components using primary action colors

### Blue Color Values

Using Tailwind's standard blue palette:

```css
--blue-50: #eff6ff (lightest) --blue-100: #dbeafe --blue-200: #bfdbfe --blue-300: #93c5fd
  --blue-400: #60a5fa --blue-500: #3b82f6 (medium) --blue-600: #2563eb (primary action)
  --blue-700: #1d4ed8 (submit buttons) --blue-800: #1e40af (submit hover) --blue-900: #1e3a8a
  (darkest) --blue-950: #172554 (extra dark);
```

### Testing Completed

- ✅ Verified CSS variable updates
- ✅ Verified Tailwind config updates
- ✅ Verified component class replacements via automated script
- ⏳ Visual testing in light mode (pending)
- ⏳ Visual testing in dark mode (pending)
- ⏳ Custom features verification (Claim Tokens, Buy Tokens, Model Pricing, Split Auth Layout)

### Merge Strategy

When syncing with upstream:

1. Check if upstream modified any of the 3 core files (style.css, tailwind.config.cjs)
2. If modified, carefully merge keeping blue values instead of green
3. Check if any new green classes were added in component files
4. Run the same automated replacement script on new files
5. Verify visual consistency across the app

### Rationale

- Aligns with the blue theme established in the Split Auth Layout feature
- Provides consistent brand identity throughout the application
- Blue is widely recognized as a primary action color in modern UI design
- Maintains excellent contrast and accessibility in both light and dark modes
- Complements the existing gray color palette

### Rollback Instructions

If needed to revert:

1. Replace all `--blue-*` with `--green-*` in style.css
2. Update Tailwind config with original green palette
3. Run reverse sed command on component files (blue → green)
4. Clear browser cache and rebuild frontend

---

## Code Interpreter Removal (2025-11-15)

### Overview

Removed Code Interpreter from the Tools dropdown menu as it is a LibreChat paid-only service not available in this fork.

### Modified Files

#### client/src/components/Chat/Input/ToolsDropdown.tsx

- **Lines**: 217-275 (commented out)
- **Reason**: Remove Code Interpreter from Tools dropdown (LibreChat paid-only service)
- **Upstream Version**: v0.8.1-rc1 (commit: 8ea0896d485d7e7f3c2ea6edb5267703492bf6cd)
- **Impact**: Low (isolated to dropdown menu item)
- **Changes**:
  - Commented out the entire Code Interpreter dropdown item block
  - Preserved original code in comments for potential future re-enablement
  - Added clear documentation explaining why it was removed
- **Alternative Considered**: Configure via permissions/environment variables (rejected for less explicit control and potential side effects)

### User Impact

- **Before**: Code Interpreter appeared in Tools dropdown (gear icon in chat input) between Web Search and Artifacts
- **After**: Code Interpreter no longer visible in Tools dropdown
- **Other Tools**: File Search, Web Search, Artifacts, and MCP remain functional

### Merge Strategy

When syncing with upstream:

1. Check if upstream modified the Code Interpreter block in ToolsDropdown.tsx
2. If significantly changed, update the commented-out code to match upstream structure
3. Re-apply the comment block with updated code
4. Verify no new Code Interpreter features were added elsewhere (e.g., in BadgeRow.tsx)
5. Test that remaining tools (File Search, Web Search, Artifacts) still work correctly

### Rationale

- Code Interpreter is a paid LibreChat service requiring additional infrastructure
- Removing it from the UI prevents user confusion about unavailable features
- Commenting out instead of deleting preserves upstream code for easier future integration
- Fork-friendly approach with clear documentation for maintenance

### Testing Checklist

- [ ] Verify Code Interpreter no longer appears in Tools dropdown
- [ ] Verify File Search still works (appears in dropdown)
- [ ] Verify Web Search still works (appears in dropdown)
- [ ] Verify Artifacts still works (appears in dropdown)
- [ ] Test no console errors when opening Tools dropdown
- [ ] Test in both light and dark mode

---

## Plugins Endpoint Removal (2025-12-09)

### Overview

Removed the deprecated Plugins (gptPlugins) endpoint from the Model Dropdown selector. This endpoint was already marked as deprecated in LibreChat with an amber "Deprecated" badge.

### Modified Files

#### client/src/components/Chat/Menus/Endpoints/components/EndpointItem.tsx

- **Lines**: 209-213 (added filter logic in renderEndpoints function)
- **Reason**: Remove deprecated gptPlugins endpoint from appearing in Model Dropdown
- **Upstream Version**: v0.8.1-rc1
- **Impact**: Low (UI-only change, does not affect backend)
- **Changes**:
  - Added filter in `renderEndpoints()` function to exclude endpoints with value 'gptPlugins'
  - Preserves all other endpoints (OpenAI, Anthropic, Google, Groq, DeepSeek, etc.)
  - Follows same pattern as Code Interpreter removal
- **Alternative Considered**: Backend configuration block (rejected for being overly complex and not fork-friendly)

### User Impact

- **Before**: Plugins endpoint appeared in Model Dropdown with amber "Deprecated" badge
- **After**: Plugins endpoint no longer visible in Model Dropdown
- **Other Endpoints**: All other endpoints (OpenAI, Anthropic, Google, custom endpoints) remain functional

### Code Implementation

```typescript
export function renderEndpoints(mappedEndpoints: Endpoint[]) {
  // CUSTOM: gptchina - Filter out deprecated gptPlugins endpoint
  const filteredEndpoints = mappedEndpoints.filter((endpoint) => endpoint.value !== 'gptPlugins');

  return filteredEndpoints.map((endpoint) => (
    <EndpointItem endpoint={endpoint} key={`endpoint-${endpoint.value}-item`} />
  ));
}
```

### Merge Strategy

When syncing with upstream:

1. Check if upstream modified the `renderEndpoints()` function in EndpointItem.tsx
2. If modified, re-apply the filter logic to the new implementation
3. Verify the deprecated badge code (lines ~102-110) has been removed from upstream
4. If upstream removes gptPlugins entirely, this custom modification becomes obsolete
5. Test that Model Dropdown still displays all other endpoints correctly

### Rationale

- gptPlugins endpoint was already deprecated by LibreChat with a visible warning
- Removing it from UI reduces user confusion about deprecated features
- Simple filter approach is fork-friendly and easy to maintain
- Follows established pattern from Code Interpreter removal
- No backend changes needed - purely cosmetic UI improvement

### Testing Checklist

- [ ] Verify Plugins no longer appears in Model Dropdown
- [ ] Verify OpenAI endpoint still works
- [ ] Verify Anthropic endpoint still works
- [ ] Verify Google endpoint still works
- [ ] Verify custom endpoints (Groq, DeepSeek, etc.) still work
- [ ] Test model selection flow works correctly
- [ ] Test in both light and dark mode
- [ ] Verify no console errors

---

## Email Template Styling & Branding (2025-12-09)

### Overview

Updated email templates to use light theme styling (white background, black text) instead of dark theme, and simplified APP_TITLE branding to remove Chinese characters.

### Modified Files

#### 1. .env

- **Line**: ~477 (APP_TITLE)
- **Reason**: Simplify brand name to "GPT China" without Chinese subtitle or description
- **Upstream Version**: v0.8.1-rc1
- **Impact**: Low (affects email templates and app title)
- **Changes**:
  - **Before**: `APP_TITLE=GPTChina - Your AI Assistant with Multiple Models`
  - **After**: `APP_TITLE=GPT China`
- **Alternative Considered**: Keep full description (rejected for being too verbose in emails)

#### 2. api/server/utils/emails/verifyEmail.handlebars

- **Lines**: Multiple (CSS styles and inline styles throughout)
- **Reason**: Convert from dark theme to light theme for better email client compatibility
- **Upstream Version**: v0.8.1-rc1
- **Impact**: Low (cosmetic change only)
- **Changes**:
  - Removed dark mode media query (`@media (prefers-color-scheme: dark)`)
  - Changed body background: `#212121` → `#ffffff`
  - Changed body text color: `#ffffff` → `#000000`
  - Changed table background: `#212121` → `#ffffff`
  - Changed table/td text color: `#ffffff` → `#000000`
  - Changed MSO conditional comments backgrounds: `#212121` → `#ffffff`
  - Changed div backgrounds: `#212121` → `#ffffff`
  - Button styling unchanged (green button with white text remains)
- **Alternative Considered**: Keep dark theme (rejected due to email client rendering issues)

#### 3. api/server/utils/emails/passwordReset.handlebars

- **Lines**: Multiple (CSS styles and inline styles throughout)
- **Reason**: Match light theme styling of verification email
- **Upstream Version**: v0.8.1-rc1
- **Impact**: Low (cosmetic change only)
- **Changes**: Same as verifyEmail.handlebars
  - Removed dark mode media query
  - All backgrounds: `#212121` → `#ffffff`
  - All text colors: `#ffffff` → `#000000`

#### 4. api/server/utils/emails/requestPasswordReset.handlebars

- **Lines**: Multiple (CSS styles and inline styles throughout)
- **Reason**: Match light theme styling of other email templates
- **Upstream Version**: v0.8.1-rc1
- **Impact**: Low (cosmetic change only)
- **Changes**: Same as other templates
  - Removed dark mode media query
  - All backgrounds: `#212121` → `#ffffff`
  - All text colors: `#ffffff` → `#000000`

#### 5. api/server/utils/emails/inviteUser.handlebars

- **Lines**: Multiple (CSS styles and inline styles throughout)
- **Reason**: Match light theme styling of other email templates
- **Upstream Version**: v0.8.1-rc1
- **Impact**: Low (cosmetic change only)
- **Changes**: Same as other templates
  - Removed dark mode media query
  - All backgrounds: `#212121` → `#ffffff`
  - All text colors: `#ffffff` → `#000000`

### User Impact

**Before**:

- Email APP_TITLE could show: "GPTChina - Your AI Assistant with Multiple Models | 人工智能领域的前沿解决方案!" (if metadata was appended)
- Emails had black backgrounds with white text (dark theme)
- Poor rendering in some email clients

**After**:

- Email APP_TITLE shows: "GPT China" (clean, no Chinese characters)
- Emails have white backgrounds with black text (light theme)
- Better compatibility across all email clients
- Professional, clean appearance
- Button remains green with white text for good contrast

### Merge Strategy

When syncing with upstream:

1. Check if upstream modified any email templates in `api/server/utils/emails/`
2. If modified, re-apply light theme colors to any new sections
3. Keep APP_TITLE simplified in .env
4. Verify button colors remain accessible (white text on colored background)
5. Test emails in multiple clients (Gmail, Outlook, Apple Mail)

### Rationale

**APP_TITLE Simplification**:

- Users reported seeing Chinese characters appended via metadata
- Clean "GPT China" brand name is sufficient for emails
- Reduces confusion for English-speaking users
- More professional appearance

**Light Theme Styling**:

- White background with black text is standard for email templates
- Better rendering across email clients (Gmail, Outlook, Yahoo, Apple Mail)
- Dark theme emails can have inconsistent rendering
- Light theme ensures high readability
- Professional appearance matching typical transactional emails

### Testing Checklist

- [ ] Restart backend server (to load new APP_TITLE)
- [ ] Trigger verification email (register new test account)
- [ ] Verify email shows "GPT China" (no Chinese characters)
- [ ] Verify email has white background and black text
- [ ] Trigger password reset request email
- [ ] Verify password reset email styling is correct
- [ ] Complete password reset and verify confirmation email
- [ ] Test invite user email (if applicable)
- [ ] Check emails in multiple clients (Gmail, Outlook, Apple Mail)
- [ ] Verify button remains readable (green with white text)

---

## Custom Features

For documentation on custom features (Claim Tokens, Buy Tokens, Model Pricing, Split Auth Layout), see:

- `custom/FEATURES.md` - Feature documentation
- `custom/features/*/README.md` - Individual feature documentation

---

## Autofill Label Overlay Fix (2025-12-10)

### Overview

Fixed a bug where browser autofill caused floating labels to overlay autofilled text on the login page. The label would stay centered over the autofilled email/username field instead of moving to the top as expected.

### Modified Files

#### client/src/style.css

- **Lines**: ~3510-3525 (after .webkit-dark-styles section)
- **Reason**: Fix floating label positioning when browser autofills email/username inputs
- **Upstream Version**: v0.8.1-rc1
- **Impact**: Low (cosmetic fix, improves UX)
- **Root Cause**: The CSS relied on `:placeholder-shown` pseudo-class to detect empty inputs, but this doesn't update when browser autofills
- **Changes**:

  ```css
  /* CUSTOM: gptchina - Fix autofill label overlay bug */
  .peer:-webkit-autofill ~ label,
  .peer:autofill ~ label {
    top: 0.375rem !important;
    transform: translateY(-1rem) scale(0.75) !important;
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
  }

  .peer:-webkit-autofill {
    -webkit-text-fill-color: var(--text-primary) !important;
  }
  /* CUSTOM: gptchina - End fix */
  ```

- **Alternative Considered**: JavaScript solution to detect autofill (rejected for complexity and performance impact)

### User Impact

**Before**:

- When browser autofilled login email/username, the "Email address" label stayed centered
- Label text overlayed the autofilled value, making it hard to read
- Users had to click into the field to see the label move up

**After**:

- Label automatically moves to the top position when browser autofills
- Autofilled text is fully visible and readable
- Consistent behavior between manual typing and autofill
- Works in both light and dark mode

### Technical Details

**The Problem**:

- LoginForm.tsx uses a "floating label" pattern with `peer-placeholder-shown` CSS
- When user manually types, the label moves from center to top
- Browser autofill doesn't trigger the `:placeholder-shown` state change
- Result: Label stays centered and overlays the autofilled text

**The Solution**:

- Use `:-webkit-autofill` pseudo-class to detect autofilled inputs (Chrome/Safari/Edge)
- Use `:autofill` pseudo-class for Firefox and modern browsers
- Apply the same positioning as the focused/filled state
- Ensure autofilled text color uses theme-aware `var(--text-primary)`

**Browser Support**:

- Chrome/Edge/Safari: `:-webkit-autofill`
- Firefox 86+: `:autofill`
- Covers 95%+ of users

### Affected Pages

- Login page (`/login`)
- Registration page (if email field uses same pattern)
- Password reset page (if email field uses same pattern)
- Any other auth forms using the floating label pattern with `.peer` class

### Merge Strategy

When syncing with upstream:

1. Check if upstream modified the `.webkit-dark-styles` section in style.css
2. If modified, ensure the autofill fix remains after that section
3. Check if upstream fixed this issue in a different way
4. If upstream has their own fix, evaluate which approach is better
5. Test autofill behavior after merge to ensure fix still works

### Rationale

- Improves user experience for returning users with saved credentials
- CSS-only solution is performant and maintainable
- Fork-friendly approach with clear documentation
- No JavaScript required, avoiding performance overhead
- Works consistently across all major browsers

### Testing Checklist

- [x] CSS fix implemented
- [ ] Test with Chrome autofill (saved passwords)
- [ ] Test with Firefox autofill
- [ ] Test with Safari autofill
- [ ] Test with password manager autofill (1Password, LastPass, Bitwarden)
- [ ] Verify manual typing still works correctly
- [ ] Test focus/blur transitions
- [ ] Test in light mode
- [ ] Test in dark mode
- [ ] Verify label is readable in both positions
- [ ] Test browser back button (form state persistence)

---

**Last Updated**: 2025-12-10
**Maintainer**: gptchina fork
**Upstream Version**: v0.8.1-rc1
