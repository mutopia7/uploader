import express from "express";
import dotenv from "dotenv";
import prisma from "./config/db.js";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import expressSession from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import Prisma from "./config/db.js";
import passport from "./config/passport.js";
import flash from "connect-flash";

import router from "./routes/router.js";
import storageRouter from "./routes/storage.js";

dotenv.config();

const app = express();

// app.use(helmet());
// app.use(helmet())

// --- session setup (global) ---
app.use(
  expressSession({
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
    secret: "a santa at nasa",
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(Prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);




app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next) => {
    res.locals.user = req.user;
    next()
})


app.use(flash());

// flash middleware
app.use((req, res, next) => {
  res.locals.loginErrors = req.flash("loginErrors")[0] || {};
  res.locals.oldInput = req.flash("oldInput")[0] || {};
  res.locals.user = req.user; // اینم بذار اینجا سراسری
  next();
});



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


app.use("/storage", storageRouter);
app.use("/", router)




const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on Port:${PORT}`);
});
