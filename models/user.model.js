import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  lastSeenAt: {
    type: Date,
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }],
  savedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  }],
  chats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
