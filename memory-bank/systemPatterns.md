# System Patterns

## Architecture Overview

LibreChat follows a **monorepo architecture** with clear separation between frontend (client), backend (api), and shared packages. The system uses a modern web stack with React frontend and Node.js/Express backend, communicating via REST APIs and WebSocket connections.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client (React)                       │
│  ┌─────────┬─────────┬─────────┬──────────┬──────────┐  │
│  │  Chat   │ Agents  │ Files   │ Settings │  Search  │  │
│  │   UI    │   UI    │   UI    │    UI    │    UI    │  │
│  └─────────┴─────────┴─────────┴──────────┴──────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API / WebSocket
┌──────────────────────┼──────────────────────────────────┐
│                      ▼                                   │
│              API Server (Express)                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │          Routes & Controllers                     │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │        Services & Business Logic                 │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Models & Data Access                │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼               ▼
   ┌─────────┐   ┌─────────┐   ┌────────────┐
   │ MongoDB │   │  Redis  │   │ Meilisearch│
   └─────────┘   └─────────┘   └────────────┘
        │
        ▼
┌─────────────────────────────────────────────┐
│         External AI Providers                │
│  OpenAI | Anthropic | Google | Azure | ...  │
└─────────────────────────────────────────────┘
```

## Directory Structure

### Workspace Organization

```
LibreChat/
├── api/                    # Backend application
│   ├── server/            # Express server setup
│   ├── models/            # Database models (Mongoose)
│   ├── strategies/        # Authentication strategies
│   ├── cache/             # Caching utilities
│   ├── lib/               # Shared utilities
│   └── test/              # Backend tests
├── client/                # Frontend application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── store/        # State management (Recoil)
│   │   ├── utils/        # Client utilities
│   │   └── localization/ # i18n translations
│   └── public/           # Static assets
├── packages/              # Shared packages
│   ├── data-provider/    # Data access layer
│   ├── data-schemas/     # Zod schemas & types
│   ├── client/           # Shared client logic
│   ├── api/              # Shared API utilities
│   └── mcp/              # MCP protocol implementation
├── config/               # Configuration scripts
├── e2e/                  # End-to-end tests
└── docker-compose.yml    # Docker orchestration
```

## Key Technical Decisions

### 1. Monorepo with Workspaces

**Decision**: Use npm workspaces to manage multiple packages in a single repository

**Rationale**:

- Shared code between client and server (types, schemas, utilities)
- Simplified dependency management
- Atomic changes across packages
- Better developer experience

**Implementation**:

- `api/`, `client/`, `packages/*` as separate workspaces
- Shared packages: `data-provider`, `data-schemas`, `client`, `api`, `mcp`
- Cross-workspace dependencies managed via workspace protocol

### 2. Client-Server Communication

**Decision**: REST API for primary operations, WebSocket for streaming responses

**Rationale**:

- REST for standard CRUD operations (conversations, messages, settings)
- WebSocket (via Server-Sent Events) for AI streaming responses
- Clear separation of concerns

**Implementation**:

- Express REST routes in `api/server/routes/`
- Controllers handle business logic
- Services interact with AI providers
- WebSocket streaming for real-time AI responses

### 3. Data Persistence Strategy

**Decision**: MongoDB as primary database, Redis for caching, Meilisearch for search

**Rationale**:

- MongoDB: Flexible schema for varied conversation structures
- Redis: Fast session storage, rate limiting, caching
- Meilisearch: Full-text search across conversations

**Data Models**:

- Conversation: Chat sessions with metadata
- Message: Individual messages with tool calls
- User: Authentication and preferences
- Agent: Custom AI agents with configurations
- File: File metadata and storage references
- Preset: Saved conversation configurations
- Prompt: Reusable prompt templates

### 4. Authentication Architecture

**Decision**: Multi-strategy authentication with session-based and JWT tokens

**Strategies Supported**:

- Local (email/password)
- OAuth2 (Google, GitHub, Facebook, Discord, Apple)
- OpenID Connect
- SAML
- LDAP

**Implementation**:

- Passport.js for strategy management
- JWT for API authentication
- Refresh tokens for session persistence
- Role-based access control (RBAC)

### 5. AI Provider Integration

**Decision**: Plugin-based architecture for AI provider abstraction

**Pattern**:

```javascript
// Abstract provider interface
class BaseClient {
  async sendMessage(payload) {}
  async streamMessage(payload) {}
  async getModels() {}
}

// Provider-specific implementations
class OpenAIClient extends BaseClient {}
class AnthropicClient extends BaseClient {}
class GoogleClient extends BaseClient {}
```

**Benefits**:

- Easy to add new providers
- Consistent interface across providers
- Provider-specific optimizations isolated
- Simplified testing and mocking

### 6. File Handling Strategy

**Decision**: Support multiple storage backends (Firebase, S3, Azure Blob, Local)

**Architecture**:

- Abstract file storage interface
- Provider-specific implementations
- File metadata in MongoDB
- Temporary storage for processing
- Stream-based uploads for large files

### 7. Plugin & Tool System

**Decision**: MCP (Model Context Protocol) for tool integration

**Components**:

- MCP server support for external tools
- Built-in tools (web search, code interpreter, image generation)
- Tool calling via function calling APIs
- Sandboxed execution environments

### 8. Agent Architecture

**Decision**: Agent as configuration layer over AI models with tools

**Structure**:

```javascript
Agent {
  name: string
  description: string
  model: string
  provider: string
  tools: Tool[]
  instructions: string
  permissions: Permission[]
}
```

**Capabilities**:

- Tool selection and orchestration
- Custom instructions (system prompts)
- File search integration
- Code interpreter access
- Shared with users/groups

## Component Relationships

### Frontend Architecture

**State Management**: Recoil for global state

- Atoms for primitive state (auth, settings)
- Selectors for derived state
- Persistent state via localStorage

**Component Hierarchy**:

```
App
├── Layout
│   ├── Header (Navigation, User Menu)
│   ├── Sidebar (Conversations, Agents)
│   └── Main Content
│       ├── ChatView
│       │   ├── MessageList
│       │   └── MessageInput
│       ├── AgentBuilder
│       └── Settings
└── Providers (Auth, Theme, i18n)
```

**Data Flow**:

1. User action triggers React event
2. Component calls custom hook
3. Hook uses Recoil state and data-provider
4. data-provider makes API call
5. Response updates Recoil state
6. Components re-render

### Backend Architecture

**Layered Architecture**:

```
Routes → Controllers → Services → Models → Database
```

**Request Flow**:

1. Request hits Express route
2. Middleware: Authentication, validation, rate limiting
3. Controller processes request
4. Service layer contains business logic
5. Model layer interacts with database
6. Response sent back to client

**Middleware Stack**:

- Authentication (Passport.js)
- Rate limiting (express-rate-limit)
- Validation (Zod schemas)
- Error handling (custom error middleware)
- Logging (Winston)
- CORS handling

## Critical Implementation Paths

### Message Streaming Path

```
1. Client sends message via POST /api/messages
2. Controller validates and creates message record
3. Service layer:
   - Retrieves conversation context
   - Selects appropriate AI provider
   - Builds provider-specific payload
4. Provider client streams response
5. Service layer processes stream:
   - Parses tool calls
   - Executes tools if needed
   - Accumulates response
6. WebSocket pushes chunks to client
7. Complete message saved to MongoDB
8. Meilisearch index updated
```

### Agent Execution Path

```
1. User selects agent or creates new one
2. Agent configuration loaded (tools, model, instructions)
3. Message sent with agent context
4. System prompt built from agent instructions
5. Available tools attached to payload
6. AI provider receives enhanced context
7. Tool calls executed in sequence:
   - Code interpreter runs in sandbox
   - File search queries vector DB
   - Web search fetches and processes results
   - MCP tools invoke external services
8. Results incorporated into conversation
9. Final response returned to user
```

### File Upload Path

```
1. Client uploads file via multipart/form-data
2. Multer middleware processes upload
3. File temporarily stored
4. File validated (size, type, content)
5. Virus scan if configured
6. Storage backend called:
   - Firebase Storage
   - S3
   - Azure Blob
   - Local filesystem
7. File metadata saved to MongoDB
8. File associated with conversation/message
9. Client receives file reference
10. AI providers can access file via reference
```

## Design Patterns in Use

### Repository Pattern

- Models abstract database operations
- Services use models for data access
- Testable without database

### Strategy Pattern

- Authentication strategies (Passport.js)
- AI provider clients
- File storage backends

### Factory Pattern

- Client creation based on provider
- Tool instantiation
- Response formatters

### Middleware Pattern

- Express middleware chain
- React hooks composition
- Error handling pipeline

### Observer Pattern

- WebSocket event listeners
- React state updates (Recoil)
- Cache invalidation

### Singleton Pattern

- Database connection
- Redis client
- Meilisearch client

## Scalability Considerations

### Horizontal Scaling

- Stateless API servers (sessions in Redis)
- Load balancer in front of multiple instances
- Shared MongoDB replica set
- Redis cluster for distributed caching

### Performance Optimizations

- Response streaming (reduces perceived latency)
- Aggressive caching (Redis + in-memory)
- Database indexing (conversation queries)
- CDN for static assets
- Lazy loading of components

### Resource Management

- Connection pooling (MongoDB, Redis)
- Request queuing and rate limiting
- Token usage tracking
- File size limits
- Concurrent request limits

## Fork-Friendly Architecture

### Overview

**Critical Constraint**: This project ("gptchina") is a fork of the upstream LibreChat repository. All development must prioritize maintainability and minimize merge conflicts when syncing with upstream updates.

### Core Principles

1. **Isolation First**

   - Custom features must be isolated in dedicated modules
   - Minimize direct modifications to upstream files
   - Use composition and extension over modification

2. **Clear Boundaries**

   - Explicit separation between fork and upstream code
   - Well-defined integration points
   - Documented dependencies on upstream code

3. **Merge-Aware Development**

   - Consider upstream evolution in all design decisions
   - Prefer configuration over code changes
   - Use abstraction layers for upstream interactions

4. **Comprehensive Documentation**
   - Mark all custom modifications explicitly
   - Maintain change logs for custom features
   - Document reasons for necessary upstream modifications

### Directory Structure for Custom Code

```
LibreChat/
├── custom/                          # All fork-specific code
│   ├── README.md                   # Overview and guidelines
│   ├── FEATURES.md                 # Custom features documentation
│   ├── features/                   # Custom feature implementations
│   │   ├── feature-name/
│   │   │   ├── README.md          # Feature documentation
│   │   │   ├── client/            # Frontend components
│   │   │   ├── server/            # Backend logic
│   │   │   └── shared/            # Shared utilities
│   ├── integrations/               # Third-party integrations
│   ├── overrides/                  # Necessary upstream modifications
│   │   ├── README.md              # Why overrides are needed
│   │   └── upstream-version.txt   # Track upstream version
│   ├── config/                     # Custom configurations
│   │   └── librechat.custom.yaml
│   └── scripts/                    # Custom utility scripts
```

### Integration Patterns

#### Pattern 1: Plugin Architecture

**Use Case**: Adding new functionality without modifying upstream code

**Implementation**:

```javascript
// custom/features/my-feature/plugin.js
export const MyFeaturePlugin = {
  name: 'my-feature',
  version: '1.0.0',

  // Hook into upstream lifecycle
  init(app) {
    // Initialize feature
  },

  // Register routes
  registerRoutes(router) {
    // Add custom routes
  },

  // Extend configuration
  extendConfig(config) {
    // Add custom config
    return { ...config, myFeature: {...} };
  }
};

// api/server/index.js (minimal upstream change)
// CUSTOM: gptchina - Plugin system integration
import { loadCustomPlugins } from '../custom/loader.js';
const customPlugins = loadCustomPlugins();
customPlugins.forEach(plugin => plugin.init(app));
```

#### Pattern 2: Middleware Wrapping

**Use Case**: Extending upstream behavior without direct modification

**Implementation**:

```javascript
// custom/middleware/enhanced-auth.js
import { upstreamAuthMiddleware } from '../../api/server/middleware/auth.js';

export const customAuthMiddleware = (req, res, next) => {
  // Pre-processing
  addCustomHeaders(req);

  // Call upstream middleware
  upstreamAuthMiddleware(req, res, (err) => {
    if (err) return next(err);

    // Post-processing
    logCustomMetrics(req);
    next();
  });
};
```

#### Pattern 3: Configuration Extension

**Use Case**: Adding custom settings without modifying upstream config

**Implementation**:

```javascript
// custom/config/index.js
import { upstreamConfig } from '../../api/config/index.js';
import { customConfig } from './custom.yaml';

export const config = {
  ...upstreamConfig,
  custom: customConfig,

  // Override only when necessary, with clear comments
  // CUSTOM: gptchina - Extended model list
  models: [...upstreamConfig.models, ...customConfig.additionalModels],
};
```

#### Pattern 4: Event-Driven Integration

**Use Case**: React to upstream events without modifying core logic

**Implementation**:

```javascript
// custom/features/analytics/listener.js
import { eventEmitter } from '../../api/lib/events.js';

// Listen to upstream events
eventEmitter.on('message:sent', async (data) => {
  await trackCustomAnalytics(data);
});

eventEmitter.on('user:login', async (user) => {
  await customLoginHandler(user);
});
```

#### Pattern 5: Dependency Injection

**Use Case**: Swap implementations without upstream changes

**Implementation**:

```javascript
// custom/providers/custom-ai-provider.js
import { BaseProvider } from '../../api/app/clients/BaseProvider.js';

export class CustomAIProvider extends BaseProvider {
  // Implement upstream interface
  async sendMessage(payload) {
    // Custom implementation
  }
}

// Register through existing provider system
// CUSTOM: gptchina - Custom provider registration
providerRegistry.register('custom-ai', CustomAIProvider);
```

### Marking Custom Code

#### In Modified Upstream Files

```javascript
// CUSTOM: gptchina - Added support for custom feature X
// Original upstream behavior preserved above
// See: custom/features/featureX/README.md for details
// Upstream version: v0.8.1-rc1 (commit: ba71375)

if (process.env.ENABLE_CUSTOM_FEATURE_X === 'true') {
  await customFeatureXHandler(req, res);
}

// Resume upstream code below
```

#### In New Custom Files

```javascript
/**
 * CUSTOM: gptchina fork
 *
 * Feature: Custom Analytics Integration
 * Created: 2025-11-09
 * Upstream Impact: None (standalone module)
 *
 * This module provides custom analytics without modifying upstream code.
 * Integrates via event listeners and middleware wrapping.
 *
 * See: custom/features/analytics/README.md
 */
