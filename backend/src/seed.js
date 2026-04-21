import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import { ADMIN_CREDENTIALS } from "./config/constants.js";

dotenv.config();

const initFirebase = () => {
  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY
          ?.replace(/\\n/g, "\n")
          .replace(/^"|"$/g, ""),
      }),
    });
  }
  const db = getFirestore();
  db.settings({ ignoreUndefinedProperties: true });
  return db;
};

const seedData = async () => {
  const db = initFirebase();

  console.log("🔥 Connected to Firestore");

  const hashedPassword = await bcrypt.hash(ADMIN_CREDENTIALS.password, 10);
  const now = new Date();

  // ── Dorms ──────────────────────────────────────────────────────────────────
  const northRef = db.collection("dorms").doc();
  const southRef = db.collection("dorms").doc();

  const dormBatch = db.batch();
  dormBatch.set(northRef, {
    name: "North Hall",
    code: "NH",
    location: "North Campus",
    floors: [1],
    createdAt: now,
    updatedAt: now,
  });
  dormBatch.set(southRef, {
    name: "South Hall",
    code: "SH",
    location: "South Campus",
    floors: [1],
    createdAt: now,
    updatedAt: now,
  });
  await dormBatch.commit();
  console.log("✓ Dorms seeded");

  // ── Rooms ──────────────────────────────────────────────────────────────────
  const roomRefs = [];
  const roomBatch = db.batch();
  for (let i = 1; i <= 5; i++) {
    const northRoom = db.collection("rooms").doc();
    roomBatch.set(northRoom, {
      dormId: northRef.id,
      floor: 1,
      roomNumber: `N-10${i}`,
      type: "Double",
      capacity: 2,
      currentOccupancy: 0,
      genderRestriction: "Male",
      status: "Available",
      createdAt: now,
      updatedAt: now,
    });
    roomRefs.push({ ref: northRoom, dormId: northRef.id });

    const southRoom = db.collection("rooms").doc();
    roomBatch.set(southRoom, {
      dormId: southRef.id,
      floor: 1,
      roomNumber: `S-10${i}`,
      type: "Double",
      capacity: 2,
      currentOccupancy: 0,
      genderRestriction: "Female",
      status: "Available",
      createdAt: now,
      updatedAt: now,
    });
    roomRefs.push({ ref: southRoom, dormId: southRef.id });
  }
  await roomBatch.commit();
  console.log("✓ Rooms seeded");

  // ── Users (with room assignments for students) ────────────────────────────
  const users = [
    {
      fullName: ADMIN_CREDENTIALS.fullName,
      username: ADMIN_CREDENTIALS.username.toLowerCase(),
      email: ADMIN_CREDENTIALS.email.toLowerCase(),
      password: hashedPassword,
      role: ADMIN_CREDENTIALS.role,
      status: "Active",
    },
    {
      fullName: "Dorm Administrator",
      username: "dormadmin",
      email: "dormadmin@gmail.com",
      password: await bcrypt.hash("Dormadmin@2026", 10),
      role: "Dorm Admin",
      status: "Active",
    },
    {
      fullName: "Maintenance Mark",
      username: "maint_mark",
      email: "mark@gmail.com",
      password: hashedPassword,
      role: "Maintenance Staff",
      status: "Active",
    },
    {
      fullName: "Student Sam",
      username: "sam.student",
      email: "sam.student@gmail.com",
      password: hashedPassword,
      role: "Student",
      studentId: "STU001",
      status: "Active",
      roomId: roomRefs[0].ref.id, // Assign to first North Hall room
      dormBlockId: roomRefs[0].dormId,
    },
    {
      fullName: "Student Sally",
      username: "sally.student",
      email: "sally.student@gmail.com",
      password: hashedPassword,
      role: "Student",
      studentId: "STU002",
      status: "Active",
      roomId: roomRefs[5].ref.id, // Assign to first South Hall room
      dormBlockId: roomRefs[5].dormId,
    },
  ];

  const userBatch = db.batch();
  const userRefs = [];
  for (const user of users) {
    const ref = db.collection("users").doc();
    userBatch.set(ref, { ...user, createdAt: now, updatedAt: now });
    userRefs.push({ ref, user });
  }
  await userBatch.commit();
  console.log("✓ Users seeded");

  // ── Assignments (create proper assignment documents) ──────────────────────
  const assignmentBatch = db.batch();
  const studentUsers = userRefs.filter(u => u.user.role === "Student");
  
  for (const { ref: userRef, user } of studentUsers) {
    if (user.roomId) {
      const assignmentRef = db.collection("assignments").doc();
      assignmentBatch.set(assignmentRef, {
        student: userRef.id,
        room: user.roomId,
        dormBlock: user.dormBlockId,
        status: "Active",
        startDate: now,
        assignedBy: userRefs[0].ref.id, // Assigned by admin
        createdAt: now,
        updatedAt: now,
      });

      // Update room occupancy
      const roomRef = db.collection("rooms").doc(user.roomId);
      assignmentBatch.update(roomRef, {
        currentOccupancy: 1,
        status: "Occupied",
        updatedAt: now,
      });
    }
  }
  await assignmentBatch.commit();
  console.log("✓ Assignments seeded");

  console.log("\n" + "=".repeat(60));
  console.log("FIRESTORE SEEDING COMPLETED SUCCESSFULLY!");
  console.log("=".repeat(60));
  console.log("\n📋 DEFAULT ADMIN CREDENTIALS:");
  console.log(`   Username: ${ADMIN_CREDENTIALS.username}`);
  console.log(`   Password: ${ADMIN_CREDENTIALS.password}`);
  console.log(`   Email: ${ADMIN_CREDENTIALS.email}`);
  console.log(`   Role: ${ADMIN_CREDENTIALS.role}`);
  console.log("\n📋 OTHER TEST CREDENTIALS:");
  console.log("   Dorm Admin: dormadmin / Dormadmin@2026");
  console.log("   Maintenance: maint_mark / Admin@2026");
  console.log("   Student: sam.student / Admin@2026");
  console.log("\n" + "=".repeat(60) + "\n");
  process.exit(0);
};

seedData().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
