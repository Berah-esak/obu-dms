import compression from "compression";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";

// Import backend modules
import { connectDatabase } from "../backend/src/config/firebase.js";
import { errorHandler } from "../backend/src/middlewares/errorMiddleware.js";
import { notFoundHandler } from "../backend/src/middlewares/notFoundMiddleware.js";
import { appRouter } from "../backend/src/routes/index.js";

const app = express();

// Middleware setup
app.disable("x-powered-by");
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({ 
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(compression());
app.use(morgan("combined"));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Reduced for serverless
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Routes
app.use("/api", appRouter);
app.use(notFoundHandler);
app.use(errorHandler);

// Database connection cache
let dbConnected = false;

// Serverless function handler
export default async function handler(req, res) {
  try {
    // Initialize database connection once
    if (!dbConnected) {
      await connectDatabase();
      dbConnected = true;
    }

    // Handle the request
    return app(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}