# Design Document: Proctor and Exit Clearance System

## Overview

This design extends the dormitory management system with seven major feature areas:

1. **Proctor Role Management**: New "Proctor" and "Proctor Head" roles with dorm block assignment
2. **Exit Clearance System**: Student exit request submission, approval workflow, verification code generation, and gate verification
3. **Attendance System**: Daily attendance recording by proctors with reporting capabilities
4. **Enhanced Maintenance Workflow**: Multi-level approval (Student → Proctor → Proctor Head → Maintenance Staff)
5. **Material Inventory**: Room-level tracking of furniture and equipment
6. **Announcement System**: Broadcast messaging from Proctor Head to students
7. **Complaint Management**: Student complaint submission with proctor/admin response workflow

The system maintains the existing architecture: Node.js/Express backend with Firebase/Firestore, React/TypeScript frontend, repository pattern, service layer, and REST API.

### Key Design Principles

- **Role-Based Access Control**: Strict enforcement of permissions based on user roles and dorm block assignments
- **Workflow Automation**: Sequential approval workflows with automatic notifications
- **Data Isolation**: Proctors access only their assigned dorm blocks
- **Audit Trail**: Complete tracking of all status changes and approvals
- **Real-Time Updates**: Students see live status updates in their dashboard

## Architecture

### System Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend (TypeScript)              │
│  - Student Dashboard (Exit Requests, Complaints, Materials)  │
│  - Proctor Dashboard (Attendance, Approvals, Complaints)     │
│  - Proctor Head Dashboard (Management, Reports, Approvals)   │
│  - Gate Guard Interface (Verification)                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    REST API Layer (Express)                  │
│  - Authentication Middleware (JWT + Role Verification)       │
│  - Route Handlers (Controllers)                              │
│  - Request Validation (express-validator)                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Service Layer                           │
│  - Business Logic                                            │
│  - Workflow Orchestration                                    │
│  - Notification Triggering                                   │
│  - Verification Code Generation                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Repository Layer                          │
│  - Firestore Query Abstraction                              │
│  - Data Transformation                                       │
│  - Collection Management                                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Firebase/Firestore                          │
│  - Document Storage                                          │
│  - Query Execution                                           │
│  - Transaction Support                                       │
└─────────────────────────────────────────────────────────────┘
```

### Role Hierarchy

```
System Admin (full system access)
    │
    ├─── Proctor Head (manages proctors, approves requests, sends announcements)
    │       │
    │       └─── Proctor (assigned to dorm blocks, first-level approvals, attendance)
    │               │
    │               └─── Student (submits requests, views materials, receives announcements)
    │
    ├─── Maintenance Staff (handles approved maintenance requests)
    │
    ├─── Management (reports and analytics)
    │
    └─── Gate Guard (verifies exit codes)
```

### Exit Clearance Workflow

```
┌─────────────┐
│   Student   │
│  Submits    │
│   Request   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Status: Pending │
│  Notify: Proctor │
│      Head        │
└──────┬───────────┘
       │
       ▼
┌──────────────────────┐
│  Proctor Head        │
│  Reviews Request     │
└──────┬───────────────┘
       │
       ├─── Approve ──────┐
       │                  │
       │                  ▼
       │         ┌────────────────────┐
       │         │ Generate Unique    │
       │         │ Verification Code  │
       │         │ Status: Approved   │
       │         │ Notify: Student    │
       │         └────────┬───────────┘
       │                  │
       │                  ▼
       │         ┌────────────────────┐
       │         │ Student Receives   │
       │         │ Code in Dashboard  │
       │         └────────┬───────────┘
       │                  │
       │                  ▼
       │         ┌────────────────────┐
       │         │  Gate Guard        │
       │         │  Verifies Code     │
       │         └────────┬───────────┘
       │                  │
       │                  ▼
       │         ┌────────────────────┐
       │         │ Status: Verified   │
       │         │ Code: Used         │
       │         └────────────────────┘
       │
       └─── Reject ──────┐
                         │
                         ▼
                ┌────────────────────┐
                │ Status: Rejected   │
                │ Notify: Student    │
                │ with Reason        │
                └────────────────────┘