```

### Feature Toggle System

**Environment Variables**:

```bash
# Custom feature flags (prefix with CUSTOM_)
CUSTOM_ENABLE_ANALYTICS=true
CUSTOM_ENABLE_ENHANCED_AUTH=false
CUSTOM_AI_PROVIDER_TIMEOUT=30000

# Feature-specific configuration
CUSTOM_FEATURE_X_API_KEY=xxx
CUSTOM_FEATURE_Y_ENDPOINT=https://api.example.com
```

**Configuration File** (`custom/config/librechat.custom.yaml`):

```yaml
version: 1.0.0
features:
  analytics:
    enabled: true
    provider: 'custom-analytics'
  enhanced_auth:
    enabled: false
  custom_ai_provider:
    enabled: true
    timeout: 30000
```

### Frontend Custom Code Strategy

**Custom Components**:

```
client/src/custom/
├── components/
│   ├── CustomFeatureX/
│   │   ├── index.tsx
│   │   ├── CustomFeatureX.tsx
│   │   └── styles.css
│   └── README.md
├── hooks/
│   ├── useCustomFeature.ts
│   └── README.md
├── store/
│   ├── customAtoms.ts      # Recoil atoms for custom features
│   └── customSelectors.ts
└── utils/
    └── customHelpers.ts
