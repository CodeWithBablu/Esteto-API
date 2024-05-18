import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import messageController from "../controllers/message.controller.js";
const router = express.Router();

router.post("/:chatId", verifyToken, messageController.addMessage);

export default router;
