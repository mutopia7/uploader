import express from "express";
import dotenv from "dotenv";
import prisma from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection test
app.get("/health", async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ status: "ok", db: "connected" });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on Port:${PORT}`);
});