```

**Integration Approach**:

```typescript
// client/src/App.tsx (minimal change)
// CUSTOM: gptchina - Load custom features
import { CustomFeatureProvider } from './custom/providers/CustomFeatureProvider';

function App() {
  return (
    <CustomFeatureProvider>  {/* Wrap existing app */}
      <UpstreamApp />
    </CustomFeatureProvider>
  );
}
```

### Backend Custom Code Strategy

**Custom Routes**:

```
api/server/routes/custom/
├── index.js              # Route registry
├── analytics.js          # Custom analytics routes
├── enhanced-auth.js      # Custom auth endpoints
└── README.md
```

**Registration Pattern**:

```javascript
// api/server/routes/index.js
// CUSTOM: gptchina - Register custom routes
import customRoutes from './custom/index.js';

router.use('/api/custom', customRoutes);
```

### Merge Conflict Prevention

#### Pre-Merge Checklist

1. **Review Upstream Changelog**

   - Identify changed files
   - Check for conflicts with custom code
   - Plan refactoring if needed

2. **Audit Custom Modifications**

   - List all modified upstream files
   - Check if upstream changes affect custom code
   - Update abstraction layers if needed

3. **Test Custom Features**

   - Run full test suite
   - Manually test all custom features
   - Verify configuration compatibility

4. **Update Documentation**
   - Update CUSTOM_MODIFICATIONS.md
   - Document any new integration points
   - Update memory bank

#### Merge Strategy Script

```bash
#!/bin/bash
# custom/scripts/prepare-merge.sh

