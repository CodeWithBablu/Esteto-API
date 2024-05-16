import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: {
    type: [String],
    require: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  bedroom: {
    type: Number,
    required: true,
  },
  bathroom: {
    type: Number,
    required: true,
  },
  latitude: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['buy', 'rent'],
  },
  property: {
    type: String,
    required: true,
    enum: ['apartment', 'house', 'condo', 'land'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  postdetail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PostDetail",
  },
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);
export default Post;
