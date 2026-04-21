# Requirements Document

## Introduction

This document specifies requirements for enhancing the dormitory management system with a Proctor role, exit clearance workflow, attendance tracking, enhanced maintenance approval workflow, material inventory tracking, announcement system, and complaint management. The system currently supports System Admin, Proctor Head (dormitory administrator), Maintenance Staff, Management, and Student roles with room allocation and basic maintenance features. These enhancements introduce a new Proctor role (supervisory staff) positioned between Students and Proctor Head, and implement structured workflows for exit clearance, maintenance approvals, and student communication.

## Glossary

- **System**: The dormitory management system (Node.js/Express backend with Firebase/Firestore, React/TypeScript frontend)
- **System_Admin**: Top-level administrator with full system access and configuration authority
- **Proctor_Head**: Head administrator who manages proctors, buildings, students, rooms, approves requests, manages materials, and sends announcements (formerly called Dorm Admin)
- **Proctor**: Supervisory staff assigned to specific dorm blocks for daily supervision, positioned between Student and Proctor_Head in the role hierarchy. Responsible for enforcing room rules, first-level approvals, attendance tracking, and report generation
- **Dorm_Block**: A physical subdivision of a dormitory building containing multiple rooms
- **Exit_Request**: A student-initiated request to leave the dormitory with a list of items being carried
- **Verification_Code**: A one-time alphanumeric code generated for exit clearance verification
- **Gate_Guard**: Security personnel who verifies exit clearance codes at the dormitory exit
- **Attendance_Record**: A daily record of student presence in the dormitory
- **Maintenance_Request**: A student-submitted request for room or facility repairs
- **Material_Item**: Physical inventory assigned to a room (chair, table, locker, bed, etc.)
- **Announcement**: A broadcast message from Proctor_Head to students
- **Complaint**: A student-submitted issue or concern requiring administrative attention
- **Student**: Existing role representing dormitory residents
- **Approval_Workflow**: A sequential process requiring authorization from designated roles (typically Student → Proctor → Proctor_Head)

## Requirements

### Requirement 1: Proctor Role Management

**User Story:** As a Proctor Head, I want to create and manage Proctor accounts assigned to specific dorm blocks, so that I can delegate daily supervision responsibilities.

#### Acceptance Criteria

1. THE System SHALL support a "Proctor" role in the user role hierarchy
2. THE System SHALL support a "Proctor Head" role in the user role hierarchy with administrative authority over Proctors
3. WHEN a Proctor_Head creates a Proctor account, THE System SHALL require assignment to at least one Dorm_Block
4. THE System SHALL allow a Proctor to be assigned to multiple Dorm_Blocks
5. THE System SHALL allow a Dorm_Block to have multiple Proctors assigned
6. WHEN a Proctor logs in, THE System SHALL display only data related to their assigned Dorm_Blocks
7. THE System SHALL prevent Proctors from accessing data outside their assigned Dorm_Blocks
8. THE System SHALL allow Proctor_Head to modify Proctor Dorm_Block assignments
9. THE System SHALL allow Proctor_Head to deactivate Proctor accounts
10. THE System SHALL allow Proctor_Head to view all Proctors and their assigned Dorm_Blocks

### Requirement 2: Dorm Block Management

**User Story:** As a Proctor Head, I want to register and manage dormitory buildings (blocks), so that I can organize the physical structure of the dormitory system.

#### Acceptance Criteria

1. THE System SHALL allow Proctor_Head to create new Dorm_Blocks
2. WHEN creating a Dorm_Block, THE System SHALL require a unique block name
3. WHEN creating a Dorm_Block, THE System SHALL require a unique block code
4. WHEN creating a Dorm_Block, THE System SHALL allow specification of location/address
5. THE System SHALL allow Proctor_Head to update Dorm_Block information
6. THE System SHALL allow Proctor_Head to view all Dorm_Blocks
7. THE System SHALL allow Proctor_Head to deactivate Dorm_Blocks
8. THE System SHALL prevent deletion of Dorm_Blocks that have active room assignments

### Requirement 3: Student and Room Management

**User Story:** As a Proctor Head, I want to add and manage students and rooms, so that I can maintain accurate dormitory records.

#### Acceptance Criteria

