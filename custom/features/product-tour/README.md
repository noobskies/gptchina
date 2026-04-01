# Product Tour Feature

**Status**: ✅ Complete  
**Created**: 2025-12-10  
**i18n Support**: English + Simplified Chinese (18 keys)

## Overview

Interactive product tour for first-time users using React Joyride. Guides users through key platform features with a 6-step walkthrough (1 welcome modal + 5 interactive steps).

## Features

### Step 0: Welcome Modal

- Modal greeting introducing GPT China
- "Start Tour" button to begin
- "Skip Tour" option to dismiss permanently

### Step 1: Model Selection

- **Target**: Model dropdown button (top left)
- **Content**: Explains model switching capabilities
- **Teaches**: How to switch between providers (Nano/Mini/DeepSeek vs flagship models)

### Step 2: Compare Mode

- **Target**: Plus (+) icon button
- **Content**: Explains side-by-side model comparison
- **Teaches**: 3-step process to compare two models simultaneously

### Step 3: Token Usage Rates

- **Target**: Pricing display under greeting (Input/Output costs)
- **Content**: Explains token burn rates
- **Teaches**: Understanding input vs output costs, links to Token Usage Guide

### Step 4: Enhanced Capabilities

- **Target**: Input tools area (attachment/artifacts icons)
- **Content**: Explains file uploads, web search, and artifacts
- **Teaches**: Going beyond basic chat with advanced tools

### Step 5: The Command Center

- **Target**: Side panel (desktop) or toggle button (mobile)
- **Content**: Explains organization, customization, and parameters
- **Teaches**: Files, Bookmarks, Memory, Agents, Prompts, Parameters

## Technical Implementation

### Library

**React Joyride** v2.8.2

- Industry-standard tour library for React
- 16.5k+ GitHub stars
- WCAG accessibility compliant
- Responsive and mobile-friendly

### State Management

**localStorage Keys**:

- `gptchina:tour:completed` - Tracks if user completed tour
- `gptchina:tour:dismissed` - Tracks if user skipped/dismissed tour
- `gptchina:tour:current-step` - Tracks current step progress

**Behavior**:

- Shows welcome modal 1 second after page load
- Tour only shows once (never again after completion/dismissal)
- Can be reset by clearing localStorage

### Architecture

```
custom/features/product-tour/
├── README.md (this file)
└── client/
    ├── index.tsx                  # Barrel export
    ├── types.ts                   # TypeScript interfaces
    ├── useTourState.ts            # localStorage state hook
    ├── tourStyles.ts              # Theme-aware Joyride styles
    ├── tourSteps.ts               # Step definitions
    ├── WelcomeModal.tsx           # Welcome modal (Step 0)
    ├── ProductTour.tsx            # Main Joyride component
    └── ProductTourProvider.tsx    # Tour orchestration
```

## Upstream Integration

### Files Modified

1. **client/src/App.jsx**
   - Added `ProductTourProvider` import
   - Wrapped `RouterProvider` with `ProductTourProvider`
   - **Impact**: Low (wrapper pattern)

2. **client/src/components/Chat/Header.tsx**
   - Added `data-tour="model-selector"` to ModelSelector
   - Added `data-tour="compare-mode"` to AddMultiConvo
   - Added `data-tour="mobile-nav-toggle"` to OpenSidebar
   - **Impact**: Low (data attributes only)

3. **client/src/components/Chat/Landing.tsx**
   - Added `data-tour="token-rates"` to pricing display
   - **Impact**: Low (data attribute only)

4. **client/src/components/Chat/Input/BadgeRow.tsx**
   - Wrapped input tools with `data-tour="input-tools"` div
   - **Impact**: Low (wrapper with `className="contents"` for no layout impact)

5. **client/src/components/Nav/Nav.tsx**
   - Added `data-tour="side-panel"` to nav element
   - **Impact**: Low (data attribute only)

6. **client/src/locales/en/translation.json**
   - Added 18 translation keys
   - **Impact**: Low (additive only)

7. **client/src/locales/zh-Hans/translation.json**
   - Added 18 translation keys
   - **Impact**: Low (additive only)

### Tracking

All modifications documented in `custom/MODIFICATIONS.md` (to be updated).

## i18n Translation Keys

**Total**: 18 keys (English + Chinese)

### Welcome Modal (3 keys)

- `com_custom_tour_welcome_title` - "Welcome to GPT CHINA"
- `com_custom_tour_welcome_body` - Introduction text
- `com_custom_tour_welcome_button` - "Start Tour"

### Tour Steps (12 keys)

