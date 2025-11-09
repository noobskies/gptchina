# Custom Modifications to Upstream Files

This document tracks all modifications made to upstream LibreChat files to support custom features in the gptchina fork.

## Modified Files

### eslint.config.mjs

- **Lines**: 376-387 (added new configuration block at end of config array)
- **Reason**: Configure ESLint to properly lint custom TypeScript files in `custom/` directory
- **Upstream Version**: v0.8.1-rc1 (commit: ba71375)
- **Impact**: Low (isolated addition, doesn't modify existing rules)
- **Alternative Considered**: Modifying client/tsconfig.json to include custom files (rejected to maintain fork-friendly separation)
- **Change Description**:
  ```javascript
  {
    // CUSTOM: gptchina - Custom features TypeScript configuration
    files: ['./custom/**/*.ts', './custom/**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        project: './custom/tsconfig.json',
      },
    },
  }
  ```

## New Files (Not Modifying Upstream)

### custom/tsconfig.json

- **Purpose**: TypeScript configuration for custom features
- **Extends**: `../client/tsconfig.json`
- **Reason**: Provides type checking for custom TypeScript code without modifying upstream configs
- **Impact**: None on upstream code
- **Includes**: All TypeScript files in `custom/features/**/client/` and `custom/features/**/shared/`

## Merge Strategy

When syncing with upstream:

### For eslint.config.mjs

1. Check if upstream modified the end of the config array
2. If yes, review changes for compatibility with custom block
3. Ensure custom block remains at the end of the array
4. If upstream added new TypeScript config blocks, verify no conflicts with custom block
5. Test ESLint on custom files after merge

### For custom/tsconfig.json

- No merge conflicts possible (custom file only)
- If `client/tsconfig.json` is updated upstream, review for needed changes
- Verify `extends` still works after upstream updates

## Testing After Merge

```bash
# Test ESLint on custom files
npx eslint custom/**/*.tsx

# Test TypeScript compilation
npx tsc --project custom/tsconfig.json --noEmit

# Run full linting
npm run lint
```

## History

### 2025-11-09: Initial ESLint/TypeScript Setup for Custom Code

**Problem**: ESLint was unable to parse custom TypeScript files in `custom/features/buy-tokens/client/` because:

- `client/tsconfig.json` only includes files under `client/src/`
- ESLint was trying to use `client/tsconfig.json` for all `**/*.ts` and `**/*.tsx` files

**Solution**:

1. Created `custom/tsconfig.json` extending `client/tsconfig.json` with proper React/JSX settings
2. Added new ESLint configuration block specifically for `custom/**/*.ts` and `custom/**/*.tsx` files
3. Configuration follows fork-friendly principles by isolating custom code

**Files Modified**:

- `eslint.config.mjs` - Added 12 lines (new config block)

**Files Created**:

- `custom/tsconfig.json` - New file (18 lines)

**Verification**:

- ✅ ESLint runs without errors on custom TypeScript files
- ✅ TypeScript compiler recognizes React JSX syntax
- ✅ No modifications to upstream TypeScript configurations
- ✅ Maintains separation between custom and upstream code
  **Upstream Version at Modification**: v0.8.1-rc1 (commit: c31777b)

**Feature**: Claim Tokens (enables @custom alias for all custom features)

#### Lines Modified

- **Lines**: resolve.alias section
- **Type**: Addition (2 lines)

#### Reason for Modification

Add Vite alias `@custom` to resolve imports from the root `custom/` directory. This allows frontend code to import custom features without complex relative paths.

#### Modification Impact

**Impact Level**: Low

**Explanation**:

- **Functionality**: Enables clean imports for custom features
- **Performance**: No performance impact (build-time resolution)
- **Security**: No security implications
- **Compatibility**: Alias addition is non-breaking

#### Code Changes

```typescript
// CUSTOM: gptchina - Claim Tokens feature - alias for custom folder
'@custom': path.resolve(__dirname, '../custom'),
```

#### Update Strategy

When upstream updates vite.config.ts, re-add alias to the resolve.alias object.

---

### 3. client/src/components/Nav/Nav.tsx

**Status**: 🟢 Stable

**Modified Date**: 2025-11-09

**Last Reviewed**: 2025-11-09

**Upstream Version at Modification**: v0.8.1-rc1 (commit: c31777b)

**Feature**: Claim Tokens

#### Lines Modified

- **Lines**: Import section and JSX section
- **Type**: Addition (4 lines total)

#### Reason for Modification

Integrate ClaimTokensButton component into the navigation sidebar above the AccountSettings component.

#### Modification Impact

**Impact Level**: Low

**Explanation**:

- **Functionality**: Adds new UI element without affecting existing navigation
- **Performance**: Lazy loaded, minimal impact
- **Security**: No security implications
- **Compatibility**: Uses existing Suspense pattern, well-isolated

#### Code Changes

```typescript
// Import section
// CUSTOM: gptchina - Claim Tokens feature
const ClaimTokensButton = lazy(() => import('@custom/features/claim-tokens/client'));

// JSX section (before AccountSettings)
{/* CUSTOM: gptchina - Claim Tokens feature */}
<Suspense fallback={null}>
  <ClaimTokensButton />
</Suspense>
```

#### Update Strategy

When upstream updates Nav.tsx, re-add ClaimTokensButton import and render it before AccountSettings.

---

### 4. packages/data-schemas/src/schema/balance.ts

**Status**: 🟢 Stable

**Modified Date**: 2025-11-09

**Last Reviewed**: 2025-11-09

**Upstream Version at Modification**: v0.8.1-rc1 (commit: c31777b)

**Feature**: Claim Tokens

#### Lines Modified

- **Lines**: After refillAmount field
- **Type**: Addition (7 lines)

#### Reason for Modification

Add `lastTokenClaim` field to Balance schema to track when user last claimed free tokens, enabling 24-hour cooldown enforcement.

#### Modification Impact

**Impact Level**: Low

**Explanation**:

- **Functionality**: Adds new field without affecting existing balance functionality
- **Performance**: No performance impact (optional field)
- **Security**: No security implications
- **Compatibility**: Default value of null makes this non-breaking for existing records

#### Code Changes

```typescript
// CUSTOM: gptchina - Claim Tokens feature
// Timestamp of last manual token claim (24-hour cooldown)
lastTokenClaim: {
  type: Date,
  default: null,
},
```

#### Update Strategy

When upstream updates balance schema, re-add lastTokenClaim field at the end of the schema.

---

### 5. packages/data-schemas/src/types/balance.ts

**Status**: 🟢 Stable

**Modified Date**: 2025-11-09

**Last Reviewed**: 2025-11-09

**Upstream Version at Modification**: v0.8.1-rc1 (commit: c31777b)

**Feature**: Claim Tokens

#### Lines Modified

- **Lines**: IBalance interface
- **Type**: Addition (2 lines)

#### Reason for Modification

Add TypeScript type for `lastTokenClaim` field to match the schema addition.

#### Modification Impact

**Impact Level**: Low

**Explanation**:

- **Functionality**: Type-safety for new field
- **Performance**: No runtime impact (compile-time only)
- **Security**: No security implications
- **Compatibility**: Optional field, non-breaking

#### Code Changes

```typescript
// CUSTOM: gptchina - Claim Tokens feature
lastTokenClaim?: Date | null;
```

#### Update Strategy

When upstream updates IBalance interface, re-add lastTokenClaim field at the end.

---

## Modification Template

When modifying an upstream file, document it here immediately:

### [File Path]

**Status**: 🟢 Stable / 🟡 Needs Review / 🔴 High Risk / ⚪ Temporary

**Modified Date**: [Date]

**Last Reviewed**: [Date]

**Upstream Version at Modification**: [Version/Commit]

#### Lines Modified

- **Lines**: [Specific line numbers or ranges]
- **Type**: Addition / Modification / Deletion / Wrap

#### Reason for Modification

[Detailed explanation of why this modification was necessary]

#### Modification Impact

**Impact Level**: None / Low / Medium / High

**Explanation**:

- **Functionality**: [How it affects functionality]
- **Performance**: [Any performance implications]
- **Security**: [Any security considerations]
- **Compatibility**: [Upstream compatibility concerns]

#### Alternative Approaches Considered

1. **[Alternative 1]**

   - **Pros**: [Benefits]
   - **Cons**: [Drawbacks]
   - **Rejected Because**: [Reason]

2. **[Alternative 2]**
   - **Pros**: [Benefits]
   - **Cons**: [Drawbacks]
   - **Rejected Because**: [Reason]

#### Code Changes

**Before** (Original Upstream Code):

```javascript
// Original upstream code
function originalFunction() {
  // ...
}
```

**After** (Modified Code):

```javascript
// CUSTOM: gptchina - START MODIFICATION
// Reason: [Brief reason]
// Upstream version: v0.8.1-rc1 (commit: ba71375)
// Impact: Low
// Update strategy: [Strategy]

function originalFunction() {
  // Custom code here
  customFeatureInit();

  // Original code
  // ...
}

// CUSTOM: gptchina - END MODIFICATION
```

#### Update Strategy

[Detailed strategy for handling upstream changes to this file]

**When Upstream Updates This File**:

1. [Step 1]
2. [Step 2]
3. [Step 3]

**Automated Checks**:

- [ ] Automated test: `custom/__tests__/modifications/[file-name].test.js`
- [ ] CI/CD check: Verifies modification still valid
- [ ] Documentation: Updated in this file

#### Dependencies

**Custom Features Depending on This**:

- [Feature 1]: [How it depends on this modification]
- [Feature 2]: [How it depends on this modification]

**Upstream Code This Depends On**:

- [Upstream function/module]: [How this modification depends on it]

#### Refactoring Plan

**Goal**: [Describe ideal state without this modification]

**Blockers**:

- [What prevents removing this modification]

**Steps to Remove**:

1. [Step 1]
2. [Step 2]

**Timeline**: [When this might be refactored]

---

## Example Modifications

Below are examples of how to document modifications. Remove these once real modifications are added.

### Example 1: api/server/index.js

**Status**: 🟢 Stable

**Modified Date**: 2025-11-09

**Last Reviewed**: 2025-11-09

**Upstream Version at Modification**: v0.8.1-rc1 (commit: ba71375)

#### Lines Modified

- **Lines**: 45-52
- **Type**: Addition

#### Reason for Modification

Need to register custom plugin system that loads and initializes custom features from the `custom/` directory. This is the application entry point and is the most appropriate place to initialize custom features without modifying individual routes or controllers.

#### Modification Impact

**Impact Level**: Low

**Explanation**:

- **Functionality**: Adds plugin system initialization without affecting existing functionality
- **Performance**: Minimal impact (one-time init at startup)
- **Security**: No security implications (plugins loaded from trusted source)
- **Compatibility**: Uses stable Express middleware pattern, unlikely to break

#### Alternative Approaches Considered

1. **Separate entry point file**

   - **Pros**: No modification to upstream file
   - **Cons**: More complex startup sequence, harder to maintain
   - **Rejected Because**: Added complexity outweighs benefit of avoiding this minimal change

2. **Modify each route file individually**

   - **Pros**: More granular control
   - **Cons**: Would require modifying many upstream files instead of one
   - **Rejected Because**: Would increase modification surface area significantly

3. **Use Express middleware late in the chain**
   - **Pros**: Could be done without file modification via environment setup
   - **Cons**: Features would load too late in the request cycle
   - **Rejected Because**: Some custom features need early initialization

#### Code Changes

**Before**:

```javascript
// api/server/index.js - line 45
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
```

**After**:

```javascript
// api/server/index.js - line 45
const app = express();

// CUSTOM: gptchina - START MODIFICATION
// Reason: Initialize custom plugin system for fork features
// Upstream version: v0.8.1-rc1 (commit: ba71375)
// Impact: Low (isolated plugin init)
// Update strategy: Monitor upstream changes to server initialization
import { loadCustomPlugins } from '../custom/loader.js';
const customPlugins = loadCustomPlugins();
customPlugins.forEach((plugin) => plugin.init(app));
// CUSTOM: gptchina - END MODIFICATION

// Middleware setup
app.use(cors());
app.use(express.json());
```

#### Update Strategy

**When Upstream Updates This File**:

1. Check if server initialization flow changed
2. Verify plugin init still occurs before middleware setup
3. Test all custom features still initialize correctly
4. Update modification if needed

**Automated Checks**:

- [x] Automated test: `custom/__tests__/modifications/server-init.test.js`
- [x] CI/CD check: Verifies custom plugins load correctly
- [x] Documentation: Updated in this file

#### Dependencies

**Custom Features Depending on This**:

- All plugins in `custom/features/`: Rely on plugin loader initialization
- Custom middleware: Requires plugins to be loaded first

**Upstream Code This Depends On**:

- Express app initialization: Must happen after `app = express()` but before middleware
- Environment variables: Uses NODE_ENV to determine plugin loading

#### Refactoring Plan

**Goal**: Eliminate this modification by using Express's native plugin/extension mechanism if one becomes available.

**Blockers**:

- Express doesn't have native plugin system
- Would need upstream to add extension points

**Steps to Remove**:

1. Wait for upstream to add plugin system support
2. Migrate custom features to use official plugin API
3. Remove this modification

**Timeline**: Not planned - this is a minimal, stable modification

---

### Example 2: client/src/App.tsx

**Status**: 🟢 Stable

**Modified Date**: 2025-11-09

**Last Reviewed**: 2025-11-09

**Upstream Version at Modification**: v0.8.1-rc1 (commit: ba71375)

#### Lines Modified

- **Lines**: 23-25
- **Type**: Wrap

#### Reason for Modification

Need to wrap the upstream App component with CustomFeatureProvider to inject custom React context for fork-specific features. This provides custom features access to React context without prop drilling.

#### Modification Impact

**Impact Level**: Low

**Explanation**:

- **Functionality**: Wraps existing app without changing its behavior
- **Performance**: Negligible (one React context provider)
- **Security**: No security implications
- **Compatibility**: Uses standard React pattern, highly compatible

#### Alternative Approaches Considered

1. **Higher-Order Component (HOC)**

   - **Pros**: No modification to App.tsx
   - **Cons**: More complex, harder to debug
   - **Rejected Because**: Context provider is cleaner and more maintainable

2. **Modify root index file**
   - **Pros**: Keeps App.tsx unchanged
   - **Cons**: Would need to duplicate App import and wrapping logic
   - **Rejected Because**: This modification is more straightforward

#### Code Changes

**Before**:

```tsx
// client/src/App.tsx - line 23
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
```

**After**:

```tsx
// client/src/App.tsx - line 23
// CUSTOM: gptchina - Load custom features
import { CustomFeatureProvider } from './custom/providers/CustomFeatureProvider';

function App() {
  return (
    <CustomFeatureProvider>
      <Router>
        <AppContent />
      </Router>
    </CustomFeatureProvider>
  );
}
```

#### Update Strategy

**When Upstream Updates This File**:

1. Check if App component structure changed
2. Verify CustomFeatureProvider can still wrap the app
3. Test custom features still have access to context
4. Reposition wrapper if needed

**Automated Checks**:

- [x] Automated test: `custom/__tests__/modifications/app-wrapper.test.tsx`
- [x] CI/CD check: Verifies custom context provider works
- [x] Documentation: Updated in this file

#### Dependencies

**Custom Features Depending on This**:

- All React custom features: Use CustomFeatureProvider for context
- Custom hooks: Access context provided by this wrapper

**Upstream Code This Depends On**:

- App component: Must exist and accept wrapping
- React Router: Our wrapper must work with routing

#### Refactoring Plan

**Goal**: Use upstream plugin system if React plugin architecture is added.

**Blockers**:

- No upstream React plugin system exists
- Context wrapping is standard React pattern

**Steps to Remove**:

1. Wait for upstream to add React plugin support
2. Migrate to official plugin API
3. Remove wrapper

**Timeline**: Not planned - this is a minimal, stable modification

---

## Modifications by Category

### Critical Path Modifications

[List modifications in critical code paths]

### Configuration Modifications

[List modifications to configuration files]

### UI/Frontend Modifications

[List modifications to frontend code]

### API/Backend Modifications

[List modifications to backend code]

### Build/Deployment Modifications

[List modifications to build or deployment scripts]

---

## Merge Conflict Risk Assessment

### High Risk Files

Files most likely to cause merge conflicts:

1. [File name] - [Why it's high risk]
2. [File name] - [Why it's high risk]

### Medium Risk Files

1. [File name] - [Why it's medium risk]
2. [File name] - [Why it's medium risk]

### Low Risk Files

1. [File name] - [Why it's low risk]
2. [File name] - [Why it's low risk]

---

## Upstream Sync History

### [Date] - Sync to v[version]

**Status**: Success / Conflicts / In Progress

**Modified Files Affected**:

- [File 1]: [Impact]
- [File 2]: [Impact]

**Actions Taken**:

1. [Action 1]
2. [Action 2]

**Issues Encountered**:

- [Issue 1 and resolution]
- [Issue 2 and resolution]

**Documentation Updates**:

- [ ] Updated modification entries above
- [ ] Updated upstream version references
- [ ] Updated refactoring plans
- [ ] Tested all custom features

---

## Refactoring Roadmap

### Short Term (1-3 months)

**Goal**: [Overall goal]

**Modifications to Address**:

1. [Modification 1] - [Plan]
2. [Modification 2] - [Plan]

### Medium Term (3-6 months)

**Goal**: [Overall goal]

**Modifications to Address**:

1. [Modification 1] - [Plan]
2. [Modification 2] - [Plan]

### Long Term (6+ months)

**Goal**: [Overall goal]

**Modifications to Address**:

1. [Modification 1] - [Plan]
2. [Modification 2] - [Plan]

---

## Best Practices

1. **Document Immediately**: Add modifications to this file the moment they're made
2. **Explain Thoroughly**: Include detailed rationale and alternatives considered
3. **Mark Clearly**: Use consistent code comments (see `custom/README.md`)
4. **Test Coverage**: Add tests that verify modifications still work
5. **Review Regularly**: Schedule periodic reviews of all modifications
6. **Plan Refactoring**: Always have a plan to reduce or eliminate modifications
7. **Assess Risk**: Understand which modifications are most likely to conflict

---

**Last Updated**: 2025-11-09

**Next Review**: [Schedule review date]

**Reviewer**: [Name/Team]
