import express from "express";
import chatController from "../controllers/chat.controller.js";
import verifyToken from "../middleware/verifyToken.js";
const router = express.Router();

router.get("/", verifyToken, chatController.getChats);
router.get("/:id", verifyToken, chatController.getChat);
router.post("/addchat", verifyToken, chatController.addChat);
router.post("/read/:id", verifyToken, chatController.readChat);

export default router;
