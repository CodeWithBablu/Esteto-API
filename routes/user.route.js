import express from "express";
import userController from "../controllers/user.controller.js";
import verifyToken from "../middleware/verifyToken.js";
const router = express.Router();

router.get("/", userController.getUsers);

router.get("search/:id", verifyToken, userController.getUser);

router.get("/lastseen/:id", verifyToken, userController.getLastSeen);
router.post("/update-lastseen/:id", userController.updateLastSeen);

router.get("/profilePosts", verifyToken, userController.profilePosts);
router.get("/notification", verifyToken, userController.getNotificationCount);

router.put("/:id", verifyToken, userController.updateUser);

router.delete("/:id", verifyToken, userController.deleteUser);

export default router;
