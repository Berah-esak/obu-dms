# Hardcoded Admin Credentials

## Overview

The DMS system now has hardcoded credentials for the initial System Admin account. This ensures consistency, security, and a standardized entry point for system administration.

---

## Primary System Admin Credentials (Hardcoded)

```
Username: admin
Password: Admin@2026
Email: admin@odu.edu.et
Role: System Admin
Full Name: System Administrator
```

### Location of Hardcoded Credentials

The credentials are defined in:
- **File**: `backend/src/config/constants.js`
- **Object**: `ADMIN_CREDENTIALS`

```javascript
export const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "Admin@2026",
  email: "admin@odu.edu.et",
  fullName: "System Administrator",
  role: "System Admin",
};
```

### Usage in Seed File

When you run `npm run seed`, the system:
1. Reads the hardcoded credentials from `constants.js`
2. Creates the admin user with these credentials
3. Displays the credentials in the console output

**Console Output Example:**
```
============================================================
DATABASE SEEDING COMPLETED SUCCESSFULLY!
============================================================

📋 DEFAULT ADMIN CREDENTIALS:
   Username: admin
   Password: Admin@2026
   Email: admin@odu.edu.et
   Role: System Admin

📋 OTHER TEST CREDENTIALS:
   Dorm Admin: warden_jane / (same password)
   Maintenance: maint_mark / (same password)
   Student: sam.student / (same password)

============================================================
```

---

## Test Credentials (After Seeding)

After running `npm run seed`, the following test accounts are created:

| Role | Username | Password | Email |
|------|----------|----------|-------|
| **System Admin** | `admin` | `Admin@2026` | `admin@odu.edu.et` |
| Dorm Admin | `warden_jane` | `Admin@2026` | `jane@odu.edu.et` |
| Maintenance Staff | `maint_mark` | `Admin@2026` | `mark@odu.edu.et` |
| Student | `sam.student` | `Admin@2026` | `sam@student.odu.edu.et` |
| Student | `sally.student` | `Admin@2026` | `sally@student.odu.edu.et` |

---

## Important Notes

### Security Considerations

1. **Development Environment**
   - The hardcoded credentials are suitable for development and testing
   - All test accounts use the same password for convenience
   - Change passwords immediately in production

2. **Production Environment**
   - Change the admin password immediately after first login
   - Use strong, unique passwords for all accounts
   - Store credentials securely (password manager, vault, etc.)
   - Never commit production credentials to version control

3. **Access Control**
   - Only the System Admin can create additional admin users
   - The hardcoded admin account cannot be deleted
   - The admin username and email are reserved and cannot be changed

### Changing the Hardcoded Credentials

To change the hardcoded credentials:

1. **Edit** `backend/src/config/constants.js`:
   ```javascript
   export const ADMIN_CREDENTIALS = {
     username: "admin",
     password: "YourNewPassword123",  // Change this
     email: "admin@odu.edu.et",
     fullName: "System Administrator",
     role: "System Admin",
   };
   ```

2. **Reseed the database**:
   ```bash
   cd backend
   npm run seed
   ```

3. **Restart the backend**:
   ```bash
   npm run dev
   ```

### First Login Procedure

1. Start the backend: `npm run dev`
2. Start the frontend: `npm run dev`
3. Navigate to `http://localhost:5173`
4. Login with:
   - Username: `admin`
   - Password: `Admin@2026`
5. Change the password immediately (recommended)

---

## Files Updated

The following documentation files have been updated with the new credentials:

1. **ADMIN_USER_MANAGEMENT.md**
   - Added hardcoded credentials section
   - Updated default credentials table
   - Added test credentials information

2. **BACKEND_SETUP_GUIDE.md**
   - Updated all credential examples
   - Updated login instructions
   - Updated cURL examples

3. **FRONTEND_SETUP_GUIDE.md**
   - Updated login credentials
   - Updated test credentials

4. **QUICK_START.md**
   - Updated credentials table
   - Updated login examples

5. **SETUP_CHECKLIST.md**
   - Updated all credential references
   - Updated login test procedures

6. **ROLE_BASED_SYSTEM.md**
   - Updated default password references

---

## Backend Implementation

### Constants File

**File**: `backend/src/config/constants.js`

Contains all system constants including:
- `ADMIN_CREDENTIALS` - Hardcoded admin credentials
- `SYSTEM_ROLES` - Available user roles
- `USER_STATUSES` - User status values
- `ROOM_STATUSES` - Room status values
- `MAINTENANCE_PRIORITIES` - Maintenance priority levels
- `MAINTENANCE_STATUSES` - Maintenance status values
- `AUDIT_ACTIONS` - Audit log actions
- `NOTIFICATION_TYPES` - Notification types
- `VALIDATION_RULES` - Input validation rules
- `ERROR_MESSAGES` - Error message templates
- `SUCCESS_MESSAGES` - Success message templates

### Seed File

**File**: `backend/src/seed.js`

Updated to:
1. Import `ADMIN_CREDENTIALS` from constants
2. Use hardcoded credentials when creating admin user
3. Display credentials in console output
4. Create test accounts with same password

---

## Quick Reference

### Login Command (cURL)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@2026"}'
```

### Login in Browser
1. Navigate to `http://localhost:5173`
2. Username: `admin`
3. Password: `Admin@2026`
4. Click Login

### Seed Database
```bash
cd backend
npm run seed
```

### View Credentials in Code
```bash
cat backend/src/config/constants.js | grep -A 5 "ADMIN_CREDENTIALS"
```

---

## Troubleshooting

### Issue: Login fails with "Invalid credentials"

**Solution:**
```bash
# Verify credentials are correct
# Username: admin
# Password: Admin@2026

# Reseed the database
cd backend
npm run seed

# Restart backend
npm run dev
```

### Issue: Cannot find admin user

**Solution:**
```bash
# Check if database was seeded
cd backend
npm run seed

# Verify user exists
mongosh
use dms
db.users.findOne({username: "admin"})
```

### Issue: Forgot admin password

**Solution:**
```bash
# Reseed the database to reset to default
cd backend
npm run seed

# Login with default credentials
# Username: admin
# Password: Admin@2026
```

---

## Security Best Practices

### For Development
- ✓ Use the hardcoded credentials for testing
- ✓ Create test accounts for different roles
- ✓ Test role-based access control
- ✓ Test API endpoints

### For Production
- ✗ Do NOT use hardcoded credentials
- ✗ Do NOT use the same password for all accounts
- ✗ Do NOT commit credentials to version control
- ✓ Change admin password immediately after first login
- ✓ Use strong, unique passwords (minimum 12 characters)
- ✓ Store credentials in a secure vault
- ✓ Enable two-factor authentication (if available)
- ✓ Regularly audit user accounts
- ✓ Monitor login attempts

---

## Related Documentation

- **ADMIN_USER_MANAGEMENT.md** - Complete user management guide
- **BACKEND_SETUP_GUIDE.md** - Backend setup and configuration
- **ROLE_BASED_SYSTEM.md** - Role-based access control
- **QUICK_START.md** - Quick start guide
- **SETUP_CHECKLIST.md** - Setup verification checklist

---

## Summary

The DMS system now has:
- ✓ Hardcoded admin credentials in `backend/src/config/constants.js`
- ✓ Centralized constants file for all system values
- ✓ Updated seed file to use hardcoded credentials
- ✓ Updated documentation with new credentials
- ✓ Clear security guidelines for production use

**Default Admin Credentials:**
```
Username: admin
Password: Admin@2026
```

---

**Last Updated:** April 2026
**Version:** 1.0.0
