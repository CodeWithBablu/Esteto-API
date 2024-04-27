import mongoose from "mongoose";

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("db connection is a success"))
  .catch((err) => console.log(`db error occured : ${err}`));
