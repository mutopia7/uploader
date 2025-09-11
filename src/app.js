import express from "express";
import dotenv from "dotenv";
import prisma from "./config/db.js";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";

import router from "./routes/router.js";

dotenv.config();

const app = express();

// app.use(helmet());


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// view engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// layouts
app.use(expressLayouts);
app.set("layout", "./layouts/main");

// public files
app.use(express.static(path.join(__dirname, "public")));

app.use("/", router)


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on Port:${PORT}`);
});
