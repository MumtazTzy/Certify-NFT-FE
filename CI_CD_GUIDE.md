# CI/CD Pipeline Guide - Certify NFT Frontend

## Overview
This guide explains the CI/CD pipeline and how to ensure it doesn't break when deploying.

## CI/CD Pipeline Flow

### 1. **Trigger**
- **Event:** Push to `prod` branch
- **Location:** `.github/workflows/deploy.yml`
- **Trigger:** `on.push.branches: [prod]`

### 2. **Deployment Process**
```yaml
jobs:
  deploy:
    name: Deploy FE to VPS via Portainer
    runs-on: ubuntu-latest
    steps:
      1. Checkout Code
      2. Remove old container/image on VPS
      3. Copy project files to VPS
      4. Build & Compose on VPS
      5. Clean up old images
```

### 3. **Notification**
- **Platform:** Discord webhook
- **Trigger:** After deployment (success/failure)
- **Content:** Commit info, author, status

## Pre-Deployment Safety Checks

### **Script: `pre-deploy-check.sh`**
Runs 10 critical checks before deployment:

1. ✅ **Branch Check** - Must be on `dev` branch
2. ✅ **Sync Check** - Dev branch must be up to date
3. ✅ **Changes Check** - No uncommitted changes
4. ✅ **Files Check** - All critical files exist
5. ✅ **Dockerfile Check** - Syntax validation
6. ✅ **Build Check** - Application builds successfully
7. ✅ **Sitemap Check** - sitemap.xml in dist folder
8. ✅ **Robots Check** - robots.txt in dist folder
9. ✅ **Workflow Check** - GitHub Actions file exists
10. ✅ **Compose Check** - docker-compose.yml syntax

## Safe Deployment Process

### **Step 1: Pre-Deployment Check**
```bash
# Run safety checks
./pre-deploy-check.sh
```

### **Step 2: Deploy to Production**
```bash
# Deploy with safety checks
./update-prod.sh
```

### **Step 3: Monitor Deployment**
1. **GitHub Actions:** Check deployment status
2. **Discord:** Monitor notifications
3. **Website:** Verify deployment at `https://certify.nft.gpadaka.com`

## Critical Files for CI/CD

### **Required Files:**
- ✅ `index.html` - Main entry point
- ✅ `public/sitemap.xml` - SEO sitemap
- ✅ `public/robots.txt` - SEO robots
- ✅ `src/feature/Home.tsx` - Landing page
- ✅ `Dockerfile` - Container configuration
- ✅ `docker-compose.yml` - Orchestration
- ✅ `vite.config.ts` - Build configuration
- ✅ `package.json` - Dependencies
- ✅ `.github/workflows/deploy.yml` - CI/CD workflow

### **VPS Requirements:**
- ✅ Docker installed
- ✅ Docker Compose installed
- ✅ SSH access configured
- ✅ GitHub secrets configured

## GitHub Secrets Required

### **VPS Configuration:**
```yaml
VPS_HOST: your-vps-ip
VPS_USER: your-vps-username
SSH_PRIVATE_KEY: your-ssh-private-key
```

### **Discord Notification:**
```yaml
DISCORD_WEBHOOK_URL: your-discord-webhook-url
```

## Deployment Timeline

### **Expected Duration:**
- **Pre-deployment checks:** 30-60 seconds
- **Git operations:** 10-30 seconds
- **GitHub Actions trigger:** 1-2 minutes
- **VPS deployment:** 2-5 minutes
- **Total time:** 4-8 minutes

### **Monitoring Points:**
1. **0-1 min:** Git operations complete
2. **1-3 min:** GitHub Actions starts
3. **3-6 min:** VPS deployment
4. **6-8 min:** Discord notification

## Troubleshooting

### **Common Issues:**

#### 1. **Pre-deployment Check Fails**
```bash
# Check current branch
git branch --show-current

# Pull latest changes
git pull origin dev

# Commit changes
git add .
git commit -m "your message"
```

#### 2. **GitHub Actions Fails**
- Check GitHub Actions logs
- Verify VPS connectivity
- Check Docker installation on VPS
- Verify GitHub secrets

#### 3. **VPS Deployment Fails**
- Check SSH access
- Verify Docker/Docker Compose
- Check disk space
- Verify network configuration

#### 4. **Website Not Accessible**
- Check container status: `docker ps`
- Check container logs: `docker logs certify-nft-fe`
- Verify port 3004 is accessible
- Check firewall settings

## Best Practices

### **Before Deployment:**
1. ✅ Run `./pre-deploy-check.sh`
2. ✅ Test build locally: `npm run build`
3. ✅ Verify all files are committed
4. ✅ Ensure you're on `dev` branch
5. ✅ Pull latest changes

### **During Deployment:**
1. ✅ Monitor GitHub Actions
2. ✅ Watch Discord notifications
3. ✅ Don't interrupt the process
4. ✅ Wait for completion

### **After Deployment:**
1. ✅ Verify website accessibility
2. ✅ Check sitemap.xml: `https://certify.nft.gpadaka.com/sitemap.xml`
3. ✅ Test critical functionality
4. ✅ Monitor for any issues

## Rollback Process

### **If Deployment Fails:**
1. **Immediate:** Check GitHub Actions logs
2. **Quick fix:** Fix issue and redeploy
3. **Emergency:** Revert to previous commit
   ```bash
   git checkout prod
   git reset --hard HEAD~1
   git push -f origin prod
   ```

## Monitoring & Alerts

### **Success Indicators:**
- ✅ GitHub Actions: Green checkmark
- ✅ Discord: Success notification
- ✅ Website: Accessible and functional
- ✅ Sitemap: Accessible at `/sitemap.xml`

### **Failure Indicators:**
- ❌ GitHub Actions: Red X
- ❌ Discord: Failure notification
- ❌ Website: Not accessible
- ❌ Container: Not running

## Security Considerations

### **Secrets Management:**
- ✅ Never commit secrets to repository
- ✅ Use GitHub secrets for sensitive data
- ✅ Rotate SSH keys regularly
- ✅ Monitor access logs

### **Access Control:**
- ✅ Limit VPS access to necessary users
- ✅ Use SSH keys instead of passwords
- ✅ Monitor deployment logs
- ✅ Regular security updates

## Performance Optimization

### **Build Optimization:**
- ✅ Use Docker layer caching
- ✅ Optimize image size
- ✅ Remove unnecessary files
- ✅ Use multi-stage builds

### **Deployment Optimization:**
- ✅ Parallel job execution
- ✅ Efficient file transfer
- ✅ Quick container startup
- ✅ Minimal downtime

## Conclusion

The CI/CD pipeline is designed to be:
- ✅ **Safe:** Pre-deployment checks prevent failures
- ✅ **Fast:** Optimized for quick deployment
- ✅ **Reliable:** Multiple validation points
- ✅ **Monitored:** Full visibility into process
- ✅ **Recoverable:** Easy rollback if needed

**Always run `./pre-deploy-check.sh` before `./update-prod.sh` to ensure a smooth deployment!** 