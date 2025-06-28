#!/bin/bash

echo "🔍 Pre-deployment CI/CD Check"
echo "=============================="

# Check 1: Verify we're on dev branch
echo "1. Checking current branch..."
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "dev" ]; then
    echo "❌ ERROR: You must be on 'dev' branch. Current branch: $CURRENT_BRANCH"
    echo "   Run: git checkout dev"
    exit 1
fi
echo "✅ Current branch: $CURRENT_BRANCH"

# Check 2: Verify dev branch is up to date
echo "2. Checking if dev branch is up to date..."
git fetch origin
LOCAL_COMMIT=$(git rev-parse HEAD)
REMOTE_COMMIT=$(git rev-parse origin/dev)
if [ "$LOCAL_COMMIT" != "$REMOTE_COMMIT" ]; then
    echo "❌ ERROR: Local dev branch is not up to date with remote"
    echo "   Run: git pull origin dev"
    exit 1
fi
echo "✅ Dev branch is up to date"

# Check 3: Check for uncommitted changes
echo "3. Checking for uncommitted changes..."
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ ERROR: You have uncommitted changes"
    echo "   Please commit or stash your changes first"
    git status --short
    exit 1
fi
echo "✅ No uncommitted changes"

# Check 4: Verify critical files exist
echo "4. Checking critical files..."
CRITICAL_FILES=(
    "index.html"
    "public/sitemap.xml"
    "public/robots.txt"
    "src/feature/Home.tsx"
    "Dockerfile"
    "docker-compose.yml"
    "vite.config.ts"
    "package.json"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ ERROR: Critical file missing: $file"
        exit 1
    fi
    echo "✅ $file exists"
done

# Check 5: Verify Dockerfile syntax
echo "5. Checking Dockerfile syntax..."
if ! docker build --dry-run . > /dev/null 2>&1; then
    echo "❌ ERROR: Dockerfile has syntax errors"
    echo "   Run: docker build --dry-run ."
    exit 1
fi
echo "✅ Dockerfile syntax is valid"

# Check 6: Verify package.json dependencies
echo "6. Checking package.json..."
if ! npm run build > /dev/null 2>&1; then
    echo "❌ ERROR: Build failed. Check for missing dependencies or build errors"
    echo "   Run: npm run build"
    exit 1
fi
echo "✅ Build successful"

# Check 7: Verify sitemap.xml is accessible after build
echo "7. Checking sitemap.xml in dist folder..."
if [ ! -f "dist/sitemap.xml" ]; then
    echo "❌ ERROR: sitemap.xml not found in dist folder after build"
    exit 1
fi
echo "✅ sitemap.xml found in dist folder"

# Check 8: Verify robots.txt is accessible after build
echo "8. Checking robots.txt in dist folder..."
if [ ! -f "dist/robots.txt" ]; then
    echo "❌ ERROR: robots.txt not found in dist folder after build"
    exit 1
fi
echo "✅ robots.txt found in dist folder"

# Check 9: Verify GitHub Actions workflow file
echo "9. Checking GitHub Actions workflow..."
if [ ! -f ".github/workflows/deploy.yml" ]; then
    echo "❌ ERROR: GitHub Actions workflow file missing"
    exit 1
fi
echo "✅ GitHub Actions workflow exists"

# Check 10: Verify docker-compose.yml syntax
echo "10. Checking docker-compose.yml syntax..."
if ! docker-compose config > /dev/null 2>&1; then
    echo "❌ ERROR: docker-compose.yml has syntax errors"
    echo "   Run: docker-compose config"
    exit 1
fi
echo "✅ docker-compose.yml syntax is valid"

echo ""
echo "🎉 All checks passed! CI/CD pipeline is ready for deployment."
echo ""
echo "📋 Summary:"
echo "   - Branch: $CURRENT_BRANCH ✅"
echo "   - Up to date: ✅"
echo "   - No uncommitted changes: ✅"
echo "   - Critical files: ✅"
echo "   - Dockerfile: ✅"
echo "   - Build: ✅"
echo "   - Sitemap: ✅"
echo "   - Robots.txt: ✅"
echo "   - GitHub Actions: ✅"
echo "   - Docker Compose: ✅"
echo ""
echo "🚀 You can now safely run: ./update-prod.sh" 