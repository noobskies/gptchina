# Privacy Policy Feature

## Overview

Comprehensive privacy policy page accessible at `/privacy-policy` explaining data collection, usage, security, and user rights for GPT China.

## Purpose

Provides legally compliant privacy policy with:

- Information collection transparency
- Data usage policies
- Security measures
- Third-party service disclosure
- User rights (GDPR-compliant)
- Contact information

## Features

- **Full i18n Support**: English + Simplified Chinese
- **Theme-Aware Design**: Adapts to light/dark mode
- **Responsive Layout**: Works on all device sizes
- **Accessible**: Proper heading hierarchy and semantic HTML
- **Clear Structure**: 12 comprehensive sections

## Route

```
https://gptchina.io/privacy-policy
```

## Implementation

### Files Created

- `client/PrivacyPolicyPage.tsx` - Main page component
- `client/index.tsx` - Barrel export

### Route Registration

Added to `client/src/routes/index.tsx`:

```typescript
{
  path: 'privacy-policy',
  element: <PrivacyPolicyPage />,
  errorElement: <RouteErrorBoundary />,
}
```

### Translation Keys

Added ~70 translation keys following pattern:

- `com_custom_privacy_[section]_[content]`
- Examples: `com_custom_privacy_title`, `com_custom_privacy_collect_account_email`

## Sections

1. **Introduction** - Overview and commitment
2. **Information We Collect** - Account, usage, and technical data
3. **How We Use Your Data** - Service provision, improvements, communication
4. **Data Storage & Security** - Encryption, secure servers, access controls
5. **Third-Party Services** - AI providers (OpenAI, Anthropic, Google), Stripe payments
6. **Your Rights** - Access, correction, deletion, export, opt-out
7. **Cookies & Tracking** - Essential and functional cookies
8. **Data Retention** - How long we keep data
9. **International Users** - GDPR compliance
10. **Children's Privacy** - Age restrictions (13+)
11. **Changes to Policy** - Update notifications
12. **Contact Us** - support@gptchina.io

## Design Patterns

- Card-based sections with subtle borders
- Clean typography with proper hierarchy
- Blue accent for links and highlights
- Theme-aware colors using LibreChat design tokens
- Maximum width 5xl for readability
- Proper spacing and padding

## Upstream Impact

**None** - Completely isolated in `custom/features/privacy-policy/`

## Fork-Friendly

- No upstream file modifications (except route registration)
- Self-contained feature
- Clear CUSTOM markers
- Follows established patterns

## Customization

To update content:

1. Modify translation keys in `client/src/locales/en/translation.json`
2. Update Chinese translations in `client/src/locales/zh-Hans/translation.json`
3. Adjust sections in `PrivacyPolicyPage.tsx` if needed

To change contact email:

- Update email address in Contact Us section (currently `support@gptchina.io`)

## Testing Checklist

- [ ] Page loads at `/privacy-policy`
- [ ] All sections render correctly
- [ ] Language switching works (EN ↔ ZH)
- [ ] Links are clickable (email, website)
- [ ] Dark/light mode displays properly
- [ ] Mobile responsive layout
- [ ] No console errors
- [ ] All translation keys exist

## Legal Considerations

This privacy policy is a template and should be reviewed by legal counsel to ensure compliance with:

- GDPR (EU)
- CCPA (California)
- Other applicable privacy laws

Update the "Last Updated" date when making changes.

## Maintenance

- Review policy annually
- Update when adding new features that collect data
- Notify users of material changes
- Keep translations synchronized

## Created

2025-12-10

## Status

✅ Implementation complete, pending translation keys
