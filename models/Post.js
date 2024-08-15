import mongoose from "mongoose"; // ייבוא ספריית mongoose לעבודה עם MongoDB

// הגדרת הסכימה של הפוסט (postSchema)
const postSchema = mongoose.Schema(
  {
    userId: {
      type: String, // סוג השדה הוא מחרוזת (String)
      required: true, // שדה חובה - חייב להיות מוגדר בעת יצירת מסמך חדש
    },
    firstName: {
      type: String, // סוג השדה הוא מחרוזת (String)
      required: true, // שדה חובה
    },
    lastName: {
      type: String, // סוג השדה הוא מחרוזת (String)
      required: true, // שדה חובה
    },
    title: String,
    location: String, // שדה אופציונלי - סוגו מחרוזת (String)
    description: String, // שדה אופציונלי - סוגו מחרוזת (String)
    picturePath: String, // שדה אופציונלי - סוגו מחרוזת (String), משמש לשמירת הנתיב לתמונה
    userPicturePath: String, // שדה אופציונלי - סוגו מחרוזת (String), משמש לשמירת הנתיב לתמונת המשתמש
    
    likes: {
      type: Map, // סוג השדה הוא מפה (Map) של מפתחות וערכים
      of: Boolean, // כל ערך במפה הוא מסוג Boolean (נכון/לא נכון)
    },

    saved: {
      type: Map, // סוג השדה הוא מפה (Map) של מפתחות וערכים
      of: Boolean, // כל ערך במפה הוא מסוג Boolean (נכון/לא נכון)
    },

    shared: {
      type: Map, // סוג השדה הוא מפה (Map) של מפתחות וערכים
      of: Boolean, // כל ערך במפה הוא מסוג Boolean (נכון/לא נכון)
    },

    comments: {
      type: Array, // סוג השדה הוא מערך (Array)
      default: [], // ברירת מחדל היא מערך ריק
    },

    userStars: {
      type: Number,
      default: 0
    },

    region: {
      type: String, // סוג השדה הוא מחרוזת (String)
      required: true, // שדה חובה - חייב להיות מוגדר בעת יצירת מסמך חדש
    },
  },
  { timestamps: true } // יוסיף באופן אוטומטי שדות createdAt ו-updatedAt לכל מסמך
);

// יצירת המודל של הפוסט (Post) על בסיס הסכימה (postSchema)
const Post = mongoose.model("Post", postSchema);

export default Post; // ייצוא המודל לשימוש בקבצים אחרים
