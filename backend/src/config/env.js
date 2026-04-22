import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const requiredVars = [
  "JWT_SECRET",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
];

// In serverless environment, some vars might be missing during build
const isServerless = process.env.VERCEL || process.env.NODE_ENV === 'production';

if (!isServerless) {
  for (const variableName of requiredVars) {
    if (!process.env[variableName]) {
      console.warn(`Warning: ${variableName} is not set in environment variables`);
    }
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  jwtSecret: process.env.JWT_SECRET || "fallback_secret_for_dev",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY,
};
