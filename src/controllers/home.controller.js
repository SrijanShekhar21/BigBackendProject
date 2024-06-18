import { asyncHandler } from "../utils/asyncHandler.js";
import connectDB from "../db/index.js";
import bcrypt from "bcrypt";
const saltRounds = 10;

const db = await connectDB();

//GET Routes
const homePage = (req, res) => {
  res.render("index.ejs");
};

const loginPage = (req, res) => {
  res.render("login.ejs");
};

const registerPage = (req, res) => {
  res.render("register.ejs");
};

//POST Routes
const userRegister = asyncHandler(async (req, res) => {
  console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;

  try {
    const checkResult = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (checkResult.rows.length > 0) {
      console.log("User already exists");
      res.redirect("/login");
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.log("Error in hashing: ", err);
        } else {
          const result1 = await db.query(
            "INSERT INTO users (username, password, name) VALUES ($1, $2, $3) RETURNING *",
            [username, hash, name]
          );

          const noPicURL =
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
          const result2 = await db.query(
            "INSERT INTO usercontents (userid, profilePicURL) VALUES ($1, $2) RETURNING *",
            [result1.rows[0].id, noPicURL]
          );

          console.log("User registered: ", result1.rows[0], result2.rows[0]);
          res.redirect("/login");
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
});

export { userRegister, homePage, loginPage, registerPage };
