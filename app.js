import "dotenv/config";
import "./utils/db.js";
import express from "express";
import cookieParser from "cookie-parser";

import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import testRoute from "./routes/test.route.js";

// import postRoute from "./routes/post.route.js";
const app = express();
app.use(cookieParser());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/test", testRoute);

app.use((err, req, res, next) => {
  const statuscode = err.statuscode || 500;
  const message = err.message || "internal server error";
  return res.status(statuscode).json({
    success: false,
    statuscode,
    message,
  });
});

app.listen(PORT, () => console.log(`Server running on port : ${PORT}`));
