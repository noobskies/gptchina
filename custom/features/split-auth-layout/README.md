# Split Auth Layout Feature

**Status:** ✅ Implemented  
**Created:** 2025-11-09  
**Type:** UI Enhancement  
**Upstream Impact:** Minimal (1 file, ~20 lines)

## Overview

This feature redesigns the authentication pages (login, register, forgot password, reset password) with a modern split-screen layout. The left side (40%) showcases platform features and benefits, while the right side (60%) contains the authentication forms. This creates a more engaging and informative user experience for new and returning users.

## Design Specifications

### Layout Structure

```
┌─────────────────────────────────────────────────────┐
│  Features Panel (40%)  │  Auth Forms (60%)         │
│                        │                            │
│  Hero Section          │  Logo                     │
│  - Headline            │  Form Header              │
│  - Subheadline         │  Login/Register Form      │
│  - Tagline             │  Social Login Buttons     │
│                        │  Footer                    │
│  Features Grid         │  Theme Selector           │
│  - 6 feature cards     │                            │
│  - Icons + descriptions│                            │
│                        │                            │
└─────────────────────────────────────────────────────┘
```

### Responsive Breakpoints

- **Desktop (≥1024px):** Side-by-side 40/60 split
- **Mobile (<1024px):** Stacked vertically (features on top, forms below)

### Routes Using Split Layout

- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset form

### Routes Using Original Layout

- `/login/2fa` - Two-factor authentication
- `/verify` - Email verification

## File Structure

```
custom/features/split-auth-layout/
├── README.md                          # This file
├── client/
│   ├── index.tsx                      # Barrel export
│   ├── SplitAuthLayout.tsx           # Main wrapper component
│   ├── FeaturesPanel.tsx             # Left panel with marketing
│   ├── FeatureCard.tsx               # Individual feature display
│   └── icons/                         # Custom SVG icons
│       ├── index.tsx
│       ├── MultiProviderIcon.tsx
│       ├── PrivacyIcon.tsx
│       ├── CostControlIcon.tsx
│       ├── AgentsIcon.tsx
│       ├── CodeIcon.tsx
│       └── SearchIcon.tsx
├── shared/
│   ├── types.ts                       # TypeScript definitions
│   └── constants.ts                   # Feature content data
```

## Component Architecture

### SplitAuthLayout.tsx

Main wrapper component that creates the split layout. Drop-in replacement for `AuthLayout` with identical props signature.

**Key Features:**

- 40/60 CSS Grid layout
- Responsive stacking on mobile
- Dark/light mode support
- Error handling (matches AuthLayout)
- Theme selector integration
- Footer and banner support

### FeaturesPanel.tsx

Left panel component displaying hero content and feature grid.

**Sections:**

1. Hero Section - Main headline, subheadline, and tagline
2. Features Grid - 6 feature cards in responsive grid

**Grid Configuration:**

- Desktop XL (≥1280px): 2 columns
- Desktop (1024-1279px): 1 column
- Tablet (768-1023px): 2 columns
- Mobile (<768px): 1 column

### FeatureCard.tsx

Reusable component for individual features.

**Structure:**

- Icon (24x24px) in colored background
- Bold title
- Description text
- Hover effects with border color change

### Icons

Six custom SVG icons representing platform features:

- **MultiProviderIcon** - Multiple AI providers
- **PrivacyIcon** - Data privacy and security
- **CostControlIcon** - Cost savings
- **AgentsIcon** - AI agents and automation
- **CodeIcon** - Code execution
- **SearchIcon** - Web search

All icons are inline SVGs (no HTTP requests) with `currentColor` for theme compatibility.

## Content Configuration

### Hero Content

Located in `shared/constants.ts`:

```typescript
export const HERO_CONTENT: HeroContent = {
  headline: 'Your AI Assistant, Your Way',
  subheadline: 'Access multiple AI providers with full privacy and control',
  tagline: 'Open source. Cost effective. Powerful.',
};
```

### Platform Features

Located in `shared/constants.ts`:

```typescript
export const PLATFORM_FEATURES: PlatformFeature[] = [
  {
    id: 'multi-provider',
    icon: 'MultiProviderIcon',
    title: 'Multiple AI Providers',
    description: 'Access OpenAI, Anthropic, Google, and more in one unified interface',
  },
  // ... 5 more features
];
```

**To modify content:** Edit the constants in `shared/constants.ts`. No code changes needed.

## Styling Strategy

### Design Tokens (LibreChat)

The feature uses LibreChat's design system for consistency:

- `bg-surface-primary` - Main backgrounds
- `bg-surface-secondary` - Card backgrounds
- `text-text-primary` - Primary text
- `text-text-secondary` - Secondary text
- `border-border-light` / `border-border-medium` - Borders
- `text-green-600 dark:text-green-400` - Accent colors
- `text-blue-600 dark:text-blue-400` - Feature highlights

### Custom Gradients

Features panel background:

```css
bg-gradient-to-br from-green-500/5 to-blue-500/5
dark:from-green-500/10 dark:to-blue-500/10
```

### Dark Mode Support

All components fully support dark mode through:

- Design token usage
- Conditional Tailwind classes (`dark:` prefix)
- `currentColor` in SVG icons

## Integration

### Upstream Modification

**File:** `client/src/routes/Layouts/Startup.tsx`

**Changes:**

1. Import SplitAuthLayout component
2. Conditional layout selection based on pathname
3. Use Layout variable instead of hardcoded AuthLayout

**Lines Modified:** ~20 lines

**Code:**

```typescript
// Import
import { SplitAuthLayout } from '~/../../custom/features/split-auth-layout/client';

// Conditional selection
const usesSplitLayout = ['/login', '/register', '/forgot-password', '/reset-password'].includes(
  location.pathname,
);
const Layout = usesSplitLayout ? SplitAuthLayout : AuthLayout;

// Usage
return <Layout {...props}>{children}</Layout>;
```

