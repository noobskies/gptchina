# Custom Features

This directory contains all custom feature implementations for the gptchina fork. Each feature is organized in its own subdirectory with a standardized structure.

## Directory Structure

Each feature should follow this structure:

```
features/
└── [feature-name]/
    ├── README.md              # Feature documentation
    ├── client/                # Frontend components (if needed)
    │   ├── components/
    │   ├── hooks/
    │   └── utils/
    ├── server/                # Backend logic (if needed)
    │   ├── routes/
    │   ├── controllers/
    │   ├── services/
    │   └── models/
    ├── shared/                # Shared utilities
    │   ├── types/
    │   └── utils/
    ├── __tests__/             # Tests
    │   ├── client/
    │   ├── server/
    │   └── integration/
    └── config/                # Feature-specific configuration
        └── defaults.yaml
```

## Creating a New Feature

1. **Create Feature Directory**:

   ```bash
   mkdir -p custom/features/[feature-name]/{client,server,shared,__tests__,config}
   ```

2. **Copy Template README**:
   Use the template from `custom/README.md` or base it on existing features.

3. **Implement Feature**:

   - Follow isolation patterns
   - Use appropriate integration pattern (Plugin, Middleware, etc.)
   - Keep upstream modifications minimal

4. **Document**:

   - Update `custom/FEATURES.md`
   - Create feature README with all details
   - Update `custom/MODIFICATIONS.md` if needed

5. **Test**:
   - Write unit tests
   - Write integration tests
   - Test upstream compatibility

## Feature Guidelines

### Naming Conventions

- Use kebab-case for directory names: `my-feature-name`
- Use PascalCase for React components: `MyFeatureComponent`
- Use camelCase for functions and variables: `myFeatureFunction`
- Prefix environment variables with `CUSTOM_`: `CUSTOM_MY_FEATURE_ENABLED`

### Integration Patterns

Choose the appropriate pattern based on your needs:

1. **Plugin Architecture**: For features that extend core functionality
2. **Middleware Wrapping**: For features that enhance existing behavior
3. **Configuration Extension**: For features that add new configuration options
4. **Event-Driven**: For features that react to system events
5. **Dependency Injection**: For features that replace implementations

See `memory-bank/systemPatterns.md` for detailed pattern explanations.

### Code Organization

**Frontend (client/)**:

- `components/`: React components
- `hooks/`: Custom React hooks
- `utils/`: Utility functions
- Keep components small and focused
- Use TypeScript for type safety

**Backend (server/)**:

- `routes/`: Express routes
- `controllers/`: Request handlers
- `services/`: Business logic
- `models/`: Data models
- Follow layered architecture

**Shared (shared/)**:

- `types/`: TypeScript type definitions
- `utils/`: Shared utility functions
- `constants/`: Shared constants
- Code used by both frontend and backend

### Testing Requirements

Every feature must include:

1. **Unit Tests**:

   - Test individual functions and components
   - Mock external dependencies
   - Aim for >80% coverage

2. **Integration Tests**:

   - Test feature as a whole
   - Test interactions with upstream code
   - Verify feature works end-to-end

3. **Upstream Compatibility Tests**:
   - Verify feature doesn't break upstream functionality
   - Test with upstream configuration disabled
   - Document any upstream dependencies

### Documentation Requirements

Every feature README must include:

1. **Overview**: What the feature does and why
2. **Integration Approach**: How it integrates with upstream
3. **Configuration**: All configuration options
4. **API**: Public APIs exposed by the feature
5. **Dependencies**: Upstream and external dependencies
6. **Testing**: How to test the feature
7. **Maintenance**: Known issues, todos, update strategy

## Current Features

<!-- List current features here as they are added -->

No custom features implemented yet.

## Feature Templates

### Minimal Feature Template

For simple features that don't need full structure:

```
features/
└── simple-feature/
    ├── README.md
    ├── index.js              # Main feature file
    └── __tests__/
        └── index.test.js
```

### Full-Stack Feature Template

For complex features spanning frontend and backend:

```
features/
└── complex-feature/
    ├── README.md
    ├── client/
    │   ├── components/
    │   │   ├── FeatureComponent.tsx
    │   │   └── index.ts
    │   ├── hooks/
    │   │   └── useFeature.ts
    │   └── index.ts
    ├── server/
    │   ├── routes/
    │   │   └── index.js
    │   ├── controllers/
    │   │   └── featureController.js
    │   ├── services/
    │   │   └── featureService.js
    │   └── index.js
    ├── shared/
    │   ├── types/
    │   │   └── feature.types.ts
    │   └── utils/
    │       └── helpers.ts
    ├── __tests__/
    │   ├── client/
    │   ├── server/
    │   └── integration/
    └── config/
        └── defaults.yaml
```

## Best Practices

1. **Keep Features Isolated**: Each feature should work independently
2. **Minimize Upstream Impact**: Prefer patterns that don't modify upstream code
3. **Document Thoroughly**: Explain why the feature exists and how it works
4. **Test Comprehensively**: Ensure feature works and doesn't break anything
5. **Follow Conventions**: Use established patterns and naming conventions
6. **Consider Upgrades**: Design features to survive upstream updates
7. **Be Consistent**: Follow the style of existing custom features

## Common Patterns

### Feature with Environment Toggle

```javascript
// custom/features/my-feature/server/index.js
/**
 * CUSTOM: gptchina fork - My Feature
 */

export function initMyFeature(app) {
  if (process.env.CUSTOM_MY_FEATURE_ENABLED !== 'true') {
    console.log('[CustomFeature] My Feature disabled');
    return;
  }

  console.log('[CustomFeature] Initializing My Feature');
  // Feature initialization logic
}
```

### Feature with Configuration File

```javascript
// custom/features/my-feature/server/config.js
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

export function loadFeatureConfig() {
  const configPath = path.join(__dirname, '../config/defaults.yaml');

  try {
    const config = yaml.load(fs.readFileSync(configPath, 'utf8'));
    return config;
  } catch (error) {
    console.error('[MyFeature] Failed to load config:', error);
    return {};
  }
}
```

### Feature with Event Listener

```javascript
// custom/features/my-feature/server/listener.js
import { eventEmitter } from '../../../api/lib/events.js';

export function registerEventListeners() {
  eventEmitter.on('message:sent', async (data) => {
    // React to message sent event
    await handleMessageSent(data);
  });

  eventEmitter.on('user:login', async (user) => {
    // React to user login event
    await handleUserLogin(user);
  });
}
```

## Troubleshooting

### Feature Not Loading

- Check environment variable is set
- Verify feature is registered in plugin loader
- Check console logs for initialization errors
- Ensure all dependencies are installed

### Feature Breaking Upstream

- Review upstream compatibility tests
- Check if upstream code changed
- Verify modification markers are correct
- Update integration approach if needed

### Feature Performance Issues

- Profile feature code
- Check for unnecessary computations
- Optimize database queries
- Add caching where appropriate

---

**Last Updated**: 2025-11-09
