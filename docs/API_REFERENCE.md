# OBU Dormitory Management System — API Reference

> **OpenAPI Version:** 3.0.0  
> **API Version:** 2.0.0  
> **Base URL:** `https://api.obu.edu.et/dms/v1`  
> **Auth:** All endpoints require `Authorization: Bearer <JWT>` except login and password reset.

---

## Authentication

All endpoints except the ones marked `public` require JWT. Include the token from the login response:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Servers

| Environment | URL |
|-------------|-----|
| Production | `https://api.obu.edu.et/dms/v1` |
| Staging | `https://staging-api.obu.edu.et/dms/v1` |
| Local Dev | `http://localhost:3000/api` |

---

## Roles

| Role | Value |
|------|-------|
| Student | `student` |
| Dorm Administrator | `dorm_admin` |
| Maintenance Staff | `maintenance` |
| Management | `management` |
| System Administrator | `system_admin` |

---

## Data Schemas

### User
```json
{
  "id": "usr_12345",
  "username": "alemu.bekele",
  "fullName": "Alemu Bekele",
  "email": "alemu.bekele@obu.edu.et",
  "role": "student | dorm_admin | maintenance | management | system_admin",
  "status": "active | inactive",
  "lastLogin": "2026-04-03T10:00:00Z",
  "studentId": "OBU12345"
}
```

### Student
```json
{
  "studentId": "OBU12345",
  "fullName": "Alemu Bekele",
  "gender": "M | F",
  "department": "Computer Science",
  "year": 3,
  "phone": "0912345678",
  "email": "alemu.bekele@obu.edu.et"
}
```

### Dorm (Building)
```json
{
  "id": "dorm_001",
  "name": "Block A",
  "code": "BLK-A",
  "address": "North Campus",
  "warden": "Dr. Tadesse",
  "floors": [1, 2, 3, 4]
}
```

### Room
```json
{
  "roomId": "BLK-A-101",
  "building": "Block A",
  "floor": 1,
  "roomNumber": "101",
  "type": "Single | Double | Triple",
  "capacity": 4,
  "currentOccupancy": 2,
  "status": "Available | Occupied | Under Maintenance",
  "genderRestriction": "Male | Female | None"
}
```

### Assignment
```json
{
  "id": "assign_001",
  "student": { "...Student" },
  "room": { "...Room" },
  "startDate": "2026-03-15",
  "endDate": "2026-07-01"
}
```

### RoomAssignment (Student Portal)
```json
{
  "room": { "...Room" },
  "dorm": { "...Dorm" },
  "building": "Block A",
  "floor": 1,
  "assignedDate": "2026-03-15",
  "roommates": [{ "...Student" }]
}
```

### RoomChangeRequest
```json
{
  "id": "rc_001",
  "student": { "...Student" },
  "currentRoom": { "...Room" },
  "requestedRoom": { "...Room" },
  "reason": "conflict | maintenance | health | other",
  "description": "Incompatible roommates",
  "status": "pending | approved | rejected",
  "submittedAt": "2026-04-02T09:00:00Z",
  "rejectionReason": "..."
}
```

### MaintenanceRequest
```json
{
  "id": "mr_001",
  "requestId": "MR-2026-0001",
  "room": { "...Room" },
  "category": "Plumbing | Electrical | Furniture | Sanitation | Other",
  "description": "Leaking faucet in bathroom",
  "priority": "Low | Medium | High",
  "status": "Submitted | In Progress | Completed | Rejected",
  "submittedBy": { "...Student" },
  "assignedTo": { "...User" },
  "submittedAt": "2026-04-01T10:00:00Z",
  "updatedAt": "2026-04-01T10:00:00Z",
  "resolutionNotes": "Faucet replaced",
  "trackingNumber": "TRK-001"
}
```

### FurnitureItem
```json
{
  "id": "f_001",
  "roomId": "BLK-A-101",
  "itemName": "Bed | Mattress | Desk | Chair | Wardrobe | Shelf",
  "quantity": 4,
  "condition": "Good | Fair | Damaged | Missing"
}
```

### LinenRecord
```json
{
  "id": "ln_001",
  "student": { "...Student" },
  "items": ["Sheet", "Blanket", "Pillowcase", "Towel"],
  "dateIssued": "2026-03-15",
  "expectedReturnDate": "2026-07-01",
  "dateReturned": null,
  "damages": null
}
```

### KeyRecord
```json
{
  "id": "key_001",
  "student": { "...Student" },
  "room": { "...Room" },
  "keyCode": "BLK-A-101-K1",
  "dateIssued": "2026-03-15",
  "dateReturned": null,
  "condition": "Good"
}
```

