import express from "express"; 
import { getPostsByRegion, getFeedPosts, getUserPosts, likePost, savePost, sharePost, deletePost, getAllPosts } from "../controllers/posts.js"; 
import { getLikedPosts, getSavedPosts, getSharedPosts, updatePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js"; 

const router = express.Router(); 

/* READ */
// מסלול שמחזיר את כל הפוסטים בפיד למשתמשים רשומים
router.get("/", verifyToken, getFeedPosts); 

// מסלול שמחזיר את כל הפוסטים לאורחים (חיפוש כללי)
router.get("/guest", getAllPosts); 

// הבאת פוסטים לפי אזור - גישה פתוחה למשתמשים לא רשומים
router.get("/region", getPostsByRegion);

// מסלול שמחזיר את כל הפוסטים של משתמש ספציפי לפי userId
router.get("/:userId/posts", verifyToken, getUserPosts); 

// מסלול שמחזיר את כל הפוסטים שאהבתי
router.get("/:userId/likes", verifyToken, getLikedPosts); 

// מסלול שמחזיר את כל הפוסטים ששמרתי
router.get("/:userId/saves", verifyToken, getSavedPosts); 

// מסלול שמחזיר את כל הפוסטים ששיתפתי
router.get("/:userId/shares", verifyToken, getSharedPosts); 

/* UPDATE */
// מסלול לעדכון הפוסט (לייק) לפי מזהה הפוסט
router.patch("/:id/like", verifyToken, likePost); 

/* UPDATE */
// מסלול לעדכון הפוסט (שמירה) לפי מזהה הפוסט
router.patch("/:id/save", verifyToken, savePost); 

/* UPDATE */
// מסלול לעדכון הפוסט (שיתוף) לפי מזהה הפוסט
router.patch("/:id/share", verifyToken, sharePost); 

router.delete("/:id/delete", verifyToken, deletePost); 

router.patch("/:id/update", verifyToken, updatePost); 

export default router;
