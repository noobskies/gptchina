# Project Brief: LibreChat

## Overview

**Project Name:** LibreChat  
**Current Version:** v0.8.1-rc1 ✨  
**Repository:** https://github.com/danny-avila/LibreChat  
**Repository (this fork):** git@github.com:noobskies/gptchina.git  
**Official Website:** https://librechat.ai  
**Documentation:** https://docs.librechat.ai

## Purpose

LibreChat is an open-source, enhanced AI chat platform that serves as a comprehensive alternative to ChatGPT Plus. It provides users with the ability to integrate multiple AI models from various providers (OpenAI, Anthropic, Google, AWS Bedrock, Azure, etc.) in a single, unified interface inspired by ChatGPT's design.

## Core Goals

1. **Multi-Provider Integration** - Support multiple AI providers and models in one platform
2. **Cost Control** - Allow users to use free or pay-per-call APIs instead of subscriptions
3. **Privacy & Self-Hosting** - Enable completely local or self-hosted deployments
4. **Enhanced Features** - Provide advanced capabilities beyond standard chat interfaces
5. **Open Source** - Maintain community-driven development with full transparency
6. **Enterprise Ready** - Support multi-user environments with authentication and moderation

## Key Requirements

### Functional Requirements

- Multi-model AI conversation support
- User authentication and authorization (OAuth2, LDAP, email)
- Conversation management (search, fork, export)
- File upload and multimodal interactions
- Custom AI agents and assistants
- Code interpreter with sandboxed execution
- Web search integration
- Image generation capabilities
- Multilingual UI support
- Mobile app support (Android/iOS via Capacitor)

### Technical Requirements

- Monorepo architecture with workspaces
- RESTful API backend
- Modern React frontend
- MongoDB for data persistence
- Redis for caching (optional)
- Docker containerization
- Horizontal scalability
- MCP (Model Context Protocol) integration

### Non-Functional Requirements

- Security: Token spend limits, rate limiting, moderation
- Performance: Efficient message streaming, caching
- Reliability: Error handling, connection management
- Maintainability: Clean architecture, comprehensive testing
- Accessibility: WCAG compliance, multilingual support

## Scope

### In Scope

- Core chat functionality with multiple AI providers
- User management and authentication
- Conversation persistence and management
- File handling and multimodal support
- Agent/Assistant creation with tools
- Code execution and web search
- Image generation integration
- Mobile application builds
- Payment integration (Stripe)

### Out of Scope (at this level)

- RAG API (separate repository)
- Custom model training
- Direct model hosting

## Success Criteria

1. Stable multi-provider AI chat experience
2. Secure multi-user environment with proper authentication
3. Feature parity or enhancement over ChatGPT Plus
4. Easy deployment via Docker
5. Active community contribution and support
6. Comprehensive documentation
7. Mobile app availability on iOS and Android

## Constraints

- Must maintain compatibility with various AI provider APIs
- Must support self-hosted and cloud deployments
- Must handle API rate limits and token management
- Must ensure user data privacy and security
- Must maintain open-source license (ISC)

## Stakeholders

- **End Users**: Individuals seeking ChatGPT alternatives
- **Organizations**: Companies needing private AI chat solutions
- **Contributors**: Open-source developers and maintainers
- **AI Providers**: OpenAI, Anthropic, Google, AWS, Azure, etc.
