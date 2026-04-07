# OBU Dormitory Management System (DMS) — Software Requirements Specification

> **Source:** Derived from `Requirement.docx` — "OBU Dormitory Management System SRS v1.0 (January 2026)"  
> **Scope:** Frontend functionality, user interactions, modules, and API contracts. Backend implementation details are intentionally excluded.  
> **Important:** Financial modules are **excluded** — dorms are provided **free of charge**.

---

## 1. Introduction

The Oda Bultum University Dormitory Management System (OBU-DMS) is a web-based platform that digitizes and automates the management of student housing. It covers the full lifecycle of student dormitory management — from allocation to move-out — across multiple roles.

---

## 2. Scope

### Included
- Frontend user interfaces (UI/UX)
- Functional requirements by module
- System modules from a user perspective
- API endpoints required by the frontend

### Excluded
- Backend architecture & implementation
- Database design
- Infrastructure/DevOps details
- All financial/payment-related functionality

---

## 3. User Roles

| Role | Description |
|------|-------------|
| **Student** | Resident students; can view assignment, submit maintenance & room change requests |
| **Dorm Administrator** | Manages day-to-day dorm operations; approves requests, assigns rooms |
| **Maintenance Staff** | Receives and resolves maintenance work orders |
| **Management** | Senior oversight; can view reports and analytics |
| **System Admin** | Full system control; manages users, roles, and audit logs |

---

## 4. Frontend Modules

### 4.1 Authentication Module

**Features:**
- Login with username + password
- Forgot password with email-based reset link
- Session auto-timeout after 30 minutes of inactivity
- Role-based redirect after login

**Required APIs:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | Authenticate user, receive JWT |
| `POST` | `/auth/forgot-password` | Request password reset email |
| `POST` | `/auth/reset-password` | Submit new password with reset token |
| `GET` | `/auth/validate-session` | Validate current session |
| `POST` | `/auth/logout` | Invalidate session token |

---

### 4.2 Student Module

**Features (Admin view):**
- Search and browse the full student directory
- Filter by department, year, or room
- View individual student profiles
- Assign students to rooms manually

**Features (Student view):**
- View own profile (read-only except emergency contact & bio)
- View room assignment, roommates, and building details

**Required APIs:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/students` | List all students (Admin) |
| `GET` | `/students/{id}` | Get a specific student's profile |
| `POST` | `/students` | Create/register a new student record |
| `GET` | `/students/{id}/assignment` | Get a student's room assignment |
| `GET` | `/student/profile` | Get own student profile (Student) |
| `GET` | `/student/assignment` | Get own room assignment (Student) |
| `GET` | `/students/unassigned` | List students without a room |

---

### 4.3 Room Management Module

**Features:**
- View all rooms with filter by building, floor, status, and gender
- View room details including current occupants
- Create new rooms and dorm buildings
- Update room capacity, type, status, and gender restriction
- View only available rooms for allocation purposes

**Required APIs:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/dorms` | List all dorm buildings |
| `POST` | `/dorms` | Create a new dorm building |
| `POST` | `/dorms/{dormId}/floors` | Add a floor to a dorm building |
| `GET` | `/rooms` | List all rooms (filterable) |
| `GET` | `/rooms/{roomId}` | Get room details |
| `PUT` | `/rooms/{roomId}` | Update room details |
| `POST` | `/rooms` | Create a new room |
| `GET` | `/rooms/{roomId}/occupants` | Get current occupants of a room |
| `GET` | `/rooms/available` | Filter only available rooms |

---

### 4.4 Room Allocation Module

**Features:**
- Run **automatic allocation** for a batch of students (by gender, year, department)
- Preview allocation results before committing
- Perform **manual allocation** (assign a specific student to a specific room)
- View unassigned students list
- Remove a student from a room (vacate)

**Allocation Rules:**
- Gender restriction must be respected (male rooms → male students only)
- Capacity must not be exceeded
- Students with pending change requests are excluded from bulk allocation

