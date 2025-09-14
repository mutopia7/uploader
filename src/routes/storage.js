// routes/storage.js

import express from "express";
import multer from "multer";
import uploadController from "../controllers/uploadController.js";
import { storage } from "../config/cloudinary.js";

const router = express.Router();

// File storage location
const upload = multer({ storage });


router.get("/", uploadController.uploadRender)
router.get("/:id", uploadController.uploadRenderWithId)

// Create a new folder
router.post("/folders", uploadController.createFolder);

// Upload file
router.post("/files", upload.single("file"), uploadController.uploadFile)

// Get the contents of a folder (subfolders + files)
router.get("/folders/:id/contents", uploadController.getFolder);

// Get the contents of the root (where parentId = null)
router.get("/root", uploadController.getRoot);

// download file
router.get("/download/:id", uploadController.downloadFile);

export default router;
