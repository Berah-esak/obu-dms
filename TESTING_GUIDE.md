# Exit Clearance Approval - Complete Testing Guide

## Current Status
- ✅ Backend server running on http://localhost:5000
- ✅ Frontend server running on http://localhost:8082
- ✅ ExitRequestApproval component created and integrated
- ✅ Real-time updates with 30-second auto-refresh
- ✅ Manual refresh button added
- ✅ Better error handling and loading states

## Step-by-Step Testing

### **Step 1: Submit Exit Request (as Student)**

1. **Open browser**: http://localhost:8082
2. **Login as student**:
   ```
   Username: sam.student
   Password: Admin@2026
   ```
3. **Navigate to Dashboard** (should redirect automatically)
4. **Find "Request Exit Clearance" section**
5. **Fill out the form**:
   - **Items**: Add items like "Laptop", "Books", "Phone"
   - **Reason**: Enter "Going home for the weekend"
6. **Click "Submit Exit Request"**
7. **Verify success**: Should see success message and request appears in "My Exit Requests"

### **Step 2: Approve Request (as Dorm Admin)**

1. **Logout** from student account
2. **Login as dorm admin**:
   ```
   Username: dormadmin
   Password: Dormadmin@2026
   ```
3. **Navigate to Dashboard** (should redirect automatically)
4. **Look for "Pending Exit Requests" section** in the admin dashboard
5. **You should see**:
   - The request submitted by sam.student
   - Student name, room number, submission date
   - Items being carried
   - Reason for exit
   - Three buttons: Details, Approve, Reject

### **Step 3: Test Approval Functionality**

#### **Option A: Approve Request**
1. **Click "Approve" button**
2. **Confirmation dialog appears** with request details
3. **Click "Approve Request"**
4. **Verify**:
   - Success notification appears
   - Verification code is generated (8-character hex)
   - Request disappears from pending list

#### **Option B: Reject Request**
1. **Click "Reject" button**
2. **Rejection dialog appears**
3. **Enter rejection reason** (mandatory field)
4. **Click "Reject Request"**
5. **Verify**:
   - Success notification appears
   - Request disappears from pending list

### **Step 4: Verify Student Sees Updates**

1. **Logout from admin account**
2. **Login back as student** (sam.student)
3. **Check "My Exit Requests" section**
4. **For approved requests**:
   - Status shows "Approved" with green badge
   - Verification code is displayed
   - Copy button available for the code
5. **For rejected requests**:
   - Status shows "Rejected" with red badge
   - Rejection reason is displayed

### **Step 5: Test Real-Time Updates**

1. **Open two browser windows/tabs**:
   - Tab 1: Login as student (sam.student)
   - Tab 2: Login as admin (dormadmin)
2. **Submit request in Tab 1**
3. **Wait 30 seconds or click refresh in Tab 2**
4. **Request should appear in admin dashboard**
5. **Approve/reject in Tab 2**
6. **Check Tab 1 after 30 seconds or refresh**
7. **Status should be updated**

## Troubleshooting

### **Issue: "No pending exit requests" in admin dashboard**

**Possible causes**:
1. No requests have been submitted
2. All requests have been processed
3. API error loading requests

**Solutions**:
1. Submit a new request as student
2. Check browser console for errors (F12)
3. Click the refresh button in the admin dashboard
4. Check backend logs for API errors

### **Issue: "Error loading requests" message**

**Possible causes**:
1. Backend server not running
2. Authentication token expired
3. API endpoint error

**Solutions**:
1. Verify backend is running on port 5000
2. Logout and login again
3. Check backend logs for errors
4. Click "Try Again" button

### **Issue: Buttons not working (Approve/Reject)**

**Possible causes**:
1. JavaScript errors in console
2. API endpoint not responding
3. Authentication issues

**Solutions**:
1. Check browser console (F12) for errors
2. Verify user has correct role (dorm_admin or system_admin)
3. Try refreshing the page
4. Check network tab for failed API calls

### **Issue: Student can't submit requests**

**Possible causes**:
1. Student not assigned to room
2. Authentication issues
3. API endpoint error

**Solutions**:
1. Verify student has roomId in database
2. Logout and login again
3. Check backend logs for "room assignment" errors

## API Endpoints Being Used

### **Frontend → Backend API Calls**

1. **Get Pending Requests**:
   ```
   GET /api/exit-requests/pending
   Headers: Authorization: Bearer <token>
   ```

2. **Approve Request**:
   ```
   POST /api/exit-requests/:id/approve
   Headers: Authorization: Bearer <token>
   ```

3. **Reject Request**:
   ```
   POST /api/exit-requests/:id/reject
   Headers: Authorization: Bearer <token>
   Body: { reason: "rejection reason" }
   ```

4. **Submit Request** (Student):
   ```
   POST /api/exit-requests
   Headers: Authorization: Bearer <token>
   Body: { items: ["item1"], reason: "reason" }
   ```

## Expected UI Components

### **Admin Dashboard - Pending Requests Card**
```
┌─────────────────────────────────────────┐
│ 🕐 Pending Exit Requests [2] [🔄]      │
├─────────────────────────────────────────┤
│ Student Sam                             │
│ Room: N-101 • Apr 21, 2026             │
│ Reason: Going home for weekend          │
│ [Laptop] [Books] [Phone]               │
│ [Details] [✅ Approve] [❌ Reject]      │
├─────────────────────────────────────────┤
│ Student Sally                           │
│ Room: S-101 • Apr 21, 2026             │
│ ...                                     │
└─────────────────────────────────────────┘
```

### **Student Dashboard - My Requests**
```
┌─────────────────────────────────────────┐
│ 📋 My Exit Requests                     │
├─────────────────────────────────────────┤
│ Going home for weekend                  │
│ Status: [✅ Approved]                   │
│ Code: A1B2C3D4 [📋 Copy]               │
│ Apr 21, 2026 • Items: 3                │
└─────────────────────────────────────────┘
```

## Features Implemented

✅ **Real-time data updates** (30-second auto-refresh)  
✅ **Manual refresh button** with loading indicator  
✅ **Comprehensive error handling** with retry options  
✅ **Role-based access** (dorm_admin, system_admin only)  
✅ **Detailed request information** in modal dialogs  
✅ **Verification code generation** and copy functionality  
✅ **Rejection with mandatory reason** input  
✅ **Toast notifications** for all actions  
✅ **Responsive design** for all screen sizes  
✅ **Loading states** and proper UX feedback  

## Next Steps

1. **Follow the testing guide** step by step
2. **Submit exit requests** as students
3. **Test approval/rejection** as admin
4. **Verify real-time updates** work
5. **Check verification codes** are generated properly
6. **Test error scenarios** (network issues, etc.)

The exit clearance approval system is now **fully functional** with real-time data updates! 🎉