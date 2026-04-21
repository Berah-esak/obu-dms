# 🚨 Deployment Troubleshooting Guide

## Common Deployment Issues & Solutions

### 1. **Environment Variables Missing**

#### Problem
The app can't connect to Firebase or API endpoints because environment variables aren't set.

#### Solution
Create proper environment files for production:

**Backend (.env)**
```env
PORT=5000
NODE_ENV=production
JWT_SECRET=your_production_jwt_secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-frontend-domain.com

# Firebase Configuration
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="your_private_key"
```

**Frontend (.env.production)**
```env
VITE_API_URL=https://your-backend-domain.com/api
```

### 2. **Build Configuration Issues**

#### Frontend Build
Make sure the frontend builds correctly:
```bash
npm run build
```

Check for build errors in:
- TypeScript compilation errors
- Missing dependencies
- Import path issues

#### Backend Build
Ensure all dependencies are installed:
```bash
cd backend
npm install --production
```

### 3. **Firebase Configuration**

#### Check Firebase Setup
1. **Firestore Rules**: Ensure database rules allow access
2. **Service Account**: Verify service account has proper permissions
3. **Project ID**: Confirm project ID matches in environment variables

#### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. **CORS Issues**

#### Backend CORS Configuration
Update `backend/server.js`:
```javascript
app.use(cors({ 
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://your-frontend-domain.com'
  ],
  credentials: true
}));
```

### 5. **API Endpoint Issues**

#### Check API Base URL
In `src/lib/api.ts`, ensure the API URL is correct:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-backend-domain.com/api';
```

### 6. **Database Seeding**

#### Seed Production Database
```bash
cd backend
npm run seed
```

Make sure the database has:
- Default admin users
- Dorm and room data
- Proper collections structure

## Platform-Specific Solutions

### **Vercel Deployment**

#### Frontend (Vercel)
1. **Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

2. **Environment Variables**:
   Add in Vercel dashboard:
   ```
   VITE_API_URL=https://your-backend.vercel.app/api
   ```

3. **vercel.json**:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### Backend (Vercel)
1. **Create `vercel.json`**:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    }
  ]
}
```

### **Netlify Deployment**

#### Frontend (Netlify)
1. **Build Settings**:
   - Build Command: `npm run build`
   - Publish Directory: `dist`

2. **_redirects file**:
```
/*    /index.html   200
```

3. **Environment Variables**:
   Add in Netlify dashboard:
   ```
   VITE_API_URL=https://your-backend.herokuapp.com/api
   ```

### **Heroku Deployment**

#### Backend (Heroku)
1. **Procfile**:
```
web: node backend/server.js
```

2. **package.json scripts**:
```json
{
  "scripts": {
    "start": "node backend/server.js",
    "heroku-postbuild": "cd backend && npm install"
  }
}
```

3. **Environment Variables**:
   Set in Heroku dashboard or CLI:
   ```bash
   heroku config:set JWT_SECRET=your_secret
   heroku config:set FIREBASE_PROJECT_ID=your_project_id
   ```

### **Railway Deployment**

#### Backend (Railway)
1. **railway.json**:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd backend && npm start"
  }
}
```

## Debugging Steps

### 1. **Check Browser Console**
Open Developer Tools (F12) and check for:
- JavaScript errors
- Network request failures
- CORS errors

### 2. **Check Network Tab**
Look for failed API requests:
- 404 errors (wrong API URL)
- 500 errors (server issues)
- CORS errors (cross-origin issues)

### 3. **Check Backend Logs**
Most platforms provide logs:
- **Vercel**: Check Functions tab
- **Heroku**: `heroku logs --tail`
- **Railway**: Check deployment logs
- **Netlify**: Check Functions logs

### 4. **Test API Endpoints**
Test your backend directly:
```bash
curl https://your-backend-domain.com/api/health
```

### 5. **Check Environment Variables**
Verify all required environment variables are set in your deployment platform.

## Quick Fixes

### **Fix 1: Update API URL**
If frontend can't reach backend, update the API URL:

```typescript
// src/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-actual-backend-url.com/api';
```

### **Fix 2: Add Health Check**
Add a health check endpoint to verify backend is running:

```javascript
// backend/src/routes/healthRoutes.js
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});
```

### **Fix 3: Enable CORS**
Ensure CORS is properly configured:

```javascript
// backend/server.js
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
```

### **Fix 4: Check Firebase Connection**
Test Firebase connection:

```javascript
// Add to backend startup
console.log('Firebase Project ID:', process.env.FIREBASE_PROJECT_ID);
console.log('Firebase Client Email:', process.env.FIREBASE_CLIENT_EMAIL);
```

## Platform-Specific Environment Setup

### **Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env add VITE_API_URL
```

### **Netlify**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist

# Set environment variables
netlify env:set VITE_API_URL https://your-backend.com/api
```

### **Heroku**
```bash
# Install Heroku CLI
# Create app
heroku create your-app-name

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set FIREBASE_PROJECT_ID=your_project_id

# Deploy
git push heroku main
```

## Need More Help?

If you're still having issues, please provide:

1. **Deployment Platform**: Where are you deploying? (Vercel, Netlify, Heroku, etc.)
2. **Error Messages**: Any specific error messages in browser console or logs
3. **Build Logs**: Any errors during the build process
4. **Network Errors**: Failed API requests in Network tab

I can then provide more specific troubleshooting steps!