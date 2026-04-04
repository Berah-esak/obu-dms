import type { Student, Room, Dorm, MaintenanceRequest, RoomChangeRequest, DashboardSummary, Notification, AuditLog, FurnitureItem, Assignment, User } from '@/types/api';

export const mockDashboard: DashboardSummary = {
  totalStudents: 2847,
  totalRooms: 456,
  occupancyRate: 87.3,
  pendingMaintenance: 23,
  availableBeds: 182,
};

export const mockDorms: Dorm[] = [
  { id: 'dorm_001', name: 'Block A', code: 'BLK-A', address: 'North Campus', warden: 'Dr. Tadesse', floors: [1, 2, 3, 4] },
  { id: 'dorm_002', name: 'Block B', code: 'BLK-B', address: 'North Campus', warden: 'Mrs. Almaz', floors: [1, 2, 3] },
  { id: 'dorm_003', name: 'Block C', code: 'BLK-C', address: 'South Campus', warden: 'Mr. Kebede', floors: [1, 2, 3, 4, 5] },
  { id: 'dorm_004', name: 'Block D', code: 'BLK-D', address: 'South Campus', warden: 'Ms. Fatuma', floors: [1, 2, 3] },
];

export const mockRooms: Room[] = [
  { roomId: 'BLK-A-101', building: 'Block A', floor: 1, roomNumber: '101', type: 'Double', capacity: 4, currentOccupancy: 3, status: 'Occupied', genderRestriction: 'Male' },
  { roomId: 'BLK-A-102', building: 'Block A', floor: 1, roomNumber: '102', type: 'Triple', capacity: 6, currentOccupancy: 6, status: 'Occupied', genderRestriction: 'Male' },
  { roomId: 'BLK-A-201', building: 'Block A', floor: 2, roomNumber: '201', type: 'Double', capacity: 4, currentOccupancy: 0, status: 'Available', genderRestriction: 'Male' },
  { roomId: 'BLK-A-202', building: 'Block A', floor: 2, roomNumber: '202', type: 'Single', capacity: 2, currentOccupancy: 1, status: 'Occupied', genderRestriction: 'Male' },
  { roomId: 'BLK-B-101', building: 'Block B', floor: 1, roomNumber: '101', type: 'Double', capacity: 4, currentOccupancy: 4, status: 'Occupied', genderRestriction: 'Female' },
  { roomId: 'BLK-B-102', building: 'Block B', floor: 1, roomNumber: '102', type: 'Double', capacity: 4, currentOccupancy: 0, status: 'Under Maintenance', genderRestriction: 'Female' },
  { roomId: 'BLK-C-301', building: 'Block C', floor: 3, roomNumber: '301', type: 'Triple', capacity: 6, currentOccupancy: 5, status: 'Occupied', genderRestriction: 'Male' },
  { roomId: 'BLK-C-302', building: 'Block C', floor: 3, roomNumber: '302', type: 'Double', capacity: 4, currentOccupancy: 0, status: 'Available', genderRestriction: 'Female' },
];

export const mockStudents: Student[] = [
  { studentId: 'OBU12345', fullName: 'Alemu Bekele', gender: 'M', department: 'Computer Science', year: 3, phone: '0912345678', email: 'alemu.bekele@obu.edu.et' },
  { studentId: 'OBU12346', fullName: 'Bontu Tadese', gender: 'F', department: 'Computer Science', year: 3, phone: '0912345679', email: 'bontu.tadese@obu.edu.et' },
  { studentId: 'OBU12347', fullName: 'Chaltu Abera', gender: 'F', department: 'Biology', year: 2, phone: '0912345680', email: 'chaltu.abera@obu.edu.et' },
  { studentId: 'OBU12348', fullName: 'Dawit Hailu', gender: 'M', department: 'Engineering', year: 4, phone: '0912345681', email: 'dawit.hailu@obu.edu.et' },
  { studentId: 'OBU12349', fullName: 'Eyerusalem Fikadu', gender: 'F', department: 'Medicine', year: 5, phone: '0912345682', email: 'eyerusalem.fikadu@obu.edu.et' },
  { studentId: 'OBU12350', fullName: 'Fikru Gebre', gender: 'M', department: 'Law', year: 1, phone: '0912345683', email: 'fikru.gebre@obu.edu.et' },
];

export const mockMaintenanceRequests: MaintenanceRequest[] = [
  { id: 'mr_001', requestId: 'MR-2026-0001', room: mockRooms[0], category: 'Plumbing', description: 'Leaking faucet in bathroom', priority: 'High', status: 'Submitted', submittedBy: mockStudents[0], submittedAt: '2026-04-01T10:00:00Z', updatedAt: '2026-04-01T10:00:00Z', trackingNumber: 'TRK-001' },
  { id: 'mr_002', requestId: 'MR-2026-0002', room: mockRooms[1], category: 'Electrical', description: 'Power outlet not working', priority: 'Medium', status: 'In Progress', submittedBy: mockStudents[3], assignedTo: { id: 'usr_m1', username: 'tech.staff', fullName: 'Abdi Musa', email: 'abdi@obu.edu.et', role: 'maintenance', status: 'active' }, submittedAt: '2026-03-28T14:00:00Z', updatedAt: '2026-03-30T09:00:00Z', trackingNumber: 'TRK-002' },
  { id: 'mr_003', requestId: 'MR-2026-0003', room: mockRooms[4], category: 'Furniture', description: 'Broken desk chair', priority: 'Low', status: 'Completed', submittedBy: mockStudents[1], submittedAt: '2026-03-20T08:00:00Z', updatedAt: '2026-03-25T16:00:00Z', resolutionNotes: 'Chair replaced', trackingNumber: 'TRK-003' },
  { id: 'mr_004', requestId: 'MR-2026-0004', room: mockRooms[6], category: 'Sanitation', description: 'Blocked drain in shower', priority: 'High', status: 'Submitted', submittedBy: mockStudents[5], submittedAt: '2026-04-03T07:00:00Z', updatedAt: '2026-04-03T07:00:00Z', trackingNumber: 'TRK-004' },
];

