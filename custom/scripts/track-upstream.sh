#!/bin/bash

# Track Upstream Changes Script
# This script helps monitor changes in the upstream LibreChat repository
# and identifies potential conflicts with our custom modifications

set -e

UPSTREAM_REMOTE="upstream"
UPSTREAM_URL="https://github.com/danny-avila/LibreChat.git"
MODIFICATIONS_FILE="custom/MODIFICATIONS.md"
VERSION_FILE="custom/overrides/upstream-version.txt"

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Tracking Upstream Changes - gptchina Fork${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

# Check if upstream remote exists
if ! git remote get-url "$UPSTREAM_REMOTE" &> /dev/null; then
    echo -e "${YELLOW}⚠️  Upstream remote not found. Adding...${NC}"
    git remote add "$UPSTREAM_REMOTE" "$UPSTREAM_URL"
    echo -e "${GREEN}✓ Added upstream remote: $UPSTREAM_URL${NC}"
else
    echo -e "${GREEN}✓ Upstream remote exists${NC}"
fi

echo

# Fetch upstream changes
echo -e "${BLUE}Fetching upstream changes...${NC}"
git fetch "$UPSTREAM_REMOTE"
echo -e "${GREEN}✓ Fetched upstream changes${NC}"
echo

# Get current upstream version from version file
CURRENT_VERSION=$(grep "Current Upstream Version:" "$VERSION_FILE" | cut -d':' -f2 | xargs)
CURRENT_COMMIT=$(grep "Commit:" "$VERSION_FILE" | head -n1 | cut -d':' -f2 | xargs)

echo -e "${BLUE}Current fork status:${NC}"
echo "  Version: $CURRENT_VERSION"
echo "  Commit: $CURRENT_COMMIT"
echo

# Show upstream changes since our last sync
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Changes in upstream since last sync${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

UPSTREAM_COMMITS=$(git log --oneline HEAD..$UPSTREAM_REMOTE/main | wc -l)

if [ "$UPSTREAM_COMMITS" -eq 0 ]; then
    echo -e "${GREEN}✓ Fork is up to date with upstream${NC}"
else
    echo -e "${YELLOW}⚠️  Upstream has $UPSTREAM_COMMITS new commits${NC}"
    echo
    echo -e "${BLUE}Recent upstream commits:${NC}"
    git log --oneline --no-decorate -10 HEAD..$UPSTREAM_REMOTE/main
fi

echo
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Checking for conflicts with custom modifications${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

# Extract modified file paths from MODIFICATIONS.md
MODIFIED_FILES=$(grep "^### " "$MODIFICATIONS_FILE" | sed 's/### //' | grep -v "\[" || true)

if [ -z "$MODIFIED_FILES" ]; then
    echo -e "${GREEN}✓ No custom modifications to upstream files${NC}"
    echo -e "${GREEN}  This is ideal! All custom code is isolated.${NC}"
else
    echo -e "${YELLOW}⚠️  Found custom modifications to upstream files:${NC}"
    echo "$MODIFIED_FILES" | while read -r file; do
        echo "  - $file"
    done
    
    echo
    echo -e "${BLUE}Checking if modified files changed in upstream...${NC}"
    
    CONFLICTS_FOUND=0
    echo "$MODIFIED_FILES" | while read -r file; do
        if git diff --name-only HEAD..$UPSTREAM_REMOTE/main | grep -q "^$file$"; then
            echo -e "${RED}⚠️  CONFLICT RISK: $file changed in upstream!${NC}"
            CONFLICTS_FOUND=$((CONFLICTS_FOUND + 1))
            
            # Show the changes
            echo -e "${BLUE}   Changes in upstream:${NC}"
            git log --oneline --no-decorate -5 HEAD..$UPSTREAM_REMOTE/main -- "$file" | sed 's/^/     /'
        else
            echo -e "${GREEN}✓ $file - no upstream changes${NC}"
        fi
    done
    
    if [ "$CONFLICTS_FOUND" -gt 0 ]; then
        echo
        echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${RED}  ⚠️  WARNING: Potential merge conflicts detected!${NC}"
        echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo
        echo "Review the changes above before merging upstream updates."
        echo "See custom/MODIFICATIONS.md for update strategies."
    fi
fi

echo
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo
echo "  Upstream commits ahead: $UPSTREAM_COMMITS"
echo "  Current version: $CURRENT_VERSION"
echo "  Current commit: $CURRENT_COMMIT"
echo

if [ "$UPSTREAM_COMMITS" -gt 0 ]; then
    echo -e "${YELLOW}Recommended actions:${NC}"
    echo "  1. Review upstream changelog"
    echo "  2. Run: bash custom/scripts/prepare-merge.sh"
    echo "  3. Test merge in a separate branch"
    echo "  4. Update custom/overrides/upstream-version.txt after merge"
else
    echo -e "${GREEN}No action needed. Fork is up to date.${NC}"
fi

echo
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
