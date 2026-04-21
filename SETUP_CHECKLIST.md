# DMS Setup Checklist & Visual Guide

Complete checklist and visual diagrams for setting up the Dormitory Management System.

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                                    │
│                    http://localhost:5173                                │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   React Frontend       │
                    │   (Vite + TypeScript)  │
                    │   - Components         │
                    │   - Pages              │
                    │   - Routing            │
                    │   - State Management   │
                    └────────────┬────────────┘
                                 │
                    HTTP/REST API (JSON)
                                 │
                    ┌────────────▼────────────┐
                    │   Express Backend      │
                    │   (Node.js)            │
                    │   - Routes             │
                    │   - Controllers        │
                    │   - Services           │
                    │   - Middleware         │
                    │   - Authentication    │
                    └────────────┬────────────┘
                                 │
                    Mongoose ODM (MongoDB Driver)
                                 │
                    ┌────────────▼────────────┐
                    │   MongoDB Database     │
                    │   - Collections        │
                    │   - Documents          │
                    │   - Indexes            │
                    │   - Transactions       │
                    └────────────────────────┘
```

---

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND STACK                                  │
├─────────────────────────────────────────────────────────────────────────┤
│ Runtime:      Node.js v18+                                              │
│ Framework:    React 18.3.1                                              │
│ Language:     TypeScript 5.8.3                                          │
│ Build Tool:   Vite 5.4.19                                               │
│ Styling:      Tailwind CSS 3.4.17                                       │
│ UI Library:   shadcn/ui (Radix UI)                                      │
│ Routing:      React Router DOM 6.30.1                                   │
│ Forms:        React Hook Form 7.61.1                                    │
│ Validation:   Zod 3.25.76                                               │
│ Data Fetch:   TanStack Query 5.83.0                                     │
│ Charts:       Recharts 2.15.4                                           │
│ Testing:      Vitest 3.2.4, Playwright 1.57.0                          │
│ Linting:      ESLint 9.32.0                                             │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         BACKEND STACK                                   │
├─────────────────────────────────────────────────────────────────────────┤
│ Runtime:      Node.js v18+                                              │
│ Framework:    Express 4.21.2                                            │
│ Language:     JavaScript (ES Modules)                                   │
│ Database:     MongoDB 5.0+                                              │
│ ODM:          Mongoose 8.8.0                                            │
│ Auth:         JWT (jsonwebtoken 9.0.2)                                  │
│ Password:     bcryptjs 2.4.3                                            │
│ Validation:   Joi 18.1.2                                                │
│ Security:     Helmet 8.0.0                                              │
│ CORS:         cors 2.8.5                                                │
│ Logging:      Morgan 1.10.0                                             │
│ Compression:  compression 1.8.1                                         │
│ Rate Limit:   express-rate-limit 7.4.1                                  │
│ Dev Tool:     Nodemon 3.1.7                                             │
│ Env Config:   dotenv 16.4.5                                             │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      DATABASE STACK                                     │
├─────────────────────────────────────────────────────────────────────────┤
│ Database:     MongoDB 5.0+                                              │
│ Deployment:   Local, Docker, or MongoDB Atlas (Cloud)                   │
│ Collections:  15+ (Users, Rooms, Students, Maintenance, etc.)           │
│ Indexes:      Optimized for common queries                              │
│ Transactions: ACID transactions supported                               │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Pre-Setup Checklist

### System Requirements
- [ ] Operating System: Linux, macOS, or Windows
- [ ] RAM: Minimum 4GB (8GB recommended)
- [ ] Disk Space: Minimum 2GB free
- [ ] Internet Connection: Required for npm packages

### Software Installation
- [ ] Node.js v18+ installed
  ```bash
  node --version  # Should show v18.0.0 or higher
  ```
- [ ] npm installed
  ```bash
  npm --version   # Should show 9.0.0 or higher
  ```
- [ ] Git installed (for cloning)
  ```bash
  git --version   # Should show git version
  ```
- [ ] MongoDB installed or Atlas account created
  ```bash
  mongod --version  # For local installation
  ```

### Development Tools (Optional but Recommended)
- [ ] Code Editor (VS Code, WebStorm, etc.)
- [ ] Postman or Thunder Client (for API testing)
- [ ] MongoDB Compass (for database visualization)
- [ ] Git GUI (GitHub Desktop, GitKraken, etc.)

---

## Backend Setup Checklist

### Step 1: Navigate to Backend Directory
- [ ] Open terminal/command prompt
- [ ] Navigate to project root: `cd oda-bultum-dms`
- [ ] Navigate to backend: `cd backend`
- [ ] Verify location: `pwd` (should show `.../oda-bultum-dms/backend`)

### Step 2: Install Dependencies
- [ ] Run: `npm install`
- [ ] Wait for installation to complete
- [ ] Verify: `npm list` (should show installed packages)
- [ ] Check for errors: No red error messages

### Step 3: Database Setup
- [ ] **Option A - Local MongoDB**:
  - [ ] MongoDB installed
  - [ ] MongoDB service running: `mongod`
  - [ ] Verify connection: `mongosh`
  - [ ] Exit: `exit`

- [ ] **Option B - Docker**:
  - [ ] Docker installed
  - [ ] Run: `docker run -d -p 27017:27017 --name mongodb mongo:latest`
  - [ ] Verify: `docker ps` (should show mongodb container)

- [ ] **Option C - MongoDB Atlas**:
  - [ ] Account created at mongodb.com/cloud/atlas
  - [ ] Cluster created
  - [ ] Connection string obtained
  - [ ] IP whitelist configured

### Step 4: Environment Configuration
- [ ] Copy example: `cp .env.example .env`
- [ ] Edit `.env` file:
  - [ ] `NODE_ENV=development`
  - [ ] `PORT=5000`
  - [ ] `MONGO_URI=mongodb://127.0.0.1:27017/dms` (or your connection string)
  - [ ] `JWT_SECRET=your_secret_key_here`
  - [ ] `JWT_EXPIRES_IN=7d`
  - [ ] `CORS_ORIGIN=http://localhost:5173`
