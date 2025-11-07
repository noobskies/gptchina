# Product Context: LibreChat

## Why LibreChat Exists

### The Problem

1. **Subscription Fatigue**: ChatGPT Plus costs $20/month per user, which becomes expensive for teams and heavy users
2. **Vendor Lock-in**: Users are limited to OpenAI's models and features
3. **Privacy Concerns**: Data is sent to third-party servers with limited control
4. **Feature Limitations**: ChatGPT Plus lacks certain advanced features users need
5. **API Cost Efficiency**: Users with API access often pay less than subscription costs
6. **Multi-Model Access**: No unified interface for different AI providers

### The Solution

LibreChat provides a self-hosted, open-source alternative that:

- Eliminates subscription fees by using pay-per-call APIs
- Supports multiple AI providers in one interface
- Gives users full control over their data
- Enables custom deployments and integrations
- Offers enterprise features like user management and moderation
- Maintains feature parity with ChatGPT Plus while adding enhancements

## User Experience Goals

### Core Experience Principles

1. **Familiar Yet Enhanced**

   - UI/UX inspired by ChatGPT for minimal learning curve
   - Enhanced with additional capabilities and customization
   - Consistent experience across web and mobile

2. **Flexibility Without Complexity**

   - Easy to start with defaults
   - Power features available when needed
   - Graceful degradation when features unavailable

3. **Transparent Operations**

   - Clear indication of which model is being used
   - Visible token usage and costs
   - Obvious error messages and recovery paths

4. **Performance & Reliability**
   - Fast message streaming
   - Reliable conversation persistence
   - Smooth switching between models/endpoints

### Primary User Journeys

#### Individual User

1. Deploys LibreChat locally or on cloud
2. Configures API keys for preferred providers
3. Starts conversations with any available model
4. Saves and organizes conversations
5. Switches models mid-conversation as needed
6. Exports conversations for backup/sharing

#### Organization Administrator

1. Deploys LibreChat for team
2. Configures SSO/LDAP authentication
3. Sets up user roles and permissions
4. Configures token spend limits
5. Monitors usage and costs
6. Manages model availability per user/team

#### Power User

1. Creates custom AI agents with tools
2. Integrates code interpreter for data analysis
3. Uses web search for current information
4. Uploads files for analysis
5. Generates and edits images
6. Chains multiple models for complex tasks

## Key Features & Value Propositions

### For End Users

**Conversation Management**

- Create, search, and organize unlimited conversations
- Fork conversations at any point for exploration
- Export to multiple formats (JSON, markdown, text, screenshots)
- Import from other platforms (ChatGPT, Chatbot UI)

**Multi-Modal Interactions**

- Upload and analyze images with vision-capable models
- Chat with documents and files
- Generate images from text descriptions
- Execute code securely in sandboxed environments

**Advanced AI Capabilities**

- Create custom AI agents without coding
- Use web search for up-to-date information
- Chain of thought reasoning with compatible models
- Code artifacts for interactive code generation

**Personalization**

- Save custom presets for different use cases
- Switch models mid-conversation
- Edit and resubmit messages
- Customize UI appearance and behavior

### For Organizations

**Enterprise Features**

- Multi-user support with role-based access
- OAuth2, LDAP, and custom authentication
- Token spend tracking and limits
- Built-in content moderation
- Audit logging and user analytics

**Deployment Flexibility**

- Self-hosted for data privacy
- Docker containerization
- Kubernetes support via Helm charts
- Cloud deployment templates (Railway, Zeabur, Sealos)

**Cost Control**

- Pay only for API usage
- Set per-user token limits
- Track spending across organization
- Use free/cheaper models when appropriate

### For Developers

**Extensibility**

- Plugin system for custom tools
- MCP (Model Context Protocol) support
- Custom endpoint configuration
- Open-source for modifications
- Comprehensive API documentation

**Integration Options**

- RESTful API for external integrations
- Webhook support for events
- Custom authentication providers
- Database flexibility (MongoDB)

## How It Should Work

### Core Workflows

#### Starting a Conversation

1. User selects endpoint/model from dropdown
2. (Optional) Loads a preset with specific parameters
3. Types message and sends
4. System streams response in real-time
5. Conversation auto-saves continuously

#### Switching Models

1. User clicks model selector mid-conversation
2. Selects different endpoint/model
3. Continues conversation with new model
4. Previous messages remain in context
5. Clear indication of model switch in UI

#### Using Advanced Features

1. User attaches file to message
2. System automatically enables file-compatible models
3. Model analyzes file and responds
4. File remains in conversation context
5. User can reference file in follow-ups

#### Managing Agents

1. User creates new agent in interface
2. Selects tools (code interpreter, web search, etc.)
3. Configures agent parameters and instructions
4. Saves agent for reuse
5. Starts conversation with agent
6. Agent uses tools automatically when needed

### Quality Standards

**Performance**

- Message streaming begins within 2 seconds
- UI remains responsive during generation
- Conversation loads in under 1 second
- Search results appear instantly (< 500ms)

**Reliability**

- 99.9% uptime for self-hosted deployments
- Graceful handling of API failures
- Automatic retry with exponential backoff
- Persistent conversation state even on crashes

**Usability**

- Zero learning curve for ChatGPT users
- Keyboard shortcuts for power users
- Mobile-responsive on all screen sizes
- Accessible to screen readers (WCAG 2.1)

**Security**

- Encrypted data at rest and in transit
- Secure token storage
- Rate limiting to prevent abuse
- Input sanitization and validation
- Regular security audits

## Success Metrics

### User Satisfaction

- Time to first message < 5 minutes (new users)
- Conversation completion rate > 90%
- User retention rate > 70% (monthly)
- Feature adoption rates (agents, tools, etc.)

### System Performance

- API response time < 2 seconds (p95)
- Message streaming latency < 500ms
- Conversation load time < 1 second (p95)
- Error rate < 0.1%

### Business Impact

- Cost per conversation vs. ChatGPT Plus
- API usage efficiency (tokens per conversation)
- User growth rate
- Community contribution rate
