# ✅ Vercel Deployment Checklist

## 🔧 **Pre-Deployment Steps**

### **1. Clean Up Vercel Project**
- [ ] Go to Vercel Dashboard → Settings → Environment Variables
- [ ] **DELETE** any variables with `@` references (like `@vite_api_url`)
- [ ] **DELETE** old `VITE_API_URL` environment variable

### **2. Add Required Environment Variables**
Add these **exact** variables in Vercel Dashboard:

- [ ] `NODE_ENV` = `production`
- [ ] `JWT_SECRET` = `super_secret_jwt_key_odu_dms`
- [ ] `FIREBASE_PROJECT_ID` = `obu-9741c`
- [ ] `FIREBASE_CLIENT_EMAIL` = `firebase-adminsdk-fbsvc@obu-9741c.iam.gserviceaccount.com`
- [ ] `FIREBASE_PRIVATE_KEY` = `"-----BEGIN PRIVATE KEY-----\n[your_key_content]\n-----END PRIVATE KEY-----\n"`

### **3. Verify Local Build**
- [ ] Run `npm run build` (should complete successfully)
- [ ] Check `dist/` folder is created
- [ ] No TypeScript errors

## 🚀 **Deployment Steps**

### **Method 1: Vercel Dashboard**
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Click "New Project"
- [ ] Import your GitHub repository
- [ ] Framework: **Vite**
- [ ] Root Directory: **Leave empty**
- [ ] Click "Deploy"

### **Method 2: Git Push (if already connected)**
- [ ] `git add .`
- [ ] `git commit -m "Fix Vercel deployment configuration"`
- [ ] `git push origin main`
- [ ] Vercel auto-deploys

## 🔍 **Post-Deployment Verification**

### **1. Check Deployment Status**
- [ ] Deployment completes without errors
- [ ] Build logs show successful completion
- [ ] Function deployment successful

### **2. Test Frontend**
- [ ] Visit `https://your-app.vercel.app`
- [ ] Frontend loads correctly
- [ ] No console errors
- [ ] Navigation works

### **3. Test Backend API**
- [ ] Visit `https://your-app.vercel.app/api/health`
- [ ] Should return: `{"status":"OK","timestamp":"..."}`
- [ ] No 404 or 500 errors

### **4. Test Authentication**
- [ ] Go to login page
- [ ] Try login with: `admin` / `Admin@2026`
- [ ] Should redirect to dashboard
- [ ] No CORS errors in console

### **5. Test Database Connection**
- [ ] Login works (confirms Firebase connection)
- [ ] Dashboard loads data
- [ ] No database connection errors

## 🚨 **Common Issues & Solutions**

### **Issue: "Secret vite_api_url does not exist"**
- **Solution**: Delete old environment variables with `@` references

### **Issue: "Cannot connect to API"**
- **Solution**: Verify environment variables are set correctly

### **Issue: "Firebase authentication failed"**
- **Solution**: Check `FIREBASE_PRIVATE_KEY` format (keep quotes and \n)

### **Issue: "Function timeout"**
- **Solution**: Check function logs in Vercel dashboard

### **Issue: "CORS errors"**
- **Solution**: Ensure using relative API paths (`/api`)

## 🎯 **Success Indicators**

✅ **Deployment successful when:**
- Frontend loads at your Vercel URL
- API health check returns OK
- Login functionality works
- Dashboard displays data
- No console errors
- Professional production setup complete

## 📞 **Support**

If issues persist:
1. Check Vercel function logs
2. Verify all environment variables
3. Test local build first
4. Clear Vercel cache with `vercel --prod --force`

Your dormitory management system is now ready for production use! 🎉