### Props Compatibility

SplitAuthLayout accepts identical props to AuthLayout:

- `children: React.ReactNode`
- `header: React.ReactNode`
- `isFetching: boolean`
- `startupConfig: TStartupConfig | null | undefined`
- `startupConfigError: unknown | null | undefined`
- `pathname: string`
- `error: TranslationKeys | null`

This ensures drop-in compatibility with no changes needed to existing code.

## Testing Checklist

### Functional Testing

- [x] Login page displays split layout
- [x] Register page displays split layout
- [x] Forgot password page displays split layout
- [x] Reset password page displays split layout
- [ ] 2FA page uses original layout (not split)
- [ ] Forms submit correctly
- [ ] Social login buttons work
- [ ] Error messages display correctly
- [ ] Success messages display correctly

### Responsive Testing

- [ ] Desktop (1920x1080): 40/60 split displays correctly
- [ ] Laptop (1440x900): Layout adapts properly
- [ ] Tablet (1024x768): Layout transitions smoothly
- [ ] Mobile (375x667): Stacked vertically, features on top

### Visual Testing

- [ ] Dark mode: All colors adapt correctly
- [ ] Light mode: All colors visible and clear
- [ ] Feature cards: Hover effects work
- [ ] Icons: Display correctly and scale properly
- [ ] Gradients: Subtle and visually pleasing
- [ ] Typography: Hierarchy clear and readable

### Browser Testing

- [ ] Chrome/Edge: Layout renders correctly
- [ ] Firefox: Layout renders correctly
- [ ] Safari: Layout renders correctly
- [ ] Mobile browsers: Layout works on small screens

## Performance

### Bundle Impact

- **Size:** ~8-10KB additional JavaScript
- **HTTP Requests:** 0 additional (inline SVGs)
- **Render Performance:** Negligible impact (FeaturesPanel memoized)

### Optimization

- Icons are inline SVGs (no HTTP requests)
- Components use React.memo where appropriate
- Tailwind classes compiled at build time
- No runtime CSS generation

## Accessibility

### ARIA Support

- Semantic HTML structure
- Icon labels via `aria-label` where needed
- Proper heading hierarchy (h1, h2, h3)
- Focus management preserved from AuthLayout

### Keyboard Navigation

- All interactive elements keyboard accessible
- Tab order logical and intuitive
- Theme selector accessible

### Screen Readers

- Meaningful alt text for logo
- Feature descriptions clear and descriptive
- Error messages announced properly

## Maintenance

### Updating Content

**To change hero content:**
Edit `shared/constants.ts`:

```typescript
export const HERO_CONTENT = {
  headline: 'New Headline',
  // ...
};
```

**To add/remove features:**
Edit `PLATFORM_FEATURES` array in `shared/constants.ts`

**To change feature descriptions:**
Modify the `description` field in feature objects

### Adding New Icons

1. Create new icon component in `client/icons/`
2. Export from `client/icons/index.tsx`
3. Add to `iconMap` in `FeaturesPanel.tsx`
4. Reference in `shared/constants.ts`

### Styling Modifications

- Edit Tailwind classes in component files
- Maintain design token usage for consistency
- Test both dark and light modes
- Verify responsive behavior

## Future Enhancements

### Potential Additions

1. **Animated Transitions** - Smooth entrance animations for features
2. **User Testimonials** - Add testimonial section to features panel
3. **Statistics Display** - Show usage stats or user counts
4. **Video Background** - Optional subtle background animation
5. **Localization** - Translate feature content to other languages
6. **A/B Testing** - Test different feature sets/order
7. **Dynamic Content** - Load features from backend API

### Configuration Options

Could add environment variables:

- `VITE_SPLIT_AUTH_LAYOUT_ENABLED` - Toggle feature on/off
- `VITE_FEATURES_PANEL_WIDTH` - Adjust split ratio
- `VITE_FEATURES_PANEL_STYLE` - Theme variations

## Troubleshooting

### Common Issues

**Issue:** Split layout not displaying

- **Check:** Pathname matches conditional logic in Startup.tsx
- **Check:** SplitAuthLayout imported correctly
- **Check:** No TypeScript errors in components

**Issue:** Icons not showing

- **Check:** Icon names match in iconMap
- **Check:** SVG viewBox and dimensions correct
- **Check:** currentColor used for stroke/fill

**Issue:** Dark mode colors incorrect

- **Check:** All colors use design tokens or dark: prefix
- **Check:** Gradients have dark mode variants
- **Check:** Test theme toggle functionality

**Issue:** Mobile layout stacking incorrectly

- **Check:** Breakpoint is `lg:grid-cols-[2fr_3fr]`
- **Check:** Features panel has min-h-screen on mobile
- **Check:** Grid changes to single column below 1024px

## Related Documentation

- [Fork-Friendly Architecture](../../systemPatterns.md#fork-friendly-architecture)
- [LibreChat Auth System](https://docs.librechat.ai)
- [Tailwind CSS Grid](https://tailwindcss.com/docs/grid-template-columns)
- [React TypeScript](https://react-typescript-cheatsheet.netlify.app/)

## Version History

- **2025-11-09:** Initial implementation
  - Created split layout with 40/60 design
  - Implemented 6 custom icons
  - Added hero section and features grid
  - Full dark/light mode support
  - Responsive mobile layout

## Contact & Support

For questions or issues with this feature:

- Check this README first
- Review component source code
- Test in isolation before debugging integration
- Verify Tailwind classes are correct

---

**Last Updated:** 2025-11-09  
**Maintainer:** gptchina fork team
