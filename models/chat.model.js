import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  seenBy: [{
    type: mongoose.Schema.Types.ObjectId,
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  }],
  latestMessage: String
}, { timestamps: true });

export const Chat = mongoose.model("Chat", chatSchema);

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  text: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  }
}, { timestamps: true });

export const Message = mongoose.model("Message", messageSchema);