1. THE System SHALL allow Proctor_Head to create student accounts
2. THE System SHALL allow Proctor_Head to update student information
3. THE System SHALL allow Proctor_Head to view all students
4. THE System SHALL allow Proctor_Head to filter students by Dorm_Block, room, or status
5. THE System SHALL allow Proctor_Head to create rooms within Dorm_Blocks
6. WHEN creating a room, THE System SHALL require room number, capacity, and floor
7. THE System SHALL allow Proctor_Head to update room information
8. THE System SHALL allow Proctor_Head to view all rooms
9. THE System SHALL allow Proctor_Head to filter rooms by Dorm_Block, status, or occupancy

### Requirement 4: Student Room Assignment

**User Story:** As a Proctor Head, I want to assign students to rooms manually or automatically, so that I can efficiently manage dormitory occupancy.

#### Acceptance Criteria

1. THE System SHALL allow Proctor_Head to manually assign a student to a specific room
2. WHEN manually assigning a student, THE System SHALL verify the room has available capacity
3. WHEN manually assigning a student, THE System SHALL verify gender restrictions are met
4. THE System SHALL allow Proctor_Head to initiate automatic room assignment
5. WHEN automatic assignment is initiated, THE System SHALL assign students based on gender, department, and year
6. WHEN automatic assignment is initiated, THE System SHALL respect room capacity limits
7. THE System SHALL allow Proctor_Head to preview automatic assignment results before confirming
8. THE System SHALL allow Proctor_Head to vacate a student from their current room
9. THE System SHALL update room occupancy counts when students are assigned or vacated

### Requirement 5: Exit Clearance Request Submission

**User Story:** As a Student, I want to submit exit requests with a list of items I am carrying, so that I can obtain proper clearance to leave the dormitory.

#### Acceptance Criteria

1. THE System SHALL provide an interface for Students to create Exit_Requests
2. WHEN a Student creates an Exit_Request, THE System SHALL require a list of items being carried
3. WHEN a Student creates an Exit_Request, THE System SHALL record the submission timestamp
4. THE System SHALL allow Students to specify the reason for exit
5. THE System SHALL allow Students to view their Exit_Request history in their dashboard
6. THE System SHALL display the current status of each Exit_Request (Pending, Approved, Rejected, Verified) in the student dashboard
7. WHEN a Student submits an Exit_Request, THE System SHALL set the initial status to "Pending"
8. THE System SHALL display the Verification_Code to the Student in their dashboard when the request is approved
9. THE System SHALL allow Students to track the approval status of their Exit_Requests in real-time
10. THE System SHALL display rejection reason to the Student if their Exit_Request is rejected

### Requirement 6: Exit Clearance Approval Workflow

**User Story:** As a Proctor Head (Dorm Admin), I want to review and approve exit requests from students, so that I can ensure proper supervision and security.

#### Acceptance Criteria

1. WHEN an Exit_Request is submitted by a Student, THE System SHALL notify the Proctor_Head (Dorm Admin)
2. THE System SHALL allow Proctor_Head to view all Exit_Requests
3. THE System SHALL allow Proctor_Head to approve or reject Exit_Requests
4. WHEN Proctor_Head approves an Exit_Request, THE System SHALL generate a unique Verification_Code
5. WHEN Proctor_Head rejects an Exit_Request, THE System SHALL update the status to "Rejected" and notify the Student with rejection reason
6. THE System SHALL display pending Exit_Requests in the Proctor_Head dashboard
7. THE System SHALL allow Proctor_Head to filter Exit_Requests by status, date, or student

### Requirement 7: Verification Code Generation and Management

**User Story:** As a system, I need to generate secure one-time verification codes for approved exit requests, so that gate guards can verify legitimate exits.

#### Acceptance Criteria

1. WHEN an Exit_Request receives final approval, THE System SHALL generate a unique alphanumeric Verification_Code
2. THE System SHALL ensure each Verification_Code is unique across all active Exit_Requests
3. THE System SHALL display the Verification_Code to the Student
4. THE System SHALL store the Verification_Code with the Exit_Request record
5. THE System SHALL set the Verification_Code status to "Active" upon generation
6. THE System SHALL include the generation timestamp with each Verification_Code
7. THE Verification_Code SHALL be at least 6 characters in length

### Requirement 8: Gate Verification System

**User Story:** As a Gate Guard, I want to verify exit clearance codes, so that I can confirm students have proper authorization to leave with their items.

#### Acceptance Criteria