```

### Maintenance Approval Workflow

```
┌─────────────┐
│   Student   │
│  Submits    │
│   Request   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Status: Pending │
│  Notify: Proctor │
└──────┬───────────┘
       │
       ▼
┌──────────────────────┐
│  Proctor Reviews     │
└──────┬───────────────┘
       │
       ├─── Approve ──────┐
       │                  │
       │                  ▼
       │         ┌────────────────────┐
       │         │ Forward to Proctor │
       │         │ Head for Final     │
       │         │ Approval           │
       │         └────────┬───────────┘
       │                  │
       │                  ▼
       │         ┌────────────────────┐
       │         │ Proctor Head       │
       │         │ Reviews            │
       │         └────────┬───────────┘
       │                  │
       │                  ├─── Approve ──────┐
       │                  │                   │
       │                  │                   ▼
       │                  │          ┌────────────────────┐
       │                  │          │ Status: Approved   │
       │                  │          │ Visible to         │
       │                  │          │ Maintenance Staff  │
       │                  │          └────────────────────┘
       │                  │
       │                  └─── Reject ──────┐
       │                                    │
       │                                    ▼
       │                           ┌────────────────────┐
       │                           │ Status: Rejected   │
       │                           │ Notify: Student    │
       │                           └────────────────────┘
       │
       └─── Reject ──────┐
                         │
                         ▼
                ┌────────────────────┐
                │ Status: Rejected   │
                │ Notify: Student    │
                └────────────────────┘
