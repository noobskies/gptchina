# Custom Code - gptchina Fork

This directory contains all custom features and modifications specific to the **gptchina** fork of LibreChat. All code in this directory is isolated from upstream to minimize merge conflicts during upstream synchronization.

## Purpose

The `custom/` directory serves as the central location for:

- Custom features and functionality
- Fork-specific integrations
- Configuration extensions
- Utility scripts
- Documentation of upstream modifications

## Core Principles

### 1. Isolation First

Custom features are implemented in dedicated modules within `custom/` to avoid modifying upstream files whenever possible.

### 2. Clear Integration Points

When integration with upstream code is necessary, we use well-defined patterns:

- **Plugin Architecture**: Register features through plugin systems
- **Middleware Wrapping**: Extend behavior by wrapping existing middleware
- **Configuration Extension**: Layer custom config over upstream config
- **Event-Driven Integration**: React to upstream events without code changes
- **Dependency Injection**: Swap implementations through existing interfaces

### 3. Comprehensive Documentation

Every custom feature and modification is thoroughly documented:

- Feature purpose and rationale
- Integration approach with upstream
- Configuration requirements
- Testing strategy
- Maintenance notes

### 4. Merge-Aware Development

All development considers future upstream merges:

- Minimal upstream file modifications
- Clear marking of custom code
- Documented merge strategies
- Regular upstream sync schedule

## Directory Structure

```
custom/
├── README.md                   # This file - overview and guidelines
├── FEATURES.md                 # List of all custom features
├── MODIFICATIONS.md            # Track all upstream file modifications
├── features/                   # Custom feature implementations
│   └── [feature-name]/
│       ├── README.md          # Feature documentation
│       ├── client/            # Frontend components
│       ├── server/            # Backend logic
│       └── shared/            # Shared utilities
├── integrations/               # Third-party integrations
│   └── [integration-name]/
│       └── README.md
├── overrides/                  # Necessary upstream modifications
│   ├── README.md              # Why overrides are needed
│   └── upstream-version.txt   # Track upstream version
├── config/                     # Custom configurations
│   └── librechat.custom.yaml
├── scripts/                    # Custom utility scripts
│   ├── prepare-merge.sh       # Prepare for upstream merge
│   ├── track-upstream.sh      # Monitor upstream changes
│   └── verify-modifications.sh # Verify documentation
└── __tests__/                  # Custom code tests
    ├── integration/
    └── upstream-compatibility/
```

## Development Guidelines

### Adding a New Feature

1. **Plan**

   - Determine if upstream modification is necessary
   - Choose appropriate integration pattern
   - Document in `custom/features/[feature]/README.md`

2. **Implement**

   - Create feature directory: `custom/features/[feature-name]/`
   - Follow isolation patterns
   - Mark any upstream changes with `// CUSTOM: gptchina - [description]`

3. **Test**

   - Write unit tests for feature
   - Write integration tests with upstream
   - Document test strategy

4. **Document**

   - Update `custom/FEATURES.md`
   - Update `custom/MODIFICATIONS.md` if upstream changed
   - Update memory bank (`memory-bank/activeContext.md`, `memory-bank/progress.md`)

5. **Review**
   - Verify minimal upstream impact
   - Check merge conflict potential
   - Validate documentation completeness

### Modifying Upstream Code

⚠️ **Only when absolutely necessary!**

When you must modify an upstream file:

```javascript
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

Then document in `custom/MODIFICATIONS.md`:

- File path and line numbers
- Reason for modification
- Upstream version at time of modification
- Impact assessment
- Alternative approaches considered
- Strategy for handling upstream updates

### Code Marking Standards

**In Custom Files**:

```javascript
/**
 * CUSTOM: gptchina fork
 *
 * Feature: [Feature Name]
 * Created: [Date]
 * Upstream Impact: None (standalone module)
 *
 * [Brief description]
 *
 * See: custom/features/[feature]/README.md
 */
```

**In Modified Upstream Files**:

```javascript
// CUSTOM: gptchina - [Brief description]
// See: custom/features/[feature]/README.md for details
// Upstream version: v0.8.1-rc1 (commit: ba71375)
```

### Environment Variables

All custom feature environment variables must be prefixed with `CUSTOM_`:

```bash
# Custom feature flags
CUSTOM_ENABLE_FEATURE_X=true
CUSTOM_FEATURE_Y_API_KEY=xxx
CUSTOM_FEATURE_Z_TIMEOUT=30000
```

### Commit Messages

Use `[CUSTOM]` prefix for custom feature commits:

```
[CUSTOM] Add analytics feature

- Implement event-based analytics
- No upstream modifications required
- Integration via plugin pattern

Refs: #123
```

## Testing Strategy

### Isolation Testing

Test custom features independently of upstream:

```javascript
// custom/features/[feature]/__tests__/feature.test.js
describe('Custom Feature', () => {
  it('should work independently of upstream', async () => {
    // Test without upstream dependencies
  });
});
```

### Upstream Compatibility Testing

Ensure custom code doesn't break upstream functionality:

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

## Merge Strategy

### Regular Upstream Sync

1. **Before Merging**:

   - Run `custom/scripts/prepare-merge.sh`
   - Review upstream changelog
   - Check if modified files changed upstream
   - Plan refactoring if needed

2. **During Merge**:

   - Resolve conflicts carefully
   - Verify custom modifications still valid
   - Update abstraction layers if needed

3. **After Merge**:
   - Run full test suite
   - Manually test all custom features
   - Update `custom/MODIFICATIONS.md`
   - Update `custom/overrides/upstream-version.txt`
   - Update memory bank

### Monitoring Upstream Changes

Run `custom/scripts/track-upstream.sh` regularly to:

- Check for new upstream commits
- Identify changes to files we've modified
- Plan for upcoming merges

## CI/CD Integration

### Automated Checks

Custom code includes CI/CD workflows to ensure:

- All upstream modifications are documented
- Custom features pass tests
- Upstream compatibility maintained
- Documentation is up to date

See `.github/workflows/custom-checks.yml` for details.

## Best Practices

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
   - Keep custom code in `custom/` when possible
   - Use feature flags for optional functionality
   - Fail gracefully if custom features disabled
   - Maintain backward compatibility

## Getting Help

### Documentation

- **Architecture**: See `memory-bank/systemPatterns.md` - Fork-Friendly Architecture section
- **Features**: See `custom/FEATURES.md` for list of custom features
- **Modifications**: See `custom/MODIFICATIONS.md` for upstream changes
- **Progress**: See `memory-bank/progress.md` for development status

### Development Questions

When adding new custom features:

1. Review this README and relevant architecture documentation
2. Check existing features for patterns and examples
3. Ensure compliance with isolation principles
4. Document thoroughly

## Version Information

- **Fork Name**: gptchina
- **Upstream Repository**: https://github.com/danny-avila/LibreChat
- **Current Upstream Version**: v0.8.1-rc1
- **Last Upstream Sync**: [To be updated on first sync]
- **Upstream Commit**: ba71375982ac287ae81707329b4e95d27988f393

## Contributing

All custom feature development should:

1. Follow the guidelines in this README
2. Use appropriate integration patterns
3. Include comprehensive documentation
4. Include tests
5. Update the memory bank
6. Be reviewed for upstream impact

---

**Last Updated**: 2025-11-09

**Status**: Initial Setup Complete
