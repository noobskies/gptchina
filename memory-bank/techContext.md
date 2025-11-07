# Technical Context: LibreChat

## Technology Stack

### Backend

**Core Framework**

- **Node.js**: Runtime environment (v18+)
- **Express.js**: Web application framework
- **Mongoose**: MongoDB ODM

**Database**

- **MongoDB**: Primary database for all data persistence
- **Redis** (optional): Caching and session storage

**Authentication**

- **Passport.js**: Authentication middleware
- **JWT (jsonwebtoken)**: Token-based authentication
- **bcrypt**: Password hashing

**API Integration**

- **axios**: HTTP client for AI provider APIs
- **openai**: Official OpenAI SDK
- **@anthropic-ai/sdk**: Anthropic Claude SDK
- **@google/generative-ai**: Google AI SDK

**Utilities**

- **node-cron**: Scheduled task execution
- **multer**: File upload handling
- **winston**: Logging
- **joi**: Schema validation

### Frontend

**Core Framework**

- **React 18**: UI library
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety

**State Management**

- **Recoil**: State management library
- **React Query**: Server state management

**UI Components**

- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Headless UI**: Unstyled UI components
- **react-icons**: Icon library

**Internationalization**

- **react-i18next**: i18n framework
- **locize**: Translation management platform

**Rich Text**

- **react-markdown**: Markdown rendering
- **remark/rehype**: Markdown processing
- **katex**: Math rendering

**Mobile**

- **Capacitor**: Native mobile app framework
- **@capgo/capacitor-social-login**: Social authentication

**Payment**

- **@stripe/stripe-js**: Stripe payment integration
- **@stripe/react-stripe-js**: Stripe React components

### Shared Packages

**data-provider**

- Shared data access layer
- API client abstractions
- Common utilities

**data-schemas**

- Shared TypeScript types/interfaces
- Validation schemas
- Constants and enums

**mcp**

- Model Context Protocol implementation
- Tool and resource definitions

### Development Tools

**Code Quality**

- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Husky**: Git hooks
- **lint-staged**: Run linters on staged files

**Testing**

- **Jest**: Testing framework
- **Playwright**: End-to-end testing
- **@testing-library/react**: React component testing
- **@axe-core/playwright**: Accessibility testing

**Build Tools**

- **Vite**: Frontend build tool
- **esbuild**: Fast bundler
- **PostCSS**: CSS processing
- **Tailwind CSS**: CSS framework

**Package Management**

- **npm**: Primary package manager
- **bun** (alternative): Fast JavaScript runtime/package manager

### DevOps & Deployment

**Containerization**

- **Docker**: Container platform
- **Docker Compose**: Multi-container orchestration
- **Dockerfile**: Container definitions

**Orchestration**

- **Kubernetes**: Container orchestration (via Helm)
- **Helm**: Kubernetes package manager

**CI/CD**

- **GitHub Actions**: Continuous integration
- **Playwright**: Automated testing

**Deployment Platforms**

- **Railway**: Cloud deployment
- **Zeabur**: Cloud deployment
- **Sealos**: Cloud deployment
- **Self-hosted**: Docker/Docker Compose

## Development Setup

### Prerequisites

- Node.js 18+ or Bun 1.0+
- MongoDB 4.4+
- Redis 6+ (optional but recommended)
- Git
- Docker & Docker Compose (for containerized deployment)

### Environment Variables

Key environment variables (see `.env.example`):

```bash
# Database
MONGO_URI=mongodb://localhost:27017/librechat
REDIS_URI=redis://localhost:6379

# JWT
JWT_SECRET=<random-secret>
JWT_REFRESH_SECRET=<random-secret>

# AI Providers
OPENAI_API_KEY=<your-key>
ANTHROPIC_API_KEY=<your-key>
GOOGLE_API_KEY=<your-key>

# Authentication
DOMAIN_CLIENT=http://localhost:3080
DOMAIN_SERVER=http://localhost:3080

# Social Login (optional)
GOOGLE_CLIENT_ID=<your-id>
GOOGLE_CLIENT_SECRET=<your-secret>
GITHUB_CLIENT_ID=<your-id>
GITHUB_CLIENT_SECRET=<your-secret>

# Stripe (optional)
STRIPE_SECRET_KEY=<your-key>
STRIPE_PUBLISHABLE_KEY=<your-key>

# File Storage
FILE_UPLOAD_PATH=/app/data/uploads
```

### Installation & Running

**Standard Setup (npm)**

```bash
# Install dependencies
npm install

# Start MongoDB and Redis (if using Docker)
docker-compose up -d mongodb redis

# Start development servers
npm run backend:dev    # API server on :3080
npm run frontend:dev   # Frontend on :3090
```

**Alternative Setup (Bun)**

```bash
# Install dependencies
bun install

# Start development
bun run b:api:dev      # API server
bun run b:client:dev   # Frontend
```

**Docker Setup**

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Build Process

**Frontend Build**

```bash
# Standard build
npm run frontend

# Bun build (faster)
npm run b:client

# Mobile builds
npm run cap:build:android
npm run cap:build:ios
```

**Backend Build**

```bash
# Standard (no build needed, runs directly)
npm run backend

# Bun
npm run b:api
```

**Full Production Build**

```bash
# Install all dependencies
npm install

# Build shared packages
npm run build:data-provider
npm run build:mcp
npm run build:data-schemas

# Build frontend
cd client && npm run build

# Start production backend
npm run backend
```

## Technical Constraints

### Performance Requirements

- API response time < 2 seconds (p95)
- Message streaming latency < 500ms
- Frontend initial load < 3 seconds
- MongoDB query time < 100ms (p95)

