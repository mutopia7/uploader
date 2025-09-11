import Prisma from "../config/db.js";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";

async function signUpPost(req, res, next) {
  const { firstname, lastname, username, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Convert errors to object { fieldName: "error message" }
    const mappedErrors = {};
    errors.array().forEach(err => {
      mappedErrors[err.path] = err.msg;
    });
    return res.status(400).render("layouts/sign-up", {
      title: "sign-up",
      errors: mappedErrors,
      oldInput: { firstname, lastname, username },
      user: req.user
    });
  }

  try {
    // Password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creating a user with Prisma
    await Prisma.user.create({
      data: {
        firstName: firstname,
        lastName: lastname,
        username: username,
        password: hashedPassword
      }
    });

    res.redirect("/");
  } catch (err) {
    // If the username is duplicated, Prisma will give an error that we can handle.
    if (err.code === "P2002" && err.meta.target.includes("username")) {
      return res.status(400).render("layouts/sign-up", {
        title: "sign-up",
        errors: { username: "Username already exists" },
        oldInput: { firstname, lastname, username },
        user: req.user
      });
    }
    return next(err);
  }
}

export default {
    signUpPost
};
