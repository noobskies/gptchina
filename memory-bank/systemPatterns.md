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
