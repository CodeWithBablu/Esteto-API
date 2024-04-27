import brcypt from "bcrypt";
import { handleError, success } from "../utils/responsehandlers.js";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { MongooseError } from "mongoose";

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ username, email });

    if (user) return next(handleError(501, "User already exists 🤨"));

    const hashedPassword = await brcypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res
      .status(200)
      .json(success(200, "User successfully onboarded 👏😍"));
  } catch (error) {
    console.log(error);
    return next(handleError(500, "Failed to create user 🥵"));
  }
};

//// login handler
const login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    //check if user exists
    const user = await User.findOne({ username: username });

    if (!user) return next(handleError(401, "Invalid Crendentials 🥵"));

    //check if password is correct
    const ispasswordMatched = await brcypt.compare(password, user.password);
    if (!ispasswordMatched)
      return next(handleError(401, "Invalid Crendentials 🥵"));

    //generate cookie token and send to user
    const maxAge = 1000 * 60 * 10;

    const generatedAccessToken = jwt.sign(
      {
        id: user.id,
        isAdmin: "true",
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: maxAge }
    );

    const { password: hashPassword, ...data } = user._doc;
    res
      .cookie("token", generatedAccessToken, {
        httpOnly: true,
        // secure:true,
        maxAge: maxAge,
      })
      .status(200)
      .json(success(200, "Logged in successfully👏😍", data));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to login" });
  }
};

//// logout handler
const logout = (req, res) => {
  //db operations
  return res
    .clearCookie("token")
    .status(200)
    .json({ message: "Logout Successful" });
};

export default { register, login, logout };