### Notification
```json
{
  "id": "n_001",
  "title": "Room Assignment",
  "message": "You have been assigned to Room 101, Block A",
  "isRead": false,
  "createdAt": "2026-04-03T08:00:00Z",
  "type": "room_assignment | room_change | maintenance_update | announcement"
}
```

### AuditLog
```json
{
  "id": "al_001",
  "timestamp": "2026-04-03T10:30:00Z",
  "user": "admin.user",
  "action": "CREATE | UPDATE | DELETE | LOGIN | LOGOUT | APPROVE | REJECT | ASSIGN",
  "entity": "room",
  "entityId": "BLK-A-101",
  "ipAddress": "192.168.1.100",
  "status": "SUCCESS | FAILED",
  "details": "Assigned student OBU12345 to room BLK-A-101"
}
```

### DashboardSummary
```json
{
  "totalStudents": 2847,
  "totalRooms": 456,
  "occupancyRate": 87.3,
  "pendingMaintenance": 23,
  "availableBeds": 182
}
```

---

## API Endpoints

---

### 🔐 Authentication

#### POST `/auth/login` — `public`
Login and receive a JWT token.

**Request:**
```json
{ "username": "alemu.bekele", "password": "SecurePass123" }
```
**Response `200`:**
```json
{
  "token": "eyJ...",
  "refreshToken": "eyJ...",
  "role": "student",
  "user": { "...User" }
}
```
**Response `401`:** Invalid credentials

---

#### POST `/auth/logout` — `🔒 auth`
Invalidate current JWT.

**Response `200`:** `{ "success": true, "message": "Logged out" }`

---

#### POST `/auth/forgot-password` — `public`
Send password reset email.

**Request:** `{ "email": "alemu.bekele@obu.edu.et" }`  
**Response `200`:** `{ "success": true, "message": "Reset link sent if email exists" }`

---

#### POST `/auth/reset-password` — `public`
Set new password using reset token.

**Request:**
```json
{ "token": "abc123", "newPassword": "NewPass456" }
```
**Response `200`:** `{ "success": true }`

---

#### GET `/auth/validate-session` — `🔒 auth`
Check if current session/token is still valid.

**Response `200`:** `{ "valid": true, "role": "student" }`

---

### 👤 Student Portal

#### GET `/student/assignment` — `🔒 student`
Get the signed-in student's full room assignment details.

**Response `200`:** `RoomAssignment` object  
**Response `404`:** No assignment found for this student

---

#### GET `/student/maintenance-requests` — `🔒 student`
Get own maintenance request history.

**Query Params:**
- `limit` (int, default: 10)
- `offset` (int, default: 0)

**Response `200`:** `{ "requests": [...MaintenanceRequest], "total": 4 }`

---

#### GET `/student/profile` — `🔒 student`
Get own student profile data.

**Response `200`:** `Student` object

---

### 🏢 Room Management

#### GET `/dorms` — `🔒 auth`
List all dorm buildings.

**Response `200`:** `{ "buildings": [...Dorm] }`

---

#### POST `/dorms` — `🔒 dorm_admin, system_admin`
Create a new dorm building.

**Request:**
```json
{ "name": "Block E", "code": "BLK-E", "address": "East Campus", "warden": "Mr. Ali" }
```
**Response `201`:** `Dorm` object

---

#### POST `/dorms/{dormId}/floors` — `🔒 dorm_admin, system_admin`
Add a floor to an existing dorm.

**Request:** `{ "floorNumber": 5 }`  
**Response `201`:** Success

---

#### GET `/rooms` — `🔒 auth`
Get all rooms with optional filters.

**Query Params:**
- `building` (string)
- `floor` (int)
- `status` (`Available | Occupied | Under Maintenance`)
- `gender` (`Male | Female | None`)

**Response `200`:** `{ "rooms": [...Room] }`

---

#### POST `/rooms` — `🔒 dorm_admin, system_admin`
Create a new room.

**Request:**
```json
{
  "buildingId": "dorm_001",
  "floor": 2,
  "roomNumber": "210",
  "type": "Double",
  "capacity": 4,
  "genderRestriction": "Male"
}
```
**Response `201`:** `Room` object

---

#### GET `/rooms/{roomId}` — `🔒 auth`
Get details for a specific room.

**Response `200`:** `Room` object

---

#### PUT `/rooms/{roomId}` — `🔒 dorm_admin, system_admin`
Update room properties.

**Request:**
```json
{
  "capacity": 6,
  "type": "Triple",
  "status": "Available",
  "genderRestriction": "Female"
}
```
**Response `200`:** Updated `Room` object

