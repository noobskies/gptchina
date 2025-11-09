# Tech Context

## Technology Stack Overview

LibreChat is built on a modern JavaScript/TypeScript stack with emphasis on developer experience, performance, and maintainability.

## Frontend Technologies

### Core Framework

**React 18+**

- Component-based UI architecture
- Hooks for state and side effects
- Concurrent rendering features
- Suspense for async operations

**Vite**

- Fast development server with HMR
- Optimized production builds
- Native ESM support
- Plugin ecosystem (React, TypeScript)

**TypeScript**

- Type safety across the application
- Enhanced IDE support
- Better refactoring capabilities
- Shared types with backend via `packages/data-schemas`

### State Management

**Recoil**

- Atoms for primitive state
- Selectors for derived state
- Async selectors for data fetching
- Built-in persistence utilities

**Why Recoil over Redux/Zustand**:

- More React-like mental model
- Better performance for fine-grained updates
- Simpler async data management
- Atom family for dynamic state

### UI & Styling

**Tailwind CSS**

- Utility-first CSS framework
- JIT compiler for optimal bundle size
- Custom design system configuration
- Dark mode support built-in

**Radix UI**

- Accessible component primitives
- Unstyled, composable components
- Keyboard navigation support
- Focus management

**Additional UI Libraries**:

- `react-markdown`: Markdown rendering
- `react-syntax-highlighter`: Code highlighting
- `katex`: Math rendering (LaTeX)
- `mermaid`: Diagram generation
- `react-virtuoso`: Virtual scrolling for long lists

### Build & Development Tools

**ESLint**

- Code quality enforcement
- React hooks rules
- Import sorting
- A11y checks

**Prettier**

- Consistent code formatting
- Tailwind plugin for class sorting
- Pre-commit hooks via husky

**Playwright**

- End-to-end testing
- Visual regression testing
- Accessibility testing
- Cross-browser support

### Client-Side Libraries

**Data Fetching & Caching**

- Custom data-provider layer
- Request deduplication
- Optimistic updates
- Background refetching

**Utilities**

- `date-fns`: Date manipulation
- `zod`: Runtime validation
- `lodash`: Utility functions
- `uuid`: ID generation

## Backend Technologies

### Runtime & Framework

**Node.js v18+**

- LTS version for stability
- Native ESM support
- Modern JavaScript features
- Performance improvements

**Express.js**

- Mature, battle-tested framework
- Extensive middleware ecosystem
- Simple routing and middleware
- Good documentation

**Why Express over NestJS/Fastify**:

- Simpler learning curve
- More community resources
- Lighter weight
- Sufficient for current needs

### Database & Persistence

**MongoDB 4.4+**

- Flexible document schema
- Native JSON support
- Horizontal scaling via sharding
- Change streams for real-time updates

**Mongoose ODM**

- Schema definition and validation
- Middleware (pre/post hooks)
- Virtual properties
- Built-in type casting

**Why MongoDB**:

- Flexible schema for varied conversation structures
- Good performance for read-heavy workloads
- Native support for nested documents
- Easier to evolve schema

### Caching & Session Storage

**Redis 6+**

- In-memory key-value store
- Pub/sub messaging
- Session storage
- Rate limiting counters
- Cache invalidation

**Redis Use Cases**:

- User sessions (if enabled)
- Rate limiting data
- Temporary tokens
- Cached API responses
- Leader election in multi-instance setup

**Optional**: In-memory caching fallback when Redis unavailable

### Search

**Meilisearch**

- Fast full-text search
- Typo tolerance
- Faceted search
- Instant search results
- RESTful API

**Indexed Data**:

- Conversation titles
- Message content
- User-created agents
- Prompt templates

### Authentication

**Passport.js**

- Authentication middleware
- 500+ strategies available
- Unified API across strategies
- Session management

**Supported Strategies**:

