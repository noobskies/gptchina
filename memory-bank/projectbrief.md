# Project Brief

## Project Identity

**Name:** LibreChat  
**Version:** v0.8.1-rc1 (Release Candidate)  
**Repository:** https://github.com/danny-avila/LibreChat  
**Fork Context:** This is "gptchina" - a fork of the upstream LibreChat repository  
**License:** ISC  
**Type:** Open-source AI chatbot platform

## Core Purpose

LibreChat is an all-in-one AI conversation platform that brings together multiple AI providers and models under a single, unified interface. It serves as a comprehensive alternative to ChatGPT Plus, allowing users to integrate various AI services without being locked into a single provider.

## Key Goals

1. **Provider Flexibility** - Support multiple AI providers (OpenAI, Anthropic, Google, Azure, Bedrock, etc.) with seamless switching
2. **Cost Control** - Use free or pay-per-call APIs instead of subscription services
3. **Feature Parity** - Match or exceed ChatGPT's capabilities while remaining open-source
4. **Extensibility** - Enable custom endpoints, plugins, agents, and tools
5. **Privacy & Control** - Allow fully local or cloud deployment with complete data ownership
6. **Enterprise Ready** - Support multi-user authentication, moderation, and administration

## Primary Requirements

### Functional Requirements

- Multi-provider AI model integration with unified chat interface
- User authentication and authorization (OAuth2, LDAP, email)
- Conversation management (save, search, share, export)
- File handling (upload, analyze, process with AI)
- Agent and tool integration (MCP protocol support)
- Code interpretation and execution
- Image generation and editing
- Web search integration
- Speech-to-text and text-to-speech
- RAG (Retrieval Augmented Generation) capabilities

### Technical Requirements

- Monorepo architecture with separate API and client workspaces
- MongoDB for data persistence
- Redis for caching and session management (optional)
- Meilisearch for full-text search
- Docker and Kubernetes deployment support
- Comprehensive testing (Jest, Playwright)
- Internationalization (25+ languages)

### Quality Requirements

- Security: Built-in moderation, rate limiting, token management
- Performance: Efficient caching, optimized bundle sizes
- Maintainability: Clean code standards, comprehensive documentation
- Accessibility: WCAG compliance, screen reader support

## Scope

### In Scope

- Core chat functionality with multiple AI providers
- User management and authentication
- Conversation history and search
- File operations and multimodal interactions
- Agent creation and management
- Plugin and tool integration
- Deployment configurations (Docker, Kubernetes)
- API endpoints for custom integrations

### Out of Scope

- Direct monetization features
- Built-in payment processing
- Mobile native applications (web-responsive only)
- Proprietary AI model training

## Success Criteria

1. Successfully integrate and maintain connections to major AI providers
2. Provide feature parity with leading commercial AI chat platforms
3. Maintain active community contribution and support
4. Enable both local and cloud deployments
5. Ensure security and privacy compliance
6. Support enterprise-grade scalability

## Constraints

- Must remain open-source (ISC license)
- Must support multiple deployment environments
- API costs are user's responsibility
- Requires external services (MongoDB, optional Redis/Meilisearch)
- Subject to upstream AI provider API changes and limitations
