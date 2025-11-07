# System Patterns: LibreChat

## Architecture Overview

LibreChat follows a **monorepo architecture** with clear separation between frontend, backend, and shared packages. The system is designed for horizontal scalability, containerization, and flexible deployment.

```
LibreChat/
├── api/              # Backend Node.js/Express server
├── client/           # Frontend React application
├── packages/         # Shared packages (workspaces)
│   ├── data-provider/
│   ├── data-schemas/
│   └── mcp/
├── config/           # CLI utilities and scripts
├── android/          # Capacitor Android build
├── e2e/             # End-to-end tests
└── helm/            # Kubernetes deployment charts
```

## Core Architectural Patterns

### 1. Monorepo with Workspaces

**Pattern**: npm workspaces for code sharing and dependency management

**Implementation**:

- Root `package.json` defines workspaces: `["api", "client", "packages/*"]`
- Shared code in `packages/` directory
- Independent versioning per workspace
- Shared dependencies hoisted to root

**Benefits**:

- Single source of truth for dependencies
- Easy code sharing between frontend/backend
- Simplified development workflow
- Consistent tooling across all packages

### 2. API-First Design

**Pattern**: RESTful API with clear separation of concerns

**Structure**:

```
api/
├── app/              # Main application setup
├── models/           # MongoDB models & business logic
├── server/           # Express server & routes
│   ├── controllers/  # Request handlers
│   ├── middleware/   # Express middleware
│   ├── routes/       # Route definitions
│   └── services/     # Business logic services
├── strategies/       # Authentication strategies
├── cache/            # Caching layer (Redis/Memory)
├── config/           # Configuration management
└── lib/              # Shared utilities
```

**Key Principles**:

- Controller → Service → Model pattern
- Middleware for cross-cutting concerns (auth, validation, rate limiting)
- Strategy pattern for authentication
- Repository pattern for data access

### 3. Frontend Component Architecture

**Pattern**: React with component-based architecture

**Structure**:

```
client/src/
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── store/            # State management (Recoil/Redux)
├── utils/            # Frontend utilities
├── localization/     # i18n translations
└── routes/           # Route definitions
```

**Key Patterns**:

- Composition over inheritance
- Custom hooks for business logic
- Context API for global state
- Component co-location (components with their styles/tests)

### 4. Data Model Architecture

**Pattern**: MongoDB with Mongoose ODM

**Core Models**:

```javascript
// Key entities
User; // Authentication & user data
Conversation; // Chat conversations
Message; // Individual messages
Agent; // Custom AI agents
Assistant; // OpenAI assistants
Preset; // Saved configurations
File; // File uploads
Transaction; // Token usage tracking
Balance; // User balance/credits
```

**Relationships**:

- User → Conversations (one-to-many)
- Conversation → Messages (one-to-many)
- User → Agents (one-to-many)
- Message → Files (many-to-many)
- User → Transactions (one-to-many)

**Key Patterns**:

- Mongoose schemas with validation
- Virtual properties for computed fields
- Middleware for hooks (pre-save, post-save)
- Indexing for performance
- Soft deletes where appropriate

### 5. Authentication & Authorization

**Pattern**: Strategy pattern with multiple providers

**Strategies**:

- `localStrategy.js` - Username/password
- `jwtStrategy.js` - JWT token validation
- `googleStrategy.js` - Google OAuth2
- `githubStrategy.js` - GitHub OAuth2
- `discordStrategy.js` - Discord OAuth2
- `facebookStrategy.js` - Facebook OAuth2
- `appleStrategy.js` - Apple Sign In
- `ldapStrategy.js` - LDAP/Active Directory
- `openidStrategy.js` - OpenID Connect

**Flow**:

1. Client initiates authentication
2. Strategy validates credentials
3. JWT token generated on success
4. Token stored client-side (httpOnly cookie or localStorage)
5. Token validated on each API request via middleware

**Authorization**:

- Role-based access control (RBAC)
- Middleware checks for permissions
- User roles stored in database
- Token contains user ID and roles

### 6. Caching Strategy

**Pattern**: Multi-layer caching with Redis/In-Memory fallback

**Layers**:

1. **Application Cache**: In-memory for frequently accessed data
2. **Redis Cache**: Distributed cache for session data, rate limiting
3. **Database Cache**: MongoDB query result caching

**Use Cases**:

- Session storage (Redis)
- Rate limiting counters (Redis)
- Conversation metadata (Memory)
- User preferences (Memory)
- API response caching (Memory/Redis)

**Implementation**:

```javascript
// cache/index.js exports cache client
// Supports both Redis and in-memory fallback
// Configurable TTL per cache key pattern
```

### 7. Message Streaming Architecture

**Pattern**: Server-Sent Events (SSE) for real-time streaming

**Flow**:

1. Client initiates message with POST request
2. Server opens SSE connection
3. API calls AI provider (OpenAI, Anthropic, etc.)
4. Tokens stream from provider
5. Server forwards tokens to client via SSE
6. Client updates UI in real-time
7. On completion, message saved to database

**Error Handling**:

