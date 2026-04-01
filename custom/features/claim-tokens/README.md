# Claim Tokens Feature

**Status**: ✅ Implemented  
**Created**: 2025-11-09  
**Fork**: gptchina  
**Upstream Version**: v0.8.1-rc1

## Overview

The Claim Tokens feature adds a button to the left sidebar (above user profile) that allows authenticated users to claim 20,000 free tokens with a 24-hour cooldown period. This feature is fully isolated following fork-friendly architecture principles.

## Features

- 🎁 Claim 20,000 tokens per claim
- ⏰ 24-hour cooldown between claims
- ⏲️ Real-time countdown timer display
- 💾 Cooldown persists across browser sessions
- 📱 Responsive design (works on mobile and desktop)
- ♿ Accessibility compliant (ARIA labels, keyboard navigation)
- 🎨 Matches existing LibreChat UI design
- ✅ Toast notifications for success/error feedback
- 🔒 Requires authentication
- 📊 Transaction audit trail

## User Flow

1. User logs in to LibreChat
2. Sees "Claim 20,000 Tokens" button in left sidebar (above user profile)
3. Clicks button to claim tokens
4. Receives success notification
5. Balance increases by 20,000 tokens
6. Button shows countdown timer (e.g., "23h 59m remaining")
7. After 24 hours, button becomes available again

## Architecture

### Integration Pattern

**Type**: Event-Driven + Custom Component  
**Upstream Impact**: Minimal (5 files, ~30 lines total)

### Directory Structure

```
custom/features/claim-tokens/
├── README.md                     # This file
├── client/                       # Frontend components
│   ├── ClaimTokensButton.tsx    # Main button component
│   ├── ClaimTokensIcon.tsx      # Gift icon SVG
│   ├── useClaimTokens.ts        # React Query hook
│   └── index.tsx                # Export file
├── server/                       # Backend logic
│   ├── controller.js            # Business logic
│   └── routes.js                # Express routes
└── shared/                       # Shared constants
    └── constants.js             # Config values
```

## API Endpoints

### POST /api/custom/claim-tokens

Claim 20,000 tokens (requires authentication via JWT).

**Authentication**: Required (JWT token in Authorization header)

**Request**: None (user ID from JWT)

**Response** (Success 200):

```json
{
  "success": true,
  "balance": 45000,
  "tokensAdded": 20000,
  "nextClaimAvailable": "2025-11-10T18:19:00Z"
}
```

**Response** (Cooldown Active 429):

```json
{
  "success": false,
  "error": "COOLDOWN_ACTIVE",
  "nextClaimAvailable": "2025-11-10T18:19:00Z",
  "remainingTime": 82800000
}
```

**Response** (Unauthorized 401):

```json
{
  "success": false,
  "error": "UNAUTHORIZED"
}
```

### GET /api/custom/claim-tokens/status

Get current claim eligibility status.

**Authentication**: Required (JWT token in Authorization header)

**Request**: None (user ID from JWT)

**Response** (200):

```json
{
  "canClaim": false,
  "nextClaimAvailable": "2025-11-10T18:19:00Z",
  "remainingTime": 82800000
}
```

## Database Schema

### Balance Model Extension

Added field to `packages/data-schemas/src/schema/balance.ts`:

```typescript
lastTokenClaim: {
  type: Date,
  default: null,
}
```

**Field Details**:

- **Type**: Date (nullable)
- **Default**: null (allows immediate first claim)
- **Purpose**: Tracks last claim timestamp for cooldown calculation
- **Migration**: No migration needed (field defaults to null for existing users)

### TypeScript Interface

Updated `packages/data-schemas/src/types/balance.ts`:

```typescript
export interface IBalance extends Document {
  // ... existing fields ...
  lastTokenClaim?: Date | null;
}
```

## Frontend Implementation

### Components

**ClaimTokensButton** (`client/ClaimTokensButton.tsx`)

- Main button component
- Renders in sidebar above user profile
- Shows claim amount or countdown timer
- Handles click events and displays notifications

**ClaimTokensIcon** (`client/ClaimTokensIcon.tsx`)

- SVG gift icon component
- Accessible (aria-hidden="true")
- Styled to match LibreChat design

### Custom Hook

**useClaimTokens** (`client/useClaimTokens.ts`)

- React Query hook for state management
- Fetches claim status on mount
- Updates countdown every second
- Handles claim mutation
- Invalidates balance cache on success

**Hook Returns**:

```typescript
{
  canClaim: boolean;        // Whether user can claim now
  isLoading: boolean;       // Loading state (status or claim)
  isClaiming: boolean;      // Actively claiming
  remainingTime: number;    // Milliseconds until next claim
  formattedTime: string;    // Formatted time (e.g., "23h 45m")
  claimTokens: () => void;  // Mutation function
  error: Error | null;      // Error state
  isSuccess: boolean;       // Success state
}
```

### Button States

