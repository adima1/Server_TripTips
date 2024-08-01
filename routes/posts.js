import express from "express"; // ייבוא של ספריית express
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js"; // ייבוא הפונקציות מהקונטרולרים של הפוסטים
import { verifyToken } from "../middleware/auth.js"; // ייבוא פונקציית אמצע (middleware) לאימות אסימוני

const router = express.Router(); // יצירת ראוטר חדש של express

/* READ */
// מסלול שמחזיר את כל הפוסטים בפיד
router.get("/", verifyToken, getFeedPosts);
// מסלול שמחזיר את כל הפוסטים של משתמש ספציפי לפי userId
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
// מסלול לעדכון הפוסט (לייק) לפי מזהה הפוסט
router.patch("/:id/like", verifyToken, likePost);

export default router; // ייצוא הראוטר לשימוש בקבצים אחרים
