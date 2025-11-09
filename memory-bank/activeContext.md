# Active Context

## Current Work Focus

**Status**: Buy Tokens Feature - Implementation Complete

**Active Task**: Stripe payment integration for token purchases completed. Feature includes 4 token packages, multiple payment methods, atomic operations, and comprehensive security measures.

**Key Objective**: Maintain and enhance custom features while following fork-friendly architecture principles.

## Recent Changes

### Buy Tokens Feature Implementation (2025-11-09 12:45-1:02 PM)

**Overview**: Implemented complete Stripe payment integration allowing users to purchase tokens with credit cards, Bitcoin, Google Pay, and Apple Pay.

**Files Created** (15 total):

Backend (8 files):

- `custom/features/buy-tokens/server/controller.js` - Payment intent creation, webhook handling, atomic token addition
- `custom/features/buy-tokens/server/routes.js` - Express routes for payment and webhook endpoints
- `custom/features/buy-tokens/server/stripe.service.js` - Stripe SDK wrapper with payment intent logic
- `custom/features/buy-tokens/shared/constants.js` - Token packages, payment methods, error messages
- `custom/features/buy-tokens/shared/types.ts` - TypeScript type definitions

Frontend (6 files):

- `custom/features/buy-tokens/client/index.tsx` - Barrel export combining button and modal
- `custom/features/buy-tokens/client/BuyTokensButton.tsx` - Green sidebar button component
- `custom/features/buy-tokens/client/BuyTokensIcon.tsx` - Shopping cart SVG icon
- `custom/features/buy-tokens/client/TokenPurchaseModal.tsx` - Modal with package selection and payment UI
- `custom/features/buy-tokens/client/TokenPackageCard.tsx` - Individual package display with discounts
- `custom/features/buy-tokens/client/useBuyTokens.ts` - React hook for state management and API calls

Documentation:

- `custom/features/buy-tokens/README.md` - Comprehensive 450+ line documentation

**Files Modified** (4 upstream files):

1. `client/src/components/Nav/Nav.tsx` - Added BuyTokensButton import and render (~3 lines)
2. `api/server/index.js` - Registered custom routes (~4 lines)
3. `packages/data-schemas/src/schema/balance.ts` - Added `processedPayments` field (~5 lines)
4. `packages/data-schemas/src/types/balance.ts` - Added type definition (~1 line)

**Token Packages**:

- 100,000 tokens - ¥10.00
- 500,000 tokens - ¥35.00 (was ¥50.00, 30% off) - Popular
- 1,000,000 tokens - ¥55.00 (was ¥100.00, 45% off)
- 10,000,000 tokens - ¥280.00 (was ¥1,000.00, 72% off)

**Security Implementation**:

- **Atomic Operations**: Used `findOneAndUpdate()` with `processedPayments` array to prevent duplicate processing from concurrent webhooks
- **Webhook Verification**: Stripe signature verification using `stripe.webhooks.constructEvent()`
- **Server-side Validation**: Package validation, amount verification, user authentication required
- **PCI Compliance**: Stripe Elements handles all sensitive card data

**Key Technical Decisions**:

1. **Atomic Payment Processing**:

   ```javascript
   const updatedBalance = await Balance.findOneAndUpdate(
     { user: userId, processedPayments: { $ne: paymentIntentId } },
     { $inc: { tokenCredits: tokens }, $push: { processedPayments: paymentIntentId } },
     { new: true, upsert: true },
   );
   ```

   - Single database operation prevents race conditions
   - Payment intent ID used for idempotency
   - Follows same pattern as Claim Tokens feature

2. **Payment Flow Architecture**:

   - User selects package → Create payment intent → Stripe processes → Webhook confirms → Tokens added
   - Webhook signature verification ensures authenticity
   - Transaction logging for audit trail

3. **Fork-Friendly Integration**:
   - Minimal upstream modifications (only 4 files)
   - All custom code in `custom/features/buy-tokens/`
   - Follows established Claim Tokens pattern
   - Clear marking with "CUSTOM: gptchina" comments

**Integration Status**:

- ✅ Backend API complete
- ✅ Frontend UI complete
- ✅ Routes registered
- ✅ Schema updated
- ✅ Documentation complete
- ⏳ Requires: Stripe packages installation (`npm install stripe @stripe/stripe-js @stripe/react-stripe-js`)
- ⏳ Requires: Environment variables (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, VITE_STRIPE_PUBLIC_KEY)
- ⏳ Requires: Stripe webhook configuration

**Key Learnings**:

