import { title } from "process";
import prisma from "../config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new folder
async function createFolder(req, res) {
  const { name, parentId } = req.body;
  const folder = await prisma.folder.create({
    data: {
      name,
      parentId: parentId ? parseInt(parentId) : null,
    },
  });
  
  //After creating the folder, redirect to the same page.
  if (parentId) {
    res.redirect(`/storage/${parentId}`);
  } else {
    res.redirect(`/storage`);
  }
};


// Upload file
async function uploadFile(req, res) {
  const { folderId } = req.body;
  const file = await prisma.file.create({
    data: {
      name: req.file.originalname,
      path: req.file.path,
      folderId: folderId ? parseInt(folderId) : null,
    },
  });
  
  // After uploading the file, redirect it to the same folder.
  if (folderId) {
    res.redirect(`/storage/${folderId}`);
  } else {
    res.redirect(`/storage`);
  }
};


// Download file
async function downloadFile(req, res) {
  const fileId = parseInt(req.params.id);

  const file = await prisma.file.findUnique({
    where: { id: fileId },
  });

  if (!file) {
    return res.status(404).send("File not found");
  }

  const filePath = path.resolve(file.path);

  // Checking for file existence on disk
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File missing on server");
  }

  res.download(filePath, file.name);
}



// Get the contents of a folder (subfolders + files)
async function  getFolder(req, res) {
  const id = parseInt(req.params.id);
  const folder = await prisma.folder.findUnique({
    where: { id },
    include: {
      children: true,
      files: true,
    },
  });
  res.json(folder);
};


// Get the contents of the root (where parentId = null)
async function getRoot(req, res) {
  const folders = await prisma.folder.findMany({
    where: { parentId: null },
    include: { children: true, files: true },
  });
  const files = await prisma.file.findMany({
    where: { folderId: null },
  });
  res.json({ folders, files });
};

// When id does not exist (root)
async function uploadRender(req, res) {
    const folders = await prisma.folder.findMany({ where: { parentId: null } });
    const files = await prisma.file.findMany({ where: { folderId: null } });

    // Root breadcrumb is always a simple Home
    const breadcrumbs = []; 

    res.render("layouts/upload", { 
        folders, 
        files, 
        currentFolderId: null, 
        breadcrumbs,   
        title: "upload", 
        user: req.user 
    });
};


// When id exists
async function uploadRenderWithId(req, res) {
    const folderId = parseInt(req.params.id);

    const folder = await prisma.folder.findUnique({
        where: { id: folderId },
        include: { children: true, files: true },
    });

    // Create breadcrumbs up to the root
    const breadcrumbs = [];
    let current = folder;
    while (current) {
        breadcrumbs.unshift({ id: current.id, name: current.name });
        if (!current.parentId) break;
        current = await prisma.folder.findUnique({
            where: { id: current.parentId },
        });
    }

    res.render("layouts/upload", {
        folders: folder.children,
        files: folder.files,
        currentFolderId: folderId,
        breadcrumbs,  
        title: "upload",
        user: req.user
    });
}






export default {
    createFolder,
    uploadFile,
    getFolder,
    getRoot,
    uploadRender,
    uploadRenderWithId,
    downloadFile
}