---

#### GET `/rooms/{roomId}/occupants` — `🔒 dorm_admin, system_admin`
Get the list of current occupants in a room.

**Response `200`:** `{ "students": [...Student] }`

---

#### GET `/rooms/available` — `🔒 auth`
Get rooms with available beds, filterable.

**Query Params:** `building`, `gender`, `type`  
**Response `200`:** `{ "rooms": [...Room] }`

---

### 🏠 Room Allocation

#### POST `/allocation/eligible-students` — `🔒 dorm_admin, system_admin`
Get students who are eligible for room allocation based on filters.

**Request:**
```json
{ "gender": "M", "year": 1, "department": "Engineering", "previewOnly": false }
```
**Response `200`:** `{ "students": [...Student], "totalBedsAvailable": 58 }`

---

#### POST `/allocation/automatic` — `🔒 dorm_admin, system_admin`
Run automatic bulk room allocation.

**Request:**
```json
{ "gender": "all", "year": 1, "previewOnly": false }
```
**Response `200`:**
```json
{
  "assigned": [...Assignment],
  "unassigned": [...Student],
  "summary": { "totalAssigned": 95, "totalUnassigned": 5, "reason": "..." }
}
```

---

#### POST `/allocation/manual` — `🔒 dorm_admin, system_admin`
Manually assign one student to a specific room.

**Request:** `{ "studentId": "OBU12345", "roomId": "BLK-A-201" }`  
**Response `201`:** `Assignment` object  
**Response `400`:** Gender or capacity mismatch

---

#### GET `/students/unassigned` — `🔒 dorm_admin, system_admin`
Get all students not yet assigned to any room.

**Response `200`:** `{ "students": [...Student] }`

---

#### DELETE `/assignments/{assignmentId}/vacate` — `🔒 dorm_admin, system_admin`
Remove a student from their current room.

**Response `200`:** `{ "success": true, "message": "Student vacated" }`

---

### 🔄 Room Change Requests

#### GET `/room-change-requests` — `🔒 student`
Student views their own room change requests.

**Response `200`:** `{ "requests": [...RoomChangeRequest] }`

---

#### POST `/room-change-requests` — `🔒 student`
Student submits a new room change request.

**Request:**
```json
{
  "reason": "health",
  "description": "Need ground floor due to injury"
}
```
**Response `201`:** `RoomChangeRequest` object

---

#### GET `/room-change-requests/pending` — `🔒 dorm_admin, system_admin`
Get all pending requests for admin review.

**Response `200`:** `{ "requests": [...RoomChangeRequest] }`

---

#### PUT `/room-change-requests/{requestId}/approve` — `🔒 dorm_admin, system_admin`
Approve a room change request and assign the new room.

**Request:** `{ "newRoomId": "BLK-A-201" }`  
**Response `200`:** Updated `Assignment` object

---

#### PUT `/room-change-requests/{requestId}/reject` — `🔒 dorm_admin, system_admin`
Reject a room change request with a reason.

**Request:** `{ "rejectionReason": "No suitable rooms available" }`  
**Response `200`:** `{ "success": true }`

---

### 🔧 Maintenance

#### POST `/maintenance-requests` — `🔒 student`
Submit a new maintenance request.

**Request:**
```json
{
  "roomId": "BLK-A-101",
  "category": "Plumbing",
  "description": "Leaking faucet in bathroom",
  "priority": "High",
  "image": "<binary - optional>"
}
```
**Response `201`:** `MaintenanceRequest` object

---

#### GET `/maintenance-requests` — `🔒 dorm_admin, system_admin`
List all maintenance requests (admin view) with filters.

**Query Params:**
- `status` (`Submitted | In Progress | Completed | Rejected`)
- `building` (string)
- `priority` (`Low | Medium | High`)

**Response `200`:** `{ "requests": [...MaintenanceRequest] }`

---

#### GET `/maintenance-requests/assigned` — `🔒 maintenance`
Maintenance staff views their assigned tasks.

**Response `200`:** `{ "tasks": [...MaintenanceRequest] }`

---

#### PUT `/maintenance-requests/{requestId}/status` — `🔒 maintenance, dorm_admin`
Update the status of a maintenance request.

**Request:**
```json
{
  "status": "Completed",
  "resolutionNotes": "Faucet replaced and tested"
}
```
**Response `200`:** `{ "success": true }`

---

#### POST `/maintenance-requests/{requestId}/notes` — `🔒 maintenance, dorm_admin`
Add a note to a maintenance request.

**Request:**
```json
{ "note": "Parts ordered, will fix by Friday", "isInternal": true }
```
**Response `200`:** `{ "note": { ... } }`

