import "dotenv/config";
import "./utils/db.js";
import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";

import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";
import testRoute from "./routes/test.route.js";

var allowedOrigins = ["http://localhost:4000", "http://localhost:5173", "http://192.168.1.10:5173"];

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    console.log(origin);
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not ' +
        'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
app.use(cookieParser());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);
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
