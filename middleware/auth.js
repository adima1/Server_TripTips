import jwt from "jsonwebtoken";

// Middleware לאימות טוקן
export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization"); // משיכת הטוקן מההדרים של הבקשה

    if (!token) {
      return res.status(403).send("Access Denied"); // אם אין טוקן, מחזיר שגיאת גישה נדחית
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft(); // ניקוי הטוקן מהתחילית "Bearer "
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET); // אימות הטוקן באמצעות מפתח הסודי של JWT
    req.user = verified; // שמירת נתוני המשתמש שנמצאו בטוקן בתוך הבקשה
    next(); // מעבר לפונקציה הבאה (פונקציית המדיולר)
  } catch (err) {
    res.status(500).json({ error: err.message }); // במקרה של שגיאה, מחזיר תגובת JSON עם הודעת שגיאה
  }
};
