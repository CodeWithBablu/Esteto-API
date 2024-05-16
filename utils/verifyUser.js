import jwt from "jsonwebtoken";
import { handleError } from "../utils/responsehandlers.js";

const verifyUser = (token) => {
  let id;

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) return id;
    id = payload.id;
  });

  return id;
};

export default verifyUser;