- Webhook-based payment confirmation requires robust idempotency handling
- Stripe Elements provides PCI-compliant card handling without storing sensitive data
- Payment metadata crucial for linking payments to users and packages
- Atomic database operations essential for financial transactions
- Multiple payment methods can share same payment intent flow

**Next Steps for Completion**:

1. Install Stripe packages: `npm install stripe @stripe/stripe-js @stripe/react-stripe-js`
2. Add environment variables to `.env`
3. Configure Stripe webhook in dashboard
4. Run `npm run build:packages`
5. Test with Stripe test cards

### Claim Tokens Bug Fixes & UI Improvements (2025-11-09 12:32-12:37 PM)

**Race Condition Fix** (12:32 PM):

- **Issue**: Multiple simultaneous claim requests could bypass 24-hour cooldown
- **Root Cause**: Read-check-save pattern allowed race conditions
- **Solution**: Implemented atomic database operation using `findOneAndUpdate()` with conditional query
- **Implementation**:
  ```javascript
  // Atomic update at database level
  const updatedBalance = await Balance.findOneAndUpdate(
    {
      user: userId,
      $or: [{ lastTokenClaim: null }, { lastTokenClaim: { $lte: cooldownThreshold } }],
    },
    {
      $inc: { tokenCredits: CLAIM_TOKENS_CONFIG.CLAIM_AMOUNT },
      $set: { lastTokenClaim: now },
    },
    { new: true, upsert: true },
  );
  ```
- **Result**: Thread-safe, prevents duplicate claims regardless of timing
- **File Modified**: `custom/features/claim-tokens/server/controller.js`
- **Packages Rebuilt**: Ran `npm run build:packages` to apply schema changes

**UI Improvements** (12:37 PM):

- **Time Format**: Changed from "23h 2m" to "Claim in 23h 2m 24s" (added seconds and prefix)
- **Button Styling**:
  - Available state: Blue background (`bg-blue-600 hover:bg-blue-700`) with white text
  - Cooldown state: Default styling (no background), grayed out when disabled
  - Text centered with `justify-center`
- **Files Modified**:
  - `custom/features/claim-tokens/client/useClaimTokens.ts` - Time formatting
  - `custom/features/claim-tokens/client/ClaimTokensButton.tsx` - Styling and layout

**Key Learnings**:

- Atomic database operations prevent race conditions in concurrent scenarios
- Following LibreChat's existing patterns (Transaction.js concurrency model) ensures consistency
- Conditional styling based on state provides better UX feedback
- Real-time countdown with seconds creates more engaging user experience

### Fork-Friendly Architecture Implementation (2025-11-09)

**What was done**:

1. **Updated systemPatterns.md** - Added comprehensive fork-friendly architecture section including:
   - Core principles (Isolation First, Clear Boundaries, Merge-Aware Development)
   - Directory structure for custom code (`custom/` directory)
   - Five integration patterns (Plugin, Middleware Wrapping, Configuration Extension, Event-Driven, Dependency Injection)
   - Code marking conventions for custom modifications
   - Feature toggle system with environment variables
   - Frontend and backend custom code strategies
   - Merge conflict prevention strategies
   - Documentation requirements
   - Testing strategies
   - CI/CD considerations
   - Best practices summary

**Key Architectural Patterns Established**:

- **Plugin Architecture**: Register custom features without modifying upstream
- **Middleware Wrapping**: Extend behavior by wrapping upstream middleware
- **Configuration Extension**: Layer custom config over upstream config
- **Event-Driven Integration**: React to upstream events without code changes
- **Dependency Injection**: Swap implementations through existing interfaces

**Documentation Standards**:

- All custom code marked with `// CUSTOM: gptchina - [description]`
- Every custom feature requires `custom/features/[name]/README.md`
- Track upstream modifications in `custom/MODIFICATIONS.md`
- Clear branching strategy and commit message format

### Memory Bank Initialization (2025-11-09)

**Completed earlier**:

- Created complete memory bank structure
- Documented project foundation in `projectbrief.md`
- Captured product context and user needs in `productContext.md`
- Documented system architecture in `systemPatterns.md`
- Cataloged full technology stack in `techContext.md`
- Established this active context tracking file
- Set up progress tracking

**Project Understanding**:

- LibreChat is a multi-provider AI chat platform (OpenAI, Anthropic, Google, Azure, Bedrock, etc.)
- Monorepo architecture with React frontend and Express backend
- Agent system with MCP (Model Context Protocol) integration
- Comprehensive authentication strategies (OAuth2, LDAP, SAML, OpenID)
- Support for code interpretation, web search, RAG, and image generation

## Next Steps

### Immediate Actions

