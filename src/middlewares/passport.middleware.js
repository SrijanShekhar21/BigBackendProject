import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import connectDB from "../db/index.js";

const db = await connectDB();

passport.use(
  "local",
  new Strategy(async function verify(username, password, cb) {
    try {
      const result = await db.query("SELECT * FROM users WHERE username = $1", [
        username,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storesHashPassword = user.password;
        console.log("Stored pw: ", storesHashPassword);

        bcrypt.compare(password, storesHashPassword, (err, valid) => {
          if (err) {
            console.log("Error in comparing password", err);
            return cb(err);
          } else {
            if (valid) {
              return cb(null, user);
            } else {
              return cb(null, false);
            }
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

export { passport };