1. THE System SHALL provide an interface for Gate_Guards to enter Verification_Codes
2. WHEN a Gate_Guard enters a Verification_Code, THE System SHALL validate the code against active Exit_Requests
3. WHEN a valid Verification_Code is entered, THE System SHALL display the Student name, items list, and approval details
4. WHEN a valid Verification_Code is verified, THE System SHALL mark the code as "Used"
5. WHEN a Verification_Code is marked as "Used", THE System SHALL prevent further verification attempts with that code
6. WHEN an invalid Verification_Code is entered, THE System SHALL display an error message
7. WHEN a used Verification_Code is entered, THE System SHALL display a message indicating the code has already been used
8. THE System SHALL record the verification timestamp when a Verification_Code is used

### Requirement 9: Exit Clearance History Tracking

**User Story:** As a Proctor Head (Dorm Admin), I want to view complete exit clearance history, so that I can audit dormitory security and student movements.

#### Acceptance Criteria

1. THE System SHALL maintain a complete history of all Exit_Requests
2. THE System SHALL record all status changes for each Exit_Request with timestamps
3. THE System SHALL record which Proctor_Head approved each Exit_Request
4. THE System SHALL allow Proctor_Head to filter Exit_Request history by date range
5. THE System SHALL allow Proctor_Head to filter Exit_Request history by Student
6. THE System SHALL allow Proctor_Head to filter Exit_Request history by status
7. THE System SHALL allow Proctor_Head to export Exit_Request history reports

### Requirement 10: Daily Attendance Recording

**User Story:** As a Proctor, I want to record daily student attendance in my assigned blocks, so that I can track student presence and identify absences.

#### Acceptance Criteria

1. THE System SHALL provide an interface for Proctors to record daily Attendance_Records
2. WHEN a Proctor records attendance, THE System SHALL display all Students assigned to rooms in their Dorm_Blocks
3. THE System SHALL allow Proctors to mark each Student as "Present" or "Absent"
4. WHEN a Proctor records attendance, THE System SHALL record the date and timestamp
5. THE System SHALL prevent duplicate Attendance_Records for the same Student on the same date
6. THE System SHALL allow Proctors to modify Attendance_Records for the current date
7. THE System SHALL prevent Proctors from modifying Attendance_Records from previous dates

### Requirement 11: Attendance Report Generation

**User Story:** As a Proctor Head, I want to generate attendance reports, so that I can monitor student presence patterns and identify chronic absences.

#### Acceptance Criteria

1. THE System SHALL allow Proctor_Head to generate Attendance_Record reports for any date range
2. THE System SHALL allow Proctor_Head to filter attendance reports by Dorm_Block
3. THE System SHALL allow Proctor_Head to filter attendance reports by Student
4. THE System SHALL calculate and display attendance percentage for each Student
5. THE System SHALL identify Students with attendance below a configurable threshold
6. THE System SHALL allow Proctor_Head to export attendance reports in CSV format
7. THE System SHALL display daily attendance summary statistics (total present, total absent)

### Requirement 12: Enhanced Maintenance Request Submission

**User Story:** As a Student, I want to submit maintenance requests for my room, so that facility issues can be addressed.

#### Acceptance Criteria

1. THE System SHALL allow Students to create Maintenance_Requests for their assigned room
2. WHEN a Student creates a Maintenance_Request, THE System SHALL require a description of the issue
3. WHEN a Student creates a Maintenance_Request, THE System SHALL allow selection of a maintenance category (Plumbing, Electrical, Furniture, Sanitation, Other)
4. WHEN a Student creates a Maintenance_Request, THE System SHALL allow optional photo attachments
5. WHEN a Student submits a Maintenance_Request, THE System SHALL set the initial status to "Pending"
6. THE System SHALL allow Students to view their Maintenance_Request history
7. THE System SHALL display the current status of each Maintenance_Request

### Requirement 13: Maintenance Request Approval Workflow

**User Story:** As a Proctor, I want to review and approve maintenance requests before they reach maintenance staff, so that I can verify legitimate issues and prioritize urgent repairs.

#### Acceptance Criteria

1. WHEN a Maintenance_Request is submitted by a Student in a Proctor's assigned Dorm_Block, THE System SHALL notify the Proctor
2. THE System SHALL allow Proctors to view pending Maintenance_Requests from their assigned Dorm_Blocks
3. THE System SHALL allow Proctors to approve or reject Maintenance_Requests
4. WHEN a Proctor approves a Maintenance_Request, THE System SHALL forward the request to Proctor_Head for final approval
5. WHEN a Proctor rejects a Maintenance_Request, THE System SHALL update the status to "Rejected" and notify the Student with rejection reason
6. THE System SHALL allow Proctor_Head to approve Maintenance_Requests after Proctor approval
7. WHEN Proctor_Head approves a Maintenance_Request, THE System SHALL update the status to "Approved" and make it visible to Maintenance Staff
8. THE System SHALL allow Proctor_Head to override Proctor rejections and approve Maintenance_Requests directly
9. THE System SHALL prevent Maintenance Staff from viewing Maintenance_Requests with status "Pending" or "Rejected"