export const mockRoomChangeRequests: RoomChangeRequest[] = [
  { id: 'rc_001', student: mockStudents[0], currentRoom: mockRooms[0], reason: 'conflict', description: 'Incompatible roommates', status: 'pending', submittedAt: '2026-04-02T09:00:00Z' },
  { id: 'rc_002', student: mockStudents[2], currentRoom: mockRooms[4], reason: 'health', description: 'Need ground floor due to injury', status: 'approved', submittedAt: '2026-03-28T11:00:00Z' },
  { id: 'rc_003', student: mockStudents[3], currentRoom: mockRooms[1], reason: 'maintenance', description: 'Persistent electrical issues', status: 'pending', submittedAt: '2026-04-01T15:00:00Z' },
];

export const mockNotifications: Notification[] = [
  { id: 'n_001', title: 'Room Assignment', message: 'You have been assigned to Room 101, Block A', isRead: false, createdAt: '2026-04-03T08:00:00Z', type: 'room_assignment' },
  { id: 'n_002', title: 'Maintenance Update', message: 'Your maintenance request MR-2026-0001 is being reviewed', isRead: false, createdAt: '2026-04-02T14:00:00Z', type: 'maintenance_update' },
  { id: 'n_003', title: 'Announcement', message: 'Water supply will be interrupted on April 5th for maintenance', isRead: true, createdAt: '2026-04-01T10:00:00Z', type: 'announcement' },
  { id: 'n_004', title: 'Room Change Approved', message: 'Your room change request has been approved', isRead: true, createdAt: '2026-03-30T16:00:00Z', type: 'room_change' },
];

export const mockAuditLogs: AuditLog[] = [
  { id: 'al_001', timestamp: '2026-04-03T10:30:00Z', user: 'admin.user', action: 'ASSIGN', entity: 'room', entityId: 'BLK-A-101', ipAddress: '192.168.1.100', status: 'SUCCESS', details: 'Assigned student OBU12345 to room BLK-A-101' },
  { id: 'al_002', timestamp: '2026-04-03T09:15:00Z', user: 'alemu.bekele', action: 'LOGIN', entity: 'auth', entityId: 'usr_12345', ipAddress: '192.168.1.50', status: 'SUCCESS', details: 'User login successful' },
  { id: 'al_003', timestamp: '2026-04-02T16:00:00Z', user: 'admin.user', action: 'APPROVE', entity: 'room_change', entityId: 'rc_002', ipAddress: '192.168.1.100', status: 'SUCCESS', details: 'Approved room change for OBU12347' },
  { id: 'al_004', timestamp: '2026-04-02T14:30:00Z', user: 'unknown', action: 'LOGIN', entity: 'auth', entityId: '', ipAddress: '10.0.0.55', status: 'FAILED', details: 'Invalid credentials attempt' },
];

export const mockFurniture: FurnitureItem[] = [
  { id: 'f_001', roomId: 'BLK-A-101', itemName: 'Bed', quantity: 4, condition: 'Good' },
  { id: 'f_002', roomId: 'BLK-A-101', itemName: 'Desk', quantity: 4, condition: 'Good' },
  { id: 'f_003', roomId: 'BLK-A-101', itemName: 'Chair', quantity: 3, condition: 'Fair' },
  { id: 'f_004', roomId: 'BLK-A-101', itemName: 'Wardrobe', quantity: 2, condition: 'Damaged' },
  { id: 'f_005', roomId: 'BLK-A-102', itemName: 'Bed', quantity: 6, condition: 'Good' },
  { id: 'f_006', roomId: 'BLK-A-102', itemName: 'Mattress', quantity: 6, condition: 'Fair' },
];

export const mockUsers: User[] = [
  { id: 'usr_001', username: 'admin.user', fullName: 'Admin User', email: 'admin@obu.edu.et', role: 'system_admin', status: 'active', lastLogin: '2026-04-03T10:00:00Z' },
  { id: 'usr_002', username: 'dorm.admin', fullName: 'Dorm Administrator', email: 'dorm.admin@obu.edu.et', role: 'dorm_admin', status: 'active', lastLogin: '2026-04-03T08:00:00Z' },
  { id: 'usr_003', username: 'maint.staff', fullName: 'Abdi Musa', email: 'abdi@obu.edu.et', role: 'maintenance', status: 'active', lastLogin: '2026-04-02T07:00:00Z' },
  { id: 'usr_004', username: 'mgmt.user', fullName: 'Management User', email: 'mgmt@obu.edu.et', role: 'management', status: 'active', lastLogin: '2026-04-01T09:00:00Z' },
  { id: 'usr_005', username: 'alemu.bekele', fullName: 'Alemu Bekele', email: 'alemu.bekele@obu.edu.et', role: 'student', status: 'active', lastLogin: '2026-04-03T09:15:00Z', studentId: 'OBU12345' },
];
