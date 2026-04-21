# 🚀 Quick Deployment Fix Guide

## Most Common Issues & Immediate Solutions

### 1. **Environment Variables Not Set**

#### Frontend Environment Variables
Create `.env.production` file:
```env
VITE_API_URL=https://your-backend-url.com/api
```

#### Backend Environment Variables
Ensure these are set in your deployment platform:
```env
PORT=5000
NODE_ENV=production
JWT_SECRET=your_jwt_secret_here
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_email
FIREBASE_PRIVATE_KEY="your_firebase_private_key"
CORS_ORIGIN=https://your-frontend-url.com
```

### 2. **API URL Mismatch**

#### Check Current API URL
In `src/lib/api.ts`, line 3:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

#### Fix for Production
Update to your actual backend URL:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-backend.herokuapp.com/api';
```

### 3. **Build Errors**

#### Test Local Build
```bash
npm run build
```

If this fails, check for:
- TypeScript errors
- Missing dependencies
- Import path issues

#### Common Build Fixes
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

### 4. **Backend Not Deployed**

#### Deploy Backend Separately
The backend needs to be deployed to a server platform:

**Option A: Heroku**
```bash
# Create separate backend deployment
cd backend
git init
git add .
git commit -m "Backend deployment"
heroku create your-backend-name
git push heroku main
```

**Option B: Railway**
1. Go to railway.app
2. Connect GitHub repository
3. Select backend folder
4. Add environment variables

**Option C: Render**
1. Go to render.com
2. Connect GitHub repository
3. Create web service
4. Set build command: `cd backend && npm install`
5. Set start command: `cd backend && npm start`

### 5. **CORS Issues**

#### Update Backend CORS
In `backend/server.js`:
```javascript
app.use(cors({ 
  origin: [
    'http://localhost:5173',
    'https://your-frontend-domain.vercel.app',
    'https://your-frontend-domain.netlify.app'
  ],
  credentials: true
}));
```

## Platform-Specific Quick Fixes

### **Vercel (Frontend Only)**

1. **Deploy Frontend**:
   ```bash
   npm i -g vercel
   vercel --prod
   ```

2. **Set Environment Variable**:
   - Go to Vercel dashboard
   - Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.com/api`

3. **Redeploy**:
   ```bash
   vercel --prod
   ```

### **Netlify (Frontend Only)**

1. **Deploy**:
   - Connect GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Environment Variables**:
   - Site Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.com/api`

### **Full Stack Deployment**

#### Option 1: Separate Deployments
- **Frontend**: Vercel/Netlify
- **Backend**: Heroku/Railway/Render

#### Option 2: Single Platform
- **Vercel**: Use Vercel Functions for backend
- **Netlify**: Use Netlify Functions for backend

## Immediate Action Steps

### Step 1: Check What's Deployed
1. Open browser developer tools (F12)
2. Go to Console tab
3. Look for error messages

### Step 2: Common Error Messages

#### "Failed to fetch"
- **Cause**: Backend not accessible
- **Fix**: Deploy backend or update API URL

#### "CORS error"
- **Cause**: Cross-origin request blocked
- **Fix**: Update CORS configuration in backend

#### "404 Not Found"
- **Cause**: Wrong API endpoint
- **Fix**: Check API URL in frontend

#### "500 Internal Server Error"
- **Cause**: Backend error (likely environment variables)
- **Fix**: Check backend logs and environment variables

### Step 3: Quick Test

#### Test Backend Health
```bash
curl https://your-backend-url.com/api/health
```

Should return:
```json
{"status": "OK", "timestamp": "..."}
```

#### Test Frontend Build
```bash
npm run build
npm run preview
```

## Emergency Deployment Script

Create `deploy.sh`:
```bash
#!/bin/bash

echo "🚀 Emergency Deployment Script"

# Build frontend
echo "Building frontend..."
npm run build

# Deploy to Vercel (if installed)
if command -v vercel &> /dev/null; then
    echo "Deploying to Vercel..."
    vercel --prod
fi

# Deploy to Netlify (if installed)
if command -v netlify &> /dev/null; then
    echo "Deploying to Netlify..."
    netlify deploy --prod --dir=dist
fi

echo "✅ Deployment complete!"
```

## Need Immediate Help?

**Tell me:**
1. **Where are you deploying?** (Vercel, Netlify, Heroku, etc.)
2. **What error do you see?** (Browser console, build logs)
3. **Is backend deployed separately?** (Yes/No)

I can provide specific fixes based on your deployment platform and error messages!