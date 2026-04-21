# Role-Based Access Control (RBAC) System

Complete guide to understanding and managing the role-based access control system in the DMS.

## Table of Contents
1. [System Overview](#system-overview)
2. [Role Definitions](#role-definitions)
3. [Permission Matrix](#permission-matrix)
4. [Access Control Implementation](#access-control-implementation)
5. [Managing Roles](#managing-roles)
6. [Best Practices](#best-practices)

---

## System Overview

The DMS implements a hierarchical role-based access control (RBAC) system with 5 distinct roles:

```
┌─────────────────────────────────────────────────────────┐
│                   System Admin                          │
│              (Full System Access)                       │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
    ┌────────┐  ┌────────┐  ┌────────┐
    │ Dorm   │  │Manager │  │Maint.  │
    │ Admin  │  │        │  │ Staff  │
    └────────┘  └────────┘  └────────┘
        │
        ▼
    ┌────────┐
    │Student │
    └────────┘
```

---

## Role Definitions

### 1. System Admin

**Purpose**: Full system administration and user management

**Hardcoded Username**: `admin`
**Email**: `admin@odu.edu.et`
**Default Password**: `Admin@2026`

**Responsibilities**:
- Create and manage all user accounts
- Create other System Admins
- Create Dorm Admins, Managers, and Maintenance Staff
- Access system settings and configuration
- View audit logs and system activity
- Reset user passwords
- Deactivate/reactivate users
- Full access to all modules

**Key Features**:
- User Management Dashboard
- System Settings Panel
- Audit Log Viewer
- Full Data Access

**Cannot Be Created By**: Anyone (only initial admin)
**Can Create**: All roles (System Admin, Dorm Admin, Manager, Maintenance Staff, Student)

---

### 2. Dorm Admin

**Purpose**: Manage dormitory operations and student accommodations

**Hardcoded Username**: `dormadmin`
**Email**: `dormadmin@odu.edu.et`
**Default Password**: `DormAdmin@1234`

**Responsibilities**:
- Manage rooms and buildings
- Assign students to rooms
- Approve/reject room change requests
- Manage maintenance requests
- Assign maintenance tasks to staff
- Manage inventory (furniture, keys, linen)
- View student directory
- Generate occupancy reports

**Key Features**:
- Room Management Dashboard
- Student Allocation Tools
- Maintenance Request Management
- Inventory Tracking
- Occupancy Reports

**Cannot Be Created By**: Dorm Admin, Manager, Maintenance Staff, Student
**Can Create**: Cannot create other users
**Can Manage**: Rooms, Allocations, Maintenance, Inventory

---

### 3. Maintenance Staff

**Purpose**: Handle and track maintenance requests

**Hardcoded Username**: `maintenance`
**Email**: `maintenance@odu.edu.et`
**Default Password**: `Maintenance@1234`

**Responsibilities**:
- View assigned maintenance tasks
- Update task status (In Progress, Completed, etc.)
- Add notes and updates to tasks
- Track task progress
- View task details and requirements

**Key Features**:
- Task Dashboard
- Task Status Updates
- Note Management
- Task History

**Cannot Be Created By**: Maintenance Staff, Manager, Student
**Can Create**: Cannot create other users
**Can Manage**: Only assigned maintenance tasks

---

### 4. Manager

**Purpose**: View reports, analytics, and system statistics

**Hardcoded Username**: `manager`
**Email**: `manager@odu.edu.et`
**Default Password**: `Manager@1234`

**Responsibilities**:
- View reports and analytics
- View occupancy statistics
- View student directory
- Export reports to PDF/Excel
- View system dashboard
- Monitor key metrics

**Key Features**:
- Analytics Dashboard
- Report Generation
- Data Export
- Statistics Viewer

**Cannot Be Created By**: Manager, Maintenance Staff, Student
**Can Create**: Cannot create other users
**Can Manage**: Cannot modify data, read-only access

---

### 5. Student

**Purpose**: Access personal information and submit requests

**Username Format**: `firstname.lastname` (auto-generated from email)
**Email Format**: `firstname.lastname@odu.edu.et`
**Registration**: Self-registration or admin creation

**Responsibilities**:
- View own profile
- View room assignment
- Submit maintenance requests
- Request room changes
- View notifications
- Update personal information

**Key Features**:
- Personal Dashboard
- Room Assignment View
- Maintenance Request Submission
- Room Change Request
- Notification Center

**Cannot Be Created By**: Student, Maintenance Staff
**Can Create**: Cannot create other users
**Can Manage**: Only own data and requests

---

## Permission Matrix

### Detailed Permissions by Role

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PERMISSION MATRIX                                  │
├──────────────────────────┬────────┬──────────┬──────────┬─────────┬─────────┤
│ Feature/Permission       │ Admin  │ DormAdm  │ Manager  │ Maint.  │ Student │
├──────────────────────────┼────────┼──────────┼──────────┼─────────┼─────────┤
│ USER MANAGEMENT          │        │          │          │         │         │
│ ├─ Create Users          │   ✓    │    ✗     │    ✗     │    ✗    │    ✗    │
│ ├─ Edit Users            │   ✓    │    ✗     │    ✗     │    ✗    │    ✗    │
│ ├─ Delete Users          │   ✓    │    ✗     │    ✗     │    ✗    │    ✗    │
│ ├─ Deactivate Users      │   ✓    │    ✗     │    ✗     │    ✗    │    ✗    │
│ ├─ Reset Passwords       │   ✓    │    ✗     │    ✗     │    ✗    │    ✗    │
│ └─ View All Users        │   ✓    │    ✗     │    ✗     │    ✗    │    ✗    │
│                          │        │          │          │         │         │
│ ROOM MANAGEMENT          │        │          │          │         │         │
│ ├─ Create Rooms          │   ✓    │    ✓     │    ✗     │    ✗    │    ✗    │
│ ├─ Edit Rooms            │   ✓    │    ✓     │    ✗     │    ✗    │    ✗    │
│ ├─ Delete Rooms          │   ✓    │    ✓     │    ✗     │    ✗    │    ✗    │
│ ├─ View Rooms            │   ✓    │    ✓     │    ✓     │    ✓    │    ✓    │
│ └─ Manage Capacity       │   ✓    │    ✓     │    ✗     │    ✗    │    ✗    │
│                          │        │          │          │         │         │
│ ALLOCATION               │        │          │          │         │         │
│ ├─ Manual Assign         │   ✓    │    ✓     │    ✗     │    ✗    │    ✗    │
│ ├─ Bulk Assign           │   ✓    │    ✓     │    ✗     │    ✗    │    ✗    │
│ ├─ Unassign              │   ✓    │    ✓     │    ✗     │    ✗    │    ✗    │
│ └─ View Assignments      │   ✓    │    ✓     │    ✓     │    ✗    │    ✓    │
│                          │        │          │          │         │         │
│ ROOM CHANGES             │        │          │          │         │         │
│ ├─ Submit Request        │   ✓    │    ✗     │    ✗     │    ✗    │    ✓    │
│ ├─ Approve Request       │   ✓    │    ✓     │    ✗     │    ✗    │    ✗    │
│ ├─ Reject Request        │   ✓    │    ✓     │    ✗     │    ✗    │    ✗    │
│ └─ View Requests         │   ✓    │    ✓     │    ✓     │    ✗    │    ✓    │
│                          │        │          │          │         │         │
│ MAINTENANCE              │        │          │          │         │         │
│ ├─ Submit Request        │   ✓    │    ✗     │    ✗     │    ✗    │    ✓    │
│ ├─ Create Task           │   ✓    │    ✓     │    ✗     │    ✗    │    ✗    │
│ ├─ Assign Task           │   ✓    │    ✓     │    ✗     │    ✗    │    ✗    │
│ ├─ Update Status         │   ✓    │    ✓     │    ✗     │    ✓    │    ✗    │
│ ├─ Add Notes             │   ✓    │    ✓     │    ✗     │    ✓    │    ✗    │
│ └─ View All Requests     │   ✓    │    ✓     │    ✓     │    ✓    │    ✓    │
│                          │        │          │          │         │         │
│ INVENTORY                │        │          │          │         │         │
│ ├─ Manage Furniture      │   ✓    │    ✓     │    ✗     │    ✗    │    ✗    │
│ ├─ Manage Keys           │   ✓    │    ✓     │    ✗     │    ✗    │    ✗    │
│ ├─ Manage Linen          │   ✓    │    ✓     │    ✗     │    ✗    │    ✗    │
│ └─ View Inventory        │   ✓    │    ✓     │    ✓     │    ✗    │    ✗    │
│                          │        │          │          │         │         │
│ REPORTS                  │        │          │          │         │         │
│ ├─ View Reports          │   ✓    │    ✓     │    ✓     │    ✗    │    ✗    │
│ ├─ Export Reports        │   ✓    │    ✓     │    ✓     │    ✗    │    ✗    │
│ ├─ View Analytics        │   ✓    │    ✓     │    ✓     │    ✗    │    ✗    │
│ └─ View Statistics       │   ✓    │    ✓     │    ✓     │    ✗    │    ✗    │
│                          │        │          │          │         │         │
│ AUDIT & SETTINGS         │        │          │          │         │         │
│ ├─ View Audit Logs       │   ✓    │    ✗     │    ✗     │    ✗    │    ✗    │
│ ├─ System Settings       │   ✓    │    ✗     │    ✗     │    ✗    │    ✗    │
│ ├─ Manage Roles          │   ✓    │    ✗     │    ✗     │    ✗    │    ✗    │
│ └─ View Notifications    │   ✓    │    ✓     │    ✓     │    ✓    │    ✓    │
│                          │        │          │          │         │         │
│ PROFILE                  │        │          │          │         │         │
│ ├─ View Own Profile      │   ✓    │    ✓     │    ✓     │    ✓    │    ✓    │
│ ├─ Edit Own Profile      │   ✓    │    ✓     │    ✓     │    ✓    │    ✓    │
│ ├─ Change Password       │   ✓    │    ✓     │    ✓     │    ✓    │    ✓    │
│ └─ View Other Profiles   │   ✓    │    ✓     │    ✓     │    ✗    │    ✗    │
└──────────────────────────┴────────┴──────────┴──────────┴─────────┴─────────┘
```

---

## Access Control Implementation

### Backend Implementation

#### Authentication Middleware
```javascript
// Checks if user is authenticated
app.use(authMiddleware);

// Verifies JWT token
// Extracts user info and role
// Attaches to req.user
```

#### Authorization Middleware
```javascript
// Checks if user has required role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
    }
    next();
  };
};

// Usage:
router.post('/users', requireRole(['System Admin']), createUser);
router.post('/rooms', requireRole(['System Admin', 'Dorm Admin']), createRoom);
```

#### Route Protection
```javascript
// Public routes (no auth required)
POST /auth/login
POST /auth/register-student
POST /auth/forgot-password

// Protected routes (auth required)
GET /users                    // System Admin only
POST /users                   // System Admin only
GET /rooms                    // All authenticated users
POST /rooms                   // System Admin, Dorm Admin
POST /maintenance-requests    // All authenticated users
GET /maintenance-requests     // System Admin, Dorm Admin, Maintenance Staff
```

### Frontend Implementation

#### Role-Based Rendering
```typescript
// Show component only if user has required role
<ProtectedComponent requiredRoles={['System Admin', 'Dorm Admin']}>
  <UserManagement />
</ProtectedComponent>

// Conditional navigation
{user.role === 'System Admin' && (
  <NavLink to="/users">User Management</NavLink>
)}

{user.role === 'Student' && (
  <NavLink to="/maintenance-requests">Submit Request</NavLink>
)}
```

#### Route Guards
```typescript
// Protect routes based on role
<Route
  path="/users"
  element={
    <ProtectedRoute requiredRoles={['System Admin']}>
      <UserManagement />
    </ProtectedRoute>
  }
/>
```

---

## Managing Roles

### Creating Users with Specific Roles

#### System Admin Creates Dorm Admin
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{
    "fullName": "Jane Warden",
    "email": "jane.warden@odu.edu.et",
    "role": "Dorm Admin",
    "password": "SecurePass123"
  }'
```

#### System Admin Creates Maintenance Staff
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{
    "fullName": "Mark Technician",
    "email": "mark.technician@odu.edu.et",
    "role": "Maintenance Staff",
    "password": "SecurePass456"
  }'
```

#### System Admin Creates Manager
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{
    "fullName": "Sarah Manager",
    "email": "sarah.manager@odu.edu.et",
    "role": "Management",
    "password": "SecurePass789"
  }'
```

### Changing User Roles

```bash
curl -X PUT http://localhost:5000/api/users/user_id \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{
    "role": "Dorm Admin"
  }'
```

### Viewing Role Permissions

```bash
curl -X GET http://localhost:5000/api/roles/permissions \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "roles": [
      {
        "role": "System Admin",
        "permissions": ["*"]
      },
      {
        "role": "Dorm Admin",
        "permissions": [
          "rooms:manage",
          "allocation:manage",
          "maintenance:manage",
          "inventory:manage"
        ]
      },
      {
        "role": "Maintenance Staff",
        "permissions": [
          "maintenance:assigned"
        ]
      },
      {
        "role": "Management",
        "permissions": [
          "reports:view",
          "audit:view"
        ]
      },
      {
        "role": "Student",
        "permissions": [
          "student:self",
          "maintenance:create"
        ]
      }
    ]
  }
}
```

---

## Best Practices

### 1. Principle of Least Privilege

Assign users the minimum role needed for their job:

```
✓ Student → Student role
✓ Maintenance Worker → Maintenance Staff role
✓ Dorm Supervisor → Dorm Admin role
✓ System Manager → Manager role
✓ System Administrator → System Admin role

✗ Don't assign System Admin to everyone
✗ Don't assign higher roles than needed
```

### 2. Role Separation

Keep roles separate and distinct:

```
✓ One person = One primary role
✓ Clear role boundaries
✓ Audit trail for role changes

✗ Multiple roles per person (unless necessary)
✗ Overlapping responsibilities
```

### 3. Access Control

Enforce access control at multiple levels:

```
Backend:
  ✓ Verify authentication (JWT token)
  ✓ Check authorization (role-based)
  ✓ Validate permissions for each action

Frontend:
  ✓ Hide UI elements for unauthorized users
  ✓ Disable buttons/links
  ✓ Show appropriate error messages
```

### 4. Audit Logging

Log all role-related actions:

```
✓ User creation with role
✓ Role changes
✓ Permission denials
✓ Sensitive operations

View logs:
GET /api/audit-logs?action=CREATE&entity=User
```

### 5. Password Management

Enforce strong passwords for all roles:

```
✓ Minimum 8 characters
✓ Mix of uppercase, lowercase, numbers, symbols
✓ Change on first login
✓ Regular password resets

Example: SecurePass@2026
```

### 6. Session Management

Manage user sessions properly:

```
✓ JWT tokens with expiration (7 days)
✓ Refresh tokens for extended sessions
✓ Automatic logout on inactivity (30 minutes)
✓ Clear tokens on logout
```

### 7. Role Hierarchy

Respect the role hierarchy:

```
System Admin (highest)
    ↓
Dorm Admin
    ↓
Manager / Maintenance Staff
    ↓
Student (lowest)

✓ Higher roles can manage lower roles
✓ Lower roles cannot manage higher roles
✓ Peers cannot manage each other
```

---

## Troubleshooting

### Issue: User cannot access feature despite having correct role

**Solution:**
```bash
# Verify user role
curl -X GET http://localhost:5000/api/users/user_id \
  -H "Authorization: Bearer <ADMIN_TOKEN>"

# Check token is valid
curl -X GET http://localhost:5000/api/auth/validate-session \
  -H "Authorization: Bearer <USER_TOKEN>"

# Verify role permissions
curl -X GET http://localhost:5000/api/roles/permissions \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

### Issue: "Insufficient permissions" error

**Solution:**
```bash
# Check required role for endpoint
# Verify user has that role
# Update user role if needed

curl -X PUT http://localhost:5000/api/users/user_id \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{"role": "Dorm Admin"}'
```

### Issue: Cannot create user with specific role

**Solution:**
```bash
# Only System Admin can create users
# Verify you're logged in as System Admin
# Check token is valid and not expired

# Valid roles:
# - System Admin
# - Dorm Admin
# - Maintenance Staff
# - Management
# - Student
```

---

## Quick Reference

### Role Hierarchy
```
System Admin > Dorm Admin > Manager/Maintenance > Student
```

### Hardcoded Usernames
```
admin          → System Admin
dormadmin      → Dorm Admin
maintenance    → Maintenance Staff
manager        → Manager
firstname.lastname → Student
```

### Key Permissions
```
System Admin:     Create users, manage all features
Dorm Admin:       Manage rooms, allocations, maintenance
Manager:          View reports and analytics
Maintenance:      Update assigned tasks
Student:          View profile, submit requests
```

### Create User Endpoint
```
POST /api/users
Required: fullName, email, role, password
Roles: System Admin, Dorm Admin, Maintenance Staff, Management, Student
```

---

## Support

For more information:
- See `ADMIN_USER_MANAGEMENT.md` for user management
- See `BACKEND_SETUP_GUIDE.md` for backend setup
- See `/docs/API_REFERENCE.md` for API details

---

**Last Updated:** April 2026
**Version:** 1.0.0