- `passport-local`: Email/password
- `passport-google-oauth20`: Google OAuth
- `passport-github2`: GitHub OAuth
- `passport-facebook`: Facebook OAuth
- `passport-discord`: Discord OAuth
- `passport-apple`: Apple Sign In
- `passport-openid-connect`: OpenID
- `passport-saml`: SAML 2.0
- `passport-ldapauth`: LDAP

**JWT Handling**:

- `jsonwebtoken`: Token generation/verification
- Short-lived access tokens
- Long-lived refresh tokens
- Token rotation on refresh

### Logging & Monitoring

**Winston**

- Structured logging
- Multiple transports (console, file, cloud)
- Log levels (error, warn, info, debug)
- JSON output for cloud logging

**Log Categories**:

- API requests/responses
- Database operations
- Authentication events
- Error tracking
- Performance metrics

### Testing

**Jest**

- Unit and integration testing
- Mocking capabilities
- Coverage reporting
- Snapshot testing

**Supertest**

- HTTP assertion library
- API endpoint testing
- Request/response validation

## AI Provider SDKs

**Official SDKs**:

- `openai`: OpenAI API client
- `@anthropic-ai/sdk`: Anthropic Claude
- `@google/generative-ai`: Google Gemini
- `@aws-sdk/client-bedrock-runtime`: AWS Bedrock
- `@azure/openai`: Azure OpenAI

**Custom Clients**:

- Generic OpenAI-compatible client for custom endpoints
- Streaming response handlers
- Error handling and retries
- Token counting utilities

## Infrastructure & Deployment

### Containerization

**Docker**

- Multi-stage builds
- Layer caching optimization
- Health checks
- Volume management

**docker-compose**

- Local development setup
- Service orchestration
- Network configuration
- Environment variables

### Orchestration

**Kubernetes (via Helm)**

- Helm charts in `helm/` directory
- Scalable deployments
- Rolling updates
- ConfigMaps and Secrets

### Storage Options

**Firebase Storage**

- Google Cloud integration
- CDN delivery
- Client SDK available
- Simple authentication

**AWS S3**

- Object storage
- Versioning support
- Lifecycle policies
- CloudFront integration

**Azure Blob Storage**

- Microsoft Cloud integration
- Blob tiers (hot/cool/archive)
- Private/public containers
- SAS token authentication

**Local Filesystem**

- Development/testing
- Simple deployment
- Volume mounting in Docker

## Development Tools

### Package Management

**npm**

- Workspaces for monorepo
- Lock file for reproducible builds
- Scripts for common tasks
- Version management

**Bun (Optional)**

- Faster alternative to npm
- Compatible with npm packages
- Built-in bundler and test runner
- Scripts prefixed with `b:`

### Code Quality

**Husky**

- Git hooks automation
- Pre-commit linting
- Pre-push testing

**lint-staged**

- Run linters on staged files
- Format before commit
- Fast incremental checks

### Version Control

**Git**

- Branching strategy (feature branches)
- Conventional commits encouraged
- Pull request workflow
- Automated CI/CD

### CI/CD

**GitHub Actions** (inferred from upstream)

- Automated testing
- Build verification
- Deployment pipelines
- Security scanning

## Shared Packages

### packages/data-provider

**Purpose**: Abstract data access layer for frontend

**Key Features**:

- API client methods
- Request/response types
- Error handling
- Retry logic

**Technologies**:

- Axios for HTTP requests
- TypeScript for types
- Custom hooks for React

### packages/data-schemas

**Purpose**: Shared data validation and types

**Key Features**:

- Zod schemas for validation
- TypeScript types generated from schemas
- Runtime validation
- Type guards

**Why Zod**:

- Runtime type checking
- Composable schemas
- Great TypeScript integration
- Schema transformation

### packages/api

**Purpose**: Shared API utilities

**Key Features**:

- Common middleware
- Validation utilities
- Error classes
- Response formatters

### packages/client

