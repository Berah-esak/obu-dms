# 🚀 Vercel Clean Deployment Commands

## Step 1: Clean Local Cache
```bash
# Remove any local Vercel cache
rm -rf .vercel

# Clear npm/yarn cache
npm cache clean --force
# OR
yarn cache clean
```

## Step 2: Force Clean Deployment
```bash
# Deploy with force flag to bypass cache
vercel --prod --force

# Alternative: Deploy to new environment
vercel --prod --force --env production
```

## Step 3: If Still Failing - Nuclear Option
```bash
# 1. Delete the Vercel project completely
# 2. Create a new project with same name
# 3. Deploy fresh without any cached settings

# Or use CLI to create new project
vercel --name your-project-name --force
```

## Verification Commands
```bash
# Check deployment status
vercel ls

# Check environment variables
vercel env ls

# Check build logs
vercel logs your-deployment-url
```