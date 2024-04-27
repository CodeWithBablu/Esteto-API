import { handleError, success } from "../utils/responsehandlers.js";
import jwt from "jsonwebtoken";

const shouldbeLoggedin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return next(handleError(401, "unauthorized access!!"));

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) return next(handleError(403, "Token is not valid!!"));

    return res.status(200).json(success(200, "authrorized to go ahead"));
  });
};

const shouldbeAdmin = (req, res) => {
  const token = req.cookies.token;
  if (!token) return next(handleError(401, "unauthorized access!!"));

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) return next(handleError(403, "Token is not valid!!"));
    console.log(payload);
    if (!payload.isAdmin)
      return next(handleError(403, "unauthorized access!!"));

    return res.status(200).json(success(200, "authrorized to go ahead"));
  });
};

export default { shouldbeAdmin, shouldbeLoggedin };
