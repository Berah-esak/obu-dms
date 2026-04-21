# Dormitory Management System (DMS) - Backend Setup Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Installation & Setup](#backend-installation--setup)
3. [Database Setup](#database-setup)
4. [Running the Backend](#running-the-backend)
5. [User Roles & Authentication](#user-roles--authentication)
6. [Admin User Management](#admin-user-management)
7. [Login Instructions by Role](#login-instructions-by-role)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5.0 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** (comes with Node.js) or **yarn** or **bun**

### Verify Installation
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check MongoDB version (if installed locally)
mongod --version
```

---

## Backend Installation & Setup

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Install Dependencies
```bash
# Using npm
npm install

# Or using yarn
yarn install

# Or using bun
bun install
```

This will install all required packages:
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **joi** - Data validation
- **cors** - Cross-origin resource sharing
- **helmet** - Security headers
- **morgan** - HTTP request logging
- **compression** - Response compression
- **express-rate-limit** - Rate limiting
- **dotenv** - Environment variables
- **nodemon** - Development auto-reload (dev only)

---

## Database Setup

### Option 1: Local MongoDB Installation

#### On Linux/Mac:
```bash
# Start MongoDB service
mongod

# In another terminal, verify connection
mongo
```

#### On Windows:
```bash
# MongoDB should be running as a service
# Verify in Services or start manually:
"C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe"
```

### Option 2: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/dms`

### Option 3: Docker (Recommended for Development)

```bash
# Pull and run MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Verify it's running
docker ps
```

---

## Environment Configuration

### Step 1: Create `.env` File in Backend Directory

```bash
cd backend
cp .env.example .env
```

### Step 2: Edit `.env` File

```env
# Node Environment
NODE_ENV=development

# Server Port
PORT=5000

# MongoDB Connection
# For local MongoDB:
MONGO_URI=mongodb://127.0.0.1:27017/dms

# For MongoDB Atlas (cloud):
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dms

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# CORS Configuration (Frontend URL)
CORS_ORIGIN=http://localhost:5173
```

### Important Security Notes:
- **JWT_SECRET**: Change this to a strong random string in production
- **NODE_ENV**: Set to `production` when deploying
- **MONGO_URI**: Use environment-specific URIs
- **CORS_ORIGIN**: Update to match your frontend URL

---

## Running the Backend

### Development Mode (with Auto-Reload)

```bash
npm run dev
```

This uses **nodemon** to automatically restart the server when files change.

**Expected Output:**
```
DMS API listening on port 5000
MongoDB Connected: 127.0.0.1
```

### Production Mode

```bash
npm start
```

### Seed Initial Data (Optional)

To populate the database with sample data and default admin users:

```bash
npm run seed
```

This creates:
- 1 System Admin user
- 1 Dorm Admin user
- 1 Maintenance Staff user
- 2 Student users
- 2 Dorm buildings with sample rooms

**Default Credentials After Seeding:**
```
Username: admin
Password: Admin@2026
Role: System Admin
```

---

## User Roles & Authentication

### System Roles

The DMS supports 5 user roles with different permissions:

| Role | Username Format | Email Format | Permissions |
|------|-----------------|--------------|-------------|
| **System Admin** | `admin` | `admin@odu.edu.et` | Full system access, user management |
| **Dorm Admin** | `dormadmin` | `dormadmin@odu.edu.et` | Room management, allocations, maintenance |
| **Maintenance Staff** | `maintenance` | `maintenance@odu.edu.et` | View/update assigned maintenance tasks |
| **Management** | `manager` | `manager@odu.edu.et` | View reports and analytics |
| **Student** | `firstname.lastname` | `firstname.lastname@odu.edu.et` | View profile, submit requests |

### Role Permissions Matrix

```
System Admin:
  ✓ Create/manage all users
  ✓ Create other admins, managers, maintenance staff
  ✓ View all system data
  ✓ Access audit logs
  ✓ System configuration

Dorm Admin:
  ✓ Manage rooms and allocations
  ✓ Approve/reject room changes
  ✓ Manage maintenance requests
  ✓ View student directory
  ✓ Manage inventory

Maintenance Staff:
  ✓ View assigned maintenance tasks
  ✓ Update task status
  ✓ Add notes to tasks

Management:
  ✓ View reports and analytics
  ✓ View occupancy statistics
  ✓ Export reports

Student:
  ✓ View own profile
  ✓ View room assignment
  ✓ Submit maintenance requests
  ✓ Request room changes
```

---

## Admin User Management

### Creating New Admin Users

Only the **System Admin** can create other admin users. Here's how:

#### Method 1: Via API (Recommended)

**Endpoint:** `POST /api/users`

**Headers:**
```
Authorization: Bearer <system_admin_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "fullName": "New Admin Name",
  "email": "newadmin@odu.edu.et",
  "role": "Dorm Admin",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "username": "newadmin",
    "fullName": "New Admin Name",
    "email": "newadmin@odu.edu.et",
    "role": "Dorm Admin",
    "status": "Active"
  }
}
```

#### Method 2: Direct Database Insertion (Development Only)

```javascript
// In MongoDB shell or Compass
db.users.insertOne({
  username: "newadmin",
  fullName: "New Admin Name",
  email: "newadmin@odu.edu.et",
  password: "$2a$12$...", // bcrypt hashed password
  role: "Dorm Admin",
  status: "Active",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Hardcoded Admin Usernames

The system uses hardcoded usernames for non-student roles:

```
System Admin:     admin@odu.edu.et
Dorm Admin:       dormadmin@odu.edu.et
Maintenance:      maintenance@odu.edu.et
Manager:          manager@odu.edu.et
```

**Only the System Admin can create additional users with these roles.**

### Deactivating Users

```bash
# Via API
PUT /api/users/{userId}/deactivate

# Response
{
  "success": true,
  "data": {
    "message": "User deactivated"
  }
}
```

### Reactivating Users

```bash
# Via API
PUT /api/users/{userId}/reactivate

# Response
{
  "success": true,
  "data": {
    "message": "User reactivated"
  }
}
```

### Resetting User Password

```bash
# Via API (Admin only)
POST /api/users/{userId}/reset-password

# Response
{
  "success": true,
  "data": {
    "message": "Reset link sent"
  }
}
```

---

## Login Instructions by Role

### 1. System Admin Login

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "username": "admin",
  "password": "Admin@2026"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "abc123def456...",
  "role": "System Admin",
  "user": {
    "id": "user_id",
    "username": "admin",
    "fullName": "System Admin",
    "email": "admin@odu.edu.et",
    "role": "System Admin",
    "status": "Active"
  }
}
```

**Capabilities:**
- Create/manage all users
- Create other admins
- Access system settings
- View audit logs
- Full system access

---

### 2. Dorm Admin Login

**Request:**
```json
{
  "username": "dormadmin",
  "password": "DormAdmin@1234"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "xyz789...",
  "role": "Dorm Admin",
  "user": {
    "id": "user_id",
    "username": "dormadmin",
    "fullName": "Dorm Administrator",
    "email": "dormadmin@odu.edu.et",
    "role": "Dorm Admin",
    "status": "Active"
  }
}
```

**Capabilities:**
- Manage rooms and buildings
- Assign students to rooms
- Approve/reject room changes
- Manage maintenance requests
- View student directory
- Manage inventory (furniture, keys, linen)

---

### 3. Maintenance Staff Login

**Request:**
```json
{
  "username": "maintenance",
  "password": "Maintenance@1234"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "maint123...",
  "role": "Maintenance Staff",
  "user": {
    "id": "user_id",
    "username": "maintenance",
    "fullName": "Maintenance Staff",
    "email": "maintenance@odu.edu.et",
    "role": "Maintenance Staff",
    "status": "Active"
  }
}
```

**Capabilities:**
- View assigned maintenance tasks
- Update task status
- Add notes to tasks
- Track task progress

---

### 4. Manager Login

**Request:**
```json
{
  "username": "manager",
  "password": "Manager@1234"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "mgr456...",
  "role": "Management",
  "user": {
    "id": "user_id",
    "username": "manager",
    "fullName": "Manager",
    "email": "manager@odu.edu.et",
    "role": "Management",
    "status": "Active"
  }
}
```

**Capabilities:**
- View reports and analytics
- View occupancy statistics
- Export reports
- View system dashboard

---

### 5. Student Login

**Request:**
```json
{
  "username": "firstname.lastname",
  "password": "StudentPassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "std789...",
  "role": "Student",
  "user": {
    "id": "user_id",
    "username": "firstname.lastname",
    "fullName": "Student Name",
    "email": "firstname.lastname@odu.edu.et",
    "role": "Student",
    "status": "Active",
    "studentId": "OBU12345"
  }
}
```

**Capabilities:**
- View own profile
- View room assignment
- Submit maintenance requests
- Request room changes
- View notifications

---

## Student Registration

Students can self-register using their university email:

**Endpoint:** `POST /api/auth/register-student`

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@odu.edu.et",
  "password": "SecurePass123",
  "studentId": "OBU12345",
  "gender": "M",
  "department": "Computer Science",
  "year": 2,
  "phone": "0912345678"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "user_id",
    "username": "john.doe",
    "email": "john.doe@odu.edu.et",
    "role": "Student"
  },
  "student": {
    "id": "student_id",
    "studentId": "OBU12345"
  }
}
```

**Requirements:**
- Email must end with `@odu.edu.et`
- Password minimum 6 characters
- Student ID must be unique
- Phone number must be unique

---

## API Testing

### Using cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@2026"}'

# Get users (requires token)
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman

1. Import the API collection from `/docs/API_REFERENCE.md`
2. Set base URL to `http://localhost:5000/api`
3. Use the login endpoint to get a token
4. Add token to Authorization header for protected endpoints

### Using Thunder Client (VS Code)

1. Install Thunder Client extension
2. Create a new request
3. Set method to POST
4. URL: `http://localhost:5000/api/auth/login`
5. Body (JSON):
```json
{
  "username": "admin",
  "password": "Admin@2026"
}
```

---

## Troubleshooting

### Issue: "Cannot connect to MongoDB"

**Solution:**
```bash
# Check if MongoDB is running
# On Linux/Mac:
ps aux | grep mongod

# On Windows:
tasklist | findstr mongod

# Start MongoDB if not running
mongod

# Or using Docker:
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Issue: "Port 5000 already in use"

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use a different port in .env
PORT=5001
```

### Issue: "JWT_SECRET not set"

**Solution:**
```bash
# Edit .env file and add:
JWT_SECRET=your_secret_key_here

# Restart the server
npm run dev
```

### Issue: "CORS error when connecting from frontend"

**Solution:**
```bash
# Update CORS_ORIGIN in .env to match frontend URL
CORS_ORIGIN=http://localhost:5173

# Restart the server
npm run dev
```

### Issue: "Invalid credentials" on login

**Solution:**
```bash
# Verify user exists in database
# Run seed to create default users:
npm run seed

# Check username and password are correct
# Default admin credentials:
# Username: admin
# Password: Admin@2026
```

### Issue: "Cannot find module 'express'"

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: "MongooseError: Cannot connect to MongoDB"

**Solution:**
```bash
# Check MONGO_URI in .env
# For local: mongodb://127.0.0.1:27017/dms
# For Atlas: mongodb+srv://user:pass@cluster.mongodb.net/dms

# Test connection:
mongosh "mongodb://127.0.0.1:27017/dms"
```

---

## Production Deployment Checklist

- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Use strong `JWT_SECRET` (minimum 32 characters)
- [ ] Use MongoDB Atlas or managed database
- [ ] Set `CORS_ORIGIN` to production frontend URL
- [ ] Enable HTTPS
- [ ] Set up environment variables on server
- [ ] Run `npm install --production`
- [ ] Use process manager (PM2, systemd, etc.)
- [ ] Set up monitoring and logging
- [ ] Configure backups for MongoDB
- [ ] Test all authentication flows
- [ ] Review security headers (Helmet is enabled)

---

## Quick Reference

### Start Backend
```bash
cd backend
npm install
npm run dev
```

### Seed Database
```bash
npm run seed
```

### Default Admin Credentials
```
Username: admin
Password: Admin@2026
```

### API Base URL
```
http://localhost:5000/api
```

### Frontend URL
```
http://localhost:5173
```

### MongoDB Connection
```
mongodb://127.0.0.1:27017/dms
```

---

## Support & Documentation

- **API Reference**: See `/docs/API_REFERENCE.md`
- **Requirements**: See `/docs/REQUIREMENTS.md`
- **Frontend Setup**: See `README.md`
- **Issues**: Check the Troubleshooting section above

---

**Last Updated:** April 2026
**Version:** 1.0.0
