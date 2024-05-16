import mongoose from "mongoose";

const postdetailSchema = new mongoose.Schema({
  desc: {
    type: String,
    required: true,
  },
  utilities: {
    type: String,
  },
  pet: {
    type: String,
  },
  income: {
    type: String,
  },
  size: {
    type: Number,
  },
  school: {
    type: Number,
  },
  bus: {
    type: Number,
  },
  restaurant: {
    type: Number,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
}, { timestamps: true });

const PostDetail = mongoose.model("PostDetail", postdetailSchema);
export default PostDetail;
