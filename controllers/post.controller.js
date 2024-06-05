import Post from "../models/post.model.js";
import PostDetail from "../models/postdetail.model.js";
import User from "../models/user.model.js";

import { handleError, success } from "../utils/responsehandlers.js";
import verifyUser from "../utils/verifyUser.js";

export const getPosts = async (req, res, next) => {
  const query = req.query;
  const token = req.cookies.token;
  let userId;

  const queryConditions = {};

  if (query.type)
    queryConditions.type = query.type;

  if (query.property)
    queryConditions.property = query.property;

  if (query.bedroom)
    queryConditions.bedroom = query.bedroom;

  try {
    let posts = await Post.find({
      $and: [
        {
          ...queryConditions,
          city: new RegExp(query.city.toLowerCase(), 'i')
        },
        {
          price: {
            $gte: parseInt(query.minPrice) || 1000,
            $lte: parseInt(query.maxPrice) || (query.type === "rent" ? 2000000 : 1000000000)
          }
        }
      ]
    });

    userId = verifyUser(token);
    if (posts) {

      if (userId) {
        const user = await User.findById(userId);
        const savedPost = user.savedPosts;
        posts = posts.map((post) => {
          if (savedPost.includes(post._id.toString()))
            return { ...post._doc, isSaved: true }
          else
            return { ...post._doc, isSaved: false }
        })
      }
      else
        posts = posts.map((post) => ({ ...post._doc, isSaved: false }))
    };


    // setTimeout(() => {
    return res.status(200).json(success(200, "All posts onboard sir 👏😍", posts));
    // }, 3000);
  } catch (error) {
    res.status(500).json({ message: "Failed to get the posts" });
  }
}


export const getPost = async (req, res, next) => {
  const id = req.params.id;
  const token = req.cookies.token;
  let userId;
  let isSaved;
  try {
    let post = await Post.findById(id);
    post = await (await post.populate('postdetail')).populate({ path: 'user', select: 'username avatar' });
    post = { ...post._doc, isSaved: false };

    userId = verifyUser(token);
    if (userId) {
      const user = await User.findById(userId);
      isSaved = user.savedPosts.includes(id);
      if (isSaved)
        post = { ...post, isSaved: true };
    }

    return res.status(200).json(success(200, "Here is your post 👏😍", post));
  } catch (error) {
    res.status(500).json({ message: "Failed to get the post" });
  }
}


export const createPost = async (req, res, next) => {
  try {
    const body = req.body;
    const tokenUserId = req.userId;
    const user = await User.findById(tokenUserId);

    const newPost = await Post.create({ ...body.post, user: tokenUserId });
    const newPostDetail = await PostDetail.create({ ...body.postdetail, post: newPost._id });

    newPost.postdetail = newPostDetail._id;
    await newPost.save();

    user.posts.push(newPost._id);
    await user.save();

    // await (await newPost.populate('postdetail')).populate('user');
    return res.status(200).json(success(200, "Post created successfully 👏😍"));
  } catch (error) {
    res.status(500).json({ message: "Failed to create post" });
  }
}


export const updatePost = (req, res, next) => {
  try {
    return res.status(200).json(success(200, "All posts onboard sir 👏😍"));
  } catch (error) {
    res.status(500).json({ message: "Failed to update post" });
  }
}


export const deletePost = async (req, res, next) => {
  const id = req.params.id; //post id
  const tokenUserId = req.userId;

  try {
    const post = await Post.findById(id);
    if (tokenUserId !== post.user._id.toString()) return next(handleError(403, "Not authorized"));

    await Post.findByIdAndDelete(id);
    return res.status(200).json(success(200, "Post deleted successfully 👏😍"));
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post" });
  }
}

//handler for savePost
export const savePost = async (req, res, next) => {
  const postId = req.body.postId;
  const token = req.cookies.token;
  let userId;
  let isSaved;

  try {
    userId = verifyUser(token);

    const user = await User.findById(userId);
    if (!user) return next(handleError(403, "Not authorized"));
    // check if it belongs to user
    const isUserPost = user.posts.includes(postId);
    if (isUserPost) return next(handleError(409, "you own the property 😆🤣"));

    isSaved = user.savedPosts.includes(postId);
    if (isSaved) {
      user.savedPosts = user.savedPosts.filter((post) => post._id.toString() !== postId);
    }
    else
      user.savedPosts.push(postId);

    await user.save();

    return res.status(200).json(success(200, `${isSaved ? "Post unsaved" : "Post saved successfully 👏😍"}`));
  } catch (error) {
    res.status(500).json({ message: `${isSaved ? "Failed to unsave post" : "Failed to save Post"}` });
  }
}

export default { getPost, getPosts, createPost, updatePost, deletePost, savePost };
