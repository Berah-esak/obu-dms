import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { env } from "./env.js";
import { logger } from "../utils/logger.js";

let db;

export const connectDatabase = async () => {
  if (getApps().length === 0) {
    try {
      initializeApp({
        credential: cert({
          projectId: env.firebaseProjectId,
          clientEmail: env.firebaseClientEmail,
          // Replace escaped newlines in the private key (common when stored in .env)
          privateKey: env.firebasePrivateKey
            .replace(/\\n/g, "\n")
            .replace(/^"|"$/g, ""),
        }),
      });
      logger.info("Firebase Admin SDK initialized");
    } catch (error) {
      logger.error("Failed to initialize Firebase Admin SDK:", error);
      throw error;
    }
  }

  db = getFirestore();
  
  // Check if using Firestore emulator
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    logger.info(`Using Firestore Emulator at ${process.env.FIRESTORE_EMULATOR_HOST}`);
  }
  
  db.settings({ 
    ignoreUndefinedProperties: true,
    // Add timeout and retry settings
    preferRest: true, // Use REST API instead of gRPC (may help with firewall issues)
  });
  
  // Test the connection
  try {
    await db.collection('_health_check').limit(1).get();
    logger.info("Firestore connection established and verified");
  } catch (error) {
    logger.error("Firestore connection test failed:", error.message);
    logger.warn("Server will continue but database operations may fail");
  }
};

export const getDb = () => {
  if (!db) {
    throw new Error("Firestore not initialised — call connectDatabase() first");
  }
  return db;
};
