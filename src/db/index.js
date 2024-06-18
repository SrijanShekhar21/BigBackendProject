import pg from "pg";
import env from "dotenv";
env.config();

const connectDB = async () => {
  try {
    const db = new pg.Client({
      user: process.env.PG_USER,
      host: process.env.PG_HOST,
      database: process.env.PG_DATABASE,
      password: process.env.PG_PASSWORD,
      port: process.env.PG_PORT,
    });
    await db.connect();
    console.log(`postgreSQL connected !! DB Host: ${db.host}`);
    return db;
  } catch (error) {
    console.log("Error: ", error);
    process.exit(1);
  }
};

export default connectDB;
