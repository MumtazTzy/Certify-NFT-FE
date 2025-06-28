#!/bin/bash

echo "🔍 Verifying sitemap.xml deployment..."

# Check if sitemap.xml exists in dist folder after build
if [ -f "dist/sitemap.xml" ]; then
    echo "✅ sitemap.xml found in dist folder"
else
    echo "❌ sitemap.xml NOT found in dist folder"
    exit 1
fi

# Check if robots.txt exists in dist folder
if [ -f "dist/robots.txt" ]; then
    echo "✅ robots.txt found in dist folder"
else
    echo "❌ robots.txt NOT found in dist folder"
    exit 1
fi

# Check if sitemap.xml is accessible via HTTP
echo "🌐 Testing sitemap.xml accessibility..."
curl -s -o /dev/null -w "%{http_code}" https://certify.nft.gpadaka.com/sitemap.xml
echo " - HTTP status for sitemap.xml"

# Check if robots.txt is accessible via HTTP
curl -s -o /dev/null -w "%{http_code}" https://certify.nft.gpadaka.com/robots.txt
echo " - HTTP status for robots.txt"

echo "📋 Sitemap content preview:"
curl -s https://certify.nft.gpadaka.com/sitemap.xml | head -10

echo "🎯 Verification complete!" 