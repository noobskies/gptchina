# Model Pricing Display Feature

## Overview

This feature displays the current model's pricing information (input/output rates) on the landing page below the greeting message.

## Purpose

Provides users with immediate visibility into the cost of using different AI models, helping them make informed decisions about model selection.

## Upstream Integration

### Integration Type

- **Pattern**: Plugin + Minimal Modifications
- **Modified Files**: 2 upstream files (api/server/index.js, client/src/components/Chat/Landing.tsx)
- **Upstream Version**: v0.8.1-rc1 (commit: 63ed3a35)
- **Update Strategy**: Watch for changes to Landing.tsx and route registration patterns

### Modified Upstream Files

1. **api/server/index.js**

   - **Lines**: ~5 lines added
   - **Reason**: Register custom pricing API route
   - **Impact**: Low (isolated route registration)
   - **Pattern**: Following existing custom route pattern

2. **client/src/components/Chat/Landing.tsx**
   - **Lines**: ~20 lines added
   - **Reason**: Display model pricing below greeting
   - **Impact**: Low (isolated UI addition)
   - **Pattern**: Follows existing component structure

## API Endpoints

### GET /api/custom/pricing/model/:modelName

Returns pricing information for a specific model.

**Parameters:**

- `modelName` (path) - The model identifier (e.g., "gpt-4.1")
- `endpoint` (query, optional) - The endpoint name for context

**Response:**

```json
{
  "model": "gpt-4.1",
  "pricing": {
    "prompt": 2.0,
    "completion": 8.0
  },
  "unit": "USD per 1M tokens"
}
```

**Error Response:**

```json
{
  "model": "unknown-model",
  "pricing": null,
  "message": "Pricing not available for this model"
}
```

## Frontend Integration

### React Hook

```typescript
import { usePricing } from '~/custom/features/model-pricing/client';

// In component
const { pricing, isLoading, error } = usePricing(modelName);

// pricing = { prompt: 2.0, completion: 8.0 } | null
```

### Display Format

```
Good afternoon, Tyler John McNew

Model: gpt-4.1
Input: 2.00 | Output: 8.00
```

## Data Source

- Backend uses `api/models/tx.js` (`tokenValues` object)
- No data duplication - single source of truth
- Pricing updates automatically when tx.js is modified

## Configuration

No configuration needed. Feature works out of the box once routes are registered.

## Testing

### Manual Testing

1. Start dev server
2. Log in and navigate to landing page
3. Select different models from dropdown
4. Verify pricing updates correctly
5. Test with model that has no pricing data

### Test Cases

- Model with pricing → Shows rates
- Model without pricing → Shows "Pricing unavailable"
- No model selected → No pricing displayed
- Model changes → Pricing updates

## Dependencies

### Backend

- `api/models/tx.js` - Source of pricing data
- Express router

### Frontend

- React hooks (useState, useEffect)
- Existing data-provider patterns

## Error Handling

- API errors → Gracefully hide pricing display
- Missing pricing data → Show "Pricing unavailable" or hide
- Network errors → Silent fail, no pricing shown
- Invalid model names → Return null pricing

## Performance

- Lightweight API call (~1KB response)
- No caching needed (pricing rarely changes during session)
- Lazy loading - only fetches when model is selected

## Future Enhancements

- [ ] Add caching to reduce API calls
- [ ] Show pricing in token purchase modal
- [ ] Add pricing comparison view
- [ ] Include estimated costs for conversation
- [ ] Show cache pricing (for Anthropic models)

## Maintenance Notes

### When tx.js Changes

No action needed - API automatically serves updated pricing.

### When Upstream Updates Landing.tsx

1. Review changes for conflicts
2. Re-apply custom pricing display code
3. Test functionality
4. Update this README if integration pattern changes

## Known Issues

None currently.

## Related Features

- Claim Tokens (`custom/features/claim-tokens/`)
- Buy Tokens (`custom/features/buy-tokens/`)

---

**Created**: 2025-11-09  
**Last Updated**: 2025-11-09  
**Upstream Impact**: Low (2 files, ~25 lines)
