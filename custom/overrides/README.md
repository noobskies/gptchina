# Upstream Overrides

This directory tracks and documents cases where upstream files must be modified. These are modifications that cannot be avoided through plugin patterns, middleware wrapping, or other isolation techniques.

## Purpose

While we strive to keep all custom code in the `custom/` directory, sometimes upstream modifications are unavoidable. This directory serves to:

- **Document** why each modification is necessary
- **Track** which upstream version was modified
- **Plan** how to handle future upstream updates
- **Store** backup copies or patches if needed

## Current Status

✅ **No upstream files currently modified.**

This is the ideal state! When modifications become necessary, document them in:

1. `custom/MODIFICATIONS.md` - Detailed tracking of all modifications
2. `custom/overrides/upstream-version.txt` - Current upstream version
3. Individual override documentation files as needed

## When Modifications Are Necessary

Before modifying an upstream file:

1. **Exhaust all alternatives**:

   - Can this be done with a plugin?
   - Can this be done with middleware wrapping?
   - Can this be done with configuration extension?
   - Can this be done with event-driven integration?
   - Can this be done with dependency injection?

2. **Document thoroughly**:

   - Why the modification is necessary
   - What alternatives were considered and rejected
   - Impact assessment (Low/Medium/High)
   - Update strategy for future upstream changes

3. **Mark clearly in code**:

   ```javascript
   // CUSTOM: gptchina - START MODIFICATION
   // Reason: [Why this is necessary]
   // Upstream version: v0.8.1-rc1 (commit: ba71375)
   // Impact: [Low/Medium/High]
   // Update strategy: [How to handle updates]

   // ... custom code ...

   // CUSTOM: gptchina - END MODIFICATION
   ```

4. **Update tracking**:
   - Add entry to `custom/MODIFICATIONS.md`
   - Update `custom/overrides/upstream-version.txt` if needed
   - Create test to verify modification still works

## Upstream Version Tracking

Track the current upstream version in `upstream-version.txt`:

```
Current Upstream Version: v0.8.1-rc1
Commit: ba71375982ac287ae81707329b4e95d27988f393
Last Sync: 2025-11-09
Modified Files: 0
```

Update this file whenever:

- Syncing with upstream
- Adding/removing modifications
- Upgrading to new upstream version

## Modification Lifecycle

### Adding a Modification

1. Exhaust all alternatives (see above)
2. Document in `custom/MODIFICATIONS.md`
3. Make the modification with clear markers
4. Add tests
5. Update this directory's documentation

### Reviewing Modifications

Regular review schedule:

- **Monthly**: Review all modifications
- **Before Merge**: Check if modifications conflict
- **After Merge**: Verify modifications still valid

### Removing a Modification

When a modification can be eliminated:

1. Refactor to use isolation pattern
2. Remove modification from code
3. Update `custom/MODIFICATIONS.md`
4. Remove associated tests
5. Document removal reason

## Best Practices

1. **Treat modifications as temporary**: Always plan to refactor them away
2. **Keep modifications minimal**: Change as little as possible
3. **Document extensively**: Future you will thank you
4. **Test thoroughly**: Ensure modifications don't break things
5. **Mark clearly**: Use consistent comment markers
6. **Track diligently**: Update all tracking documents
7. **Review regularly**: Schedule periodic reviews

---

**Last Updated**: 2025-11-09

**Modifications**: 0
