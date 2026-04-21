# Exit Clearance Approval System - Complete Guide

## Overview
The exit clearance approval system allows dorm administrators and system administrators to review and approve/reject exit requests submitted by students. The feature is now fully integrated into the admin dashboard.

## Features Added

### 1. **ExitRequestApproval Component** (`src/components/ExitRequestApproval.tsx`)
- **Displays pending exit requests** with student details, items, and reasons
- **Approve requests** with automatic verification code generation
- **Reject requests** with mandatory rejection reason
- **View detailed information** for each request
- **Copy verification codes** to clipboard
- **Real-time updates** when actions are performed

### 2. **Admin Dashboard Integration** (`src/pages/DashboardPage.tsx`)
- **Role-based access**: Only visible to `dorm_admin` and `system_admin` users
- **Responsive layout**: Adapts to different screen sizes
- **Live updates**: Refreshes when approval actions are taken
- **Integrated with existing dashboard** components

### 3. **API Integration** (Already existed in `src/lib/api.ts`)
- `getPendingExitRequests()` - Fetch pending requests
- `approveExitRequest(requestId)` - Approve a request
- `rejectExitRequest(requestId, reason)` - Reject with reason
- `getExitRequestHistory()` - View all requests

## User Roles & Permissions

### **Dorm Admin (dormadmin)**
- ✅ View pending exit requests
- ✅ Approve exit requests
- ✅ Reject exit requests with reason
- ✅ View request details and history
- ✅ Copy verification codes

### **System Admin (admin)**
- ✅ All dorm admin permissions
- ✅ System-wide oversight
- ✅ Access to all exit requests

### **Students**
- ✅ Submit exit requests
- ✅ View their own requests
- ✅ See approval status and verification codes

## Testing Guide

### **Step 1: Login as Student**
```
Username: sam.student
Password: Admin@2026
```

1. Navigate to dashboard
2. Fill out "Request Exit Clearance" form:
   - **Items**: Add items like "Laptop", "Books", "Phone"
   - **Reason**: Enter reason like "Going home for weekend"
3. Click "Submit Exit Request"
4. ✅ Request should be submitted successfully
5. Note the request appears in "My Exit Requests" with status "Pending"

### **Step 2: Login as Dorm Admin**
```
Username: dormadmin
Password: Dormadmin@2026
```

1. Navigate to dashboard
2. **Exit clearance section should be visible** in the admin dashboard
3. You should see the pending request from the student
4. The request shows:
   - Student name
   - Room number
   - Submission date
   - Items carrying
   - Reason for exit
   - Status badge

### **Step 3: Review Request Details**
1. Click **"Details"** button on any request
2. Modal opens showing:
   - Complete student information
   - All items being carried
   - Full reason text
   - Submission timestamp
   - Current status

### **Step 4: Approve Request**
1. Click **"Approve"** button
2. Confirmation dialog appears
3. Review the request details
4. Click **"Approve Request"**
5. ✅ Success notification appears
6. ✅ Verification code is generated (8-character hex code)
7. ✅ Request status changes to "Approved"
8. ✅ Request disappears from pending list

### **Step 5: Reject Request (Alternative)**
1. Click **"Reject"** button
2. Rejection dialog appears
3. **Enter rejection reason** (mandatory)
4. Click **"Reject Request"**
5. ✅ Request status changes to "Rejected"
6. ✅ Student will see rejection reason

### **Step 6: Verify Student Sees Updates**
1. Login back as student (sam.student)
2. Check "My Exit Requests" section
3. ✅ Approved requests show:
   - Status: "Approved"
   - Verification code with copy button
   - Green success styling
4. ✅ Rejected requests show:
   - Status: "Rejected"
   - Rejection reason
   - Red error styling

## UI Components & Features

### **Pending Requests Card**
```
┌─────────────────────────────────────┐
│ 🕐 Pending Exit Requests        [3] │
├─────────────────────────────────────┤
│ Student Sam                         │
│ Room: N-101 • Apr 21, 2026         │
│ Reason: Going home for weekend      │
│ [Laptop] [Books] [Phone]           │
│ [Details] [Approve] [Reject]       │
├─────────────────────────────────────┤
│ Student Sally                       │
│ Room: S-101 • Apr 21, 2026         │
│ ...                                 │
└─────────────────────────────────────┘
```

### **Approval Dialog**
```
┌─────────────────────────────────────┐
│ Approve Exit Request                │
├─────────────────────────────────────┤
│ Are you sure you want to approve    │
│ this exit request? A verification   │
│ code will be generated.             │
│                                     │
│ Student: Student Sam                │
│ Room: N-101                         │
│ Reason: Going home for weekend      │
│ Items: [Laptop] [Books] [Phone]    │
│                                     │
│           [Cancel] [Approve]        │
└─────────────────────────────────────┘
```

### **Rejection Dialog**
```
┌─────────────────────────────────────┐
│ Reject Exit Request                 │
├─────────────────────────────────────┤
│ Please provide a reason for         │
│ rejecting this exit request.        │
│                                     │
│ Student: Student Sam                │
│ Room: N-101                         │
│                                     │
│ Rejection Reason *                  │
│ ┌─────────────────────────────────┐ │
│ │ Enter reason for rejection...   │ │
│ │                                 │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│           [Cancel] [Reject]         │
└─────────────────────────────────────┘
```

## Backend API Endpoints

### **Get Pending Requests**
```
GET /api/exit-requests/pending
Authorization: Bearer <token>
Roles: dorm_admin, system_admin
```

### **Approve Request**
```
POST /api/exit-requests/:id/approve
Authorization: Bearer <token>
Roles: dorm_admin, system_admin
Response: { verificationCode: "A1B2C3D4" }
```

### **Reject Request**
```
POST /api/exit-requests/:id/reject
Authorization: Bearer <token>
Roles: dorm_admin, system_admin
Body: { reason: "Invalid reason provided" }
```

## Verification Code System

### **Code Generation**
- **Format**: 8-character uppercase hexadecimal (e.g., "A1B2C3D4")
- **Uniqueness**: System ensures no duplicate codes
- **Status**: Active when generated, Used when verified at gate

### **Code Usage**
1. **Student receives code** after approval
2. **Student shows code** to gate guard
3. **Gate guard verifies code** using verification endpoint
4. **Code becomes "Used"** and cannot be reused

## Current Status

✅ **Backend**: All API endpoints working  
✅ **Frontend**: Approval component integrated  
✅ **Dashboard**: Role-based access implemented  
✅ **UI/UX**: Responsive design with proper styling  
✅ **Notifications**: Toast messages for all actions  
✅ **Validation**: Proper error handling and validation  

## Test Credentials

### **System Admin**
- Username: `admin`
- Password: `Admin@2026`
- Access: Full system access

### **Dorm Admin**
- Username: `dormadmin`
- Password: `Dormadmin@2026`
- Access: Exit clearance approval

### **Students**
- Username: `sam.student` / Password: `Admin@2026`
- Username: `sally.student` / Password: `Admin@2026`
- Access: Submit exit requests

## Servers Running

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:8082

## Next Steps

1. **Test the complete workflow** using the guide above
2. **Submit exit requests** as students
3. **Approve/reject requests** as dorm admin
4. **Verify the verification codes** work properly
5. **Check notifications** and status updates

The exit clearance approval system is now **fully functional** and ready for use! 🎉