- [ ] Save file
- [ ] Verify: `cat .env` (should show your configuration)

### Step 5: Start Backend Server
- [ ] Run: `npm run dev`
- [ ] Wait for startup message
- [ ] Verify output:
  ```
  DMS API listening on port 5000
  MongoDB Connected: 127.0.0.1
  ```
- [ ] Keep terminal open (server running)

### Step 6: Seed Database (Optional)
- [ ] Open new terminal
- [ ] Navigate to backend: `cd backend`
- [ ] Run: `npm run seed`
- [ ] Wait for completion
- [ ] Verify output: `Data Imported!`
- [ ] Check database: `mongosh` → `use dms` → `db.users.find()`

### Step 7: Test Backend
- [ ] Open new terminal
- [ ] Test login endpoint:
  ```bash
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"Admin@2026"}'
  ```
- [ ] Verify response contains token
- [ ] Backend is working ✓

---

## Frontend Setup Checklist

### Step 1: Navigate to Project Root
- [ ] Open new terminal
- [ ] Navigate to project root: `cd oda-bultum-dms`
- [ ] Verify location: `pwd` (should show `.../oda-bultum-dms`)

### Step 2: Install Dependencies
- [ ] Run: `npm install`
- [ ] Wait for installation to complete
- [ ] Verify: `npm list` (should show installed packages)
- [ ] Check for errors: No red error messages

### Step 3: Environment Configuration
- [ ] Check if `.env` exists in root
- [ ] If not, create `.env`:
  ```env
  VITE_API_URL=http://localhost:5000/api
  VITE_APP_NAME=Oda Bultum DMS
  VITE_SESSION_TIMEOUT=1800000
  VITE_DEFAULT_LANGUAGE=en
  ```
- [ ] Save file
- [ ] Verify: `cat .env`

### Step 4: Start Frontend Server
- [ ] Run: `npm run dev`
- [ ] Wait for startup message
- [ ] Verify output:
  ```
  VITE v5.4.19  ready in 234 ms
  ➜  Local:   http://localhost:5173/
  ```
- [ ] Keep terminal open (server running)

### Step 5: Test Frontend
- [ ] Open browser
- [ ] Navigate to: `http://localhost:5173`
- [ ] Verify: Login page loads
- [ ] Check console (F12): No errors
- [ ] Frontend is working ✓

---

## Login & Testing Checklist