Since this is a fresh initialization, the next steps depend entirely on what the user wants to accomplish. Common starting points might include:

1. **Setup & Configuration**

   - Configure environment variables (.env)
   - Set up MongoDB connection
   - Configure AI provider API keys
   - Set up authentication strategy

2. **Local Development Environment**

   - Verify Node.js version (18+)
   - Install dependencies (`npm install`)
   - Start development servers
   - Set up Docker environment (optional)

3. **Feature Development**

   - Implement new AI provider integration
   - Add custom agent capabilities
   - Create new tool integrations
   - Enhance UI components

4. **Bug Fixes & Maintenance**

   - Address known issues
   - Update dependencies
   - Improve error handling
   - Optimize performance

5. **Deployment**
   - Configure production environment
   - Set up Docker deployment
   - Configure Kubernetes/Helm
   - Deploy to cloud platform

## Active Decisions & Considerations

### Project State

**Current Version**: v0.8.1-rc1 (Release Candidate)

- This is a pre-release version
- May have outstanding bugs or incomplete features
- Should verify changelog before upgrading to stable release

**Fork Status**: "gptchina"

- Forked from upstream: https://github.com/danny-avila/LibreChat
- Current git commit: `ba71375982ac287ae81707329b4e95d27988f393`
- Has upstream remote configured
- May need to sync with upstream periodically

### Technical Decisions to Consider

1. **Database Strategy**

   - MongoDB is required (configured in MONGO_URI)
   - Redis is optional but recommended for production
   - Meilisearch is optional but enhances search experience

2. **Authentication Method**

   - Multiple strategies available (local, OAuth2, LDAP, SAML, OpenID)
   - Need to determine which to enable based on requirements
   - JWT_SECRET and JWT_REFRESH_SECRET need to be set securely

3. **AI Provider Selection**

   - Need to determine which AI providers to enable
   - Each requires API keys
   - Cost considerations for different providers

4. **Storage Backend**

   - Options: Firebase, S3, Azure Blob, Local filesystem
   - Local is simplest for development
   - Cloud storage recommended for production

5. **Deployment Strategy**
   - Docker Compose for simple deployments
   - Kubernetes/Helm for scalable production
   - Consider load balancing and horizontal scaling needs

## Important Patterns & Preferences

### Development Patterns

**Code Organization**:

- Monorepo structure with clear separation of concerns
- Shared packages for common functionality
- TypeScript for type safety
- Zod for runtime validation

**State Management**:

- Recoil for React state (preferred over Redux/Zustand)
- Atoms for primitive state
- Selectors for derived state
- Persistent state via localStorage

**API Design**:

- REST for CRUD operations
- WebSocket/SSE for streaming AI responses
- Validation at controller level using Zod schemas
- Layered architecture (Routes → Controllers → Services → Models)

**Error Handling**:

- Consistent error classes across the codebase
- Validation errors returned with clear messages
- Rate limiting with violation tracking
- Graceful degradation when services unavailable

### Testing Strategy

**Test Coverage**:

- Unit tests with Jest for both frontend and backend
- Integration tests for API endpoints
- End-to-end tests with Playwright
- Accessibility testing

**Test Commands**:

- `npm run test:api` - Backend unit/integration tests
- `npm run test:client` - Frontend tests
- `npm run e2e` - End-to-end tests
- `npm run e2e:a11y` - Accessibility tests

### Code Quality

**Linting & Formatting**:

- ESLint for code quality
- Prettier for consistent formatting
- Pre-commit hooks via Husky
- Automated fixes: `npm run lint:fix` and `npm run format`

**Standards**:

- TypeScript strict mode
- React hooks best practices
- Accessibility (WCAG compliance)
- Security best practices (input validation, XSS prevention, CSRF protection)

## Learnings & Project Insights

### Architecture Insights

1. **Monorepo Benefits**

   - Shared types between frontend and backend prevent mismatches
   - Atomic changes across packages
   - Simplified dependency management
   - Better developer experience

2. **Provider Abstraction**

   - Plugin-based architecture makes adding new AI providers straightforward
   - Each provider has its own client implementing common interface
   - Streaming responses handled consistently across providers

3. **Agent System**

   - Agents are configuration layers over AI models
   - Can include tools, custom instructions, and permissions
   - Shareable with users/groups
   - Support MCP protocol for external tool integration

4. **File Handling**
   - Multiple storage backends supported via strategy pattern
   - File metadata stored in MongoDB
   - Temporary storage for processing before cloud upload
   - Stream-based uploads for large files

### Performance Considerations

