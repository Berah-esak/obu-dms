# 🎓 Dormitory Management System (DMS) - START HERE

Welcome to the Dormitory Management System! This is your entry point to understanding and using the complete DMS platform.

---

## 📚 What is This?

The DMS is a comprehensive web-based system for managing university dormitory operations including:
- Student room assignments
- Maintenance request tracking
- Inventory management
- Room change requests
- Reports and analytics
- User and role management

---

## ⚡ Quick Start (10 Minutes)

### Prerequisites
- Node.js v18+ ([Download](https://nodejs.org/))
- MongoDB ([Local](https://www.mongodb.com/try/download/community) or [Cloud](https://www.mongodb.com/cloud/atlas))

### Setup
```bash
# 1. Backend
cd backend
npm install
npm run dev

# 2. Frontend (new terminal)
npm install
npm run dev

# 3. Seed database (new terminal)
cd backend
npm run seed

# 4. Open browser
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000/api
```

### Login
```
Username: admin
Password: Admin@2026
```

**That's it!** You're ready to go. 🚀

---

## 📖 Documentation Guide

### 🚀 Getting Started (Choose Your Path)

**I want to get it running quickly**
→ Read: [QUICK_START.md](QUICK_START.md) (10 min)

**I want detailed setup instructions**
→ Read: [BACKEND_SETUP_GUIDE.md](BACKEND_SETUP_GUIDE.md) + [FRONTEND_SETUP_GUIDE.md](FRONTEND_SETUP_GUIDE.md) (50 min)

**I want a step-by-step checklist**
→ Read: [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) (30 min)

---

### 👥 User & Role Management

**I need to manage users and admins**
→ Read: [ADMIN_USER_MANAGEMENT.md](ADMIN_USER_MANAGEMENT.md)

**I need to understand roles and permissions**
→ Read: [ROLE_BASED_SYSTEM.md](ROLE_BASED_SYSTEM.md)

**I need to know about admin credentials**
→ Read: [HARDCODED_CREDENTIALS_INFO.md](HARDCODED_CREDENTIALS_INFO.md)

---

### 📚 Reference & API

**I need API documentation**
→ Read: [docs/API_REFERENCE.md](docs/API_REFERENCE.md)

**I need system requirements**
→ Read: [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md)

**I need a complete documentation index**
→ Read: [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)

**I need an implementation overview**
→ Read: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)

---

## 🔐 Default Admin Credentials

```
Username: admin
Password: Admin@2026
Email: admin@odu.edu.et
Role: System Admin
```

**⚠️ Important**: Change this password immediately in production!

---

## 🎯 Common Tasks

### Task: Login to the System
1. Open `http://localhost:5173`
2. Enter username: `admin`
3. Enter password: `Admin@2026`
4. Click "Login"

**See**: [QUICK_START.md](QUICK_START.md)

---

### Task: Create a New Admin User
1. Login as System Admin
2. Go to Users section
3. Click "Create New User"
4. Fill in details and select role
5. Click "Create"

**See**: [ADMIN_USER_MANAGEMENT.md](ADMIN_USER_MANAGEMENT.md)

---

### Task: Understand User Roles
The system has 5 roles:
- **System Admin** - Full access
- **Dorm Admin** - Manage dormitory
- **Maintenance Staff** - Handle maintenance
- **Manager** - View reports
- **Student** - Personal access

**See**: [ROLE_BASED_SYSTEM.md](ROLE_BASED_SYSTEM.md)

---

### Task: Test Different Roles
After seeding, use these credentials:

| Role | Username | Password |
|------|----------|----------|
| System Admin | `admin` | `Admin@2026` |
| Dorm Admin | `warden_jane` | `Admin@2026` |
| Maintenance | `maint_mark` | `Admin@2026` |
| Student | `sam.student` | `Admin@2026` |

**See**: [QUICK_START.md](QUICK_START.md)

---

### Task: Deploy to Production
1. Build frontend: `npm run build`
2. Configure environment variables
3. Set up MongoDB Atlas
4. Deploy to hosting service
5. Configure domain and HTTPS

**See**: [BACKEND_SETUP_GUIDE.md](BACKEND_SETUP_GUIDE.md) & [FRONTEND_SETUP_GUIDE.md](FRONTEND_SETUP_GUIDE.md)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│              http://localhost:5173                       │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST API
                     │
┌────────────────────▼────────────────────────────────────┐
│                  Backend (Express)                       │
│              http://localhost:5000/api                   │
└────────────────────┬────────────────────────────────────┘
                     │ Mongoose ODM
                     │
┌────────────────────▼────────────────────────────────────┐
│                  MongoDB Database                        │
│            mongodb://127.0.0.1:27017/dms                │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 Documentation Files

| File | Purpose | Time |
|------|---------|------|
| [QUICK_START.md](QUICK_START.md) | Get running in 10 minutes | 10 min |
| [BACKEND_SETUP_GUIDE.md](BACKEND_SETUP_GUIDE.md) | Complete backend setup | 30 min |
| [FRONTEND_SETUP_GUIDE.md](FRONTEND_SETUP_GUIDE.md) | Complete frontend setup | 20 min |
| [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) | Step-by-step verification | 30 min |
| [ADMIN_USER_MANAGEMENT.md](ADMIN_USER_MANAGEMENT.md) | User management guide | Reference |
| [ROLE_BASED_SYSTEM.md](ROLE_BASED_SYSTEM.md) | Roles and permissions | Reference |
| [HARDCODED_CREDENTIALS_INFO.md](HARDCODED_CREDENTIALS_INFO.md) | Admin credentials | Reference |
| [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) | Complete index | Reference |
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | Implementation overview | Reference |
| [docs/API_REFERENCE.md](docs/API_REFERENCE.md) | API documentation | Reference |
| [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) | System requirements | Reference |
| [README.md](README.md) | Project overview | Reference |

---

## 🚀 Getting Started Paths

### Path 1: Quick Start (Fastest)
1. Read: [QUICK_START.md](QUICK_START.md)
2. Run commands
3. Login and explore
4. **Time: 10 minutes**

### Path 2: Detailed Setup (Recommended)
1. Read: [BACKEND_SETUP_GUIDE.md](BACKEND_SETUP_GUIDE.md)
2. Read: [FRONTEND_SETUP_GUIDE.md](FRONTEND_SETUP_GUIDE.md)
3. Follow step-by-step
4. Test all features
5. **Time: 50 minutes**

### Path 3: Complete Understanding (Thorough)
1. Read: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
2. Read: [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)
3. Read: [ROLE_BASED_SYSTEM.md](ROLE_BASED_SYSTEM.md)
4. Read: [ADMIN_USER_MANAGEMENT.md](ADMIN_USER_MANAGEMENT.md)
5. Read: [docs/API_REFERENCE.md](docs/API_REFERENCE.md)
6. **Time: 2 hours**

---

## 🔧 Technology Stack

### Frontend
- React 18.3.1
- TypeScript 5.8.3
- Vite 5.4.19
- Tailwind CSS 3.4.17
- shadcn/ui components

### Backend
- Node.js 18+
- Express 4.21.2
- MongoDB 5.0+
- Mongoose 8.8.0
- JWT authentication

### Development
- Nodemon (auto-reload)
- ESLint (code quality)
- Vitest (testing)
- Playwright (E2E testing)

---

## 📊 Features

### Core Features
- ✓ User authentication and authorization
- ✓ Role-based access control
- ✓ Room management and allocation
- ✓ Student management
- ✓ Maintenance request tracking
- ✓ Inventory management
- ✓ Room change requests
- ✓ Reports and analytics
- ✓ Audit logging
- ✓ Notifications

### Security Features
- ✓ JWT authentication
- ✓ Password hashing
- ✓ Role-based authorization
- ✓ Input validation
- ✓ CORS protection
- ✓ Rate limiting
- ✓ Security headers
- ✓ Audit trails

---

## ❓ Troubleshooting

### Backend won't start
→ See: [BACKEND_SETUP_GUIDE.md](BACKEND_SETUP_GUIDE.md) - Troubleshooting

### Frontend won't start
→ See: [FRONTEND_SETUP_GUIDE.md](FRONTEND_SETUP_GUIDE.md) - Troubleshooting

### Cannot login
→ See: [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) - Troubleshooting

### Permission denied
→ See: [ROLE_BASED_SYSTEM.md](ROLE_BASED_SYSTEM.md) - Troubleshooting

### API errors
→ See: [docs/API_REFERENCE.md](docs/API_REFERENCE.md) - Error Responses

---

## 📞 Support

1. **Check Documentation**: Search relevant guide
2. **Check Troubleshooting**: See specific guide's troubleshooting section
3. **Check API Reference**: For API-related issues
4. **Review Code**: Check implementation in source files

---

## 🎓 Learning Resources

### For Beginners
1. [README.md](README.md) - Project overview
2. [QUICK_START.md](QUICK_START.md) - Quick start
3. [ROLE_BASED_SYSTEM.md](ROLE_BASED_SYSTEM.md) - Understand roles

### For Developers
1. [BACKEND_SETUP_GUIDE.md](BACKEND_SETUP_GUIDE.md) - Backend details
2. [FRONTEND_SETUP_GUIDE.md](FRONTEND_SETUP_GUIDE.md) - Frontend details
3. [docs/API_REFERENCE.md](docs/API_REFERENCE.md) - API details

### For Administrators
1. [ADMIN_USER_MANAGEMENT.md](ADMIN_USER_MANAGEMENT.md) - User management
2. [ROLE_BASED_SYSTEM.md](ROLE_BASED_SYSTEM.md) - Roles and permissions
3. [HARDCODED_CREDENTIALS_INFO.md](HARDCODED_CREDENTIALS_INFO.md) - Credentials

---

## ✅ Verification Checklist

After setup, verify:
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] MongoDB connected
- [ ] Database seeded
- [ ] Can login as admin
- [ ] Can login as other roles
- [ ] Role-based access working
- [ ] API endpoints responding
- [ ] System ready for use

---

## 🎯 Next Steps

### Immediate (Today)
1. ✓ Read this file
2. ✓ Follow QUICK_START.md
3. ✓ Login and explore
4. ✓ Test different roles

### Short Term (This Week)
1. ✓ Read detailed setup guides
2. ✓ Understand role-based system
3. ✓ Create test users
4. ✓ Test all features

### Medium Term (This Month)
1. ✓ Customize for your needs
2. ✓ Set up production environment
3. ✓ Configure backups
4. ✓ Deploy to production

---

## 📝 Quick Reference

### URLs
```
Frontend:    http://localhost:5173
Backend API: http://localhost:5000/api
MongoDB:     mongodb://127.0.0.1:27017/dms
```

### Commands
```bash
# Backend
cd backend && npm install && npm run dev

# Frontend
npm install && npm run dev

# Seed database
cd backend && npm run seed
```

### Default Credentials
```
Username: admin
Password: Admin@2026
```

---

## 🎉 You're Ready!

Everything is set up and documented. Choose your path above and get started!

**Questions?** Check the relevant documentation file.

**Ready to begin?** Start with [QUICK_START.md](QUICK_START.md)

---

**Last Updated:** April 2026
**Version:** 1.0.0
**Status:** ✓ Complete and Ready to Use

---

## 📚 All Documentation Files

```
START_HERE.md                          ← You are here
├── QUICK_START.md                     ← Start here for quick setup
├── BACKEND_SETUP_GUIDE.md             ← Backend details
├── FRONTEND_SETUP_GUIDE.md            ← Frontend details
├── SETUP_CHECKLIST.md                 ← Verification checklist
├── ADMIN_USER_MANAGEMENT.md           ← User management
├── ROLE_BASED_SYSTEM.md               ← Roles and permissions
├── HARDCODED_CREDENTIALS_INFO.md      ← Admin credentials
├── DOCUMENTATION_INDEX.md             ← Complete index
├── IMPLEMENTATION_SUMMARY.md          ← Implementation overview
├── README.md                          ← Project overview
├── docs/
│   ├── API_REFERENCE.md               ← API documentation
│   └── REQUIREMENTS.md                ← System requirements
└── backend/src/config/constants.js    ← Hardcoded constants
```

---

**Welcome to DMS!** 🚀
