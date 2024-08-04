import express from "express"; // ייבוא של ספריית express
import { getFeedPosts, getUserPosts, likePost, savePost } from "../controllers/posts.js"; // ייבוא הפונקציות מהקונטרולרים של הפוסטים
import { getLikedPosts, getSavedPosts } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js"; // ייבוא פונקציית אמצע (middleware) לאימות אסימוני

const router = express.Router(); // יצירת ראוטר חדש של express

/* READ */
// מסלול שמחזיר את כל הפוסטים בפיד
router.get("/", verifyToken, getFeedPosts); 

// מסלול שמחזיר את כל הפוסטים של משתמש ספציפי לפי userId
router.get("/:userId/posts", verifyToken, getUserPosts); 

//מסלול שמחזיר את כל הפוסטים שאהבתי
router.get("/:userId/likes", verifyToken, getLikedPosts); 

//מסלול שמחזיר את כל הפוסטים ששמרתי
router.get("/:userId/saves", verifyToken, getSavedPosts); 



/* UPDATE */
// מסלול לעדכון הפוסט (לייק) לפי מזהה הפוסט
router.patch("/:id/like", verifyToken, likePost); 

/* UPDATE */
// מסלול לעדכון הפוסט (שמירה) לפי מזהה הפוסט
router.patch("/:id/save", verifyToken, savePost); 

export default router; // ייצוא הראוטר לשימוש בקבצים אחרים