---

#### PUT `/maintenance-requests/{requestId}/reassign` — `🔒 dorm_admin, system_admin`
Reassign a request to a different staff member.

**Request:** `{ "staffId": "usr_003" }`  
**Response `200`:** `{ "success": true }`

---

### 📦 Inventory

#### GET `/inventory/furniture/room/{roomId}` — `🔒 dorm_admin, system_admin`
Get a room's furniture inventory.

**Response `200`:** `{ "items": [...FurnitureItem] }`

---

#### POST `/inventory/furniture` — `🔒 dorm_admin, system_admin`
Add a furniture item to a room.

**Request:**
```json
{ "roomId": "BLK-A-101", "itemName": "Bed", "quantity": 4, "condition": "Good" }
```
**Response `201`:** `FurnitureItem` object

---

#### PUT `/inventory/furniture/{itemId}` — `🔒 dorm_admin, system_admin`
Update a furniture item's quantity or condition.

**Request:** `{ "quantity": 3, "condition": "Fair" }`  
**Response `200`:** Updated `FurnitureItem`

---

#### POST `/inventory/linen/issue` — `🔒 dorm_admin, system_admin`
Issue linen items to a student.

**Request:**
```json
{ "studentId": "OBU12345", "items": ["Sheet", "Blanket", "Towel"], "dateIssued": "2026-03-15" }
```
**Response `201`:** `LinenRecord` object

---

#### POST `/inventory/linen/return` — `🔒 dorm_admin, system_admin`
Record linen return.

**Request:**
```json
{ "recordId": "ln_001", "itemsReturned": ["Sheet", "Blanket"], "damages": "Blanket has stains" }
```
**Response `200`:** `{ "success": true }`

---

#### POST `/inventory/keys/issue` — `🔒 dorm_admin, system_admin`
Issue a room key to a student.

**Request:**
```json
{ "studentId": "OBU12345", "roomId": "BLK-A-101", "keyCode": "BLK-A-101-K1" }
```
**Response `201`:** `KeyRecord` object

---

#### POST `/inventory/keys/return` — `🔒 dorm_admin, system_admin`
Record key return.

**Request:** `{ "recordId": "key_001", "condition": "Good" }`  
**Response `200`:** `{ "success": true }`

---

#### GET `/inventory/keys/missing` — `🔒 dorm_admin, system_admin`
Get report of missing/unrecovered keys.

**Response `200`:** `{ "missingKeys": [...KeyRecord] }`

---

### 📊 Reports

#### GET `/reports/dashboard-summary` — `🔒 auth`
Live system KPIs for the dashboard.

**Response `200`:** `DashboardSummary` object

---

#### GET `/reports/occupancy` — `🔒 dorm_admin, management, system_admin`
Occupancy data by building and floor.

**Query Params:** `startDate`, `endDate`, `building`, `floor`  
**Response `200`:** `OccupancyReportData` object

---

#### GET `/reports/student-directory` — `🔒 dorm_admin, management, system_admin`
Student directory with room info.

**Query Params:** `department`, `year`, `building`  
**Response `200`:** `{ "students": [...StudentDirectoryEntry] }`

---

#### GET `/reports/maintenance-summary` — `🔒 dorm_admin, management, system_admin`
Maintenance stats by category, with average resolution time.

**Query Params:** `startDate`, `endDate`  
**Response `200`:** `MaintenanceSummary` object

---

#### GET `/reports/room-utilization` — `🔒 dorm_admin, management, system_admin`
Utilization rate per room.

**Response `200`:** `{ "rooms": [...RoomUtilizationEntry] }`

---

#### GET `/reports/unassigned-students` — `🔒 dorm_admin, system_admin`
Students without room assignments.

**Response `200`:** `{ "students": [...Student] }`

---

#### GET `/reports/inventory-condition` — `🔒 dorm_admin, system_admin`
Furniture inventory summary by condition.

**Response `200`:** `{ "byCondition": [{ "condition": "Good", "count": 312 }] }`

---

#### POST `/reports/export` — `🔒 dorm_admin, management, system_admin`
Export any report to a downloadable file.

**Request:**
```json
{
  "reportType": "occupancy | student_directory | maintenance_summary | room_utilization | unassigned_students | inventory_condition",
  "format": "pdf | xlsx | csv",
  "filters": {}
}
```
**Response `200`:** `{ "fileUrl": "https://...", "expiresAt": "2026-04-08T..." }`

---

### 👥 User Management

#### GET `/users` — `🔒 system_admin`
List all platform users.