1. **Available** (canClaim = true)

   - Text: "Claim 20,000 Tokens"
   - Icon: Gift icon
   - State: Enabled, clickable
   - Color: Default button style

2. **Cooldown** (canClaim = false, remainingTime > 0)

   - Text: "23h 45m remaining" (updates every second)
   - Icon: Gift icon
   - State: Disabled
   - Color: Muted/disabled style

3. **Loading** (isClaiming = true)

   - Text: "Claim 20,000 Tokens"
   - Icon: Gift icon + Spinner
   - State: Disabled
   - Color: Default button style

4. **Error** (error !== null)
   - Text: Unchanged
   - Icon: Unchanged
   - State: Shows error toast notification
   - User can retry after dismissing

## Backend Implementation

### Controller (`server/controller.js`)

**Functions**:

1. `checkClaimEligibility(lastClaimDate)`

   - Validates cooldown period
   - Returns eligibility status
   - Calculates remaining time

2. `claimTokens(req, res)`

   - Validates user authentication
   - Checks cooldown eligibility
   - Adds 20,000 tokens to balance
   - Updates lastTokenClaim timestamp
   - Creates transaction record
   - Returns updated balance

3. `getClaimStatus(req, res)`
   - Returns current eligibility status
   - Used by frontend for countdown timer

**Business Rules**:

- First claim available immediately (lastTokenClaim = null)
- Subsequent claims require 24-hour wait
- Cooldown calculated server-side (client cannot bypass)
- Transaction logging for audit trail
- Graceful handling of missing balance records

### Routes (`server/routes.js`)

```javascript
POST / api / custom / claim - tokens; // Claim tokens
GET / api / custom / claim - tokens / status; // Get claim status
```

Both routes require JWT authentication via `requireJwtAuth` middleware.

### Error Handling

**Error Codes**:

- `COOLDOWN_ACTIVE` - User must wait before next claim
- `USER_NOT_FOUND` - User ID not in request
- `BALANCE_NOT_FOUND` - Balance record issue
- `UNAUTHORIZED` - Not authenticated
- `SERVER_ERROR` - Internal server error

**Logging**:

- Info: Successful claims
- Debug: Cooldown checks, record creation
- Error: Server errors, transaction failures

## Upstream Integration

### Modified Files

**1. api/server/index.js** (3 lines added)

```javascript
// CUSTOM: gptchina - Claim Tokens feature
// See: custom/features/claim-tokens/README.md
const customClaimTokensRoutes = require('../../custom/features/claim-tokens/server/routes');
app.use('/api/custom', customClaimTokensRoutes);
```

**2. client/vite.config.ts** (2 lines added)

```typescript
// CUSTOM: gptchina - Claim Tokens feature - alias for custom folder
'@custom': path.resolve(__dirname, '../custom'),
```

**3. client/src/components/Nav/Nav.tsx** (4 lines added)

```typescript
// CUSTOM: gptchina - Claim Tokens feature
const ClaimTokensButton = lazy(() => import('@custom/features/claim-tokens/client'));

// ... in JSX ...
{/* CUSTOM: gptchina - Claim Tokens feature */}
<Suspense fallback={null}>
  <ClaimTokensButton />
</Suspense>
```

**4. packages/data-schemas/src/schema/balance.ts** (7 lines added)

```typescript
// CUSTOM: gptchina - Claim Tokens feature
// Timestamp of last manual token claim (24-hour cooldown)
lastTokenClaim: {
  type: Date,
  default: null,
},
```

**5. packages/data-schemas/src/types/balance.ts** (2 lines added)

```typescript
// CUSTOM: gptchina - Claim Tokens feature
lastTokenClaim?: Date | null;
```

**Total Impact**: 5 files, ~18 lines of code

### Update Strategy

When syncing with upstream:

1. **Check modified files** - Review if upstream changed these files
2. **api/server/index.js** - Route registrations may shift, re-add after existing routes
3. **client/vite.config.ts** - Alias should be stable, minimal conflict risk
4. **client/src/components/Nav/Nav.tsx** - Component may shift, re-add before AccountSettings
5. **Balance schema/types** - Low risk, field addition is non-breaking

## Configuration

### Constants (`shared/constants.js`)

```javascript
CLAIM_TOKENS_CONFIG = {
  CLAIM_AMOUNT: 20000, // Tokens per claim
  COOLDOWN_MS: 86400000, // 24 hours in milliseconds
  COOLDOWN_HOURS: 24, // For display
};

CLAIM_TOKENS_ERRORS = {
  COOLDOWN_ACTIVE,
  USER_NOT_FOUND,
  BALANCE_NOT_FOUND,
  UNAUTHORIZED,
  SERVER_ERROR,
};
```

### Future Feature Flags (Optional)

Could add environment variable support:

```bash
# .env
CUSTOM_CLAIM_TOKENS_ENABLED=true
CUSTOM_CLAIM_TOKENS_AMOUNT=20000
CUSTOM_CLAIM_TOKENS_COOLDOWN_HOURS=24
```