```

## Components and Interfaces

### Backend Components

#### 1. Exit Clearance Module

**Repository: `exitRequestRepository.js`**
```javascript
{
  create(payload): Promise<ExitRequest>
  findById(id): Promise<ExitRequest>
  findByStudent(studentId, options): Promise<ExitRequest[]>
  findPending(options): Promise<ExitRequest[]>
  findByVerificationCode(code): Promise<ExitRequest>
  updateStatus(id, status, metadata): Promise<ExitRequest>
  markCodeAsUsed(id, verifiedAt): Promise<ExitRequest>
  findAll(filter, options): Promise<ExitRequest[]>
  count(filter): Promise<number>
}
```

**Service: `exitClearanceService.js`**
```javascript
{
  submitRequest(studentId, payload): Promise<ExitRequest>
  getStudentRequests(studentId, query): Promise<{requests, total}>
  getPendingRequests(query): Promise<{requests, total}>
  approveRequest(requestId, proctorHeadId, metadata): Promise<ExitRequest>
  rejectRequest(requestId, proctorHeadId, reason): Promise<ExitRequest>
  verifyCode(code, gateGuardId): Promise<{valid, request}>
  getRequestHistory(filter, options): Promise<{requests, total}>
  generateVerificationCode(): string
}
```

**Controller: `exitClearanceController.js`**
```javascript
{
  submitExitRequest(req, res): void
  getMyExitRequests(req, res): void
  getPendingExitRequests(req, res): void
  approveExitRequest(req, res): void
  rejectExitRequest(req, res): void
  verifyExitCode(req, res): void
  getExitRequestHistory(req, res): void
}
```

#### 2. Attendance Module

**Repository: `attendanceRepository.js`**
```javascript
{
  create(payload): Promise<AttendanceRecord>
  findByDate(date, filter): Promise<AttendanceRecord[]>
  findByStudent(studentId, dateRange): Promise<AttendanceRecord[]>
  findByProctor(proctorId, dateRange): Promise<AttendanceRecord[]>
  updateRecord(id, payload): Promise<AttendanceRecord>
  checkDuplicate(studentId, date): Promise<boolean>
  getAttendanceStats(filter, dateRange): Promise<Stats>
  findAll(filter, options): Promise<AttendanceRecord[]>
}
```

**Service: `attendanceService.js`**
```javascript
{
  recordAttendance(proctorId, payload): Promise<AttendanceRecord[]>
  getAttendanceForDate(proctorId, date): Promise<{records, students}>
  updateAttendanceRecord(recordId, proctorId, payload): Promise<AttendanceRecord>
  generateReport(filter, dateRange): Promise<{report, stats}>
  getStudentAttendance(studentId, dateRange): Promise<{records, percentage}>
  getProctorAttendanceRecords(proctorId, dateRange): Promise<AttendanceRecord[]>
}
```

**Controller: `attendanceController.js`**
```javascript
{
  recordDailyAttendance(req, res): void
  getAttendanceForDate(req, res): void
  updateAttendanceRecord(req, res): void
  generateAttendanceReport(req, res): void
  getStudentAttendance(req, res): void
  exportAttendanceReport(req, res): void
}
```

#### 3. Material Inventory Module

**Repository: `materialInventoryRepository.js`**
```javascript
{
  create(payload): Promise<MaterialItem>
  findByRoom(roomId): Promise<MaterialItem[]>
  findById(id): Promise<MaterialItem>
  updateById(id, payload): Promise<MaterialItem>
  deleteById(id): Promise<void>
  findByDormBlock(dormBlockId): Promise<MaterialItem[]>
  findAll(filter, options): Promise<MaterialItem[]>
  count(filter): Promise<number>
}
```

**Service: `materialInventoryService.js`**
```javascript
{
  addMaterialToRoom(roomId, payload, proctorHeadId): Promise<MaterialItem>
  updateMaterial(materialId, payload, proctorHeadId): Promise<MaterialItem>
  removeMaterial(materialId, proctorHeadId): Promise<void>
  getRoomInventory(roomId, userId, userRole): Promise<MaterialItem[]>
  getDormBlockInventory(dormBlockId): Promise<MaterialItem[]>
  getAllInventory(filter, options): Promise<{items, total}>
}
```

**Controller: `materialInventoryController.js`**
```javascript
{
  addMaterial(req, res): void
  updateMaterial(req, res): void
  removeMaterial(req, res): void
  getRoomInventory(req, res): void
  getDormBlockInventory(req, res): void
  getAllInventory(req, res): void
}
```

#### 4. Announcement Module

**Repository: `announcementRepository.js`**
```javascript
{
  create(payload): Promise<Announcement>
  findById(id): Promise<Announcement>
  findByTargetBlocks(dormBlockIds, options): Promise<Announcement[]>
  findAll(filter, options): Promise<Announcement[]>
  markAsRead(announcementId, studentId): Promise<void>
  getReadStatus(announcementId, studentId): Promise<boolean>
  countUnread(studentId, dormBlockId): Promise<number>
}
```

**Service: `announcementService.js`**
```javascript
{
  createAnnouncement(proctorHeadId, payload): Promise<Announcement>
  getAnnouncementsForStudent(studentId, dormBlockId, options): Promise<{announcements, unreadCount}>
  markAnnouncementAsRead(announcementId, studentId): Promise<void>
  searchAnnouncements(studentId, dormBlockId, keyword, options): Promise<Announcement[]>
  getAllAnnouncements(filter, options): Promise<{announcements, total}>
}
```

**Controller: `announcementController.js`**
```javascript
{
  createAnnouncement(req, res): void
  getMyAnnouncements(req, res): void
  markAsRead(req, res): void
  searchAnnouncements(req, res): void
  getAllAnnouncements(req, res): void
}
```

#### 5. Complaint Module

**Repository: `complaintRepository.js`**
```javascript
{
  create(payload): Promise<Complaint>
  findById(id): Promise<Complaint>
  findByStudent(studentId, options): Promise<Complaint[]>
  findByDormBlock(dormBlockId, options): Promise<Complaint[]>
  updateStatus(id, status, metadata): Promise<Complaint>
  addResponse(id, response): Promise<Complaint>
  findAll(filter, options): Promise<Complaint[]>
  count(filter): Promise<number>
}
```

**Service: `complaintService.js`**
```javascript
{
  submitComplaint(studentId, payload): Promise<Complaint>
  getStudentComplaints(studentId, options): Promise<{complaints, total}>
  getComplaintsForProctor(proctorId, options): Promise<{complaints, total}>
  getAllComplaints(filter, options): Promise<{complaints, total}>
  updateComplaintStatus(complaintId, userId, status, responseNotes): Promise<Complaint>
  addComplaintResponse(complaintId, userId, response): Promise<Complaint>
}
```

**Controller: `complaintController.js`**
```javascript
{
  submitComplaint(req, res): void
  getMyComplaints(req, res): void
  getComplaintsForProctor(req, res): void
  getAllComplaints(req, res): void
  updateComplaintStatus(req, res): void
  addComplaintResponse(req, res): void
}
```

#### 6. Proctor Management Module

**Service Extensions: `userService.js`**
```javascript
{
  // Existing methods...
  createProctor(proctorHeadId, payload): Promise<User>
  updateProctorAssignments(proctorId, dormBlockIds, proctorHeadId): Promise<User>
  getProctorsByDormBlock(dormBlockId): Promise<User[]>
  getAllProctors(options): Promise<{proctors, total}>
  deactivateProctor(proctorId, proctorHeadId): Promise<User>
}
```

#### 7. Dorm Block Management Module

**Repository: `dormBlockRepository.js`**
```javascript
{
  create(payload): Promise<DormBlock>
  findById(id): Promise<DormBlock>
  findByCode(code): Promise<DormBlock>
  findAll(filter, options): Promise<DormBlock[]>
  updateById(id, payload): Promise<DormBlock>
  deactivate(id): Promise<DormBlock>
  hasActiveAssignments(id): Promise<boolean>
  count(filter): Promise<number>
}
```

**Service: `dormBlockService.js`**
```javascript
{
  createDormBlock(proctorHeadId, payload): Promise<DormBlock>
  updateDormBlock(blockId, proctorHeadId, payload): Promise<DormBlock>
  getDormBlocks(filter, options): Promise<{blocks, total}>
  getDormBlockById(blockId): Promise<DormBlock>
  deactivateDormBlock(blockId, proctorHeadId): Promise<DormBlock>
}
```

**Controller: `dormBlockController.js`**
```javascript
{
  createDormBlock(req, res): void
  updateDormBlock(req, res): void
  getDormBlocks(req, res): void
  getDormBlockById(req, res): void
  deactivateDormBlock(req, res): void
}
```

#### 8. Enhanced Maintenance Service

**Service Extensions: `maintenanceService.js`**
```javascript
{
  // Existing methods...
  approveByProctor(requestId, proctorId, notes): Promise<MaintenanceRequest>
  rejectByProctor(requestId, proctorId, reason): Promise<MaintenanceRequest>
  approveByProctorHead(requestId, proctorHeadId, notes): Promise<MaintenanceRequest>
  rejectByProctorHead(requestId, proctorHeadId, reason): Promise<MaintenanceRequest>
  getRequestsForProctor(proctorId, filter, options): Promise<{requests, total}>
  getRequestsForProctorHead(filter, options): Promise<{requests, total}>
}
```

### Frontend Components

#### Student Dashboard Components

**ExitRequestForm.tsx**
- Form for submitting exit requests
- Item list input (dynamic add/remove)
- Reason text area
- Submit button

**ExitRequestList.tsx**
- Display all student's exit requests
- Status badges (Pending, Approved, Rejected, Verified)
- Verification code display for approved requests
- Rejection reason display
- Filter by status

**MaterialInventoryView.tsx**
- Display materials assigned to student's room
- Item type, quantity, condition
- Date added
- Read-only view

**ComplaintForm.tsx**
- Subject and description inputs
- Category dropdown
- Submit button

**ComplaintList.tsx**
- Display student's complaints
- Status tracking
- Response notes from proctors/admin
- Filter by status

**AnnouncementList.tsx**
- Display announcements for student's dorm block
- Unread count badge
- Mark as read functionality
- Search by keyword
- Reverse chronological order

#### Proctor Dashboard Components

**AttendanceRecorder.tsx**
- Date selector
- Student list for assigned dorm blocks
- Present/Absent toggle for each student
- Bulk save functionality
- Edit mode for current date only

**MaintenanceApprovalList.tsx**
- Pending maintenance requests from assigned blocks
- Approve/Reject actions
- Add notes
- Filter by category/priority

**ComplaintManagement.tsx**
- Complaints from assigned dorm blocks
- Status update dropdown
- Response notes text area
- Filter by status/category

#### Proctor Head Dashboard Components

**ProctorManagement.tsx**
- Create proctor accounts
- Assign/reassign dorm blocks
- View all proctors and assignments
- Deactivate proctors

**DormBlockManagement.tsx**
- Create dorm blocks
- Edit block information
- View all blocks
- Deactivate blocks (with validation)

**ExitRequestApproval.tsx**
- Pending exit requests
- Approve/Reject actions
- Rejection reason input
- Filter by date/student

**AttendanceReports.tsx**
- Date range selector
- Dorm block filter
- Student filter
- Attendance percentage display
- Export to CSV

**AnnouncementCreator.tsx**
- Title and content inputs
- Target selection (specific blocks or all students)
- Send button

**MaterialInventoryManagement.tsx**
- Add materials to rooms
- Update material condition/quantity
- Remove materials
- View inventory by room/block

#### Gate Guard Interface

**VerificationCodeChecker.tsx**
- Code input field
- Verify button
- Display student name, items, approval details on success
- Error messages for invalid/used codes

## Data Models

### ExitRequest Collection

```typescript
interface ExitRequest {
  id: string;
  studentId: string;
  studentName: string;
  dormBlockId: string;
  roomId: string;
  items: string[];  // Array of item descriptions
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Verified';
  verificationCode?: string;
  verificationCodeStatus?: 'Active' | 'Used';
  approvedBy?: string;  // Proctor Head user ID
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
  verifiedBy?: string;  // Gate Guard user ID
  verifiedAt?: Date;
  submittedAt: Date;
  updatedAt: Date;
}
```

### AttendanceRecord Collection

```typescript
interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  dormBlockId: string;
  roomId: string;
  proctorId: string;
  proctorName: string;
  date: string;  // YYYY-MM-DD format
  status: 'Present' | 'Absent';
  recordedAt: Date;
  updatedAt: Date;
}
```

### MaterialItem Collection

```typescript
interface MaterialItem {
  id: string;
  roomId: string;
  dormBlockId: string;
  itemType: string;  // chair, table, locker, bed, desk, wardrobe, etc.
  quantity: number;
  condition: 'Good' | 'Fair' | 'Damaged' | 'Missing';
  addedBy: string;  // Proctor Head user ID
  addedAt: Date;
  updatedAt: Date;
  notes?: string;
}
```

### Announcement Collection

```typescript
interface Announcement {
  id: string;
  title: string;
  content: string;
  createdBy: string;  // Proctor Head user ID
  createdByName: string;
  targetBlocks: string[];  // Array of dorm block IDs, empty array = all students
  createdAt: Date;
  updatedAt: Date;
}
```

### AnnouncementRead Collection (tracking read status)

```typescript
interface AnnouncementRead {
  id: string;
  announcementId: string;
  studentId: string;
  readAt: Date;
}
```

### Complaint Collection

```typescript
interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  dormBlockId: string;
  roomId: string;
  subject: string;
  description: string;
  category: 'Facility' | 'Roommate' | 'Noise' | 'Safety' | 'Other';
  status: 'Submitted' | 'Under Review' | 'Resolved';
  responseNotes?: string;
  respondedBy?: string;  // Proctor or Proctor Head user ID
  respondedAt?: Date;
  submittedAt: Date;
  updatedAt: Date;
}
```

### DormBlock Collection

```typescript
interface DormBlock {
  id: string;
  blockName: string;
  blockCode: string;  // Unique identifier
  location?: string;
  address?: string;
  status: 'Active' | 'Inactive';
  createdBy: string;  // Proctor Head user ID
  createdAt: Date;
  updatedAt: Date;
}
```

### User Collection Extensions

```typescript
interface User {
  // Existing fields...
  id: string;
  username: string;
  fullName: string;
  email: string;
  password: string;
  role: 'System Admin' | 'Proctor Head' | 'Proctor' | 'Maintenance Staff' | 'Management' | 'Student' | 'Gate Guard';
  status: 'Active' | 'Inactive';
  
