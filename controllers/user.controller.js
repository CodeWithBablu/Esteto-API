import User from "../models/user.model.js";
import { handleError, success } from "../utils/responsehandlers.js";
import bcrypt from 'bcrypt';

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json(success(200, "got them👏😍", users));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get users!" });
  }
};


//// getUser handler
export const getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) return next(handleError(401, "user not exist 🥵"));

    res.status(200).json(success(200, "user found 👏😍", user));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get user" });
  }
};

//// getProfilePosts handler
export const profilePosts = async (req, res, next) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).populate(['posts', 'savedPosts']);
    let userPosts = user.posts;
    let savedPosts = user.savedPosts;
    savedPosts = savedPosts.map(post => ({ ...post._doc, isSaved: true }));
    setTimeout(() => {
      return res.status(200).json(success(200, "profile posts fetched succesfully 👏😍", { userPosts, savedPosts }));
    }, 3000)
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get the profile posts" });
  }
}


//// updateUser handler
export const updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const tokenUserId = req.userId;
    if (id !== tokenUserId) return next(handleError(401, "Not authorized"));
    const { password, avatar, ...rest } = req.body;

    let user = await User.findById(id);

    if (rest.username !== user.username && await User.findOne({ username: rest.username })) {
      return next(handleError(409, "username taken. Try another 😓"));
    }

    if (rest.email !== user.email && await User.findOne({ email: rest.email })) {
      return next(handleError(409, "Uh-oh! Email taken. Choose another 😓"));
    }

    let hashedPass = null;
    if (password) {
      hashedPass = await bcrypt.hash(password, 10);
    }

    user = await User.findByIdAndUpdate(id, {
      ...rest,
      ...(hashedPass && { password: hashedPass }),
      ...(avatar && { avatar })
    }, { new: true });

    const { password: _pass, ...userinfo } = user._doc;
    return res.status(200).json(success(200, "User updated successfully👏😍", userinfo));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update user" });
  }
};


export const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const tokenUserId = req.userId;
    if (id !== tokenUserId) return next(handleError(401, "Not authorized"));
    await User.findByIdAndDelete(id);

    return res.status(200).json(success(200, "User deleted successfully 😭🙏"));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

export default { getUser, getUsers, updateUser, deleteUser, profilePosts };
