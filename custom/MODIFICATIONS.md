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

## Custom Features

For documentation on custom features (Claim Tokens, Buy Tokens, Model Pricing, Split Auth Layout), see:

- `custom/FEATURES.md` - Feature documentation
- `custom/features/*/README.md` - Individual feature documentation

---

**Last Updated**: 2025-11-10
**Maintainer**: gptchina fork
**Upstream Version**: v0.8.1-rc1
