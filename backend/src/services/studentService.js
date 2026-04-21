import { assignmentRepository } from "../repositories/assignmentRepository.js";
import { maintenanceRepository } from "../repositories/maintenanceRepository.js";
import { studentRepository } from "../repositories/studentRepository.js";
import { roomRepository } from "../repositories/roomRepository.js";
import { ApiError } from "../utils/ApiError.js";

export const studentService = {
  getAssignment: async (userId) => {
    const student = await studentRepository.findByUserId(userId);
    if (!student) {
      throw new ApiError(404, "Student profile not found");
    }

    // Look for assignment document using user ID (not student.id)
    const assignment = await assignmentRepository.findActiveByStudent(userId);
    if (!assignment && student.roomId) {
      // Fetch room details for fallback assignment
      const roomDetails = await roomRepository.findById(student.roomId);
      
      return {
        id: student.id,
        student: userId,
        room: student.roomId,
        dormBlock: student.dormBlockId,
        status: "Active",
        startDate: student.createdAt || new Date(),
        roomDetails: roomDetails ? {
          id: roomDetails.id,
          roomNumber: roomDetails.roomNumber,
          type: roomDetails.type,
          capacity: roomDetails.capacity,
          currentOccupancy: roomDetails.currentOccupancy
        } : null
      };
    } else if (!assignment) {
      throw new ApiError(404, "No active assignment found");
    }

    // Fetch room details to include in response
    const roomDetails = await roomRepository.findById(assignment.room);
    
    return {
      ...assignment,
      roomDetails: roomDetails ? {
        id: roomDetails.id,
        roomNumber: roomDetails.roomNumber,
        type: roomDetails.type,
        capacity: roomDetails.capacity,
        currentOccupancy: roomDetails.currentOccupancy
      } : null
    };
  },

  getMaintenanceHistory: async (userId, query) => {
    const limit = Number(query.limit || 10);
    const offset = Number(query.offset || 0);

    const requests = await maintenanceRepository.findBySubmitter(userId, { limit, offset });
    return { requests, total: requests.length };
  },

  getProfile: async (userId) => {
    const student = await studentRepository.findByUserId(userId);
    if (!student) {
      throw new ApiError(404, "Student profile not found");
    }

    return student;
  },
};