echo "Preparing for upstream merge..."

# 1. List all custom modifications
echo "Custom modifications:"
git diff upstream/main --name-only | grep -v "^custom/"

# 2. Check for potential conflicts
echo "Checking for conflicts..."
git merge-tree $(git merge-base HEAD upstream/main) HEAD upstream/main

# 3. Run automated tests
echo "Running tests..."
npm run test

echo "Review output above before proceeding with merge."
```

### Documentation Requirements

#### For Each Custom Feature

Create `custom/features/[feature-name]/README.md`:

```markdown
# Feature Name

## Overview

Brief description of what this feature does.

## Upstream Integration

- **Integration Type**: Plugin / Middleware / Event Listener
- **Modified Files**: List any upstream files modified
- **Upstream Version**: v0.8.1-rc1 (commit: ba71375)
- **Update Strategy**: How to handle upstream changes

## Configuration

Environment variables and configuration options.

## API

Public API exposed by this feature.

## Dependencies

- Upstream dependencies
- External packages
- Other custom features

## Testing

How to test this feature.

## Maintenance Notes

Known issues, TODOs, future considerations.
```

#### Track All Modifications

Maintain `custom/MODIFICATIONS.md`:

```markdown
# Custom Modifications to Upstream Files

## Modified Files

### api/server/index.js

