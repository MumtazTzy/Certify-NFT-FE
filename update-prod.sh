#!/bin/bash

echo "🚀 Starting production deployment process..."
echo "============================================="

# Run pre-deployment checks
if [ -f "./pre-deploy-check.sh" ]; then
    echo "🔍 Running pre-deployment checks..."
    if ! ./pre-deploy-check.sh; then
        echo "❌ Pre-deployment checks failed. Aborting deployment."
        exit 1
    fi
    echo "✅ Pre-deployment checks passed!"
else
    echo "⚠️  Warning: pre-deploy-check.sh not found. Skipping checks."
fi

echo ""
echo "🔄 Starting deployment process..."

# Switch to prod branch
echo "1. Switching to prod branch..."
git checkout prod

# Reset prod to match dev
echo "2. Resetting prod branch to match dev..."
git reset --hard dev

# Force push to remote prod
echo "3. Force pushing to remote prod branch..."
git push -f origin prod

echo ""
echo "✅ Production branch has been updated successfully!"
echo ""
echo "📋 Next steps:"
echo "   - GitHub Actions will automatically trigger deployment"
echo "   - Check deployment status at: https://github.com/your-repo/actions"
echo "   - Monitor Discord notifications for deployment status"
echo "   - Verify deployment at: https://certify.nft.gpadaka.com"
echo ""
echo "🔍 CI/CD Pipeline Status:"
echo "   - Trigger: Push to prod branch"
echo "   - Action: Deploy to VPS via Portainer"
echo "   - Notification: Discord webhook"
echo ""
echo "⏱️  Expected deployment time: 2-5 minutes" 

