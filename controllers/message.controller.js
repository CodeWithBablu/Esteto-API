import { Chat, Message } from "../models/chat.model.js";
import { success } from "../utils/responsehandlers.js";

//handler getChats
export const addMessage = async (req, res, next) => {
  const tokenUserId = req.userId;
  const chatId = req.params.chatId;
  const text = req.body.text;

  try {
    const chat = await Chat.findOne({
      _id: chatId,
      participants: { $in: [tokenUserId] }
    });

    if (!chat) return next(handleError(403, "Chat not found"));

    const message = await Message.create({
      text,
      chatId,
      sender: tokenUserId,
    });

    chat.messages.push(message._id);
    chat.seenBy = [tokenUserId];
    chat.latestMessage = text;
    await chat.save();

    return res.status(200).json(success(200, "Message sent successfully 👏😍", message));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all chats" });
  }
}


export default { addMessage }