### Requirement 14: Maintenance Request Status Tracking

**User Story:** As a Maintenance Staff member, I want to update maintenance request status as I work on them, so that students and administrators can track repair progress.

#### Acceptance Criteria

1. THE System SHALL display only approved Maintenance_Requests to Maintenance Staff
2. THE System SHALL allow Maintenance Staff to update Maintenance_Request status to "In Progress"
3. WHEN Maintenance Staff updates a Maintenance_Request to "In Progress", THE System SHALL record the start timestamp
4. THE System SHALL allow Maintenance Staff to update Maintenance_Request status to "Completed"
5. WHEN Maintenance Staff updates a Maintenance_Request to "Completed", THE System SHALL record the completion timestamp
6. THE System SHALL allow Maintenance Staff to add work notes to Maintenance_Requests
7. WHEN a Maintenance_Request status changes, THE System SHALL notify the Student who submitted the request

### Requirement 15: Material Inventory Management

**User Story:** As a Proctor Head, I want to track materials assigned to each room, so that I can maintain accurate inventory records and identify missing items.

#### Acceptance Criteria

1. THE System SHALL maintain a list of Material_Items for each room
2. THE System SHALL allow Proctor_Head to add Material_Items to a room inventory
3. WHEN adding a Material_Item, THE System SHALL require item type (chair, table, locker, bed, desk, wardrobe, etc.)
4. WHEN adding a Material_Item, THE System SHALL require quantity
5. WHEN adding a Material_Item, THE System SHALL require condition (Good, Fair, Damaged, Missing)
6. THE System SHALL allow Proctor_Head to update Material_Item condition
7. THE System SHALL allow Proctor_Head to update Material_Item quantity
8. THE System SHALL allow Proctor_Head to remove Material_Items from room inventory
9. THE System SHALL record the date when each Material_Item was added to a room

### Requirement 16: Material Inventory Viewing

**User Story:** As a Student, I want to view the materials assigned to my room, so that I can verify the inventory and report discrepancies.

#### Acceptance Criteria

1. THE System SHALL allow Students to view Material_Items assigned to their room
2. THE System SHALL display Material_Item type, quantity, and condition for each item
3. THE System SHALL display the date each Material_Item was added to the room
4. THE System SHALL prevent Students from viewing Material_Items for rooms they are not assigned to
5. THE System SHALL allow Proctors to view Material_Items for all rooms in their assigned Dorm_Blocks
6. THE System SHALL allow Proctor_Head to view Material_Items for all rooms

### Requirement 17: Announcement Creation and Distribution

**User Story:** As a Proctor Head, I want to send announcements to students, so that I can communicate important information about dormitory policies and events.

#### Acceptance Criteria

1. THE System SHALL allow Proctor_Head to create Announcements
2. WHEN creating an Announcement, THE System SHALL require a title
3. WHEN creating an Announcement, THE System SHALL require message content
4. THE System SHALL allow Proctor_Head to target Announcements to specific Dorm_Blocks
5. THE System SHALL allow Proctor_Head to target Announcements to all Students
6. WHEN an Announcement is created, THE System SHALL record the creation timestamp
7. WHEN an Announcement is created, THE System SHALL record the Proctor_Head who created it
8. THE System SHALL deliver Announcements to all targeted Students

### Requirement 18: Announcement Viewing

**User Story:** As a Student, I want to receive and view announcements from dormitory administration, so that I can stay informed about important information.

#### Acceptance Criteria

1. THE System SHALL display Announcements to Students in their assigned Dorm_Block
2. THE System SHALL display Announcements in reverse chronological order (newest first)
3. THE System SHALL allow Students to view Announcement history
4. THE System SHALL display the Announcement title, content, and creation date
5. THE System SHALL mark Announcements as "Read" when a Student views them
6. THE System SHALL display a count of unread Announcements to Students
7. THE System SHALL allow Students to search Announcements by keyword

### Requirement 19: Complaint Submission

**User Story:** As a Student, I want to submit complaints about dormitory issues, so that my concerns can be addressed by administration.

#### Acceptance Criteria

