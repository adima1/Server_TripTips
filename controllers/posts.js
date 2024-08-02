import Post from "../models/Post.js"; // ייבוא המודל של הפוסטים

import User from "../models/User.js"; // ייבוא המודל של המשתמשים

 

/* CREATE */

// פונקציה ליצירת פוסט חדש

export const createPost = async (req, res) => {

  try {

    console.log("Received data:", req.body);

    const { userId, description, picturePath, title, location } = req.body; // קבלת הפרטים מהבקשה

    const user = await User.findById(userId); // מציאת המשתמש לפי מזהה

    const newPost = new Post({

      userId,

      firstName: user.firstName,

      lastName: user.lastName,

      description,

      //userPicturePath: user.picturePath,

      picturePath,

      title,

      location,

      likes: {}, // לייקים ריקים בהתחלה

      comments: [], // תגובות ריקות בהתחלה

    });

    await newPost.save(); // שמירת הפוסט החדש בבסיס הנתונים

 

    const post = await Post.find(); // מציאת כל הפוסטים

    res.status(201).json(post); // החזרת כל הפוסטים עם סטטוס 201 (נוצר)

  } catch (err) {

    console.error("Error creating post:", err);

    res.status(409).json({ message: err.message }); // החזרת שגיאה עם סטטוס 409 (ניגוד)

  }

};

 

/* READ */

// פונקציה לקבלת כל הפוסטים בפיד

export const getFeedPosts = async (req, res) => {

  try {

    const post = await Post.find(); // מציאת כל הפוסטים

    res.status(200).json(post); // החזרת כל הפוסטים עם סטטוס 200 (הצלחה)

  } catch (err) {

    res.status(404).json({ message: err.message }); // החזרת שגיאה עם סטטוס 404 (לא נמצא)

  }

};

 

// פונקציה לקבלת כל הפוסטים של משתמש ספציפי לפי מזהה משתמש

export const getUserPosts = async (req, res) => {

  try {

    const { userId } = req.params; // קבלת מזהה המשתמש מהפרמטרים של הבקשה

    const post = await Post.find({ userId }); // מציאת כל הפוסטים של המשתמש

    res.status(200).json(post); // החזרת כל הפוסטים עם סטטוס 200 (הצלחה)

  } catch (err) {

    res.status(404).json({ message: err.message }); // החזרת שגיאה עם סטטוס 404 (לא נמצא)

  }

};

 

/* UPDATE */

// פונקציה להוספת/הסרת לייק מפוסט

export const likePost = async (req, res) => {

  try {

    const { id } = req.params; // קבלת מזהה הפוסט מהפרמטרים של הבקשה

    const { userId } = req.body; // קבלת מזהה המשתמש מהגוף של הבקשה

    const post = await Post.findById(id); // מציאת הפוסט לפי מזהה

   

    if (!post) {

      return res.status(404).json({ message: "Post not found" });

    }

 

    const isLiked = post.likes.get(userId); // בדיקה אם המשתמש כבר עשה לייק לפוסט

 

    if (isLiked) {

      post.likes.delete(userId); // אם כבר עשה לייק, מסירים את הלייק

    } else {

      post.likes.set(userId, true); // אם לא עשה לייק, מוסיפים את הלייק

    }

 

    const updatedPost = await Post.findByIdAndUpdate(

      id,

      { likes: post.likes }, // עדכון הלייקים בפוסט

      { new: true } // מחזירים את הפוסט המעודכן

    );

 

    console.log("Post updated:", updatedPost);

    res.status(200).json(updatedPost); // החזרת הפוסט המעודכן עם סטטוס 200 (הצלחה)

  } catch (err) {

    console.error("Error liking post:", err);

    res.status(500).json({ message: err.message }); // החזרת שגיאה עם סטטוס 500 (שגיאת שרת)

  }

};