- **Lines**: 45-52
- **Reason**: Register custom plugin system
- **Upstream Version**: v0.8.1-rc1
- **Impact**: Low (isolated to plugin init)
- **Alternative Considered**: Separate entry point (rejected for complexity)

### client/src/App.tsx

- **Lines**: 23-25
- **Reason**: Wrap app with custom feature provider
- **Upstream Version**: v0.8.1-rc1
- **Impact**: Low (wrapper pattern)
- **Alternative Considered**: HOC (rejected for context needs)

## Merge Strategy

When syncing with upstream:

1. Check if modified files changed in upstream
2. Review changes for compatibility
3. Update abstraction layers if needed
4. Test all custom features
```

### Version Control Strategy

#### Branch Naming

```
main                    # Synced with upstream stable releases
develop                 # Active development
feature/custom-X        # Custom features
upstream/main           # Track upstream main branch
upstream/releases       # Track upstream releases
```

#### Commit Messages

```
[CUSTOM] Add analytics feature

- Implement event-based analytics
- No upstream modifications required
- Integration via plugin pattern

Refs: #123
```

### Testing Strategy

#### Isolation Testing

```javascript
// custom/features/analytics/__tests__/analytics.test.js
describe('Custom Analytics', () => {
  it('should work independently of upstream', async () => {
    // Test without upstream dependencies
  });

  it('should integrate correctly with upstream events', async () => {
    // Test event listener integration
  });
});
```

#### Upstream Compatibility Testing

```javascript
// custom/__tests__/upstream-compatibility.test.js
describe('Upstream Compatibility', () => {
  it('should not break upstream routes', async () => {
    // Test all upstream routes still work
  });

  it('should handle upstream config changes', async () => {
    // Test config merging
  });
});
```

### Monitoring Upstream Changes

#### Automated Tracking

```bash
# custom/scripts/track-upstream.sh

# Add upstream remote if not exists
git remote add upstream https://github.com/danny-avila/LibreChat.git

# Fetch upstream changes
git fetch upstream

# Show files changed in upstream since last merge
git log --oneline --name-only HEAD..upstream/main