1. THE System SHALL allow Students to create Complaints
2. WHEN creating a Complaint, THE System SHALL require a subject
3. WHEN creating a Complaint, THE System SHALL require a description
4. WHEN creating a Complaint, THE System SHALL allow optional category selection (Facility, Roommate, Noise, Safety, Other)
5. WHEN a Student submits a Complaint, THE System SHALL set the initial status to "Submitted"
6. WHEN a Student submits a Complaint, THE System SHALL record the submission timestamp
7. THE System SHALL allow Students to view their Complaint history

### Requirement 20: Complaint Management

**User Story:** As a Proctor, I want to view and respond to complaints from students in my assigned blocks, so that I can address issues promptly.

#### Acceptance Criteria

1. WHEN a Complaint is submitted by a Student in a Proctor's assigned Dorm_Block, THE System SHALL notify the Proctor
2. THE System SHALL allow Proctors to view Complaints from their assigned Dorm_Blocks
3. THE System SHALL allow Proctors to update Complaint status to "Under Review"
4. THE System SHALL allow Proctors to update Complaint status to "Resolved"
5. THE System SHALL allow Proctors to add response notes to Complaints
6. THE System SHALL allow Proctor_Head to view all Complaints regardless of Dorm_Block
7. THE System SHALL allow Proctor_Head to update Complaint status
8. THE System SHALL allow Proctor_Head to add response notes to Complaints
9. WHEN a Complaint status changes, THE System SHALL notify the Student who submitted the Complaint

### Requirement 21: Role-Based Access Control for New Features

**User Story:** As a system administrator, I want to enforce proper access control for all new features, so that users can only access functionality appropriate to their role.

#### Acceptance Criteria

1. THE System SHALL restrict Exit_Request approval to Proctor_Head (Dorm Admin)
2. THE System SHALL restrict Verification_Code generation to the system after Proctor_Head approval
3. THE System SHALL restrict Attendance_Record creation to Proctors and Dorm Admin
4. THE System SHALL restrict Maintenance_Request approval to Proctors and Dorm Admin
5. THE System SHALL restrict Material_Item management to Dorm Admin
6. THE System SHALL restrict Announcement creation to Dorm Admin
7. THE System SHALL allow Students to view only their own Exit_Requests, Maintenance_Requests, and Complaints
8. THE System SHALL allow Proctors to view data only for their assigned Dorm_Blocks
9. THE System SHALL allow Dorm Admin to view all data across all Dorm_Blocks

### Requirement 22: Notification System Integration

**User Story:** As a user, I want to receive timely notifications about actions requiring my attention, so that I can respond promptly to requests and updates.

#### Acceptance Criteria

1. WHEN an Exit_Request is submitted, THE System SHALL notify the Proctor_Head (Dorm Admin)
2. WHEN an Exit_Request is approved by Proctor_Head, THE System SHALL notify the Student with the Verification_Code
3. WHEN an Exit_Request is rejected, THE System SHALL notify the Student with rejection reason
4. WHEN a Maintenance_Request is submitted, THE System SHALL notify the assigned Proctor
5. WHEN a Maintenance_Request is approved, THE System SHALL notify Maintenance Staff
6. WHEN a Maintenance_Request status changes, THE System SHALL notify the Student
7. WHEN an Announcement is created, THE System SHALL notify all targeted Students
8. WHEN a Complaint is submitted, THE System SHALL notify the assigned Proctor
9. WHEN a Complaint status changes, THE System SHALL notify the Student

### Requirement 23: Data Persistence and Integrity

**User Story:** As a system administrator, I want all new feature data to be reliably stored in Firestore, so that information is preserved and can be retrieved accurately.

#### Acceptance Criteria

1. THE System SHALL store Exit_Requests in a Firestore collection with fields: studentId, dormBlockId, items, reason, status, approvedBy, verificationCode, submittedAt, approvedAt, verifiedAt
2. THE System SHALL store Attendance_Records in a Firestore collection with fields: studentId, proctorId, date, status, recordedAt
3. THE System SHALL store Material_Items in a Firestore collection with fields: roomId, itemType, quantity, condition, addedAt, updatedAt
4. THE System SHALL store Announcements in a Firestore collection with fields: title, content, createdBy, targetBlocks, createdAt
5. THE System SHALL store Complaints in a Firestore collection with fields: studentId, subject, description, category, status, responseNotes, submittedAt, updatedAt
6. THE System SHALL store Proctor Dorm_Block assignments in the users collection with a dormBlocks array field
7. THE System SHALL ensure all timestamps are stored in ISO 8601 format
8. THE System SHALL validate all required fields before persisting data to Firestore
