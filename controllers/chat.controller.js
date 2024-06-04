import { Chat, Message } from "../models/chat.model.js";
import User from "../models/user.model.js";
import { success } from "../utils/responsehandlers.js";

//handler getChats
export const getChats = async (req, res, next) => {
  const tokenUserId = req.userId;

  try {
    const user = await User.findById(tokenUserId);
    if (user) {
      user.lastSeenAt = Date.now();
      await user.save();
    }
    const chats = await Chat.find({
      participants: { $in: [tokenUserId] }
    }).populate({
      path: 'participants',
      select: 'username email avatar lastSeenAt',
    }).populate({
      path: 'post',
      select: 'title images city address'
    });
    return res.status(200).json(success(200, "All Chats onboard 👏😍", chats));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all chats" });
  }
}

//handler getChat
export const getChat = async (req, res, next) => {
  const tokenUserId = req.userId;

  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      participants: { $in: [tokenUserId] },
    }).populate({
      path: 'messages',
      options: { sort: { createdAt: 1 } },
      populate: {
        path: 'sender',
        select: 'username avatar'
      }
    });

    if (!chat.seenBy.includes(tokenUserId))
      chat.seenBy.push(tokenUserId);
    await chat.save();

    return res.status(200).json(success(200, "Here is your chat 👏😍", chat));
  } catch (error) {
    res.status(500).json({ message: "Failed to get chat" });
  }
}

//handler addChat
export const addChat = async (req, res, next) => {
  const tokenUserId = req.userId;
  const { recieverId, postId } = req.body;
  try {
    // Check if a chat already exists between the two participants for the given post
    const existingChat = await Chat.findOne({
      participants: { $all: [tokenUserId, recieverId] },
      post: postId,
    });

    if (existingChat) return res.status(200).json(success(200, "Chat already exists", { newChatCreated: false, chatId: existingChat._id }));

    const newChat = await Chat.create({
      participants: [tokenUserId, recieverId],
      post: postId,
    });

    return res.status(200).json(success(200, "chat created successfully 👏😍", { newChatCreated: true, chatId: newChat._id }));

  } catch (error) {
    res.status(500).json({ message: "message haven't delivered" });
  }
}

//handler readChat
export const readChat = async (req, res, next) => {
  const tokenUserId = req.userId;
  let isSeenByUpdated = false;
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      participants: { $in: [tokenUserId] },
    });

    if (!chat.seenBy.includes(tokenUserId)) {
      chat.seenBy.push(tokenUserId);
      isSeenByUpdated = true;
    }
    await chat.save();

    return res.status(200).json(success(200, "Here is your chat 👏😍", { isSeenByUpdated }));
  } catch (error) {
    res.status(500).json({ message: "Failed to read chat" });
  }
}

export default { getChats, getChat, addChat, readChat }