**Query Params:** `role`, `status`, `search`  
**Response `200`:** `{ "users": [...User], "total": 50 }`

---

#### POST `/users` — `🔒 system_admin`
Create a new user account.

**Request:**
```json
{
  "fullName": "Test User",
  "email": "test@obu.edu.et",
  "role": "dorm_admin",
  "studentId": null,
  "tempPassword": true
}
```
**Response `201`:** `User` object

---

#### GET `/users/{userId}` — `🔒 system_admin`
Get a specific user by ID.

**Response `200`:** `User` object

---

#### PUT `/users/{userId}` — `🔒 system_admin`
Update user info, role, or status.

**Request:** `{ "fullName": "...", "email": "...", "role": "...", "status": "..." }`  
**Response `200`:** Updated `User` object

---

#### POST `/users/{userId}/deactivate` — `🔒 system_admin`
Deactivate a user account.

**Response `200`:** `{ "success": true }`

---

#### POST `/users/{userId}/reactivate` — `🔒 system_admin`
Reactivate a previously deactivated account.

**Response `200`:** `{ "success": true }`

---

#### POST `/users/{userId}/reset-password` — `🔒 system_admin`
Send a password reset link to a specific user.

**Response `200`:** `{ "success": true, "message": "Reset link sent" }`

---

#### GET `/roles/permissions` — `🔒 system_admin`
View the role-to-permission mapping matrix.

**Response `200`:** `{ "roles": [{ "role": "student", "permissions": [...] }] }`

---

### 🔔 Notifications

#### GET `/notifications` — `🔒 auth`
Get logged-in user's notifications.

**Query Params:** `limit` (default: 20), `offset` (default: 0), `unreadOnly` (bool)  
**Response `200`:** `{ "notifications": [...Notification], "total": 10 }`

---

#### GET `/notifications/unread-count` — `🔒 auth`
Get the number of unread notifications (for badge display).

**Response `200`:** `{ "count": 3 }`

---

#### PUT `/notifications/{notificationId}/read` — `🔒 auth`
Mark a single notification as read.

**Response `200`:** `{ "success": true }`

---

#### PUT `/notifications/read-all` — `🔒 auth`
Mark all notifications as read.

**Response `200`:** `{ "success": true }`

---

#### POST `/notifications/broadcast` — `🔒 dorm_admin, system_admin`
Send a broadcast notification.

**Request:**
```json
{
  "title": "Water Outage",
  "message": "Water supply interrupted April 5th, 14:00-16:00",
  "target": "all_students | building | room | specific_user",
  "targetId": "dorm_001",
  "attachmentUrl": null
}
```
**Response `200`:** `{ "success": true }`

---

### 🗒️ Audit Logs

#### GET `/audit-logs` — `🔒 system_admin`
Get paginated audit logs with filters.

**Query Params:**
- `startDate` (date)
- `endDate` (date)
- `user` (string)
- `action` (`CREATE | UPDATE | DELETE | LOGIN | LOGOUT | APPROVE | REJECT | ASSIGN`)
- `entity` (string)
- `page` (int, default: 1)
- `limit` (int, default: 50)

**Response `200`:**
```json
{
  "logs": [...AuditLog],
  "total": 1240,
  "page": 1,
  "totalPages": 25
}
```

---

#### GET `/audit-logs/export` — `🔒 system_admin`
Export filtered audit logs to a CSV file.

**Query Params:** `startDate`, `endDate`, `user`, `action`  
**Response `200`:** `{ "fileUrl": "https://...", "expiresAt": "2026-04-08T..." }`

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Human-readable error message",
  "code": "MACHINE_READABLE_CODE",
  "timestamp": "2026-04-07T00:00:00Z"
}
```

| HTTP Status | Meaning |
|-------------|---------|
| `400` | Bad request / validation error |
| `401` | Unauthenticated — missing or invalid token |
| `403` | Unauthorized — valid token but insufficient role |
| `404` | Resource not found |
| `409` | Conflict (e.g., room already at capacity) |
| `500` | Internal server error |

---

## Frontend Integration Notes

1. **Token Storage:** Store JWT in memory or `httpOnly` cookie. Avoid `localStorage` for security.
2. **Token Refresh:** Implement refresh token logic to renew session before expiry.
3. **Role Guards:** Use the `role` value from the login response to conditionally render UI components.
4. **Pagination:** All list endpoints support `limit/offset` — implement infinite scroll or page buttons.
5. **Image Upload:** For maintenance requests, use `multipart/form-data` content type for the `image` field.
6. **Polling vs WebSocket:** Notifications unread-count should be polled (`/notifications/unread-count`) every 30s. No WebSocket is defined in the API.
