import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";

// Configure storage
const storage = multer.memoryStorage(); // Store files in memory for uploading to cloud storage

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Only images (jpeg, jpg, png, gif) and PDF files are allowed"));
};

// Configure multer
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});