**Purpose**: Shared client-side logic

**Key Features**:

- Common hooks
- Utility functions
- Constants
- Type definitions

### packages/mcp

**Purpose**: Model Context Protocol implementation

**Key Features**:

- MCP server connection
- Tool discovery and invocation
- Resource access
- Protocol compliance

## Environment Configuration

### Required Services

**Development**:

- MongoDB: localhost:27017
- Redis (optional): localhost:6379
- Meilisearch (optional): localhost:7700

**Production**:

- MongoDB: Connection string via MONGO_URI
- Redis: Connection string via REDIS_URI
- Meilisearch: Connection via MEILI_HOST

### Environment Variables

**Categories**:

1. Server configuration (HOST, PORT, DOMAIN)
2. Database connections (MONGO_URI, REDIS_URI)
3. AI provider keys (OPENAI_API_KEY, ANTHROPIC_API_KEY, etc.)
4. Authentication (JWT_SECRET, OAuth credentials)
5. Feature toggles (SEARCH, USE_REDIS, ALLOW_REGISTRATION)
6. External services (Firebase, S3, Azure)

**Key Management**:

- `.env` file for local development
- Kubernetes Secrets for production
- Docker Secrets for containerized deployments
- Environment variables in cloud platforms

## Technical Constraints

### Node.js Version

**Minimum**: Node.js 18.x

- Native Fetch API
- Test runner
- Import assertions
- Performance improvements

### Browser Support

**Modern Browsers**:

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

**Not Supported**:

- Internet Explorer
- Legacy Edge (<79)

### Database Versions

**MongoDB**: 4.4+

- Transactions support
- Change streams
- Aggregation pipeline improvements

**Redis**: 6.0+

- ACL support
- Client-side caching
- Streams

### Performance Targets

**Response Times**:

- API endpoints: <100ms (excluding AI provider)
- Static assets: <50ms
- Database queries: <20ms
- Cache hits: <5ms

**Bundle Sizes**:

- Initial JS bundle: <500KB gzipped
- Lazy-loaded chunks: <200KB each
- CSS bundle: <50KB gzipped

## Development Setup

### Prerequisites

```bash
# Required
- Node.js 18+
- npm or bun
- MongoDB
- Git

# Optional but recommended
- Docker & Docker Compose
- Redis
- Meilisearch
```

### Local Development Workflow

```bash
# Install dependencies
npm install

# Start development servers
npm run backend:dev  # API server with nodemon
npm run frontend:dev # Vite dev server with HMR

# Run tests
npm run test:api     # Backend tests
npm run test:client  # Frontend tests
npm run e2e          # End-to-end tests

# Linting and formatting
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
npm run format       # Format with Prettier
```

### Docker Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

## Integration Points

### AI Provider APIs

**Request Flow**:

1. User message → API endpoint
2. Build provider-specific payload
3. Call provider SDK/API
4. Stream response back
5. Parse and save

**Error Handling**:

- Rate limit detection and backoff
- API key validation
- Model availability checks
- Graceful degradation

### External Services

**File Storage**:

- Upload → Temporary storage → Validation → Cloud storage
- Signed URLs for secure access
- Metadata stored in MongoDB

**Search Integration**:

- Document indexing on create/update
- Real-time index updates via change streams
- Search query translation and execution

**OAuth Providers**:

- Redirect flow handling
- Token exchange
- Profile information retrieval
- Account linking

## Troubleshooting Common Issues

### MongoDB Connection

**Issue**: Connection refused
**Solution**: Check MongoDB is running, verify MONGO_URI

### Redis Connection

**Issue**: Redis unavailable
**Solution**: App falls back to in-memory cache, some features disabled

### Build Failures

**Issue**: TypeScript errors
**Solution**: Run `npm run build:packages` to rebuild shared packages

### Port Conflicts

**Issue**: Port 3080 already in use
**Solution**: Change PORT in .env or stop conflicting process
