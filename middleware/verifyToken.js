import jwt from "jsonwebtoken";
import { handleError } from "../utils/responsehandlers.js";

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return next(handleError(401, "Not authorized"));

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) return next(handleError(403, "Invalid token"));
    req.userId = payload.id;
    req.isAdmin = payload.isAdmin;
    return next();
  });
};

export default verifyToken;