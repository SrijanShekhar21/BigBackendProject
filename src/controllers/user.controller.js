import { asyncHandler } from "../utils/asyncHandler.js";
import connectDB from "../db/index.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const db = await connectDB();

const userProfilePage = asyncHandler(async (req, res) => {
  if (req.isAuthenticated()) {
    console.log(req.user);
    const result = await db.query(
      "SELECT * FROM users JOIN usercontents ON users.id = usercontents.userid WHERE users.id = $1;",
      [req.user.id]
    );
    console.log(result.rows);
    const profilePicURL = result.rows[0].profilepicurl;
    console.log("pic url: ", profilePicURL);
    res.status(200).render("userProfilePage.ejs", {
      name: req.user.name,
      profilePicURL: profilePicURL,
      id: req.user.id,
    });
  } else {
    console.log("Please Login first");
    res.redirect("/login");
  }
});

const userLogOut = (req, res) => {
  console.log(req.user);
  req.logout(function (err) {
    if (err) {
      return next(err);
    } else {
      res.redirect("/");
    }
  });
  console.log("Logged out!");
};

const changeProfilePic = asyncHandler(async (req, res) => {
  console.log(req.body.userid);
  // console.log(req.file.path);
  const localImagePath = req.file.path;
  const noPicURL =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  const profilePic = await uploadOnCloudinary(localImagePath);
  const profilePicURL = profilePic?.url || noPicURL;

  const result = await db.query(
    "UPDATE usercontents SET profilepicurl = $1 WHERE userid = $2 RETURNING *",
    [profilePicURL, req.body.userid]
  );
  console.log(result.rows);
  res.redirect("/users/");
});

const deleteProfilePic = asyncHandler(async (req, res) => {
  const noPicURL =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
  const result = await db.query(
    "UPDATE usercontents SET profilepicurl = $1 WHERE userid = $2 RETURNING *",
    [noPicURL, req.body.userid]
  );
  console.log(result.rows);
  res.redirect("/users/");
});

export { deleteProfilePic, changeProfilePic, userLogOut, userProfilePage };
