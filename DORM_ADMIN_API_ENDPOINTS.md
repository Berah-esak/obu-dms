# Dorm Admin Dashboard API Endpoints

This document lists all API endpoints available for the Dorm Admin dashboard to manage room change requests and maintenance requests.

## Authentication
All endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Room Change Requests

### 1. Get Pending Room Change Requests
**Endpoint:** `GET /api/room-change-requests/pending`  
**Roles:** dorm_admin, management, system_admin  
**Description:** Retrieves all pending room change requests that need approval

**Response:**
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "string",
        "studentId": "string",
        "currentRoom": "string",
        "requestedRoom": "string",
        "reason": "string",
        "status": "pending",
        "submittedAt": "timestamp"
      }
    ]
  }
}
```

### 2. Approve Room Change Request
**Endpoint:** `PUT /api/room-change-requests/:requestId/approve`  
**Roles:** dorm_admin, system_admin  
**Description:** Approves a room change request and creates the new room assignment

**Request Body:**
```json
{
  "newRoomId": "string",
  "effectiveDate": "YYYY-MM-DD",
  "notes": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Room change approved",
    "assignment": { ... }
  }
}
```

### 3. Reject Room Change Request
**Endpoint:** `PUT /api/room-change-requests/:requestId/reject`  
**Roles:** dorm_admin, system_admin  
**Description:** Rejects a room change request with a reason

**Request Body:**
```json
{
  "reason": "string (required, min 10 chars)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Room change rejected"
  }
}
```

---

## Maintenance Requests

### 1. Get All Maintenance Requests
**Endpoint:** `GET /api/maintenance-requests`  
**Roles:** dorm_admin, maintenance, management, system_admin  
**Query Parameters:**
- `status` (optional): Filter by status (pending, approved, in_progress, completed, rejected)
- `priority` (optional): Filter by priority (Low, Medium, High)

**Description:** Retrieves all maintenance requests with optional filters

**Response:**
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "string",
        "requestId": "MR-2026-123456",
        "trackingNumber": "TRK-123456",
        "roomId": "string",
        "category": "Electrical|Plumbing|Furniture|Sanitation|Other",
        "description": "string",
        "priority": "Low|Medium|High",
        "status": "pending|approved|in_progress|completed|rejected",
        "submittedBy": "string",
        "submittedAt": "timestamp"
      }
    ]
  }
}
```

### 2. Get Pending Maintenance Requests
**Endpoint:** `GET /api/maintenance-requests/pending`  
**Roles:** dorm_admin, management, system_admin  
**Description:** Retrieves only pending maintenance requests that need approval

**Response:**
```json
{
  "success": true,
  "data": {
    "requests": [ ... ]
  }
}
```

### 3. Approve Maintenance Request
**Endpoint:** `PUT /api/maintenance-requests/:requestId/approve`  
**Roles:** dorm_admin, system_admin  
**Description:** Approves a maintenance request

**Request Body:**
```json
{
  "notes": "string (optional)",
  "adminNotes": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Maintenance request approved",
    "request": { ... }
  }
}
```

### 4. Reject Maintenance Request
**Endpoint:** `PUT /api/maintenance-requests/:requestId/reject`  
**Roles:** dorm_admin, system_admin  
**Description:** Rejects a maintenance request with a reason

**Request Body:**
```json
{
  "reason": "string (required, min 10 chars)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Maintenance request rejected",
    "request": { ... }
  }
}
```

### 5. Update Maintenance Status
**Endpoint:** `PUT /api/maintenance-requests/:requestId/status`  
**Roles:** maintenance, dorm_admin, system_admin  
**Description:** Updates the status of a maintenance request

**Request Body:**
```json
{
  "status": "Submitted|In Progress|Completed|Rejected",
  "resolutionNotes": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Status updated",
    "request": { ... }
  }
}
```

### 6. Add Note to Maintenance Request
**Endpoint:** `POST /api/maintenance-requests/:requestId/notes`  
**Roles:** maintenance, dorm_admin, system_admin  
**Description:** Adds a note to a maintenance request

**Request Body:**
```json
{
  "note": "string (required)",
  "isInternal": "boolean (default: false)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "note": {
      "note": "string",
      "isInternal": false,
      "addedBy": "userId",
      "addedAt": "timestamp"
    }
  }
}
```

### 7. Reassign Maintenance Request
**Endpoint:** `PUT /api/maintenance-requests/:requestId/reassign`  
**Roles:** dorm_admin, system_admin  
**Description:** Reassigns a maintenance request to a different staff member

**Request Body:**
```json
{
  "staffId": "string (required)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Reassigned successfully"
  }
}
```

---

## Summary

### Dorm Admin Capabilities:
✅ View all pending room change requests  
✅ Approve room change requests  
✅ Reject room change requests  
✅ View all maintenance requests (with filters)  
✅ View pending maintenance requests  
✅ Approve maintenance requests  
✅ Reject maintenance requests  
✅ Update maintenance request status  
✅ Add notes to maintenance requests  
✅ Reassign maintenance requests to staff  

### Frontend Integration Notes:
1. All endpoints return consistent response format with `success` and `data` fields
2. Error responses include appropriate HTTP status codes and error messages
3. File uploads for maintenance requests use multipart/form-data (handled automatically)
4. All timestamps are in ISO 8601 format
5. Request IDs are used in URL parameters (e.g., `:requestId`)
