import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return next(handleError(401, "unauthorized access!!"));

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) return next(handleError(403, "Token is not valid!!"));
    req.userId = payload.id;
    return res.status(200).json(success(200, "authrorized to go ahead"));
  });
};