### Step 1: Verify Both Servers Running
- [ ] Backend terminal: Shows "DMS API listening on port 5000"
- [ ] Frontend terminal: Shows "Local: http://localhost:5173"
- [ ] Both servers running ✓

### Step 2: Test System Admin Login
- [ ] Open browser: `http://localhost:5173`
- [ ] Enter username: `admin`
- [ ] Enter password: `Admin@2026`
- [ ] Click "Login"
- [ ] Verify: Redirected to dashboard
- [ ] Verify: "System Admin" shown in profile
- [ ] System Admin login working ✓

### Step 3: Test Dorm Admin Login
- [ ] Click "Logout"
- [ ] Enter username: `dormadmin`
- [ ] Enter password: `DormAdmin@1234`
- [ ] Click "Login"
- [ ] Verify: Redirected to dashboard
- [ ] Verify: "Dorm Admin" shown in profile
- [ ] Dorm Admin login working ✓

### Step 4: Test Maintenance Staff Login
- [ ] Click "Logout"
- [ ] Enter username: `maintenance`
- [ ] Enter password: `Maintenance@1234`
- [ ] Click "Login"
- [ ] Verify: Redirected to dashboard
- [ ] Verify: "Maintenance Staff" shown in profile
- [ ] Maintenance Staff login working ✓

### Step 5: Test Manager Login
- [ ] Click "Logout"
- [ ] Enter username: `manager`
- [ ] Enter password: `Manager@1234`
- [ ] Click "Login"
- [ ] Verify: Redirected to dashboard
- [ ] Verify: "Manager" shown in profile
- [ ] Manager login working ✓

### Step 6: Test Student Login
- [ ] Click "Logout"
- [ ] Enter username: `sam.student`
- [ ] Enter password: `Admin@2026`
- [ ] Click "Login"
- [ ] Verify: Redirected to dashboard
- [ ] Verify: "Student" shown in profile
- [ ] Student login working ✓

### Step 7: Test Role-Based Features
- [ ] Login as System Admin
- [ ] Verify: Can see "Users" menu
- [ ] Verify: Can see "Settings" menu
- [ ] Login as Dorm Admin
- [ ] Verify: Can see "Rooms" menu
- [ ] Verify: Cannot see "Users" menu
- [ ] Login as Student
- [ ] Verify: Can see "My Room" section
- [ ] Verify: Cannot see "Users" menu
- [ ] Role-based access working ✓

---

## Post-Setup Checklist

### Documentation
- [ ] Read QUICK_START.md
- [ ] Read BACKEND_SETUP_GUIDE.md
- [ ] Read FRONTEND_SETUP_GUIDE.md
- [ ] Read ADMIN_USER_MANAGEMENT.md
- [ ] Read ROLE_BASED_SYSTEM.md
- [ ] Read docs/API_REFERENCE.md

### Testing
- [ ] Test all login credentials
- [ ] Test role-based access
- [ ] Test API endpoints (using Postman)
- [ ] Test database operations
- [ ] Test error handling

### Configuration
- [ ] Update JWT_SECRET for production
- [ ] Configure CORS_ORIGIN for production
- [ ] Set up environment variables
- [ ] Configure database backups
- [ ] Set up logging

### Development
- [ ] Understand project structure
- [ ] Review code organization
- [ ] Set up IDE/editor
- [ ] Configure linting
- [ ] Set up version control

---

## Troubleshooting Checklist

### Backend Won't Start
- [ ] Check Node.js version: `node --version` (should be v18+)
- [ ] Check npm version: `npm --version` (should be 9+)
- [ ] Check MongoDB running: `mongosh` (should connect)
- [ ] Check .env file exists: `cat backend/.env`
- [ ] Check port 5000 available: `lsof -i :5000`
- [ ] Reinstall dependencies: `rm -rf node_modules && npm install`
- [ ] Check error messages in terminal

### Frontend Won't Start
- [ ] Check Node.js version: `node --version` (should be v18+)
- [ ] Check npm version: `npm --version` (should be 9+)
- [ ] Check port 5173 available: `lsof -i :5173`
- [ ] Check .env file exists: `cat .env`
- [ ] Reinstall dependencies: `rm -rf node_modules && npm install`
- [ ] Clear Vite cache: `rm -rf .vite`
- [ ] Check error messages in terminal