- Graceful degradation if streaming fails
- Automatic retry with exponential backoff
- Connection recovery mechanisms
- Timeout handling

### 8. AI Provider Integration

**Pattern**: Adapter pattern for multiple providers

**Structure**:

```
api/app/clients/
├── OpenAIClient.js
├── AnthropicClient.js
├── GoogleClient.js
├── AzureClient.js
├── BedrockClient.js
└── CustomClient.js
```

**Abstraction**:

- Common interface for all providers
- Provider-specific implementations
- Unified error handling
- Consistent token counting
- Standard response formatting

**Configuration**:

- Endpoint configuration in `librechat.yaml`
- Environment variables for API keys
- Per-user endpoint availability
- Dynamic model selection

### 9. File Handling Architecture

**Pattern**: Upload → Process → Store → Reference

**Flow**:

1. Client uploads file (multipart/form-data)
2. Server validates file type and size
3. File processed (virus scan, metadata extraction)
4. File stored (local filesystem or cloud storage)
5. File metadata saved to database
6. File reference included in message
7. AI provider retrieves file when needed

**Storage Options**:

- Local filesystem (default)
- AWS S3
- Azure Blob Storage
- Google Cloud Storage

### 10. Mobile App Architecture (Capacitor)

**Pattern**: Progressive Web App (PWA) with native bridges

**Structure**:

```
client/          # Main web app
android/         # Capacitor Android project
  └── app/       # Android-specific code
ios/ (optional)  # Capacitor iOS project
  └── App/       # iOS-specific code
```

**Build Process**:

1. Build React app (`npm run frontend`)
2. Remove gzip files (incompatible with Capacitor)
3. Sync to native projects (`npx cap sync`)
4. Open in native IDE (`npx cap open android/ios`)
5. Build native app

**Native Features**:

- Social login (Google, Apple)
- Push notifications
- File system access
- Share functionality
- Biometric authentication

### 11. Payment Integration (Stripe)

**Pattern**: Secure server-side payment processing

**Flow**:

1. Client initiates payment/subscription
2. Server creates Stripe checkout session
3. Client redirected to Stripe hosted page
4. User completes payment on Stripe
5. Stripe webhook notifies server
6. Server updates user balance/subscription
7. Client receives confirmation

**Components**:

- Balance model tracks user credits
- Transaction model logs all spending
- Webhook handlers for payment events
- Token spend tracking middleware

## Critical Implementation Paths

### Message Creation & Response

```
Client POST /api/messages
↓
Auth Middleware (validate JWT)
↓
Rate Limiting Middleware
↓
Message Controller
↓
Message Service
  ├─→ Create Message (MongoDB)
  ├─→ Get Conversation Context
  └─→ AI Client Service
      ├─→ Select Provider/Model
      ├─→ Format Request
      ├─→ Stream Response (SSE)
      └─→ Track Token Usage
↓
Save Response Message
↓
Update Conversation
↓
Return to Client
```

### Agent Tool Execution

```
User Message with Agent
↓
Agent resolves tools/functions
↓
AI generates function call
↓
Server executes tool
  ├─→ Code Interpreter (sandboxed)
  ├─→ Web Search (API call)
  ├─→ File Search (vector search)
  └─→ Custom Plugin
↓
Tool result returned to AI
↓
AI generates final response
↓
Response streamed to client
```

### Authentication Flow

```
Client Login Request
↓
Strategy Router (determines auth type)
↓
Selected Strategy (local, OAuth, LDAP, etc.)
  ├─→ Validate Credentials
  ├─→ Create/Update User
  └─→ Generate JWT Token
↓
Set httpOnly Cookie
↓
Return User Data + Token
↓
Client stores token
↓
Subsequent requests include token in header
↓
JWT Middleware validates on each request
```

## Design Decisions

### Why Monorepo?

- Simplified dependency management
- Code sharing between frontend/backend
- Single CI/CD pipeline
- Consistent tooling

### Why MongoDB?

- Flexible schema for evolving data models
- Strong ecosystem (Mongoose ODM)
- Horizontal scalability
- Good performance for read-heavy workloads

### Why Express?

- Mature, stable framework
- Large ecosystem of middleware
- Simple to understand and extend
- Good TypeScript support

### Why React?

- Component reusability
- Large ecosystem
- Strong community
- Excellent mobile support via React Native principles

### Why Capacitor?

- Web-first with native bridges
- Single codebase for web/mobile
- Plugin ecosystem
- Easier than React Native for web apps

### Why SSE over WebSockets?

- Simpler implementation
- Better for one-way streaming (AI responses)
- Automatic reconnection
- No need for bidirectional communication

## Scalability Patterns

### Horizontal Scaling

- Stateless API servers
- Session data in Redis
- Load balancer distribution
- Database read replicas

### Caching Strategy

- Redis for shared state
- In-memory for local state
- CDN for static assets
- Database query optimization

### Database Optimization

- Proper indexing strategy
- Query optimization
- Connection pooling
- Aggregation pipelines

### Performance Monitoring

- Request logging
- Error tracking
- Performance metrics
- User analytics
