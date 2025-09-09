import express from "express";
import dotenv from "dotenv";
import prisma from "./config/db.js";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import { fileURLToPath } from "url";

import router from "./routes/router.js";

dotenv.config();

const app = express();


// // Database connection test
// app.get("/health", async (req, res) => {
//   try {
//     await prisma.$connect();
//     res.json({ status: "ok", db: "connected" });
//   } catch (error) {
//     res.status(500).json({ status: "error", error: error.message });
//   }
// });


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// view engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// layouts
app.use(expressLayouts);
app.set("layout", "./layouts/main");

// public files
app.use(express.static(path.join(__dirname, "public")));

app.use("/", router)


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on Port:${PORT}`);
});