**Required APIs:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/allocation/eligible-students` | Get students eligible for allocation |
| `POST` | `/allocation/automatic` | Run batch auto-allocation |
| `POST` | `/allocation/manual` | Manually assign one student to a room |
| `DELETE` | `/assignments/{assignmentId}/vacate` | Remove student from room |

---

### 4.5 Room Change Request Module

**Features (Student):**
- Submit a room change request with a reason category and description
- Track the status of submitted requests (pending, approved, rejected)

**Features (Admin):**
- View all pending room change requests
- Approve: select a new room and confirm relocation
- Reject: provide a rejection reason
- Filter by status and reason

**Reason Categories:** `conflict`, `maintenance`, `health`, `other`

**Required APIs:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/room-change-requests` | Get own requests (Student) |
| `POST` | `/room-change-requests` | Submit a new request (Student) |
| `GET` | `/room-change-requests/pending` | Get all pending requests (Admin) |
| `PUT` | `/room-change-requests/{id}/approve` | Approve with new room assignment |
| `PUT` | `/room-change-requests/{id}/reject` | Reject with reason |

---

### 4.6 Maintenance Module

**Features (Student):**
- Submit a maintenance request (category, priority, description, optional photo)
- Track statuses: Submitted → In Progress → Completed / Rejected
- View tracking number for each request

**Features (Admin):**
- View all requests with filter by status, priority, building
- Assign requests to maintenance staff
- Reassign requests to different staff

**Features (Maintenance Staff):**
- View own assigned tasks
- Update status and add resolution notes
- Add internal/external notes to requests

**Categories:** `Plumbing`, `Electrical`, `Furniture`, `Sanitation`, `Other`  
**Priorities:** `Low`, `Medium`, `High`  
**Statuses:** `Submitted`, `In Progress`, `Completed`, `Rejected`

**Required APIs:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/student/maintenance-requests` | View own requests (Student) |
| `POST` | `/maintenance-requests` | Submit a new request |
| `GET` | `/maintenance-requests` | List all requests (Admin, with filters) |
| `GET` | `/maintenance-requests/assigned` | Get tasks assigned to me (Staff) |
| `PUT` | `/maintenance-requests/{id}/status` | Update status + resolution notes |
| `POST` | `/maintenance-requests/{id}/notes` | Add note to a request |
| `PUT` | `/maintenance-requests/{id}/reassign` | Reassign to another staff member |

---

### 4.7 Inventory Module

**Features:**
- **Furniture:** Track beds, desks, chairs, wardrobes, shelves, mattresses per room. Record condition (Good/Fair/Damaged/Missing).
- **Linen:** Issue sheets, blankets, pillowcases, towels to students. Record issue date, expected return, and actual return. Note any damages.
- **Keys:** Issue room keys (with key code). Record return and condition. View missing keys report.

**Required APIs:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/inventory/furniture/room/{roomId}` | Get furniture for a specific room |
| `POST` | `/inventory/furniture` | Add a furniture item to a room |
| `PUT` | `/inventory/furniture/{itemId}` | Update furniture quantity/condition |
| `POST` | `/inventory/linen/issue` | Issue linen items to a student |
| `POST` | `/inventory/linen/return` | Record linen return (with damage note) |
| `POST` | `/inventory/keys/issue` | Issue a room key |
| `POST` | `/inventory/keys/return` | Record key return |
| `GET` | `/inventory/keys/missing` | Get report on missing/unrecovered keys |

---

### 4.8 Reporting & Analytics Module

**Features:**
- Dashboard statistics (total students, rooms, occupancy rate, pending maintenance, available beds)
- Occupancy reports filterable by date range, building, floor
- Student directory report (by department, year, building)
- Maintenance summary by category and average resolution time
- Room utilization rates per room
- Unassigned students report
- Inventory condition report
- Export any report as **PDF**, **XLSX**, or **CSV**