- `com_custom_tour_step1_title` / `com_custom_tour_step1_body` - Model Selection
- `com_custom_tour_step2_title` / `com_custom_tour_step2_body` - Compare Mode
- `com_custom_tour_step3_title` / `com_custom_tour_step3_body` - Token Rates
- `com_custom_tour_step4_title` / `com_custom_tour_step4_body` - Input Tools
- `com_custom_tour_step5_title` / `com_custom_tour_step5_body` - Side Panel (desktop)
- `com_custom_tour_step5_body_mobile` - Side Panel (mobile variant)

### Button Labels (5 keys)

- `com_custom_tour_button_back` - "Back"
- `com_custom_tour_button_next` - "Next"
- `com_custom_tour_button_skip` - "Skip Tour"
- `com_custom_tour_button_close` - "Close"
- `com_custom_tour_button_finish` - "Start Chatting"

## Styling

### Theme Integration

Uses LibreChat's ThemeContext for automatic dark/light mode support:

- Tooltip backgrounds match theme
- Text colors from theme tokens
- Blue accent (#2563eb) for primary actions
- Overlay with 50% opacity

### Responsive Design

- Desktop: Tour targets actual UI elements
- Mobile: Adaptive step content and targeting
  - Step 5 targets toggle button instead of panel
  - Shorter mobile-specific content

## User Experience

### First Visit

1. Page loads
2. 1-second delay for UI to stabilize
3. Welcome modal appears (Step 0)
4. User clicks "Start Tour" or "Skip Tour"

### During Tour

- Spotlight highlights current element
- Numbered progress indicator (1/5, 2/5, etc.)
- Back/Next/Skip buttons available
- Close button (X) in top-right
- Keyboard navigation (arrows, Esc to close)

### Completion

- Final step changes button to "Start Chatting"
- Tour state saved to localStorage
- Never shows again

### Skip/Dismiss

- User can skip at any step
- State saved to localStorage
- Never shows again

## Testing Checklist

### Functionality

- [ ] Welcome modal shows for new users
- [ ] Welcome modal doesn't show for returning users
- [ ] All 5 steps target correct elements
- [ ] Navigation works (Back/Next buttons)
- [ ] Skip button dismisses permanently
- [ ] Completion marks tour as complete
- [ ] Keyboard navigation works (Esc, arrows)

### Responsiveness

- [ ] Desktop: Tour works on large screens
- [ ] Tablet: Tour adapts to medium screens
- [ ] Mobile: Tour uses mobile-specific content and targets

### i18n

- [ ] English content displays correctly
- [ ] Chinese content displays correctly
- [ ] Language switching works mid-tour
- [ ] Text doesn't overflow in either language

### Theme

- [ ] Light mode styling looks good
- [ ] Dark mode styling looks good
- [ ] Theme switching works mid-tour

### Edge Cases

- [ ] Target element not rendered (gracefully skips)
- [ ] Resizing window mid-tour
- [ ] Navigating away mid-tour
- [ ] Multiple browser tabs

## Reset Tour (Development)

To test the tour again after completion:

```javascript
// In browser console
localStorage.removeItem('gptchina:tour:completed');
localStorage.removeItem('gptchina:tour:dismissed');
localStorage.removeItem('gptchina:tour:current-step');
// Then refresh page
```

## Dependencies

```json
{
  "react-joyride": "^2.8.2"
}
```

**Bundle Size**: ~85KB (minified), tree-shakeable

## Future Enhancements

### Analytics (Optional)

- Track step completion rates
- Identify where users skip/drop off
- A/B test different tour content

### Advanced Features (Optional)

- Contextual tours for different user roles
- "Replay Tour" option in Settings
- Video walkthroughs embedded in steps
- Progressive disclosure (advanced features after X days)

## Maintenance

### Updating Tour Content

1. Modify text in translation files
2. No code changes needed for content updates
3. Deploy changes (hot reload in development)

### Adding New Steps

1. Add step to `tourSteps.ts`
2. Add `data-tour` attribute to target element
3. Add translation keys to both language files
4. Test thoroughly

### Removing Tour

1. Remove `ProductTourProvider` from `App.jsx`
2. Remove `data-tour` attributes (optional cleanup)
3. Translation keys can remain (no harm)

## Notes

- Tour designed for authenticated users (shows after login)
- No server-side tracking (purely client-side)
- Works offline (after initial page load)
- Accessible via keyboard navigation
- Screen reader compatible

---

**Last Updated**: 2025-12-10  
**Maintainer**: gptchina fork team  
**Upstream Impact**: Minimal (data attributes + one provider wrapper)
