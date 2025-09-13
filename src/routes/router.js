import { Router } from "express";
import passport from "../config/passport.js";
import viewController from "../controllers/viewController.js";
import userController from "../controllers/userController.js";
import  signUpvalid from "../validators/signUpValidator.js"

const router = Router();

 router.post("/login", (req, res, next) => {
  passport.authenticate("local", function(err, user, info) {
    if (err) { return next(err); }

    if (!user) {
      // Creating Errors Objects for Each Field
      const errors = {};
      if (info.message === "Incorrect username") {
        errors.username = info.message;
      } else if (info.message === "Incorrect password") {
        errors.password = info.message;
      } else {
        errors.general = info.message;
      }

      // Save errors and previous username value for the form
      req.flash("loginErrors", errors);
      req.flash("oldInput", { username: req.body.username });

      return res.redirect("/login");
    }

    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect("/");
    });
  })(req, res, next);
});


router.get("/", viewController.indexRender);

router.get("/signup", viewController.signUpRender);
router.post("/signup", signUpvalid, userController.signUpPost);

router.get("/login", viewController.loginRender);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// 404 handler
router.use((req, res, next) => {
  res.status(404).render("layouts/404", { user: req.user, title: "404" });
});

// Global error handler
router.use((err, req, res, next) => {
  console.error(err.stack); // Server error log
  res.status(err.status || 500).render("layouts/error", {
    title: "Error",
    user: req.user,
    message: err.message || "Something went wrong on the server.",
    status: err.status || 500
  });
});

export default router;