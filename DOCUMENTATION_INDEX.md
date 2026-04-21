# DMS Documentation Index

Complete documentation for the Dormitory Management System (DMS).

## Quick Navigation

### 🚀 Getting Started
- **[QUICK_START.md](QUICK_START.md)** - Get up and running in 10 minutes
- **[BACKEND_SETUP_GUIDE.md](BACKEND_SETUP_GUIDE.md)** - Detailed backend setup
- **[FRONTEND_SETUP_GUIDE.md](FRONTEND_SETUP_GUIDE.md)** - Detailed frontend setup

### 👥 User & Role Management
- **[ADMIN_USER_MANAGEMENT.md](ADMIN_USER_MANAGEMENT.md)** - Create and manage users
- **[ROLE_BASED_SYSTEM.md](ROLE_BASED_SYSTEM.md)** - Understand roles and permissions
- **[HARDCODED_CREDENTIALS_INFO.md](HARDCODED_CREDENTIALS_INFO.md)** - Hardcoded admin credentials

### 📚 API & Technical
- **[docs/API_REFERENCE.md](docs/API_REFERENCE.md)** - Complete API documentation
- **[docs/REQUIREMENTS.md](docs/REQUIREMENTS.md)** - System requirements
- **[README.md](README.md)** - Project overview

---

## Document Descriptions

### QUICK_START.md
**Purpose**: Get the system running quickly  
**Time**: 10 minutes  
**Audience**: Everyone  
**Contents**:
- Prerequisites
- Backend setup (5 min)
- Frontend setup (3 min)
- Login & test (2 min)
- Default credentials
- Common tasks
- Troubleshooting

**When to Use**: First time setup, quick reference

---

### BACKEND_SETUP_GUIDE.md
**Purpose**: Complete backend installation and configuration  
**Time**: 30 minutes  
**Audience**: Backend developers, DevOps  
**Contents**:
- Prerequisites and installation
- Database setup (local, cloud, Docker)
- Environment configuration
- Running the backend
- User roles and authentication
- Admin user management
- Login instructions by role
- Student registration
- API testing
- Troubleshooting
- Production deployment

**When to Use**: Setting up backend, troubleshooting issues, production deployment

---

### FRONTEND_SETUP_GUIDE.md
**Purpose**: Complete frontend installation and configuration  
**Time**: 20 minutes  
**Audience**: Frontend developers  
**Contents**:
- Prerequisites and installation
- Environment configuration
- Running the frontend
- Login and testing
- Building for production
- Testing (unit, E2E, linting)
- Project structure
- Key features and routes
- API integration
- Customization
- Performance optimization
- Troubleshooting
- Development workflow
- Production deployment

**When to Use**: Setting up frontend, customization, deployment

---

### ADMIN_USER_MANAGEMENT.md
**Purpose**: Manage system users and admin accounts  
**Time**: Reference document  
**Audience**: System administrators  
**Contents**:
- User roles overview
- Hardcoded admin usernames
- Creating admin users (API, Postman, Frontend)
- Creating non-admin users
- User management operations (list, get, update, deactivate, reactivate, reset password)
- Permission matrix
- Best practices
- Troubleshooting

**When to Use**: Creating users, managing permissions, troubleshooting access issues

---

### ROLE_BASED_SYSTEM.md
**Purpose**: Understand and manage role-based access control  
**Time**: Reference document  
**Audience**: Administrators, developers  
**Contents**:
- System overview
- Role definitions (System Admin, Dorm Admin, Maintenance Staff, Manager, Student)
- Detailed permission matrix
- Access control implementation (backend, frontend)
- Managing roles
- Best practices
- Troubleshooting

**When to Use**: Understanding roles, implementing access control, troubleshooting permissions

---

### HARDCODED_CREDENTIALS_INFO.md
**Purpose**: Information about hardcoded admin credentials  
**Time**: Reference document  
**Audience**: Administrators, developers  
**Contents**:
- Hardcoded admin credentials
- Location in codebase
- Test credentials after seeding
- Security considerations
- How to change credentials
- First login procedure
- Files updated
- Backend implementation details
- Troubleshooting
- Security best practices

**When to Use**: Understanding admin credentials, changing credentials, security setup

---

