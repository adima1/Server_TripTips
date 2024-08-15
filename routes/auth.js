import express from "express";
import { login } from "../controllers/auth.js";
import { updateUser }from "../controllers/auth.js";
import { verifyToken } from "../middleware/auth.js";
import { deleteUser, deletePostsByUserId } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.patch("/:id",verifyToken, updateUser);
router.delete("/:id/deleteUser", verifyToken, deleteUser); 
router.delete("/:id/deletePosts", verifyToken, deletePostsByUserId); 



export default router;