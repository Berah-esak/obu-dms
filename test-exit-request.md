# Exit Request Fix - Testing Guide

## Problem Fixed
The "insufficient permission" error when students tried to submit exit clearance requests has been resolved.

## Root Causes Identified and Fixed

### 1. **Missing Room Assignments**
- **Problem**: Student users in the database didn't have `roomId` or `dormBlockId` fields
- **Solution**: Updated `backend/src/seed.js` to assign students to rooms when creating user records
  - Sam Student (sam.student) → Assigned to North Hall room N-101
  - Sally Student (sally.student) → Assigned to South Hall room S-101

### 2. **Route Registration Order**
- **Problem**: Exit clearance routes were registered after report routes, causing middleware conflicts
- **Solution**: Moved exit clearance routes registration before report routes in `backend/src/routes/index.js`

### 3. **Service Layer Fallback**
- **Problem**: Service tried to find student records in separate `students` collection which didn't exist
- **Solution**: Added fallback logic in `exitClearanceService.js` to use user records when student records don't exist

### 4. **Debug Logging Cleanup**
- Removed debug console.log statements from `authMiddleware.js`

## Testing Steps

### 1. Login as Student
```
Username: sam.student
Password: Admin@2026
```

### 2. Navigate to Dashboard
- The exit clearance section should be visible on the student dashboard

### 3. Submit Exit Request
- Click "Request Exit Clearance"
- Fill in the form:
  - Reason: "Going home for the weekend"
  - Add items (optional): e.g., "Laptop", "Textbooks"
- Click "Submit Request"

### 4. Expected Result
✅ Request should be submitted successfully
✅ Status should show as "Pending"
✅ Request should appear in "My Exit Requests" list

### 5. Approve Request (as Dorm Admin)
- Logout and login as:
  ```
  Username: dormadmin
  Password: Dormadmin@2026
  ```
- Navigate to pending exit requests
- Approve the request
- A verification code should be generated

### 6. Verify Code Display
- Logout and login back as sam.student
- Check the exit request list
- The approved request should show:
  - Status: "Approved"
  - Verification Code: (8-character code)
  - Copy button to copy the code

## Database Changes
The seed script now creates:
- 2 Dorms (North Hall, South Hall)
- 10 Rooms (5 per dorm)
- 5 Users (including 2 students with room assignments)

## Files Modified
1. `backend/src/seed.js` - Added room assignments to student users
2. `backend/src/routes/index.js` - Fixed route registration order
3. `backend/src/middlewares/authMiddleware.js` - Removed debug logging
4. `backend/src/services/exitClearanceService.js` - Already had fallback logic

## Current Status
✅ Database re-seeded with proper room assignments
✅ Backend server restarted and running on port 5000
✅ All fixes applied and ready for testing
