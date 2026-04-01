# AGENTS.md — gptchina

Coding agent rules for `noobskies/gptchina`. Read this before touching anything.

---

## What This Is

This is **gptchina** — a fork of [danny-avila/LibreChat](https://github.com/danny-avila/LibreChat) with custom features for the GPT China platform (https://gptchina.io). Customizations include Stripe/WeChat/Alipay payments, token purchasing, Mandarin i18n, and China-optimized infrastructure.

**Fork strategy**: Minimize upstream modifications. All custom code lives in `custom/`. Every upstream file touched is documented in `custom/MODIFICATIONS.md`.

---

## Scope — What You May Touch

This repo only. Do not modify, reference, or suggest changes to any other repo.

**Protect these — never touch without explicit instruction:**
- `docker-compose.yml`, `deploy-compose.yml` — production infra config
- `librechat.yaml` — runtime configuration (edit only if explicitly asked)
- `.env` — environment variables (read-only for context; do not modify)
- Any MongoDB schema migrations or database seeding logic
- `custom/MODIFICATIONS.md` — update this yourself when you change upstream files

---

## Stack

- **Runtime**: Node.js (CommonJS for `api/`, ES6 modules for `client/`)
- **Backend**: Express 5, MongoDB (Mongoose), Redis, Meilisearch
- **Frontend**: React 18, Vite, Recoil state, Tailwind CSS, headlessui
- **Packages**: npm workspaces — `api/`, `client/`, `packages/*`
- **Auth**: Passport.js (JWT + OAuth2 + SAML + LDAP)
- **Payments**: Stripe (card, WeChat, Alipay, Bitcoin, Google Pay, Apple Pay)
- **Storage**: Firebase (file storage strategy)
- **i18n**: i18next — English + Simplified Chinese (`zh-Hans`) are maintained; always add keys to both
- **Testing**: Jest (backend + frontend unit), Playwright (e2e)

---

## Repo Layout

```
api/                    # Express backend (CommonJS)
  server/
    routes/            # Express route handlers
    middleware/        # Auth, rate limiting, etc.
  models/              # Mongoose models
  strategies/          # Passport.js auth strategies
  lib/                 # Shared server utilities
client/                # React frontend (ES6)
  src/
    components/        # React components
    hooks/             # Custom hooks (camelCase.ts)
    store/             # Recoil atoms/selectors
    utils/             # Client utilities
    locales/           # i18n translation files
      en/translation.json
      zh-Hans/translation.json
    routes/            # React Router routes
packages/              # Shared npm workspace packages
  data-provider/       # Data access layer
  data-schemas/        # Zod schemas + types
  client/              # Shared client logic
  api/                 # Shared API utilities
custom/                # ALL fork-specific code lives here
  features/            # Custom feature implementations
  MODIFICATIONS.md     # Tracks every upstream file change
  README.md
config/                # Utility scripts (add-balance, create-user, etc.)
e2e/                   # Playwright end-to-end tests
```

---

## The Golden Rule: Fork-Friendly Development

**Every change falls into one of two categories:**

### 1. Custom feature (preferred)
Put it in `custom/features/<feature-name>/`. No upstream files touched.

```
custom/features/my-feature/
  README.md          # Required — purpose, integration points, upstream version
  client/            # Frontend components
  server/            # Backend routes/services
  shared/            # Shared types/constants
```

### 2. Upstream modification (unavoidable)
When you must touch an upstream file:

1. Add a comment block around the change:
   ```javascript
   // CUSTOM: gptchina - START [brief reason]
   // Upstream version: v0.8.2-rc2
   // ...your code...
   // CUSTOM: gptchina - END
   ```
2. Add an entry to `custom/MODIFICATIONS.md` documenting: file, lines, reason, upstream version, merge strategy.
3. Keep the change minimal and isolated.

**Never:**
- Make upstream modifications without documenting them in `custom/MODIFICATIONS.md`
- Scatter custom logic across upstream files without the `// CUSTOM: gptchina` markers
- Mix custom and upstream logic in the same function — keep them adjacent and clearly labeled
- Edit upstream files for cosmetic/style reasons — only modify upstream files when functionally required
- Refactor or reorganize upstream code as a side effect of a fix
- Add custom logic inside existing upstream functions if you can wrap them instead

### Preferred Integration Order (most to least merge-safe)

1. **New file in `custom/`** — zero upstream impact, safest
2. **New route/endpoint registered in a custom index** — one-line upstream change
3. **Middleware wrapping** — call upstream, add pre/post logic around it
4. **Event listeners on upstream emitters** — no upstream code touched
5. **Extending upstream config** — spread upstream config, add custom keys
6. **Direct upstream file edit** — last resort; document thoroughly in `custom/MODIFICATIONS.md`

### When an upstream file must be edited

Keep the diff as small as possible. Prefer:
```javascript
// CUSTOM: gptchina - START [reason] (upstream v0.8.2-rc2)
if (process.env.CUSTOM_FEATURE_ENABLED) {
  return customHandler(req, res);
}
// CUSTOM: gptchina - END
```

Over rewriting the surrounding function. The smaller and more localized the change, the easier the upstream merge.

---

## Module System — Critical

| Context | Module system | Example |
|---------|--------------|---------|
| `api/` | **CommonJS** | `module.exports = {}`, `require()` |
| `client/` | **ES6** | `export const`, `import from` |
| `packages/` | Varies — check the package's `package.json` |
| `custom/features/*/server/` | **CommonJS** (loads in api context) |
| `custom/features/*/client/` | **ES6** (loads in client context) |

**Never share files between api and client contexts.** Duplicate constants if needed — one `constants.js` (CJS) for backend, one `types.ts` (ES6) for frontend.

---

## i18n Rules

All user-facing strings must be i18n'd. No hardcoded English or Chinese text in components.

- **Key format**: `com_custom_[feature]_[context]_[specific]`
- **TypeScript bypass**: `(localize as any)('com_custom_...')` — use this for custom keys
- **Variables**: i18next interpolation `{{variable}}`
- **Always add to both**: `client/src/locales/en/translation.json` AND `client/src/locales/zh-Hans/translation.json`

---

## Branch Strategy

- `main` — production (https://gptchina.io)
- Feature branches: `feat/<name>`, `fix/<name>`

**Starting a new task — always worktree from origin/main:**

```bash
git -C ~/workspace/gptchina fetch origin
git -C ~/workspace/gptchina worktree add /tmp/<short-name> -b feat/<name> origin/main
cd /tmp/<short-name>
```

**Never:**
- `git checkout -b` inside an existing worktree (inherits wrong branch state)
- Branch from a local `main` without fetching first
- Branch from another feature branch

**Clean up when done:**
```bash
git -C ~/workspace/gptchina worktree remove /tmp/<short-name>
```

---

## Done When

A task is complete when:
1. `npm run test:api` and `npm run test:client` pass (or unchanged areas don't regress)
2. If frontend changes: `npm run build:client` succeeds (Vite build passes)
3. TypeScript: `npm run typecheck` (in `client/`) passes with zero errors
4. ESLint: `npm run lint:fix` run, no remaining errors
5. Both `en` and `zh-Hans` translation files updated if any new strings added
6. Any upstream files touched are documented in `custom/MODIFICATIONS.md`
7. Commit message uses conventional commits format
8. PR opened against `main`

---

## Commands

```bash
# Backend dev
npm run backend:dev

# Frontend dev
npm run frontend:dev

# Build frontend
npm run frontend

# Build all packages
npm run build:packages

# Tests
npm run test:api              # Backend unit tests (Jest)
npm run test:client           # Frontend unit tests (Jest)
npm run test:all              # All tests

# Type check (run from client/)
cd client && npm run typecheck

# Lint
npm run lint:fix

# e2e (requires running app)
npm run e2e
```

---

## Architecture Patterns

### Backend (api/)

**Layered architecture — strict separation:**
```
Routes → Controllers → Services → Models → MongoDB
```

- Routes: auth + route registration only
- Controllers: request/response, call into services
- Services: all business logic
- Models: Mongoose schema + data access

**Atomic DB operations for financial transactions (REQUIRED):**
```javascript
// Always use findOneAndUpdate with conditional for token/balance ops
const result = await Balance.findOneAndUpdate(
  { user: userId, condition: true },
  { $inc: { tokenCredits: amount } },
  { new: true, upsert: true }
);
```

**Webhook routes MUST register BEFORE `express.json()` middleware** — they need raw Buffer for signature verification:
```javascript
// CUSTOM: gptchina - Stripe webhook requires raw body
app.use('/api/custom/payments/webhook', express.raw({ type: 'application/json' }), webhookHandler);
// Normal json middleware comes after
app.use(express.json());
```

### Frontend (client/)

**State management: Recoil**
- Atoms for global state
- Persist to localStorage when needed
- Component-local state for UI-only concerns

**Data fetching: use `request.post()` / `request.get()` from `librechat-data-provider`**
- **Never use native `fetch()` directly** — missing JWT auth headers
- Axios interceptor handles token refresh automatically

**Theme integration:**
- Use LibreChat design tokens: `bg-surface-*`, `text-text-*`, `border-border-*`
- Use `useTheme()` hook from `@librechat/client`
- **Never hardcode colors** — always use the token system
- Primary color is **blue** (not green — this fork swapped the palette; see `custom/MODIFICATIONS.md`)

**Modals:**
- Use `@headlessui/react` Dialog for portals
- State in parent component (not Recoil for simple modals)

**Component patterns:**
- Function components only
- Props typed with TypeScript interfaces
- Loading + error states required for any async data
- `"use client"` equivalent: keep Vite/React patterns; avoid Recoil state in pure presentational components

---

## Payment Conventions

All payment features are in `custom/features/buy-tokens/` and `custom/features/claim-tokens/`.

### Stripe
- Webhook route must be registered before `express.json()`
- Use `express.raw({ type: 'application/json' })` for webhook route only
- Verify `stripe-signature` header on every webhook event
- Atomic MongoDB operations for all credit changes after payment confirmation

### WeChat / Alipay
- Configured via Stripe (not direct Pingxx — this is GPT China, not Baopals)
- Payment methods passed as Stripe PaymentMethod types: `wechat_pay`, `alipay`

---

## Code Principles

### TypeScript
- Strict types in all `.tsx`/`.ts` files
- No `as any` — use proper type guards or `as unknown as T` only in tests
- Use Zod schemas for external data validation

### Error Handling
- Never silent `catch {}`
- Log errors with context (use Winston logger in backend: `logger.error(...)`)
- Surface meaningful errors to the frontend

### Performance
- Paginate all list queries — never fetch unbounded collections from MongoDB
- Use Redis caching for expensive operations (model list, pricing data)
- Dynamic imports for heavy frontend components

### No Unnecessary Upstream Risk
- Don't refactor working upstream code as a side effect of a fix
- Don't rename upstream functions or reorganize upstream directories
- If something upstream looks wrong, note it in a comment — don't fix it unless explicitly asked

---

## File Conventions

- Directories + files: `kebab-case` (following upstream convention)
- React components: `PascalCase.tsx`
- Hooks: `camelCase.ts` prefixed with `use`
- Backend modules: `camelCase.js` or `kebab-case.js` (match surrounding upstream files)
- Constants: `UPPER_CASE`
- Custom feature dirs: `kebab-case` under `custom/features/`

---

## Git & PR Rules

- Branch from correct base (`main` via worktree)
- Conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`
- Atomic commits — one logical change per commit
- No force-push
- One focused concern per PR — no bundling unrelated changes
- **Never merge** — open PRs only, user merges
- Squash merge only

---

## Upstream Sync Awareness

This repo syncs with `danny-avila/LibreChat` upstream regularly. Before implementing anything:

1. **Check if upstream already handles it** — LibreChat is actively developed. The feature may exist upstream already or be coming soon.
2. **Prefer config over code** — `librechat.yaml` controls a lot. If a change can be done via config, do it there instead of in code.
3. **High-risk upstream files** (frequently changed upstream — be extra careful / minimize changes):
   - `client/src/components/Chat/**` — upstream actively iterates on chat UI
   - `api/server/routes/index.js` — route registration changes often
   - `packages/data-provider/**` — API contracts change with upstream releases
   - `client/src/locales/en/translation.json` — upstream adds keys frequently (custom keys use `com_custom_` prefix to avoid collisions)
4. **Low-risk areas** (safe to add custom code alongside):
   - `api/server/routes/` — adding new route files is safe
   - `custom/` — entirely ours, never conflicts
   - `client/src/routes/index.tsx` — small additions are localized

---

## Do NOT

- Touch `docker-compose.yml` or `deploy-compose.yml` without explicit instruction
- Modify `.env` values
- Use `fetch()` directly in frontend — use `request` from `librechat-data-provider`
- Hardcode colors — use LibreChat design tokens
- Hardcode English/Chinese strings — use i18n keys
- Add non-atomic operations for token/balance mutations
- Leave upstream modifications unmarked (missing `// CUSTOM: gptchina` comments)
- Skip `custom/MODIFICATIONS.md` entry when touching an upstream file
- Register Stripe webhook route after `express.json()` middleware
- Use `--yolo` or `--dangerously-skip-permissions` modes