### docs/API_REFERENCE.md
**Purpose**: Complete API documentation  
**Time**: Reference document  
**Audience**: Frontend developers, API consumers  
**Contents**:
- Authentication endpoints
- Student portal endpoints
- Room management endpoints
- Room allocation endpoints
- Room change request endpoints
- Maintenance endpoints
- Inventory endpoints
- Reports endpoints
- User management endpoints
- Notification endpoints
- Audit log endpoints
- Error responses
- Data schemas
- Frontend integration notes

**When to Use**: API integration, endpoint reference, data schema validation

---

### docs/REQUIREMENTS.md
**Purpose**: System requirements and specifications  
**Time**: Reference document  
**Audience**: Project managers, developers  
**Contents**:
- Functional requirements
- Non-functional requirements
- System specifications
- Technology stack
- Performance requirements
- Security requirements

**When to Use**: Understanding system requirements, planning features

---

### README.md
**Purpose**: Project overview and introduction  
**Time**: 5 minutes  
**Audience**: Everyone  
**Contents**:
- Project overview
- User roles
- Core modules
- Technology stack
- Prerequisites
- Getting started
- Project structure
- Application routes
- Customization
- Performance requirements
- Security features
- API integration
- Environment variables
- Contributing guidelines

**When to Use**: Project introduction, understanding features

---

## Setup Workflow

### For New Developers

1. **Read**: [QUICK_START.md](QUICK_START.md) (10 min)
2. **Setup**: Follow backend and frontend setup
3. **Test**: Login with default credentials
4. **Read**: [ROLE_BASED_SYSTEM.md](ROLE_BASED_SYSTEM.md) to understand roles
5. **Reference**: [docs/API_REFERENCE.md](docs/API_REFERENCE.md) for API details

### For System Administrators

1. **Read**: [QUICK_START.md](QUICK_START.md) (10 min)
2. **Setup**: Follow backend and frontend setup
3. **Read**: [ADMIN_USER_MANAGEMENT.md](ADMIN_USER_MANAGEMENT.md)
4. **Read**: [ROLE_BASED_SYSTEM.md](ROLE_BASED_SYSTEM.md)
5. **Manage**: Create users and manage permissions

### For DevOps/Deployment

1. **Read**: [BACKEND_SETUP_GUIDE.md](BACKEND_SETUP_GUIDE.md) - Production section
2. **Read**: [FRONTEND_SETUP_GUIDE.md](FRONTEND_SETUP_GUIDE.md) - Production section
3. **Configure**: Environment variables for production
4. **Deploy**: Follow deployment instructions
5. **Monitor**: Set up logging and monitoring

### For API Integration

1. **Read**: [docs/API_REFERENCE.md](docs/API_REFERENCE.md)
2. **Reference**: Data schemas and endpoints
3. **Test**: Use Postman or cURL examples
4. **Implement**: Integrate with frontend/external systems

---

## Key Information Quick Reference

### Default Credentials (After Seeding)

| Role | Username | Password |
|------|----------|----------|
| System Admin | `admin` | `Admin@2026` |
| Dorm Admin | `warden_jane` | `Admin@2026` |
| Maintenance | `maint_mark` | `Admin@2026` |
| Manager | `manager` | `Admin@2026` |
| Student | `sam.student` | `Admin@2026` |

### URLs

| Service | URL |
|---------|-----|
| Frontend | `http://localhost:5173` |
| Backend API | `http://localhost:5000/api` |
| MongoDB | `mongodb://127.0.0.1:27017/dms` |

### Key Commands

```bash
# Backend
cd backend
npm install
npm run dev          # Start development
npm run seed         # Seed database
npm start            # Start production

# Frontend
npm install
npm run dev          # Start development
npm run build        # Build production
npm run test         # Run tests
npm run lint         # Check code quality
```

### User Roles

| Role | Purpose | Can Create |
|------|---------|-----------|
| System Admin | Full system access | All roles |
| Dorm Admin | Manage dormitory | Cannot create users |
| Maintenance Staff | Handle maintenance | Cannot create users |
| Manager | View reports | Cannot create users |
| Student | Access personal data | Cannot create users |

### Hardcoded Usernames

```
admin          → System Admin
dormadmin      → Dorm Admin
maintenance    → Maintenance Staff
manager        → Manager
firstname.lastname → Student (auto-generated)
```

---

## Troubleshooting Guide

### Backend Issues
→ See [BACKEND_SETUP_GUIDE.md](BACKEND_SETUP_GUIDE.md) Troubleshooting section

