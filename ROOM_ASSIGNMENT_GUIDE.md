# Room Assignment Guide for Students

## Overview
Before a student can submit an exit clearance request, they must be assigned to a room. The system supports two methods of room assignment:

1. **Direct Assignment** (on user record) - Quick method for testing
2. **Formal Assignment** (via allocation system) - Proper workflow for production

## Method 1: Direct Assignment (Quick Setup)

### For System Admin or Dorm Admin:
This method directly adds `roomId` and `dormBlockId` to the user record.

#### Via Database (Firestore Console):
1. Go to Firestore Console
2. Navigate to `users` collection
3. Find the student user document
4. Add/Edit fields:
   - `roomId`: (copy a room ID from the `rooms` collection)
   - `dormBlockId`: (copy the corresponding dorm ID from the `dorms` collection)
5. Save changes
6. Student must **log out and log back in** for changes to take effect

#### Via Seed Script (For Testing):
The seed script already creates students with room assignments:
```javascript
{
  fullName: "Student Sam",
  username: "sam.student",
  email: "sam.student@gmail.com",
  role: "Student",
  roomId: roomRefs[0].ref.id,      // ← Direct assignment
  dormBlockId: roomRefs[0].dormId,  // ← Direct assignment
}
```

## Method 2: Formal Assignment (Production Workflow)

### Step 1: Create Student Record
First, a student record must exist in the `students` collection (separate from `users`).

**API Endpoint**: `POST /api/students`
**Required Role**: System Admin or Dorm Admin

```json
{
  "studentId": "STU003",
  "fullName": "John Doe",
  "gender": "Male",
  "department": "Computer Science",
  "year": 2,
  "phone": "0912345678",
  "email": "john.doe@gmail.com",
  "user": "user_id_from_users_collection"
}
```

### Step 2: Assign Room (Manual Allocation)

**API Endpoint**: `POST /api/allocations/manual`
**Required Role**: System Admin or Dorm Admin

```json
{
  "studentId": "student_document_id",
  "roomId": "room_document_id"
}
```

This creates an entry in the `assignments` collection:
```javascript
{
  student: "student_id",
  room: "room_id",
  dorm: "dorm_id",
  status: "Active",
  assignedBy: "admin_user_id",
  startDate: "2026-04-21T00:00:00.000Z"
}
```

### Step 3: Auto Allocation (Batch Assignment)

For assigning multiple students at once:

**API Endpoint**: `POST /api/allocations/auto`
**Required Role**: System Admin or Dorm Admin

```json
{
  "gender": "Male",
  "year": 2,
  "department": "Computer Science",
  "previewOnly": false
}
```

This automatically assigns all eligible students to available rooms.

## How Exit Clearance Checks Room Assignment

The updated exit clearance service now checks **three sources** for room assignment:

1. **User Record** (`users.roomId`)
   - Direct assignment on user document
   - Fastest lookup
   - Used for quick testing

2. **Student Record + Assignment** (`students` → `assignments`)
   - Formal assignment via allocation system
   - Proper production workflow
   - Tracks assignment history

3. **Fallback**
   - If no room found in either source, shows error message

### Code Logic:
```javascript
// 1. Get user
const user = await userRepository.findById(userId);

// 2. Check direct assignment
let roomId = user.roomId;
let dormBlockId = user.dormBlockId;

// 3. Check formal assignment
if (student) {
  const assignment = await assignmentRepository.findActiveByStudent(student.id);
  if (assignment) {
    roomId = assignment.room;
    dormBlockId = assignment.dorm;
  }
}

// 4. Validate
if (!roomId) {
  throw new ApiError(400, "You must be assigned to a room...");
}
```

## Current Test Users

### Students WITH Room Assignments:
1. **sam.student** / Admin@2026
   - Room: North Hall N-101
   - Method: Direct assignment (user record)
   - ✅ Can submit exit requests

2. **sally.student** / Admin@2026
   - Room: South Hall S-101
   - Method: Direct assignment (user record)
   - ✅ Can submit exit requests

### Admins Who Can Assign Rooms:
1. **admin** / Admin@2026
   - Role: System Admin
   - Can: Create students, assign rooms, approve exit requests

2. **dormadmin** / Dormadmin@2026
   - Role: Dorm Admin (Proctor Head)
   - Can: Assign rooms, approve exit requests

## Quick Fix for Existing Users

If a student user exists but has no room assignment:

### Option A: Add Direct Assignment (Quick)
1. Login as admin
2. Go to Firestore Console
3. Edit the student's user document
4. Add `roomId` and `dormBlockId` fields
5. Student logs out and back in

### Option B: Use Allocation System (Proper)
1. Login as admin or dormadmin
2. Create student record (if not exists)
3. Use manual allocation API to assign room
4. Student can immediately submit exit requests (no logout needed)

## API Routes for Room Assignment

```javascript
// Get eligible students for allocation
POST /api/allocations/eligible
Authorization: Bearer <token>
Role: system_admin, dorm_admin

// Manual room allocation
POST /api/allocations/manual
Authorization: Bearer <token>
Role: system_admin, dorm_admin
Body: { studentId, roomId }

// Auto allocation (batch)
POST /api/allocations/auto
Authorization: Bearer <token>
Role: system_admin, dorm_admin
Body: { gender?, year?, department?, previewOnly? }

// Vacate room
DELETE /api/allocations/:assignmentId
Authorization: Bearer <token>
Role: system_admin, dorm_admin
```

## Troubleshooting

### Error: "You must be assigned to a room..."
**Cause**: Student has no room assignment in either user record or assignments table

**Solutions**:
1. Check if student record exists in `students` collection
2. Check if active assignment exists in `assignments` collection
3. Check if user has `roomId` field in `users` collection
4. Use one of the assignment methods above

### Error: "Student already has an active assignment"
**Cause**: Trying to assign a student who already has a room

**Solution**: 
- Vacate the existing assignment first
- Or update the existing assignment

### Student can't see their room assignment
**Cause**: Old session token

**Solution**:
- Log out and log back in
- Or the assignment was made via formal system (no logout needed)

## Summary

**For Testing**: Use direct assignment (add `roomId` to user record)
**For Production**: Use allocation system (create student record + assignment)
**For Exit Clearance**: System checks both methods automatically

The exit clearance system is now flexible and supports both assignment methods! 🎉
