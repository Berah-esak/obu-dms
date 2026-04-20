import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import { User } from "./models/User.js";
import { Dorm } from "./models/Dorm.js";
import { Room } from "./models/Room.js";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/odu-dms");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await User.deleteMany();
    await Dorm.deleteMany();
    await Room.deleteMany();

    const hashedPassword = await bcrypt.hash("Admin@1234", 10);

    const createdUsers = await User.insertMany([
      {
        fullName: "System Admin",
        username: "admin",
        email: "admin@odu.edu",
        password: hashedPassword,
        role: "System Admin",
        status: "Active",
      },
      {
        fullName: "Warden Jane",
        username: "warden_jane",
        email: "jane@odu.edu",
        password: hashedPassword,
        role: "Dorm Admin",
        status: "Active",
      },
      {
        fullName: "Maintenance Mark",
        username: "maint_mark",
        email: "mark@odu.edu",
        password: hashedPassword,
        role: "Maintenance Staff",
        status: "Active",
      },
      {
        fullName: "Student Sam",
        username: "sam.student",
        email: "sam@student.odu.edu",
        password: hashedPassword,
        role: "Student",
        studentId: "STU001",
        gender: "M",
        status: "Active",
      },
      {
        fullName: "Student Sally",
        username: "sally.student",
        email: "sally@student.odu.edu",
        password: hashedPassword,
        role: "Student",
        studentId: "STU002",
        gender: "F",
        status: "Active",
      },
    ]);

    const createdDorms = await Dorm.insertMany([
      {
        name: "North Hall",
        code: "NH",
        location: "North Campus",
        totalCapacity: 100,
        currentOccupancy: 0,
        status: "Active",
        floors: [1],
      },
      {
        name: "South Hall",
        code: "SH",
        location: "South Campus",
        totalCapacity: 100,
        currentOccupancy: 0,
        status: "Active",
        floors: [1],
      },
    ]);

    const roomsToInsert = [];
    for (let i = 1; i <= 5; i++) {
       roomsToInsert.push({
           dormId: createdDorms[0]._id,
           floor: 1,
           roomNumber: `N-10${i}`,
           type: "Double",
           capacity: 2,
           genderRestriction: "Male",
           status: "Available"
       });
       roomsToInsert.push({
           dormId: createdDorms[1]._id,
           floor: 1,
           roomNumber: `S-10${i}`,
           type: "Double",
           capacity: 2,
           genderRestriction: "Female",
           status: "Available"
       });
    }

    const createdRooms = await Room.insertMany(roomsToInsert);

    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

connectDB().then(importData);
