#!/bin/bash

# Prepare for Upstream Merge Script
# This script helps prepare the fork for merging upstream changes
# by running checks and tests before the actual merge

set -e

UPSTREAM_REMOTE="upstream"
MODIFICATIONS_FILE="custom/MODIFICATIONS.md"

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Preparing for Upstream Merge - gptchina Fork${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

# Step 1: Check working directory is clean
echo -e "${BLUE}[1/6] Checking working directory status...${NC}"
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${RED}✗ Working directory is not clean${NC}"
    echo
    echo "You have uncommitted changes:"
    git status --short
    echo
    echo -e "${YELLOW}Please commit or stash your changes before merging upstream.${NC}"
    exit 1
else
    echo -e "${GREEN}✓ Working directory is clean${NC}"
fi
echo

# Step 2: Fetch latest upstream
echo -e "${BLUE}[2/6] Fetching latest upstream changes...${NC}"
git fetch "$UPSTREAM_REMOTE"
echo -e "${GREEN}✓ Fetched upstream changes${NC}"
echo

# Step 3: List modified files
echo -e "${BLUE}[3/6] Checking custom modifications...${NC}"
MODIFIED_FILES=$(grep "^### " "$MODIFICATIONS_FILE" | sed 's/### //' | grep -v "\[" || true)

if [ -z "$MODIFIED_FILES" ]; then
    echo -e "${GREEN}✓ No custom modifications to upstream files${NC}"
    echo -e "${GREEN}  Merge should be straightforward!${NC}"
else
    echo -e "${YELLOW}⚠️  Found custom modifications:${NC}"
    echo "$MODIFIED_FILES" | while read -r file; do
        echo "  - $file"
    done
    echo
    echo -e "${BLUE}Checking for potential conflicts...${NC}"
    
    CONFLICTS=0
    echo "$MODIFIED_FILES" | while read -r file; do
        if git diff --name-only HEAD..$UPSTREAM_REMOTE/main | grep -q "^$file$"; then
            echo -e "${RED}  ⚠️  $file - CHANGED IN UPSTREAM${NC}"
            CONFLICTS=$((CONFLICTS + 1))
        else
            echo -e "${GREEN}  ✓ $file - no upstream changes${NC}"
        fi
    done
    
    if [ "$CONFLICTS" -gt 0 ]; then
        echo
        echo -e "${YELLOW}Review custom/MODIFICATIONS.md for merge strategies.${NC}"
    fi
fi
echo

# Step 4: Check for merge conflicts preview
echo -e "${BLUE}[4/6] Simulating merge to detect conflicts...${NC}"
MERGE_BASE=$(git merge-base HEAD "$UPSTREAM_REMOTE/main")
CONFLICTS=$(git merge-tree "$MERGE_BASE" HEAD "$UPSTREAM_REMOTE/main" | grep -c "^<<<<<" || true)

if [ "$CONFLICTS" -eq 0 ]; then
    echo -e "${GREEN}✓ No merge conflicts detected${NC}"
else
    echo -e "${RED}⚠️  Potential merge conflicts detected: $CONFLICTS conflict markers${NC}"
    echo
    echo -e "${YELLOW}Files with potential conflicts:${NC}"
    git merge-tree "$MERGE_BASE" HEAD "$UPSTREAM_REMOTE/main" | grep -B2 "^<<<<<" | grep "^changed in both" | cut -d' ' -f4
fi
echo

# Step 5: Run tests
echo -e "${BLUE}[5/6] Running test suite...${NC}"
if [ -f "package.json" ]; then
    if command -v npm &> /dev/null; then
        echo "Running npm tests..."
        if npm test 2>&1 | tail -n 5; then
            echo -e "${GREEN}✓ Tests passed${NC}"
        else
            echo -e "${YELLOW}⚠️  Some tests failed. Review before merging.${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  npm not found, skipping tests${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  No package.json found, skipping tests${NC}"
fi
echo

# Step 6: Generate merge report
echo -e "${BLUE}[6/6] Generating merge report...${NC}"

UPSTREAM_COMMITS=$(git log --oneline HEAD..$UPSTREAM_REMOTE/main | wc -l)
UPSTREAM_FILES=$(git diff --name-only HEAD..$UPSTREAM_REMOTE/main | wc -l)

echo
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Merge Report${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo
echo "Upstream commits to merge: $UPSTREAM_COMMITS"
echo "Files changed in upstream: $UPSTREAM_FILES"
echo "Custom modifications: $(echo "$MODIFIED_FILES" | wc -l)"
echo "Potential conflicts: $CONFLICTS"
echo

# Recommendations
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Recommendations${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

if [ "$CONFLICTS" -eq 0 ] && [ -z "$MODIFIED_FILES" ]; then
    echo -e "${GREEN}✓ Merge looks safe to proceed!${NC}"
    echo
    echo "Recommended steps:"
    echo "  1. Create a merge branch: git checkout -b merge-upstream-$(date +%Y%m%d)"
    echo "  2. Merge upstream: git merge $UPSTREAM_REMOTE/main"
    echo "  3. Test thoroughly"
    echo "  4. Update custom/overrides/upstream-version.txt"
    echo "  5. Merge to main when confident"
elif [ "$CONFLICTS" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Merge requires attention${NC}"
    echo
    echo "Recommended steps:"
    echo "  1. Review potential conflicts above"
    echo "  2. Check custom/MODIFICATIONS.md for update strategies"
    echo "  3. Create a merge branch: git checkout -b merge-upstream-$(date +%Y%m%d)"
    echo "  4. Merge upstream: git merge $UPSTREAM_REMOTE/main"
    echo "  5. Resolve conflicts carefully"
    echo "  6. Test all custom features"
    echo "  7. Update custom/overrides/upstream-version.txt"
    echo "  8. Update custom/MODIFICATIONS.md if needed"
else
    echo -e "${GREEN}Merge should be straightforward${NC}"
    echo
    echo "Recommended steps:"
    echo "  1. Create a merge branch: git checkout -b merge-upstream-$(date +%Y%m%d)"
    echo "  2. Merge upstream: git merge $UPSTREAM_REMOTE/main"
    echo "  3. Test custom features"
    echo "  4. Update custom/overrides/upstream-version.txt"
    echo "  5. Merge to main when confident"
fi

echo
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo
echo "Ready to proceed? Create a merge branch and test the merge:"
echo "  git checkout -b merge-upstream-$(date +%Y%m%d)"
echo "  git merge $UPSTREAM_REMOTE/main"
echo