**Required APIs:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/reports/dashboard-summary` | Live dashboard metrics |
| `GET` | `/reports/occupancy` | Occupancy report (filterable) |
| `GET` | `/reports/student-directory` | Student directory report |
| `GET` | `/reports/maintenance-summary` | Maintenance category breakdown |
| `GET` | `/reports/room-utilization` | Per-room utilization stats |
| `GET` | `/reports/unassigned-students` | List of students without rooms |
| `GET` | `/reports/inventory-condition` | Inventory by condition breakdown |
| `POST` | `/reports/export` | Export report to file (PDF/XLSX/CSV) |

---

### 4.9 User Management Module

**Features (System Admin only):**
- View all users with filter by role and active status
- Create new users (Admin, Staff, Management)
- Update user details (name, email, role, status)
- Deactivate or reactivate user accounts
- Send password reset links to specific users
- View role permissions matrix

**Required APIs:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users` | List all users (with role/status filters) |
| `POST` | `/users` | Create a new user |
| `GET` | `/users/{userId}` | Get a specific user |
| `PUT` | `/users/{userId}` | Update user info/role/status |
| `POST` | `/users/{userId}/deactivate` | Deactivate user account |
| `POST` | `/users/{userId}/reactivate` | Reactivate user account |
| `POST` | `/users/{userId}/reset-password` | Send password reset link |
| `GET` | `/roles/permissions` | Get role permissions matrix |

---

### 4.10 Notification Module

**Features:**
- View personal notifications (in-app)
- Mark individual or all notifications as read
- Unread count badge in the header
- Admin can broadcast a notification to: all students, a specific building, a specific room, or a specific user

**Notification Types:** `room_assignment`, `room_change`, `maintenance_update`, `announcement`

**Required APIs:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/notifications` | Get own notifications (paged) |
| `GET` | `/notifications/unread-count` | Get unread badge count |
| `PUT` | `/notifications/{id}/read` | Mark single notification as read |
| `PUT` | `/notifications/read-all` | Mark all as read |
| `POST` | `/notifications/broadcast` | Send a broadcast (Admin only) |

---

### 4.11 Audit Log Module

**Features (System Admin only):**
- View full activity log with filters by date range, user, action type, and entity
- Paginated results
- Export logs to CSV

**Tracked Actions:** `CREATE`, `UPDATE`, `DELETE`, `LOGIN`, `LOGOUT`, `APPROVE`, `REJECT`, `ASSIGN`

**Required APIs:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/audit-logs` | Retrieve logs (paged, filterable) |
| `GET` | `/audit-logs/export` | Export filtered logs to CSV |

---

## 5. UI Requirements

### Dashboards (Role-Specific)
| Role | Dashboard Features |
|------|--------------------|
| **Student** | Room assignment card, maintenance requests, room change status, notification inbox |
| **Dorm Admin** | Occupancy stats, pending requests, room status overview, quick actions |
| **Maintenance Staff** | Assigned tasks queue, status update controls, notes |
| **Management** | High-level KPIs, reports, analytics charts |
| **System Admin** | All dashboards + user management + audit logs |

### Component Requirements
- Tables with **pagination** (all list views)
- Forms with **client-side validation**
- Notification panel with unread badge count
- Search & multi-filter bars
- Confirmation dialogs for destructive actions (deactivate, reject, vacate)
- Toast notifications for success/error states

### Accessibility
- Multi-language support: **English**, **Amharic**, **Afan Oromo**
- High contrast mode
- Keyboard navigation support

---

## 6. Performance Requirements

| Metric | Target |
|--------|--------|
| Page load time | < 3 seconds |
| Search response time | < 2 seconds |
| Concurrent user support | Optimized for high concurrency |

---

## 7. Security (Frontend Level)

- All requests require **JWT Bearer Token** (except login / password reset)
- **Role-based UI rendering**: components are shown/hidden based on user role
- **Input validation** on all forms before API calls
- Session expires after **30 minutes** of inactivity

---

## 8. Assumptions

- Backend APIs are reliable and follow the Swagger contract
- SIMS (Student Information Management System) integration is handled externally
- Users have basic digital literacy
- No payment or financial processing is required
