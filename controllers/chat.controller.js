import { Chat, Message } from "../models/chat.model.js";
import { success } from "../utils/responsehandlers.js";

//handler getChats
export const getChats = async (req, res, next) => {
  const tokenUserId = req.userId;

  try {
    const chats = await Chat.find({
      participants: { $in: [tokenUserId] }
    }).populate({
      path: 'participants',
      select: 'username avatar',
    });
    return res.status(200).json(success(200, "All Chats onboard 👏😍", chats));
  } catch (error) {
    console.log(error);
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
    console.log(error);
    res.status(500).json({ message: "Failed to get chat" });
  }
}

//handler addChat
export const addChat = async (req, res, next) => {
  const tokenUserId = req.userId;
  const { recieverId, postId } = req.body;
  try {
    const newChat = await Chat.create({
      participants: [tokenUserId, recieverId],
      post: postId,
    });

    return res.status(200).json(success(200, "chat created successfully 👏😍", newChat));
    // const docs = await Example.find({ myArray: { $all: array, $size: array.length } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "message haven't delivered" });
  }
}

//handler rreadChat
export const readChat = async (req, res, next) => {
  const tokenUserId = req.userId;

  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      participants: { $in: [tokenUserId] },
    });

    if (!chat.seenBy.includes(tokenUserId))
      chat.seenBy.push(tokenUserId);
    await chat.save();

    return res.status(200).json(success(200, "Here is your chat 👏😍", chat));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to read chat" });
  }
}

export default { getChats, getChat, addChat, readChat }