### Frontend Issues
→ See [FRONTEND_SETUP_GUIDE.md](FRONTEND_SETUP_GUIDE.md) Troubleshooting section

### User/Permission Issues
→ See [ADMIN_USER_MANAGEMENT.md](ADMIN_USER_MANAGEMENT.md) Troubleshooting section

### Role/Access Issues
→ See [ROLE_BASED_SYSTEM.md](ROLE_BASED_SYSTEM.md) Troubleshooting section

### API Issues
→ See [docs/API_REFERENCE.md](docs/API_REFERENCE.md) Error Responses section

---

## Document Maintenance

### Last Updated
- **QUICK_START.md**: April 2026
- **BACKEND_SETUP_GUIDE.md**: April 2026
- **FRONTEND_SETUP_GUIDE.md**: April 2026
- **ADMIN_USER_MANAGEMENT.md**: April 2026
- **ROLE_BASED_SYSTEM.md**: April 2026
- **docs/API_REFERENCE.md**: April 2026
- **docs/REQUIREMENTS.md**: April 2026
- **README.md**: April 2026

### Version
All documents: Version 1.0.0

### Contributing
When updating documentation:
1. Update the document
2. Update "Last Updated" date
3. Update version if major changes
4. Update this index if adding new documents

---

## File Structure

```
oda-bultum-dms/
├── QUICK_START.md                    # Quick start guide
├── BACKEND_SETUP_GUIDE.md            # Backend setup
├── FRONTEND_SETUP_GUIDE.md           # Frontend setup
├── ADMIN_USER_MANAGEMENT.md          # User management
├── ROLE_BASED_SYSTEM.md              # Role-based access control
├── DOCUMENTATION_INDEX.md            # This file
│
├── docs/
│   ├── API_REFERENCE.md              # API documentation
│   └── REQUIREMENTS.md               # System requirements
│
├── README.md                         # Project overview
│
├── backend/                          # Backend code
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── src/                              # Frontend code
│   ├── components/
│   ├── pages/
│   ├── App.tsx
│   └── main.tsx
│
└── package.json                      # Frontend dependencies
```

---

## Support & Contact

For issues or questions:

1. **Check Documentation**: Search relevant guide
2. **Check Troubleshooting**: See specific guide's troubleshooting section
3. **Check API Reference**: For API-related issues
4. **Review Code**: Check implementation in source files
5. **Contact Team**: Reach out to development team

---

## Learning Path

### Beginner (New to System)
1. [README.md](README.md) - Understand what the system does
2. [QUICK_START.md](QUICK_START.md) - Get it running
3. [ROLE_BASED_SYSTEM.md](ROLE_BASED_SYSTEM.md) - Understand roles

### Intermediate (Using System)
1. [ADMIN_USER_MANAGEMENT.md](ADMIN_USER_MANAGEMENT.md) - Manage users
2. [BACKEND_SETUP_GUIDE.md](BACKEND_SETUP_GUIDE.md) - Understand backend
3. [FRONTEND_SETUP_GUIDE.md](FRONTEND_SETUP_GUIDE.md) - Understand frontend

### Advanced (Developing/Deploying)
1. [docs/API_REFERENCE.md](docs/API_REFERENCE.md) - API details
2. [BACKEND_SETUP_GUIDE.md](BACKEND_SETUP_GUIDE.md) - Production section
3. [FRONTEND_SETUP_GUIDE.md](FRONTEND_SETUP_GUIDE.md) - Production section

---

## Checklist for New Setup

- [ ] Read QUICK_START.md
- [ ] Install Node.js and MongoDB
- [ ] Clone repository
- [ ] Setup backend (.env, npm install, npm run dev)
- [ ] Setup frontend (npm install, npm run dev)
- [ ] Run seed (npm run seed in backend)
- [ ] Login with default credentials
- [ ] Test different roles
- [ ] Read ROLE_BASED_SYSTEM.md
- [ ] Read ADMIN_USER_MANAGEMENT.md
- [ ] Create test users
- [ ] Test API endpoints
- [ ] Review API_REFERENCE.md

---

**Welcome to the Dormitory Management System!** 🎓

Start with [QUICK_START.md](QUICK_START.md) and follow the learning path above.

---

**Last Updated:** April 2026
**Version:** 1.0.0