# Check if our modified files changed upstream
MODIFIED_FILES=$(cat custom/MODIFICATIONS.md | grep -E "^### " | sed 's/### //')
echo "Checking if modified files changed upstream..."
echo "$MODIFIED_FILES" | while read file; do
  if git diff HEAD..upstream/main --name-only | grep -q "$file"; then
    echo "⚠️  $file changed in upstream!"
  fi
done
```

### Development Workflow

#### Adding a New Custom Feature

1. **Plan**

   - Determine if upstream modification is necessary
   - Design integration approach (plugin, middleware, etc.)
   - Document in custom/features/[feature]/README.md

2. **Implement**

   - Create in custom/features/[feature]/
   - Follow isolation patterns
   - Mark any upstream changes clearly

3. **Test**

   - Unit tests for feature
   - Integration tests with upstream
   - Document test strategy

4. **Document**

   - Update custom/FEATURES.md
   - Update custom/MODIFICATIONS.md if upstream changed
   - Update memory bank

5. **Review**
   - Verify minimal upstream impact
   - Check merge conflict potential
   - Validate documentation

#### Modifying Upstream Code (When Unavoidable)

```javascript
// Before modification:
// CUSTOM: gptchina - START MODIFICATION
// Reason: [Why this change is necessary]
// Upstream version: v0.8.1-rc1 (commit: ba71375)
// Alternative considered: [What was considered and why rejected]
// Impact: [Low/Medium/High - explain]
// Update strategy: [How to handle upstream changes here]

// ... custom code ...

// CUSTOM: gptchina - END MODIFICATION
// Resume upstream code below
```

### Configuration Management

#### Upstream Config

Use upstream config as base, extend with custom:

```javascript
// custom/config/loader.js
import upstreamConfig from '../../api/config/index.js';
import customConfig from './librechat.custom.yaml';

export function loadConfig() {
  return {
    ...upstreamConfig,

    // Extend arrays
    models: [...upstreamConfig.models, ...(customConfig.models || [])],

    // Add custom sections
    custom: customConfig,

    // Override only with clear documentation
    // CUSTOM: gptchina - Extended timeout for custom features
    timeout: customConfig.timeout || upstreamConfig.timeout,
  };
}
```

### CI/CD Considerations

#### Automated Checks

```yaml
# .github/workflows/custom-checks.yml
name: Custom Code Checks

on: [push, pull_request]

jobs:
  check-upstream-modifications:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Check for upstream modifications
        run: |
          # Ensure all upstream modifications are documented
          bash custom/scripts/verify-modifications.sh

  test-custom-features:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Test custom features
        run: |
          npm install
          npm run test:custom

  upstream-compatibility:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Test upstream compatibility
        run: |
          npm run test:upstream-compat
```

### Best Practices Summary

1. **Always Prefer**:

   - Plugin/extension patterns over modification
   - Configuration over code changes
   - Composition over inheritance
   - Abstraction layers over direct upstream usage

2. **Document Everything**:

   - Why custom feature exists
   - How it integrates with upstream
   - What upstream files are modified (if any)
   - How to handle upstream updates

3. **Test Thoroughly**:

   - Isolated feature tests
   - Integration with upstream tests
   - Regression tests after upstream merges

4. **Plan for Merges**:

   - Regular upstream sync schedule
   - Documented merge strategy
   - Automated conflict detection
   - Clear ownership of merge resolution

5. **Minimize Impact**:
   - Keep custom code in custom/ when possible
   - Use feature flags for optional functionality
   - Fail gracefully if custom features disabled
   - Maintain backward compatibility

## Security Patterns

### Authentication & Authorization

- JWT tokens with short expiry
- Refresh token rotation
- RBAC for permissions
- API key encryption (CREDS_KEY/CREDS_IV)

### Input Validation

- Zod schemas for all inputs
- SQL injection prevention (Mongoose ODM)
- XSS protection (sanitization)
- CSRF tokens for state-changing operations

### Rate Limiting

- Per-IP limits
- Per-user limits
- Endpoint-specific limits
- Violation tracking and banning

### Data Protection

- API keys encrypted at rest
- Secure session storage
- HTTPS enforcement
- Content Security Policy headers