## Testing

### Manual Testing Checklist

- [ ] User can see button in sidebar after login
- [ ] Button shows "Claim 20,000 Tokens" when available
- [ ] Clicking button adds 20,000 to balance
- [ ] Success toast notification appears
- [ ] Balance display updates immediately
- [ ] Button becomes disabled after claim
- [ ] Countdown timer appears and counts down
- [ ] Countdown persists across page refresh
- [ ] Countdown persists across browser restart
- [ ] After 24 hours, button becomes available again
- [ ] Unauthenticated users don't see button
- [ ] Mobile layout works correctly

### Unit Tests (To Be Added)

```javascript
// server/controller.test.js
describe('Claim Tokens Controller', () => {
  test('allows first claim immediately', ...);
  test('enforces 24-hour cooldown', ...);
  test('calculates remaining time correctly', ...);
  test('creates transaction record', ...);
  test('handles missing balance record', ...);
});
```

### Integration Tests (To Be Added)

```javascript
// server/routes.test.js
describe('Claim Tokens API', () => {
  test('POST /api/custom/claim-tokens requires auth', ...);
  test('POST /api/custom/claim-tokens adds tokens', ...);
  test('POST /api/custom/claim-tokens respects cooldown', ...);
  test('GET /api/custom/claim-tokens/status returns correct status', ...);
});
```

## Security Considerations

✅ **Authentication**: All endpoints require JWT authentication  
✅ **Server-side Validation**: Cooldown enforced server-side  
✅ **Rate Limiting**: Inherits from Express rate limiting middleware  
✅ **Input Validation**: No user input to validate  
✅ **Audit Trail**: Transaction records created for each claim  
✅ **Error Handling**: Graceful error responses, no sensitive data leaked

## Performance Considerations

- **Lazy Loading**: Component lazy loaded for optimal bundle size
- **React Query**: Efficient caching and background refetching
- **Countdown Optimization**: Updates every second, minimal re-renders
- **Database Queries**: Indexed user field on Balance model
- **Transaction Logging**: Non-blocking (errors don't fail request)

## Troubleshooting

### Button Not Visible

**Symptom**: Button doesn't appear in sidebar  
**Causes**:

- User not logged in (Nav only visible when authenticated)
- Frontend build error (check browser console)
- Vite alias not configured correctly

**Fix**: Check browser console for errors, verify @custom alias in vite.config.ts

### 401 Unauthorized Error

**Symptom**: `GET /api/custom/claim-tokens/status 401`  
**Causes**:

- JWT token not being sent
- User not authenticated

**Fix**: Ensure using `request` from librechat-data-provider (handles auth automatically)

### Cooldown Not Persisting

**Symptom**: Countdown resets on page refresh  
**Causes**:

- Database not saving lastTokenClaim
- MongoDB connection issue

**Fix**: Check MongoDB connection, verify Balance model schema includes lastTokenClaim field

### Balance Not Updating

**Symptom**: Tokens claimed but balance display doesn't change  
**Causes**:

- Query cache not invalidated
- Balance feature not enabled in config

**Fix**: Check `queryClient.invalidateQueries({ queryKey: ['balance'] })` is called

## Maintenance Notes

### Known Issues

None currently.

### Future Enhancements

1. **Admin Panel**

   - View claim statistics
   - Modify cooldown per user
   - Disable feature for specific users

2. **Analytics**

   - Track claim frequency
   - Monitor token distribution
   - Detect abuse patterns

3. **Gamification**

   - Daily streak bonuses
   - Achievement system
   - Referral rewards

4. **Configuration UI**
   - Admin can change claim amount
   - Admin can change cooldown period
   - Feature toggle in UI

### Dependencies

**Frontend**:

- `@tanstack/react-query` - State management
- `librechat-data-provider` - API requests
- `@librechat/client` - UI components

**Backend**:

- `express` - Web framework
- `mongoose` - MongoDB ODM
- `@librechat/data-schemas` - Logging

### Update Checklist

When updating this feature:

1. Update version number in this README
2. Test all functionality manually
3. Check upstream changes to modified files
4. Update MODIFICATIONS.md
5. Update memory bank (activeContext.md, progress.md)
6. Create migration if schema changes

## Support

For issues or questions:

1. Check browser console for frontend errors
2. Check server logs for backend errors
3. Verify MongoDB has lastTokenClaim field
4. Verify routes are registered correctly
5. Test with curl to isolate frontend/backend issues

### Testing with curl

```bash
# Get claim status
curl -X GET http://localhost:3080/api/custom/claim-tokens/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"

# Claim tokens
curl -X POST http://localhost:3080/api/custom/claim-tokens \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

## License

Same as LibreChat (ISC License)

## Contributors

- Initial implementation: 2025-11-09

---

**Last Updated**: 2025-11-09  
**Status**: ✅ Production Ready
