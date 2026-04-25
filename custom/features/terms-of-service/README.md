# Terms of Service Feature

## Overview

Comprehensive terms of service page accessible at `/terms-of-service` outlining user agreements, responsibilities, and legal terms for using GPT China platform.

## Purpose

Provides legally compliant terms of service with:

- Clear acceptance requirements
- Account registration policies
- Token system and payment terms
- Acceptable use policy
- User content and IP rights
- Service availability disclaimers
- Third-party service disclosure
- Warranty disclaimers
- Liability limitations
- Termination policies
- Dispute resolution procedures
- Contact information

## Features

- **Full i18n Support**: English + Simplified Chinese
- **Theme-Aware Design**: Adapts to light/dark mode
- **Responsive Layout**: Works on all device sizes
- **Accessible**: Proper heading hierarchy and semantic HTML
- **Clear Structure**: 11 comprehensive sections

## Route

```
https://gptchina.io/terms-of-service
```

## Implementation

### Files Created

- `client/TermsOfServicePage.tsx` - Main page component
- `client/index.tsx` - Barrel export

### Route Registration

Added to `client/src/routes/index.tsx`:

```typescript
{
  path: 'terms-of-service',
  element: <TermsOfServicePage />,
  errorElement: <RouteErrorBoundary />,
}
```

### Translation Keys

Added ~72 translation keys following pattern:

- `com_custom_terms_[section]_[content]`
- Examples: `com_custom_terms_title`, `com_custom_terms_acceptance_intro`, `com_custom_terms_tokens_nonrefundable_content`

## Sections

1. **Introduction & Acceptance** - Agreement overview, binding terms, age requirement
2. **Account Registration** - User responsibilities for account management
3. **Token System & Payments** - Purchase, usage, pricing, non-refundable policy
4. **Acceptable Use Policy** - Prohibited activities (10 specific items)
5. **User Content & IP** - Ownership rights, licenses, platform IP
6. **Service Availability** - Uptime disclaimers, maintenance, modifications
7. **Third-Party Services** - AI providers, payment processors, external links
8. **Disclaimer of Warranties** - "As-is" service disclaimer
9. **Limitation of Liability** - Damage caps, exclusions
10. **Termination & Suspension** - User and platform termination rights
11. **Dispute Resolution & Contact** - Governing law, arbitration, contact info

## Design Patterns

- Card-based sections with subtle borders
- Clean typography with proper hierarchy
- Blue accent for links and highlights
- Red accent for critical warnings (non-refundable policy)
- Theme-aware colors using LibreChat design tokens
- Maximum width 5xl for readability
- Proper spacing and padding

## Key Legal Points

### Critical Terms

- **Age Requirement**: 13+ years old (matches Privacy Policy)
- **Non-Refundable**: All token purchases are final (highlighted with red border)
- **No Warranties**: Service provided "as-is"
- **Liability Cap**: Lesser of amount paid in last 12 months or $100 USD
- **Termination**: Platform can suspend/delete accounts for any reason
- **Governing Law**: Jurisdiction where GPT China operates
- **Contact**: support@gptchina.io

### Important Highlights

1. **Token Policy** - Clearly states non-refundable nature with visual emphasis
2. **Account Security** - User responsible for all account activity
3. **Prohibited Uses** - 10 specific prohibited activities listed
4. **AI Output Disclaimer** - User responsible for verifying AI-generated content
5. **Free Token Claims** - May be modified or discontinued without notice

## Upstream Impact

**None** - Completely isolated in `custom/features/terms-of-service/`

## Fork-Friendly

- No upstream file modifications (except route registration)
- Self-contained feature
- Clear CUSTOM markers
- Follows established patterns

## Customization

To update content:

1. Modify translation keys in `client/src/locales/en/translation.json`
2. Update Chinese translations in `client/src/locales/zh-Hans/translation.json`
3. Adjust sections in `TermsOfServicePage.tsx` if needed

To change contact information:

- Update email address in Contact Us section (currently `support@gptchina.io`)
- Update website URL (currently `https://gptchina.io`)

To change governing law/jurisdiction:

- Update `com_custom_terms_dispute_law_desc` key with specific jurisdiction
- Update `com_custom_terms_dispute_jurisdiction_desc` with court location

## Testing Checklist

- [ ] Page loads at `/terms-of-service`
- [ ] All sections render correctly
- [ ] Language switching works (EN ↔ ZH)
- [ ] Links are clickable (email, website)
- [ ] Dark/light mode displays properly
- [ ] Mobile responsive layout
- [ ] No console errors
- [ ] All translation keys exist
- [ ] Red warning box displays for non-refundable policy

## Legal Considerations

⚠️ **IMPORTANT**: This terms of service is a template and **MUST be reviewed by legal counsel** to ensure compliance with:

- Local laws and regulations (China, US, EU, etc.)
- E-commerce and consumer protection laws
- Data protection regulations (GDPR, CCPA)
- Platform liability requirements
- Specific industry regulations

### Legal Review Checklist

- [ ] Verify governing law jurisdiction is correct
- [ ] Confirm dispute resolution mechanism is appropriate
- [ ] Review liability limitations for local compliance
- [ ] Validate age requirements
- [ ] Ensure payment terms comply with local laws
- [ ] Check acceptable use policy is comprehensive
- [ ] Verify IP ownership clauses
- [ ] Review termination terms
- [ ] Confirm warranty disclaimers are enforceable

Update the "Last Updated" date when making changes.

## Maintenance

- Review terms annually
- Update when adding new features that affect user agreements
- Notify users of material changes (via email or platform notice)
- Keep translations synchronized
- Maintain consistency with Privacy Policy

## Related Features

- **Privacy Policy** (`/privacy-policy`) - Companion legal document
- **Buy Tokens** - Referenced in Token System section
- **Claim Tokens** - Referenced in Token System section

## Created

2025-12-10

## Status

✅ Implementation complete with full i18n support (English + Chinese)

⚠️ Requires legal review before production deployment
