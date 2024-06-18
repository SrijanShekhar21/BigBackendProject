import connectDB from "../db/index.js";
import { app } from "./app.js";
import env from "dotenv";
env.config();

const port = process.env.PORT;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("postgresql connection failed ", err);
  });