  // New fields for Proctor role
  dormBlocks?: string[];  // Array of dorm block IDs (for Proctor role)
  
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}
```

### MaintenanceRequest Collection Extensions

```typescript
interface MaintenanceRequest {
  // Existing fields...
  id: string;
  requestId: string;
  roomId: string;
  category: string;
  description: string;
  priority: string;
  submittedBy: string;
  
  // Enhanced workflow fields
  status: 'Pending' | 'Proctor Approved' | 'Approved' | 'Rejected' | 'In Progress' | 'Completed';
  proctorApprovedBy?: string;
  proctorApprovedAt?: Date;
  proctorNotes?: string;
  proctorRejectedBy?: string;
  proctorRejectionReason?: string;
  finalApprovedBy?: string;  // Proctor Head
  finalApprovedAt?: Date;
  finalRejectedBy?: string;
  finalRejectionReason?: string;
  
  assignedTo?: string;
  trackingNumber: string;
  resolutionNotes?: string;
  notes?: Array<{
    note: string;
    isInternal: boolean;
    addedBy: string;
    addedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Proctor Dorm Block Data Isolation

*For any* Proctor user with assigned dorm blocks, when querying any data endpoint (attendance records, maintenance requests, material inventory, complaints), all returned data SHALL belong exclusively to rooms within the Proctor's assigned dorm blocks.

**Validates: Requirements 1.6, 10.2, 13.2, 16.5, 20.2**

### Property 2: Verification Code Uniqueness

*For any* set of approved exit requests, all generated verification codes SHALL be unique across all active exit requests in the system.

**Validates: Requirements 6.4, 7.1, 7.2**

### Property 3: Verification Code Format Validation

*For any* generated verification code, the code SHALL be at least 6 characters in length and SHALL contain only alphanumeric characters.

**Validates: Requirements 7.7**

### Property 4: Verification Code Idempotency

*For any* valid verification code, verifying the code once SHALL mark it as "Used", and subsequent verification attempts with the same code SHALL return an error indicating the code has already been used, without changing the code's state.

**Validates: Requirements 8.4, 8.5**

### Property 5: Maintenance Staff Status-Based Visibility

*For any* Maintenance Staff user, when querying maintenance requests, the returned results SHALL NOT include any requests with status "Pending" or "Rejected".

**Validates: Requirements 13.9**

### Property 6: Student Room-Based Material Access

*For any* Student user, when querying material inventory, the system SHALL return only materials assigned to the room where the student is currently assigned, and SHALL reject queries for materials in other rooms.

**Validates: Requirements 16.4**

### Property 7: Student Announcement Targeting

*For any* Student user in a specific dorm block, when querying announcements, the system SHALL return only announcements where either (a) the announcement's targetBlocks array includes the student's dorm block, or (b) the targetBlocks array is empty (indicating all students).

**Validates: Requirements 18.1**

### Property 8: Announcement Chronological Ordering

*For any* set of announcements returned by a query, the announcements SHALL be ordered in reverse chronological order by createdAt timestamp (newest first).

**Validates: Requirements 18.2**

## Error Handling

### Error Categories

1. **Authentication Errors (401)**
   - Invalid credentials
   - Expired session
   - Missing authentication token

2. **Authorization Errors (403)**
   - Insufficient permissions for role
   - Access to dorm block not assigned to proctor
   - Student accessing another student's data

3. **Validation Errors (400)**
   - Missing required fields
   - Invalid data format
   - Duplicate verification code
   - Duplicate attendance record for same date
   - Duplicate dorm block code

4. **Not Found Errors (404)**
   - Exit request not found
   - Attendance record not found
   - Material item not found
   - Announcement not found
   - Complaint not found
   - Dorm block not found

5. **Conflict Errors (409)**
   - Verification code already used
   - Attendance already recorded for date
   - Cannot delete dorm block with active assignments

6. **Server Errors (500)**
   - Firestore connection failure
   - Verification code generation failure
   - Notification delivery failure

### Error Response Format

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

### Error Handling Strategy

- **Service Layer**: Throw `ApiError` with appropriate status code and message
- **Controller Layer**: Catch errors and format response using error middleware
- **Frontend**: Display user-friendly error messages with retry options
- **Logging**: Log all errors with context (user ID, request ID, timestamp)

## Testing Strategy

### Unit Testing

**Backend Unit Tests (Jest)**

1. **Repository Layer Tests**
   - Test Firestore query construction
   - Test data transformation (toExitRequest, toAttendance, etc.)
   - Mock Firestore SDK

2. **Service Layer Tests**
   - Test business logic in isolation
   - Mock repository calls
   - Test verification code generation uniqueness
   - Test approval workflow state transitions
   - Test notification triggering
   - Test access control logic

3. **Controller Layer Tests**
   - Test request validation
   - Test response formatting
   - Mock service calls

**Frontend Unit Tests (Vitest + React Testing Library)**

1. **Component Tests**
   - Test form submission
   - Test status display
   - Test conditional rendering based on role
   - Mock API calls

2. **Hook Tests**
   - Test custom hooks for data fetching
   - Test state management

### Property-Based Testing

**Property Test Library**: fast-check (for JavaScript/TypeScript)

**Property Test Configuration**:
- Minimum 100 iterations per property test
- Each property test must reference its design document property using a comment tag
- Tag format: `// Feature: proctor-and-exit-clearance-system, Property {number}: {property_text}`

**Property Tests to Implement**:

1. **Property 1: Proctor Dorm Block Data Isolation**
   - Generate random proctor users with random dorm block assignments
   - Generate random data (attendance, maintenance, materials, complaints) across multiple dorm blocks
   - Query each endpoint as the proctor
   - Verify all returned data belongs to assigned dorm blocks

2. **Property 2: Verification Code Uniqueness**
   - Generate multiple exit requests
   - Approve all requests to generate verification codes
   - Verify all codes are unique

3. **Property 3: Verification Code Format Validation**
   - Generate multiple verification codes
   - Verify each code is >= 6 characters and alphanumeric

4. **Property 4: Verification Code Idempotency**
   - Generate exit request and approve to get verification code
   - Verify code once (should succeed and mark as used)
   - Verify same code again (should fail with "already used" error)
   - Verify code state remains "Used"

5. **Property 5: Maintenance Staff Status-Based Visibility**
   - Generate random maintenance requests with various statuses
   - Query as maintenance staff user
   - Verify no results have status "Pending" or "Rejected"

6. **Property 6: Student Room-Based Material Access**
   - Generate random student with room assignment
   - Generate materials for multiple rooms
   - Query materials as student
   - Verify only materials from student's room are returned

7. **Property 7: Student Announcement Targeting**
   - Generate random student in specific dorm block
   - Generate announcements with various targetBlocks configurations
   - Query announcements as student
   - Verify only announcements targeting student's block or all students are returned

8. **Property 8: Announcement Chronological Ordering**
   - Generate random set of announcements with different timestamps
   - Query announcements
   - Verify results are sorted by createdAt descending

### Integration Testing

1. **API Integration Tests**
   - Test complete request/response cycles
   - Test authentication middleware
   - Test role-based access control
   - Use test Firestore instance

2. **Workflow Integration Tests**
   - Test exit clearance workflow end-to-end
   - Test maintenance approval workflow
   - Test notification delivery

### End-to-End Testing (Playwright)

1. **Student Workflows**
   - Submit exit request → View status → See verification code
   - Submit complaint → Track status
   - View announcements → Mark as read
   - View room materials

2. **Proctor Workflows**
   - Record attendance
   - Approve/reject maintenance requests
   - Respond to complaints

3. **Proctor Head Workflows**
   - Create proctor accounts
   - Approve exit requests
   - Send announcements
   - Generate attendance reports

4. **Gate Guard Workflows**
   - Verify exit codes
   - Handle invalid codes

### Test Data Strategy

- **Seed Data**: Create test users for each role
- **Test Dorm Blocks**: Create sample dorm blocks with rooms
- **Test Students**: Assign students to rooms
- **Cleanup**: Clear test data after each test suite

### Testing Priorities

1. **Critical Path**: Exit clearance workflow (highest security impact)
2. **High Priority**: Maintenance approval workflow, attendance recording
3. **Medium Priority**: Material inventory, announcements
4. **Low Priority**: Complaint management, reporting

