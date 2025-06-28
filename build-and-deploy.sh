#!/bin/bash

echo "🚀 Starting build and deploy process..."

# Step 1: Build the application
echo "📦 Building application..."
npm run build

# Step 2: Verify sitemap.xml is in dist folder
echo "🔍 Verifying sitemap.xml..."
if [ -f "dist/sitemap.xml" ]; then
    echo "✅ sitemap.xml found in dist folder"
else
    echo "❌ sitemap.xml NOT found in dist folder"
    echo "📋 Contents of dist folder:"
    ls -la dist/
    exit 1
fi

# Step 3: Verify robots.txt is in dist folder
echo "🔍 Verifying robots.txt..."
if [ -f "dist/robots.txt" ]; then
    echo "✅ robots.txt found in dist folder"
else
    echo "❌ robots.txt NOT found in dist folder"
    exit 1
fi

# Step 4: Build Docker image
echo "🐳 Building Docker image..."
docker build -t certify-nft:latest .

# Step 5: Run update-prod script
echo "🚀 Deploying to production..."
./update-prod.sh

echo "✅ Build and deploy process completed!"
echo "🌐 Verify sitemap.xml at: https://certify.nft.gpadaka.com/sitemap.xml"
echo "🌐 Verify robots.txt at: https://certify.nft.gpadaka.com/robots.txt" 