1. **Caching Strategy**

   - Redis for distributed caching (optional but recommended)
   - In-memory fallback when Redis unavailable
   - Response streaming reduces perceived latency
   - Aggressive caching with proper invalidation

2. **Database Optimization**

   - MongoDB indexes for common queries
   - Conversation queries are read-heavy
   - Change streams for real-time updates
   - Connection pooling for efficiency

3. **Frontend Performance**
   - Code splitting and lazy loading
   - Virtual scrolling for long conversation lists
   - Optimistic updates for better UX
   - Bundle size optimization with Vite

### Security Patterns

1. **API Key Management**

   - Keys encrypted at rest (CREDS_KEY/CREDS_IV)
   - Never exposed to frontend
   - Secure storage in environment variables or secrets

2. **Rate Limiting**

   - Multiple layers: per-IP, per-user, per-endpoint
   - Violation tracking with automatic banning
   - Configurable limits and windows

3. **Input Validation**
   - Zod schemas for all user inputs
   - XSS protection via sanitization
   - CSRF tokens for state-changing operations
   - Mongoose ODM prevents SQL injection

### Scalability Insights

1. **Horizontal Scaling**

   - Stateless API servers (sessions in Redis)
   - Multiple instances behind load balancer
   - Shared MongoDB replica set
   - Redis cluster for distributed caching

2. **Resource Management**
   - Connection pooling for databases
   - Request queuing and rate limiting
   - Token usage tracking
   - File size limits to prevent abuse

## Common Workflows

### Adding a New AI Provider

1. Create provider client extending `BaseClient`
2. Implement `sendMessage()`, `streamMessage()`, `getModels()`
3. Add provider configuration to environment variables
4. Register provider in client factory
5. Update frontend to show new provider option
6. Add tests for provider integration

### Creating a Custom Agent

1. Define agent configuration (name, model, tools, instructions)
2. Set up permissions (users/groups who can access)
3. Configure tools (MCP servers, built-in tools)
4. Test agent with various prompts
5. Share with intended users

### Debugging Issues

**Backend Issues**:

- Check logs in console or Winston output
- Verify environment variables are set
- Test database connectivity
- Check AI provider API keys and quotas

**Frontend Issues**:

- Check browser console for errors
- Verify API responses in Network tab
- Check Recoil state in React DevTools
- Test with different browsers

**Integration Issues**:

- Verify all services are running (MongoDB, Redis, Meilisearch)
- Check network connectivity between services
- Verify correct ports and URLs
- Test with curl or Postman

## Dependencies to Watch

### Critical Dependencies

**Frontend**:

- `react` and `react-dom`: Core framework
- `recoil`: State management
- `@radix-ui/*`: Accessible components
- `vite`: Build tool

**Backend**:

- `express`: Web framework
- `mongoose`: MongoDB ODM
- `passport`: Authentication
- `ioredis`: Redis client (optional)

**AI Providers**:

- `openai`: OpenAI SDK
- `@anthropic-ai/sdk`: Anthropic SDK
- `@google/generative-ai`: Google SDK

### Update Considerations

- Check changelog before updating major versions
- Test thoroughly after dependency updates
- Consider security patches vs. breaking changes
- Update shared packages atomically

## Configuration Notes

### Essential Environment Variables

**Required**:

- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT tokens
- `JWT_REFRESH_SECRET`: Secret for refresh tokens

**Recommended**:

- `DOMAIN_CLIENT` and `DOMAIN_SERVER`: Proper URLs for production
- AI provider keys based on which providers to enable
- `REDIS_URI`: For production deployments

**Optional**:

- `MEILI_HOST`: Enhanced search functionality
- Storage backend configs (Firebase, S3, Azure)
- OAuth credentials for social login

### Feature Flags

Key toggles in `.env`:

- `ALLOW_REGISTRATION`: Enable/disable new user signup
- `ALLOW_EMAIL_LOGIN`: Enable email/password login
- `ALLOW_SOCIAL_LOGIN`: Enable OAuth login
- `SEARCH`: Enable Meilisearch integration
- `USE_REDIS`: Use Redis for caching/sessions

## Open Questions

Since this is a fresh initialization, there are no open technical questions yet. Questions will emerge as development work begins and specific requirements are clarified.

## Context for Next Session

**What to remember**:

- This is v0.8.1-rc1, a release candidate
- Project is a fork ("gptchina") with upstream remote configured
- Memory bank now fully initialized and ready
- No active development work - awaiting user direction
- All core documentation is complete and up-to-date

**Where to start**:

- Begin by understanding user's specific goals
- Determine if setup/configuration is needed
- Identify any immediate tasks or features to implement
- Review recent upstream changes if syncing needed
