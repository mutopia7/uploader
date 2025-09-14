import prisma from "../config/db.js";
import { cloudinary } from "../config/cloudinary.js";

// ------------------------------
// Create a new folder
// ------------------------------
async function createFolder(req, res) {
  const { name, parentId } = req.body;
  const folder = await prisma.folder.create({
    data: {
      name,
      parentId: parentId ? parseInt(parentId) : null,
    },
  });

  // Redirect to current folder or root
  if (parentId) res.redirect(`/storage/${parentId}`);
  else res.redirect("/storage");
}

// ------------------------------
// Upload file
// ------------------------------
async function uploadFile(req, res) {
  const { folderId } = req.body;

  if (!req.file) {
    return res.status(400).send({ message: "No file uploaded" });
  }

  try {
    // req.file.path already contains Cloudinary URL from multer-storage-cloudinary
    const file = await prisma.file.create({
      data: {
        name: req.file.originalname,
        url: req.file.path,
        folderId: folderId ? parseInt(folderId) : null,
      },
    });

    if (folderId) res.redirect(`/storage/${folderId}`);
    else res.redirect("/storage");

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).send({ message: err.message, details: err });
  }
}

// ------------------------------
// Download file
// ------------------------------
async function downloadFile(req, res) {
  const fileId = parseInt(req.params.id);
  const file = await prisma.file.findUnique({ where: { id: fileId } });

  if (!file) return res.status(404).send("File not found");

  // Redirect directly to Cloudinary URL
  res.redirect(file.url);
}

// ------------------------------
// Get folder contents
// ------------------------------
async function getFolder(req, res) {
  const id = parseInt(req.params.id);
  const folder = await prisma.folder.findUnique({
    where: { id },
    include: { children: true, files: true },
  });
  res.json(folder);
}

// ------------------------------
// Get root contents
// ------------------------------
async function getRoot(req, res) {
  const folders = await prisma.folder.findMany({
    where: { parentId: null },
    include: { children: true, files: true },
  });
  const files = await prisma.file.findMany({ where: { folderId: null } });
  res.json({ folders, files });
}

// ------------------------------
// Render root folder
// ------------------------------
async function uploadRender(req, res) {
  const folders = await prisma.folder.findMany({ where: { parentId: null } });
  const files = await prisma.file.findMany({ where: { folderId: null } });
  const breadcrumbs = [];

  res.render("layouts/upload", {
    folders,
    files,
    currentFolderId: null,
    breadcrumbs,
    title: "upload",
    user: req.user,
  });
}

// ------------------------------
// Render specific folder by ID
// ------------------------------
async function uploadRenderWithId(req, res) {
  const folderId = parseInt(req.params.id);
  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
    include: { children: true, files: true },
  });

  // Build breadcrumbs
  const breadcrumbs = [];
  let current = folder;
  while (current) {
    breadcrumbs.unshift({ id: current.id, name: current.name });
    if (!current.parentId) break;
    current = await prisma.folder.findUnique({ where: { id: current.parentId } });
  }

  res.render("layouts/upload", {
    folders: folder.children,
    files: folder.files,
    currentFolderId: folderId,
    breadcrumbs,
    title: "upload",
    user: req.user,
  });
}

export default {
  createFolder,
  uploadFile,
  getFolder,
  getRoot,
  uploadRender,
  uploadRenderWithId,
  downloadFile,
};
