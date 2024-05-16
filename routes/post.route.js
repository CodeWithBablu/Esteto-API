import express from "express";
import postController from "../controllers/post.controller.js";
import verifyToken from "../middleware/verifyToken.js";
const router = express.Router();

router.get("/", postController.getPosts);
router.get("/:id", postController.getPost);
router.post("/", verifyToken, postController.createPost);
router.put("/:id", verifyToken, postController.updatePost);
router.delete("/:id", verifyToken, postController.deletePost);
router.post("/save", verifyToken, postController.savePost);

export default router;
