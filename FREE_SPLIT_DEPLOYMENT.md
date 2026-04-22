# 🆓 Alternative: Split Free Deployment

If you prefer better backend performance, use this split approach:

## Option: Vercel (Frontend) + Render (Backend)

### Benefits:
- ✅ No 10-second timeout limit
- ✅ Better for long-running operations
- ✅ Persistent connections
- ✅ Still 100% FREE

### Setup:

#### 1. Backend on Render (FREE)
1. Go to [render.com](https://render.com)
2. Connect GitHub repository
3. Create "Web Service"
4. **Root Directory**: `backend`
5. **Build Command**: `npm install`
6. **Start Command**: `npm start`
7. **Environment Variables**:
   ```
   NODE_ENV=production
   JWT_SECRET=your_secret
   FIREBASE_PROJECT_ID=obu-9741c
   FIREBASE_CLIENT_EMAIL=your_email
   FIREBASE_PRIVATE_KEY=your_key
   CORS_ORIGIN=https://your-frontend.vercel.app
   ```

#### 2. Frontend on Vercel
1. Update `src/lib/api.ts`:
   ```typescript
   const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-backend.onrender.com/api';
   ```
2. Deploy to Vercel with environment variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

### Render Free Tier:
- ✅ **750 hours/month** (enough for 24/7)
- ✅ **512MB RAM**
- ✅ **No timeout limits**
- ✅ **Automatic HTTPS**
- ⚠️ **Sleeps after 15 minutes of inactivity** (wakes up in ~30 seconds)

This option gives you better backend performance but with a slight delay on first request after inactivity.