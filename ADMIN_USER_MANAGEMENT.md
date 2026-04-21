# Admin User Management Guide

## Overview

This guide explains how to manage system users, create admin accounts, and handle user roles in the Dormitory Management System (DMS).

## Table of Contents
1. [User Roles Overview](#user-roles-overview)
2. [Hardcoded Admin Usernames](#hardcoded-admin-usernames)
3. [Creating Admin Users](#creating-admin-users)
4. [Creating Non-Admin Users](#creating-non-admin-users)
5. [User Management Operations](#user-management-operations)
6. [Permission Matrix](#permission-matrix)
7. [Best Practices](#best-practices)

---

## User Roles Overview

The DMS has 5 distinct user roles:

### 1. System Admin
- **Purpose**: Full system access and user management
- **Username**: `admin` (hardcoded)
- **Email**: `admin@odu.edu.et`
- **Permissions**: All system operations
- **Can Create**: All other user types

### 2. Dorm Admin
- **Purpose**: Manage dormitory operations
- **Username**: `dormadmin` (hardcoded)
- **Email**: `dormadmin@odu.edu.et`
- **Permissions**: Room management, allocations, maintenance
- **Can Create**: Cannot create other users

### 3. Maintenance Staff
- **Purpose**: Handle maintenance requests
- **Username**: `maintenance` (hardcoded)
- **Email**: `maintenance@odu.edu.et`
- **Permissions**: View and update assigned tasks
- **Can Create**: Cannot create other users

### 4. Manager
- **Purpose**: View reports and analytics
- **Username**: `manager` (hardcoded)
- **Email**: `manager@odu.edu.et`
- **Permissions**: Reports, analytics, statistics
- **Can Create**: Cannot create other users

### 5. Student
- **Purpose**: Access personal information and submit requests
- **Username**: `firstname.lastname` (auto-generated from email)
- **Email**: `firstname.lastname@odu.edu.et`
- **Permissions**: Limited to own data and requests
- **Can Create**: Cannot create other users

---

## Hardcoded Admin Credentials

The system uses hardcoded credentials for the initial System Admin account. This ensures consistency and security:

### Primary System Admin (Hardcoded)

```
Username: admin
Password: Admin@2026
Email: admin@odu.edu.et
Role: System Admin
Full Name: System Administrator
```

**Important**: 
- These credentials are hardcoded in the system and cannot be changed
- Only this account can create additional admin users
- Change the password immediately after first login in production
- Keep these credentials secure and share only with authorized personnel

### Other Admin Usernames (Reserved)

For additional admin users created by System Admin:

```
Dorm Admin:       dormadmin
Maintenance:      maintenance
Manager:          manager
```

**Note**: These usernames are reserved for their respective roles. Only the System Admin can create users with these roles.

### Default Test Credentials (After Seeding)

After running `npm run seed`, the following test accounts are created:

| Role | Username | Password | Email |
|------|----------|----------|-------|
| **System Admin** | `admin` | `Admin@2026` | `admin@odu.edu.et` |
| Dorm Admin | `warden_jane` | `Admin@2026` | `jane@odu.edu.et` |
| Maintenance Staff | `maint_mark` | `Admin@2026` | `mark@odu.edu.et` |
| Student | `sam.student` | `Admin@2026` | `sam@student.odu.edu.et` |
| Student | `sally.student` | `Admin@2026` | `sally@student.odu.edu.et` |

**Note**: All test accounts use the same password for convenience. Change passwords in production.

---

## Creating Admin Users

### Prerequisites
- System Admin account must exist
- System Admin must be logged in
- Backend API must be running

### Method 1: Using API (Recommended)

#### Step 1: Get System Admin Token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin@1234"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "abc123...",
  "role": "System Admin",
  "user": {
    "id": "user_id",
    "username": "admin",
    "fullName": "System Admin",
    "email": "admin@odu.edu.et",
    "role": "System Admin"
  }
}
```

#### Step 2: Create New Dorm Admin

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "fullName": "Jane Warden",
    "email": "jane.warden@odu.edu.et",
    "role": "Dorm Admin",
    "password": "SecurePassword123"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id_123",
    "username": "jane.warden",
    "fullName": "Jane Warden",
    "email": "jane.warden@odu.edu.et",
    "role": "Dorm Admin",
    "status": "Active",
    "createdAt": "2026-04-21T10:30:00Z"
  }
}
```

#### Step 3: Create New Maintenance Staff

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "fullName": "Mark Technician",
    "email": "mark.technician@odu.edu.et",
    "role": "Maintenance Staff",
    "password": "SecurePassword456"
  }'
```

#### Step 4: Create New Manager

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "fullName": "Sarah Manager",
    "email": "sarah.manager@odu.edu.et",
    "role": "Management",
    "password": "SecurePassword789"
  }'
```

### Method 2: Using Postman

1. **Import Collection**
   - Open Postman
   - Import the API collection from `/docs/API_REFERENCE.md`

2. **Login as System Admin**
   - Select `POST /auth/login`
   - Body:
     ```json
     {
       "username": "admin",
       "password": "Admin@1234"
     }
     ```
   - Click Send
   - Copy the `token` from response

3. **Create New User**
   - Select `POST /users`
   - Set Authorization header:
     - Type: Bearer Token
     - Token: Paste the token from step 2
   - Body:
     ```json
     {
       "fullName": "New Admin Name",
       "email": "newemail@odu.edu.et",
       "role": "Dorm Admin",
       "password": "SecurePassword123"
     }
     ```
   - Click Send

### Method 3: Using Frontend Admin Panel

1. **Login as System Admin**
   - Navigate to `http://localhost:5173/login`
   - Username: `admin`
   - Password: `Admin@1234`

2. **Go to User Management**
   - Click on "Users" in sidebar
   - Click "Create New User" button

3. **Fill User Form**
   - Full Name: Enter user's full name
   - Email: Enter university email
   - Role: Select from dropdown (Dorm Admin, Maintenance Staff, Manager)
   - Password: Enter temporary password
   - Click "Create User"

4. **Share Credentials**
   - Share username and password with the new user
   - User should change password on first login

---

## Creating Non-Admin Users

### Creating Additional System Admins

Only the initial System Admin can create other System Admins:

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{
    "fullName": "Second Admin",
    "email": "admin2@odu.edu.et",
    "role": "System Admin",
    "password": "SecurePassword999"
  }'
```

**Note**: The username will be auto-generated as `admin2` (from email prefix).

### Creating Students

Students can self-register or be created by System Admin:

#### Student Self-Registration

```bash
curl -X POST http://localhost:5000/api/auth/register-student \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@odu.edu.et",
    "password": "StudentPass123",
    "studentId": "OBU12345",
    "gender": "M",
    "department": "Computer Science",
    "year": 2,
    "phone": "0912345678"
  }'
```

#### Admin Creating Student

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{
    "fullName": "Jane Smith",
    "email": "jane.smith@odu.edu.et",
    "role": "Student",
    "studentId": "OBU54321",
    "gender": "F",
    "department": "Engineering",
    "year": 1,
    "phone": "0987654321",
    "password": "TempPassword123"
  }'
```

---

## User Management Operations

### List All Users

```bash
curl -X GET "http://localhost:5000/api/users?role=Dorm%20Admin&status=Active" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

**Query Parameters:**
- `role`: Filter by role (System Admin, Dorm Admin, Maintenance Staff, Management, Student)
- `status`: Filter by status (Active, Inactive)
- `search`: Search by name, email, or username
- `limit`: Number of results (default: 25)
- `offset`: Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_id",
        "username": "dormadmin",
        "fullName": "Dorm Administrator",
        "email": "dormadmin@odu.edu.et",
        "role": "Dorm Admin",
        "status": "Active",
        "lastLogin": "2026-04-21T09:00:00Z"
      }
    ],
    "total": 1
  }
}
```

### Get Specific User

```bash
curl -X GET http://localhost:5000/api/users/user_id \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

### Update User

```bash
curl -X PUT http://localhost:5000/api/users/user_id \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{
    "fullName": "Updated Name",
    "email": "newemail@odu.edu.et",
    "status": "Active"
  }'
```

### Deactivate User

```bash
curl -X POST http://localhost:5000/api/users/user_id/deactivate \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "User deactivated"
  }
}
```

### Reactivate User

```bash
curl -X POST http://localhost:5000/api/users/user_id/reactivate \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

### Reset User Password

```bash
curl -X POST http://localhost:5000/api/users/user_id/reset-password \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Reset link sent"
  }
}
```

---

## Permission Matrix

### System Admin Permissions
```
✓ Create users (all roles)
✓ Update users
✓ Deactivate/reactivate users
✓ Reset user passwords
✓ View all system data
✓ Access audit logs
✓ Manage system settings
✓ View reports
✓ Manage rooms and allocations
✓ Manage maintenance requests
✓ Manage inventory
```

### Dorm Admin Permissions
```
✓ Manage rooms
✓ Assign students to rooms
✓ Approve/reject room changes
✓ Manage maintenance requests
✓ Assign maintenance tasks
✓ View student directory
✓ Manage inventory (furniture, keys, linen)
✓ View occupancy reports
✗ Create users
✗ Access audit logs
✗ Manage system settings
```

### Maintenance Staff Permissions
```
✓ View assigned maintenance tasks
✓ Update task status
✓ Add notes to tasks
✓ View task details
✗ Create tasks
✗ Assign tasks
✗ Manage other users
```

### Manager Permissions
```
✓ View reports and analytics
✓ View occupancy statistics
✓ Export reports
✓ View system dashboard
✓ View student directory
✗ Modify data
✗ Create users
✗ Manage maintenance
```

### Student Permissions
```
✓ View own profile
✓ View room assignment
✓ Submit maintenance requests
✓ Request room changes
✓ View notifications
✗ Manage other users
✗ View other students' data
✗ Manage rooms
```

---

## Best Practices

### 1. Password Management

**Strong Passwords:**
- Minimum 8 characters
- Mix of uppercase, lowercase, numbers, and symbols
- Example: `SecurePass@2026`

**Password Reset:**
- Always reset passwords for new users
- Users should change temporary passwords on first login
- Use secure password reset links

### 2. User Naming Conventions

**System Admin:**
```
Username: admin
Email: admin@odu.edu.et
```

**Dorm Admin:**
```
Username: firstname.lastname
Email: firstname.lastname@odu.edu.et
Example: jane.warden@odu.edu.et
```

**Maintenance Staff:**
```
Username: firstname.lastname
Email: firstname.lastname@odu.edu.et
Example: mark.technician@odu.edu.et
```

**Manager:**
```
Username: firstname.lastname
Email: firstname.lastname@odu.edu.et
Example: sarah.manager@odu.edu.et
```

**Student:**
```
Username: firstname.lastname
Email: firstname.lastname@odu.edu.et
Example: john.doe@odu.edu.et
```

### 3. Account Lifecycle

**Creation:**
1. Create account with temporary password
2. Send credentials to user
3. User logs in and changes password

**Maintenance:**
1. Monitor last login dates
2. Deactivate inactive accounts
3. Update user information as needed

**Deactivation:**
1. Deactivate instead of deleting
2. Preserve audit trail
3. Can reactivate if needed

### 4. Security Measures

**Access Control:**
- Only System Admin can create other admins
- Each role has specific permissions
- Audit all user management actions

**Monitoring:**
- Review audit logs regularly
- Monitor failed login attempts
- Track user activity

**Compliance:**
- Follow university policies
- Maintain data privacy
- Document all changes

### 5. Bulk User Creation

For creating multiple users at once:

```bash
# Create a CSV file: users.csv
# fullName,email,role,password
# Jane Warden,jane.warden@odu.edu.et,Dorm Admin,SecurePass123
# Mark Tech,mark.tech@odu.edu.et,Maintenance Staff,SecurePass456

# Use a script to create users from CSV
# (Requires custom implementation)
```

### 6. User Deactivation vs Deletion

**Deactivate (Recommended):**
- User cannot login
- Account data preserved
- Audit trail maintained
- Can be reactivated

**Delete (Not Recommended):**
- Removes all user data
- Breaks audit trail
- Cannot be recovered
- Use only in exceptional cases

---

## Troubleshooting

### Issue: "Cannot create user - Email already exists"

**Solution:**
```bash
# Check if user already exists
curl -X GET "http://localhost:5000/api/users?search=email@odu.edu.et" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"

# If user exists but inactive, reactivate instead
curl -X POST http://localhost:5000/api/users/user_id/reactivate \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

### Issue: "Unauthorized - insufficient permissions"

**Solution:**
```bash
# Verify you're logged in as System Admin
# Check token is valid and not expired
# Ensure Authorization header is set correctly
```

### Issue: "Invalid role specified"

**Solution:**
```bash
# Valid roles are:
# - System Admin
# - Dorm Admin
# - Maintenance Staff
# - Management
# - Student

# Check spelling and capitalization
```

### Issue: "User cannot login after creation"

**Solution:**
```bash
# Verify user status is "Active"
curl -X GET http://localhost:5000/api/users/user_id \
  -H "Authorization: Bearer <ADMIN_TOKEN>"

# Reactivate if inactive
curl -X POST http://localhost:5000/api/users/user_id/reactivate \
  -H "Authorization: Bearer <ADMIN_TOKEN>"

# Reset password
curl -X POST http://localhost:5000/api/users/user_id/reset-password \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

---

## Quick Reference

### Create Dorm Admin
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "fullName": "Name",
    "email": "email@odu.edu.et",
    "role": "Dorm Admin",
    "password": "Password123"
  }'
```

### Create Maintenance Staff
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "fullName": "Name",
    "email": "email@odu.edu.et",
    "role": "Maintenance Staff",
    "password": "Password123"
  }'
```

### Create Manager
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "fullName": "Name",
    "email": "email@odu.edu.et",
    "role": "Management",
    "password": "Password123"
  }'
```

### Deactivate User
```bash
curl -X POST http://localhost:5000/api/users/user_id/deactivate \
  -H "Authorization: Bearer <TOKEN>"
```

### Reactivate User
```bash
curl -X POST http://localhost:5000/api/users/user_id/reactivate \
  -H "Authorization: Bearer <TOKEN>"
```

---

## Support

For additional help:
- See `BACKEND_SETUP_GUIDE.md` for backend setup
- See `FRONTEND_SETUP_GUIDE.md` for frontend setup
- Check `/docs/API_REFERENCE.md` for API details
- Review audit logs for troubleshooting

---

**Last Updated:** April 2026
**Version:** 1.0.0
