// Types derived from swagger-contract.yaml

export type UserRole = 'student' | 'dorm_admin' | 'maintenance' | 'management' | 'system_admin';
export type RoomStatus = 'Available' | 'Occupied' | 'Under Maintenance';
export type RoomType = 'Single' | 'Double' | 'Triple';
export type Gender = 'Male' | 'Female' | 'None';
export type MaintenanceCategory = 'Plumbing' | 'Electrical' | 'Furniture' | 'Sanitation' | 'Other';
export type MaintenancePriority = 'Low' | 'Medium' | 'High';
export type MaintenanceStatus = 'Submitted' | 'In Progress' | 'Completed' | 'Rejected';
export type RoomChangeReason = 'conflict' | 'maintenance' | 'health' | 'other';
export type RoomChangeStatus = 'pending' | 'approved' | 'rejected';
export type FurnitureCondition = 'Good' | 'Fair' | 'Damaged' | 'Missing';
export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'APPROVE' | 'REJECT' | 'ASSIGN';
export type NotificationType = 'room_assignment' | 'room_change' | 'maintenance_update' | 'announcement';

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  lastLogin?: string;
  studentId?: string;
}

export interface Student {
  studentId: string;
  fullName: string;
  gender: 'M' | 'F';
  department: string;
  year: number;
  phone: string;
  email: string;
}

export interface Dorm {
  id: string;
  name: string;
  code: string;
  address?: string;
  warden?: string;
  floors: number[];
}

export interface Room {
  roomId: string;
  building: string;
  floor: number;
  roomNumber: string;
  type: RoomType;
  capacity: number;
  currentOccupancy: number;
  status: RoomStatus;
  genderRestriction: Gender;
}

export interface Assignment {
  id: string;
  student: Student;
  room: Room;
  startDate: string;
  endDate?: string;
}

export interface RoomAssignment {
  room: Room;
  dorm: Dorm;
  building: string;
  floor: number;
  assignedDate: string;
  roommates: Student[];
}

export interface RoomChangeRequest {
  id: string;
  student: Student;
  currentRoom: Room;
  requestedRoom?: Room;
  reason: RoomChangeReason;
  description: string;
  status: RoomChangeStatus;
  submittedAt: string;
  rejectionReason?: string;
}

export interface MaintenanceRequest {
  id: string;
  requestId: string;
  room: Room;
  category: MaintenanceCategory;
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  submittedBy: Student;
  assignedTo?: User;
  submittedAt: string;
  updatedAt: string;
  resolutionNotes?: string;
  trackingNumber: string;
}

export interface FurnitureItem {
  id: string;
  roomId: string;
  itemName: string;
  quantity: number;
  condition: FurnitureCondition;
}

export interface LinenRecord {
  id: string;
  student: Student;
  items: string[];
  dateIssued: string;
  expectedReturnDate: string;
  dateReturned?: string;
  damages?: string;
}

export interface KeyRecord {
  id: string;
  student: Student;
  room: Room;
  keyCode: string;
  dateIssued: string;
  dateReturned?: string;
  condition?: string;
}

export interface DashboardSummary {
  totalStudents: number;
  totalRooms: number;
  occupancyRate: number;
  pendingMaintenance: number;
  availableBeds: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: NotificationType;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: AuditAction;
  entity: string;
  entityId: string;
  ipAddress: string;
  status: 'SUCCESS' | 'FAILED';
  details: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  role: UserRole;
  user: User;
}
