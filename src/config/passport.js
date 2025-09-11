import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import prisma from "./db.js"; 


passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        // Find user by username
        const user = await prisma.user.findUnique({
          where: { username }
        });

        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }

        // Password comparison
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize the user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize the user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