### Cannot Connect to API
- [ ] Verify backend is running
- [ ] Check CORS_ORIGIN in backend/.env
- [ ] Check VITE_API_URL in frontend/.env
- [ ] Check network connectivity
- [ ] Check firewall settings
- [ ] Test API directly: `curl http://localhost:5000/api/auth/login`

### Login Fails
- [ ] Verify backend is running
- [ ] Verify database is running
- [ ] Check credentials are correct
- [ ] Run seed: `npm run seed` (in backend)
- [ ] Check user exists: `mongosh` → `use dms` → `db.users.find()`
- [ ] Check error message in browser console

### Database Connection Error
- [ ] Verify MongoDB is running
- [ ] Check MONGO_URI in .env
- [ ] Test connection: `mongosh "mongodb://127.0.0.1:27017/dms"`
- [ ] Check firewall/network
- [ ] For Atlas: Check IP whitelist
- [ ] Check connection string format

---

## Quick Command Reference

### Backend Commands
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Seed database
npm run seed

# Check Node version
node --version

# Check npm version
npm --version
```

### Frontend Commands
```bash
# Navigate to project root
cd ..

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Check linting
npm run lint
```

### Database Commands
```bash
# Start MongoDB (local)
mongod

# Connect to MongoDB
mongosh

# Use DMS database
use dms

# List collections
show collections

# Find users
db.users.find()

# Find rooms
db.rooms.find()

# Exit MongoDB
exit
```

### Testing Commands
```bash
# Test backend API
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@2026"}'

# Check backend status
curl http://localhost:5000/api/health

# Check frontend
curl http://localhost:5173
```

---

## Success Indicators

### Backend Setup Complete ✓
- [ ] Terminal shows: "DMS API listening on port 5000"
- [ ] Terminal shows: "MongoDB Connected"
- [ ] No error messages
- [ ] API responds to requests

### Frontend Setup Complete ✓
- [ ] Terminal shows: "Local: http://localhost:5173"
- [ ] Browser loads login page
- [ ] No error messages in console
- [ ] Styling loads correctly

### System Working ✓
- [ ] Can login with all roles
- [ ] Dashboard loads for each role
- [ ] Role-based menus visible
- [ ] API calls work
- [ ] Database operations work

---

## Next Steps After Setup

1. **Read Documentation**
   - [ ] QUICK_START.md
   - [ ] ADMIN_USER_MANAGEMENT.md
   - [ ] ROLE_BASED_SYSTEM.md

2. **Explore System**
   - [ ] Login as each role
   - [ ] Test different features
   - [ ] Review UI/UX

3. **Create Test Data**
   - [ ] Create test users
   - [ ] Create test rooms
   - [ ] Create test allocations

4. **Customize System**
   - [ ] Update branding
   - [ ] Configure settings
   - [ ] Customize workflows

5. **Deploy to Production**
   - [ ] Build frontend: `npm run build`
   - [ ] Configure production environment
   - [ ] Deploy to hosting service
   - [ ] Set up monitoring

---

## Support Resources

| Issue | Resource |
|-------|----------|
| Backend setup | BACKEND_SETUP_GUIDE.md |
| Frontend setup | FRONTEND_SETUP_GUIDE.md |
| User management | ADMIN_USER_MANAGEMENT.md |
| Roles & permissions | ROLE_BASED_SYSTEM.md |
| API reference | docs/API_REFERENCE.md |
| Quick start | QUICK_START.md |
| General info | README.md |

---

## Estimated Timeline

| Task | Time |
|------|------|
| Prerequisites check | 5 min |
| Backend setup | 10 min |
| Frontend setup | 5 min |
| Testing & verification | 10 min |
| Documentation review | 15 min |
| **Total** | **45 min** |

---

## Completion Checklist

- [ ] All prerequisites installed
- [ ] Backend running successfully
- [ ] Frontend running successfully
- [ ] Database seeded with test data
- [ ] All roles can login
- [ ] Role-based access working
- [ ] API endpoints responding
- [ ] Documentation reviewed
- [ ] System ready for use

---

**Congratulations!** 🎉

Your DMS system is now set up and ready to use.

Start with [QUICK_START.md](QUICK_START.md) for a quick overview, or dive into specific guides for detailed information.

---

**Last Updated:** April 2026
**Version:** 1.0.0