### Scalability Constraints

- Support 10,000+ concurrent users
- Handle 1M+ messages per day
- Store 100GB+ of conversation data
- Process file uploads up to 100MB

### Security Constraints

- All passwords hashed with bcrypt (10 rounds)
- JWT tokens expire in 24 hours
- Refresh tokens expire in 7 days
- Rate limiting: 100 requests/15 minutes per IP
- File uploads scanned for malware
- Input sanitization on all endpoints
- HTTPS required in production

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS 14+, Android 8+)

### Database Constraints

- MongoDB 4.4+ (for transactions)
- Indexes on all frequently queried fields
- TTL indexes for temporary data
- Connection pool size: 10-100
- Max document size: 16MB

### API Rate Limits

- OpenAI: Varies by tier (typically 60 requests/minute)
- Anthropic: Varies by tier
- Google AI: Varies by quota
- Internal API: Configurable per user/role

## Dependencies Management

### Key Dependencies

**Backend (api/package.json)**

```json
{
  "express": "^4.18.x",
  "mongoose": "^8.x",
  "passport": "^0.7.x",
  "openai": "^4.x",
  "jsonwebtoken": "^9.x",
  "bcrypt": "^5.x",
  "winston": "^3.x",
  "axios": "^1.8.x"
}
```

**Frontend (client/package.json)**

```json
{
  "react": "^18.x",
  "vite": "^5.x",
  "typescript": "^5.x",
  "tailwindcss": "^3.x",
  "recoil": "^0.7.x",
  "@tanstack/react-query": "^5.x",
  "react-markdown": "^9.x",
  "react-i18next": "^14.x"
}
```

### Version Pinning Strategy

- Major versions pinned for core dependencies
- Minor versions flexible for patches
- Regular security updates via Dependabot
- Lock files committed to repository

### Workspace Dependencies

Packages can reference each other:

```json
{
  "dependencies": {
    "@librechat/data-provider": "*",
    "@librechat/data-schemas": "*",
    "@librechat/mcp": "*"
  }
}
```

## Tool Usage Patterns

### npm Scripts

**Development**

- `npm run backend:dev` - Start API server with nodemon
- `npm run frontend:dev` - Start Vite dev server
- `npm run e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

**Production**

- `npm run backend` - Start production API server
- `npm run frontend` - Build production frontend
- `npm start` - Start both frontend and backend

**Testing**

- `npm run test:api` - Run API tests
- `npm run test:client` - Run client tests
- `npm run e2e:ci` - Run E2E tests in CI

**Utilities**

- `npm run create-user` - CLI to create users
- `npm run ban-user` - CLI to ban users
- `npm run add-balance` - CLI to add user balance
- `npm run user-stats` - View user statistics

### Docker Commands

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f [service]

# Restart service
docker-compose restart [service]

# Stop all services
docker-compose down

# Remove volumes
docker-compose down -v
```

### Database Commands

```bash
# Connect to MongoDB
mongo mongodb://localhost:27017/librechat

# Connect to Redis
redis-cli

# MongoDB backup
mongodump --uri="mongodb://localhost:27017/librechat"

# MongoDB restore
mongorestore --uri="mongodb://localhost:27017/librechat" dump/
```

## Configuration Files

### Core Configuration

**package.json** - Root workspace configuration

- Defines workspaces
- Global scripts
- Development dependencies
- Version overrides

**docker-compose.yml** - Local development services

- MongoDB service
- Redis service
- API service
- Client service
- Volume mounts

**librechat.yaml** - Application configuration

- AI endpoint definitions
- Model configurations
- Feature flags
- Rate limits
- File upload settings

**.env** - Environment variables

- Database URIs
- API keys
- JWT secrets
- Feature toggles

### Build Configuration

**vite.config.ts** - Frontend build configuration

- Build options
- Dev server settings
- Plugin configuration
- Alias definitions

**tsconfig.json** - TypeScript configuration

- Compiler options
- Path mappings
- Type definitions

**tailwind.config.js** - Tailwind CSS configuration

- Theme customization
- Plugin configuration
- Content paths

**eslint.config.mjs** - ESLint configuration

- Rules and plugins
- Parser options
- Ignored paths

**prettier.config.js** - Prettier configuration

- Formatting rules
- Plugin configuration

### Mobile Configuration

**capacitor.config.ts** - Capacitor configuration

- App ID and name
- Web directory
- Plugin settings
- Platform-specific config

**android/app/build.gradle** - Android build configuration

**ios/App/App.xcodeproj** - iOS project configuration

### Deployment Configuration

**Dockerfile** - Container image definition

**deploy-compose.yml** - Production Docker Compose

**helm/** - Kubernetes Helm charts

## Common Development Patterns

### Adding a New AI Provider

1. Create client in `api/app/clients/NewProviderClient.js`
2. Implement standard interface (chat, streaming, models)
3. Add provider config to `librechat.yaml.example`
4. Add environment variables to `.env.example`
5. Update documentation

### Adding a New Feature

1. Create feature flag in config
2. Implement backend API endpoints
3. Add database models if needed
4. Create frontend components
5. Add tests (unit + E2E)
6. Update documentation

### Database Schema Changes

1. Update Mongoose model in `api/models/`
2. Create migration script if needed
3. Update TypeScript types in `packages/data-schemas/`
4. Test with existing data
5. Document migration process

### Adding Authentication Provider

1. Create strategy in `api/strategies/`
2. Configure in environment variables
3. Add frontend UI for sign-in
4. Test authentication flow
5. Document setup process
