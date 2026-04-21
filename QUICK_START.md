# DMS Quick Start Guide

Get the Dormitory Management System up and running in 10 minutes.

## Prerequisites

- Node.js v18+ ([Download](https://nodejs.org/))
- MongoDB ([Local](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas))
- Git

---

## 1. Clone & Setup Backend (5 minutes)

### Step 1: Navigate to Backend
```bash
cd backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create `.env` File
```bash
cp .env.example .env
```

### Step 4: Verify `.env` Contents
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/dms
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### Step 5: Start Backend
```bash
npm run dev
```

**Expected Output:**
```
DMS API listening on port 5000
MongoDB Connected: 127.0.0.1
```

### Step 6: Seed Database (Optional)
In a new terminal:
```bash
cd backend
npm run seed
```

---

## 2. Setup Frontend (3 minutes)

### Step 1: Navigate to Project Root
```bash
cd ..
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Frontend
```bash
npm run dev
```

**Expected Output:**
```
VITE v5.4.19  ready in 234 ms
➜  Local:   http://localhost:5173/
```

---

## 3. Login & Test (2 minutes)

### Open Browser
Navigate to: `http://localhost:5173`

### Login Credentials

After running `npm run seed`, use these credentials:

| Role | Username | Password |
|------|----------|----------|
| System Admin | `admin` | `Admin@2026` |
| Dorm Admin | `warden_jane` | `Admin@2026` |
| Maintenance | `maint_mark` | `Admin@2026` |
| Student | `sam.student` | `Admin@2026` |
| Student | `sally.student` | `Admin@2026` |

### Test Login
1. Enter username: `admin`
2. Enter password: `Admin@1234`
3. Click "Login"
4. You should see the admin dashboard

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│              http://localhost:5173                       │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST
                     │
┌────────────────────▼────────────────────────────────────┐
│                  Backend (Express)                       │
│              http://localhost:5000/api                   │
└────────────────────┬────────────────────────────────────┘
                     │ Mongoose
                     │
┌────────────────────▼────────────────────────────────────┐
│                  MongoDB Database                        │
│            mongodb://127.0.0.1:27017/dms                │
└─────────────────────────────────────────────────────────┘
```

---

## User Roles & Permissions

### System Admin
- Full system access
- Create/manage all users
- Access settings and audit logs
- **Username**: `admin`

### Dorm Admin
- Manage rooms and allocations
- Approve room changes
- Manage maintenance requests
- **Username**: `dormadmin`

### Maintenance Staff
- View assigned tasks
- Update task status
- Add notes
- **Username**: `maintenance`

### Manager
- View reports and analytics
- Export data
- **Username**: `manager`

### Student
- View profile and room
- Submit maintenance requests
- Request room changes
- **Username**: `firstname.lastname`

---

## Common Tasks

### Create New Admin User

1. Login as System Admin (`admin`)
2. Go to Users section
3. Click "Create New User"
4. Fill in details:
   - Full Name: `Jane Warden`
   - Email: `jane.warden@odu.edu.et`
   - Role: `Dorm Admin`
   - Password: `SecurePass123`
5. Click "Create"

### Create New Student

1. Login as System Admin
2. Go to Users section
3. Click "Create New User"
4. Fill in details:
   - Full Name: `John Doe`
   - Email: `john.doe@odu.edu.et`
   - Role: `Student`
   - Student ID: `OBU12345`
   - Password: `StudentPass123`
5. Click "Create"

### Assign Room to Student

1. Login as Dorm Admin
2. Go to Allocation section
3. Select student and room
4. Click "Assign"

### Submit Maintenance Request

1. Login as Student
2. Go to Maintenance section
3. Click "Submit Request"
4. Fill in details and submit

---

## Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000

# Check MongoDB is running
mongod

# Check .env file exists
cat backend/.env
```

### Frontend won't start
```bash
# Check if port 5173 is in use
lsof -i :5173

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Start again
npm run dev
```

### Cannot login
```bash
# Verify backend is running
curl http://localhost:5000/api/auth/login

# Check credentials are correct
# Default: admin / Admin@1234

# Seed database if needed
cd backend && npm run seed
```

### API connection error
```bash
# Check CORS_ORIGIN in backend/.env
CORS_ORIGIN=http://localhost:5173

# Check VITE_API_URL in frontend/.env
VITE_API_URL=http://localhost:5000/api

# Restart both servers
```

---

## File Structure

```
oda-bultum-dms/
├── backend/                    # Express API
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── models/            # MongoDB schemas
│   │   ├── services/          # Business logic
│   │   ├── routes/            # API endpoints
│   │   └── middlewares/       # Auth, error handling
│   ├── .env                   # Environment config
│   ├── server.js              # Entry point
│   └── package.json
│
├── src/                        # React Frontend
│   ├── components/            # React components
│   ├── pages/                 # Page components
│   ├── hooks/                 # Custom hooks
│   ├── lib/                   # Utilities
│   ├── App.tsx                # Main component
│   └── main.tsx               # Entry point
│
├── docs/                       # Documentation
│   ├── API_REFERENCE.md       # API docs
│   └── REQUIREMENTS.md        # Requirements
│
├── BACKEND_SETUP_GUIDE.md     # Backend setup
├── FRONTEND_SETUP_GUIDE.md    # Frontend setup
├── ADMIN_USER_MANAGEMENT.md   # User management
├── QUICK_START.md             # This file
└── package.json
```

---

## API Endpoints

### Authentication
```
POST   /api/auth/login              # Login
POST   /api/auth/logout             # Logout
POST   /api/auth/register-student   # Student registration
POST   /api/auth/forgot-password    # Password reset
```

### Users
```
GET    /api/users                   # List users
POST   /api/users                   # Create user
GET    /api/users/{id}              # Get user
PUT    /api/users/{id}              # Update user
POST   /api/users/{id}/deactivate   # Deactivate
POST   /api/users/{id}/reactivate   # Reactivate
```

### Rooms
```
GET    /api/rooms                   # List rooms
POST   /api/rooms                   # Create room
GET    /api/rooms/{id}              # Get room
PUT    /api/rooms/{id}              # Update room
```

### Allocations
```
POST   /api/allocation/manual       # Assign student
POST   /api/allocation/automatic    # Bulk assign
```

### Maintenance
```
POST   /api/maintenance-requests    # Submit request
GET    /api/maintenance-requests    # List requests
PUT    /api/maintenance-requests/{id}/status  # Update status
```

See `/docs/API_REFERENCE.md` for complete API documentation.

---

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/dms
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Oda Bultum DMS
VITE_SESSION_TIMEOUT=1800000
VITE_DEFAULT_LANGUAGE=en
```

---

## Development Commands

### Backend
```bash
cd backend
npm install          # Install dependencies
npm run dev          # Start development server
npm run seed         # Seed database
npm start            # Start production server
```

### Frontend
```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Check code quality
```

---

## Next Steps

1. **Read Full Documentation**
   - `BACKEND_SETUP_GUIDE.md` - Detailed backend setup
   - `FRONTEND_SETUP_GUIDE.md` - Detailed frontend setup
   - `ADMIN_USER_MANAGEMENT.md` - User management guide

2. **Explore the System**
   - Login with different roles
   - Test different features
   - Review the UI/UX

3. **Customize for Your Needs**
   - Update environment variables
   - Modify user roles if needed
   - Customize styling and branding

4. **Deploy to Production**
   - Build frontend: `npm run build`
   - Deploy to hosting service
   - Configure production environment

---

## Support

- **Backend Issues**: See `BACKEND_SETUP_GUIDE.md` Troubleshooting
- **Frontend Issues**: See `FRONTEND_SETUP_GUIDE.md` Troubleshooting
- **User Management**: See `ADMIN_USER_MANAGEMENT.md`
- **API Documentation**: See `/docs/API_REFERENCE.md`

---

## Quick Reference

| Task | Command |
|------|---------|
| Start Backend | `cd backend && npm run dev` |
| Start Frontend | `npm run dev` |
| Seed Database | `cd backend && npm run seed` |
| Build Frontend | `npm run build` |
| Run Tests | `npm run test` |
| Check Lint | `npm run lint` |

---

**Ready to go!** 🚀

Open `http://localhost:5173` and login with:
- Username: `admin`
- Password: `Admin@1234`

---

**Last Updated:** April 2026
**Version:** 1.0.0
