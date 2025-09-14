// config/cloudinary.js

import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();
import path from "path";

cloudinary.config({ 
  secure: true // optional but recommended
});

// Define CloudinaryStorage for multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "my_uploads",       // folder name in Cloudinary
    resource_type: "auto",      // allow images, videos, other supported files
    allowed_formats: ["jpg","jpeg","png","gif","bmp","tiff","webp","heic","mp4","mov","avi","wmv","flv","mkv","webm"]
  }
});

export { cloudinary, storage };
