import express from "express";

// JSON body parser middleware for routes that need it
export const jsonParser = express.json({ limit: "1mb" });
