# Deployment Guide - Ensuring sitemap.xml is Deployed to VPS

## Overview
This guide ensures that `sitemap.xml` and other SEO-critical files are properly deployed to your VPS via Docker.

## Files Modified for SEO

### 1. `index.html`
- ✅ Added comprehensive meta tags
- ✅ Added Open Graph tags
- ✅ Added Twitter Card tags
- ✅ Added structured data (JSON-LD)
- ✅ Optimized title and description for "certify nft"

### 2. `src/feature/Home.tsx`
- ✅ Enhanced keyword density for "certify nft"
- ✅ Added FAQ section for SEO
- ✅ Optimized headings and content
- ✅ Improved CTA buttons

### 3. `public/robots.txt`
- ✅ Added sitemap reference
- ✅ Optimized crawling directives

### 4. `public/sitemap.xml` (NEW)
- ✅ Created comprehensive sitemap
- ✅ Set proper priorities for pages
- ✅ Included all important URLs

### 5. `Dockerfile`
- ✅ Added explicit copying of sitemap.xml
- ✅ Added explicit copying of robots.txt
- ✅ Ensured public assets are included

### 6. `vite.config.ts`
- ✅ Added explicit publicDir configuration
- ✅ Added build configuration for public files

## Deployment Process

### Option 1: Using the Automated Script (Recommended)

1. **Make scripts executable (Linux/Mac):**
   ```bash
   chmod +x build-and-deploy.sh verify-sitemap.sh
   ```

2. **Run the deployment script:**
   ```bash
   ./build-and-deploy.sh
   ```

### Option 2: Manual Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Verify sitemap.xml is in dist folder:**
   ```bash
   ls -la dist/sitemap.xml
   ls -la dist/robots.txt
   ```

3. **Build Docker image:**
   ```bash
   docker build -t certify-nft:latest .
   ```

4. **Deploy to production:**
   ```bash
   ./update-prod.sh
   ```

### Option 3: Windows PowerShell

1. **Build the application:**
   ```powershell
   npm run build
   ```

2. **Verify files exist:**
   ```powershell
   Test-Path dist/sitemap.xml
   Test-Path dist/robots.txt
   ```

3. **Build and deploy:**
   ```powershell
   docker build -t certify-nft:latest .
   bash update-prod.sh
   ```

## Verification Steps

### 1. Check Local Build
After running `npm run build`, verify these files exist in `dist/`:
- ✅ `sitemap.xml`
- ✅ `robots.txt`
- ✅ `assets/` folder
- ✅ `index.html`

### 2. Check Docker Build
After building Docker image, verify files are included:
```bash
docker run --rm certify-nft:latest ls -la /app/dist/
```

### 3. Check Production URLs
After deployment, verify these URLs are accessible:
- ✅ `https://certify.nft.gpadaka.com/sitemap.xml`
- ✅ `https://certify.nft.gpadaka.com/robots.txt`
- ✅ `https://certify.nft.gpadaka.com/`

### 4. Run Verification Script
```bash
./verify-sitemap.sh
```

## Expected Results

### sitemap.xml Content
Should contain:
- Homepage with priority 1.0
- Events page with priority 0.9
- About page with priority 0.8
- FAQ page with priority 0.7
- Other important pages

### robots.txt Content
Should contain:
- Allow directives for public pages
- Disallow directives for private pages
- Sitemap reference: `https://certify.nft.gpadaka.com/sitemap.xml`

### HTTP Status Codes
- `sitemap.xml`: Should return 200
- `robots.txt`: Should return 200
- Homepage: Should return 200

## Troubleshooting

### If sitemap.xml is not found in dist:
1. Check if `public/sitemap.xml` exists
2. Verify Vite build process
3. Check for any build errors

### If sitemap.xml is not accessible on production:
1. Verify Docker build includes the file
2. Check VPS deployment process
3. Verify web server configuration

### If robots.txt is not accessible:
1. Follow same troubleshooting as sitemap.xml
2. Check if robots.txt is properly copied

## SEO Impact

After successful deployment, expect:
1. **Improved Google indexing** of all pages
2. **Better search rankings** for "certify nft"
3. **Faster crawling** by search engines
4. **Rich snippets** in search results
5. **Better social media sharing**

## Monitoring

Monitor these metrics after deployment:
- Google Search Console indexing
- Search rankings for "certify nft"
- Organic traffic growth
- Page load times
- User engagement metrics

## Next Steps

1. **Submit sitemap to Google Search Console**
2. **Monitor search rankings** for 2-4 weeks
3. **Analyze traffic patterns**
4. **Iterate based on data**
5. **Consider additional SEO optimizations**