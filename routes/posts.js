<<<<<<< HEAD
import express from "express"; 
import { getPostsByRegion, getFeedPosts, getUserPosts, likePost, savePost, sharePost, deletePost, getAllPosts } from "../controllers/posts.js"; 
import { getLikedPosts, getSavedPosts, getSharedPosts, updatePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js"; 
=======
import express from "express"; // ייבוא של ספריית express
import { getPostsByRegion, getFeedPosts, getUserPosts, likePost, savePost, sharePost, deletePost } from "../controllers/posts.js"; // ייבוא הפונקציות מהקונטרולרים של הפוסטים
import { getLikedPosts, getSavedPosts, getSharedPosts, updatePost} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js"; // ייבוא פונקציית אמצע (middleware) לאימות אסימוני
>>>>>>> 9faf482ac37890432b5dc8c7e8f694eaa9a327c0

const router = express.Router(); 

/* READ */
// מסלול שמחזיר את כל הפוסטים בפיד למשתמשים רשומים
router.get("/", verifyToken, getFeedPosts); 

<<<<<<< HEAD
// מסלול שמחזיר את כל הפוסטים לאורחים (חיפוש כללי)
router.get("/guest", getAllPosts); 

// הבאת פוסטים לפי אזור - גישה פתוחה למשתמשים לא רשומים
router.get("/region", getPostsByRegion);
=======
//הבאת תמונות לפי אזור
router.get("/region", verifyToken, getPostsByRegion); // מסלול חדש לקבלת פוסטים לפי אזור
>>>>>>> 9faf482ac37890432b5dc8c7e8f694eaa9a327c0

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