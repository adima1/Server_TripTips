import Post from "../models/Post.js"; // ייבוא המודל של הפוסטים
import User from "../models/User.js"; // ייבוא המודל של המשתמשים

/* CREATE */
// פונקציה ליצירת פוסט חדש
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath, title, location, region } = req.body;
    const user = await User.findById(userId);

    console.log("Region received:", region); // הדפסת הערך של region

    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      title,
      location,
      region, // שמירת האזור בבסיס הנתונים
      likes: {},
      saved: {},
      shared: {},
      comments: [],
    });

    await newPost.save();
    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
// פונקציה לקבלת כל הפוסטים בפיד עם אפשרות לחיפוש לפי מונח חיפוש (searchTerm)
export const getAllPosts = async (req, res) => {
  try {
    const { searchTerm } = req.query; // קבלת מונח החיפוש מתוך פרמטרי ה-query של הבקשה

    let query = {};

    if (searchTerm) {
      query = {
        $or: [
          { title: { $regex: searchTerm, $options: "i" } }, // חיפוש בכותרת
          { description: { $regex: searchTerm, $options: "i" } }, // חיפוש בתיאור
          { firstName: { $regex: searchTerm, $options: "i" } }, // חיפוש בשם פרטי
          { lastName: { $regex: searchTerm, $options: "i" } }, // חיפוש בשם משפחה
          { location: { $regex: searchTerm, $options: "i" } }, // חיפוש במיקום
        ],
      };
    }

    const posts = await Post.find(query); // מציאת כל הפוסטים שמתאימים למונח החיפוש (אם קיים)
    res.status(200).json(posts); // החזרת כל הפוסטים עם סטטוס 200 (הצלחה)
  } catch (err) {
    res.status(404).json({ message: err.message }); // החזרת שגיאה עם סטטוס 404 (לא נמצא)
  }
};

/* READ */
// פונקציה לקבלת כל הפוסטים לפי region ומונח חיפוש (searchTerm)
export const getPostsByRegion = async (req, res) => {
  try {
    const { region, searchTerm } = req.query; // קבלת האזור והמונח חיפוש מתוך פרמטרי ה-query של הבקשה

    if (!region) {
      return res.status(400).json({ message: "Region is required" }); // החזרת שגיאה אם לא נבחר אזור
    }

    let query = { region };

    if (searchTerm) {
      query = {
        ...query,
        $or: [
          { title: { $regex: searchTerm, $options: "i" } }, // חיפוש בכותרת
          { description: { $regex: searchTerm, $options: "i" } }, // חיפוש בתיאור
          { firstName: { $regex: searchTerm, $options: "i" } }, // חיפוש בשם פרטי
          { lastName: { $regex: searchTerm, $options: "i" } }, // חיפוש בשם משפחה
          { location: { $regex: searchTerm, $options: "i" } }, // חיפוש במיקום
        ],
      };
    }

    const posts = await Post.find(query); // מציאת כל הפוסטים שמתאימים לאזור ולמונח החיפוש
    res.status(200).json(posts); // החזרת כל הפוסטים עם סטטוס 200 (הצלחה)
  } catch (err) {
    res.status(404).json({ message: err.message }); // החזרת שגיאה עם סטטוס 404 (לא נמצא)
  }
};

/* READ */
// פונקציה לקבלת כל הפוסטים בפיד עם אפשרות לחיפוש לפי מונח חיפוש (searchTerm)
export const getFeedPosts = async (req, res) => {
  try {
    const { searchTerm } = req.query; // קבלת מונח החיפוש מתוך פרמטרי ה-query של הבקשה

    let query = {};

    if (searchTerm) {
      query = {
        $or: [
          { title: { $regex: searchTerm, $options: "i" } }, // חיפוש בכותרת
          { description: { $regex: searchTerm, $options: "i" } }, // חיפוש בתיאור
          { firstName: { $regex: searchTerm, $options: "i" } }, // חיפוש בשם פרטי
          { lastName: { $regex: searchTerm, $options: "i" } },
          { location: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }

    const posts = await Post.find(query); // מציאת כל הפוסטים שמתאימים למונח החיפוש (אם קיים)
    res.status(200).json(posts); // החזרת כל הפוסטים עם סטטוס 200 (הצלחה)
  } catch (err) {
    res.status(404).json({ message: err.message }); // החזרת שגיאה עם סטטוס 404 (לא נמצא)
  }
};

/* READ */
// פונקציה לקבלת כל הפוסטים של משתמש ספציפי לפי מזהה משתמש ומונח חיפוש
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params; // קבלת מזהה המשתמש מהפרמטרים של הבקשה
    const { searchTerm } = req.query; // קבלת מונח החיפוש מתוך פרמטרי ה-query של הבקשה

    let query = { userId };

    if (searchTerm) {
      query = {
        ...query,
        $or: [
          { title: { $regex: searchTerm, $options: "i" } }, // חיפוש בכותרת
          { description: { $regex: searchTerm, $options: "i" } }, // חיפוש בתיאור
          { firstName: { $regex: searchTerm, $options: "i" } }, // חיפוש בשם פרטי
          { lastName: { $regex: searchTerm, $options: "i" } }, // חיפוש בשם משפחה
          { location: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }

    const posts = await Post.find(query); // מציאת כל הפוסטים של המשתמש שמתאימים למונח החיפוש (אם קיים)
    res.status(200).json(posts); // החזרת כל הפוסטים עם סטטוס 200 (הצלחה)
  } catch (err) {
    res.status(404).json({ message: err.message }); // החזרת שגיאה עם סטטוס 404 (לא נמצא)
  }
};

/* READ */
// פונקציה למציאת כל הפוסטים שהמשתמש עשה להם לייק
export const getLikedPosts = async (req, res) => {
  try {
    const { userId } = req.params; // קבלת מזהה המשתמש מהפרמטרים של הבקשה
    const { searchTerm } = req.query; // קבלת מונח החיפוש מתוך פרמטרי ה-query של הבקשה

    let query = { [`likes.${userId}`]: true };

    if (searchTerm) {
      query = {
        ...query,
        $or: [
          { title: { $regex: searchTerm, $options: "i" } }, // חיפוש בכותרת
          { description: { $regex: searchTerm, $options: "i" } }, // חיפוש בתיאור
          { firstName: { $regex: searchTerm, $options: "i" } }, // חיפוש בשם פרטי
          { lastName: { $regex: searchTerm, $options: "i" } }, // חיפוש בשם משפחה
          { location: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }

    const posts = await Post.find(query);
    res.status(200).json(posts); // החזרת כל הפוסטים עם סטטוס 200 (הצלחה)
  } catch (err) {
    res.status(404).json({ message: err.message }); // החזרת שגיאה עם סטטוס 404 (לא נמצא)
  }
};

/* READ */
// פונקציה למציאת כל הפוסטים שהמשתמש שמר
export const getSavedPosts = async (req, res) => {
  try {
    const { userId } = req.params; // קבלת מזהה המשתמש מהפרמטרים של הבקשה
    const { searchTerm } = req.query; // קבלת מונח החיפוש מתוך פרמטרי ה-query של הבקשה

    let query = { [`saved.${userId}`]: true };

    if (searchTerm) {
      query = {
        ...query,
        $or: [
          { title: { $regex: searchTerm, $options: "i" } }, // חיפוש בכותרת
          { description: { $regex: searchTerm, $options: "i" } }, // חיפוש בתיאור
          { firstName: { $regex: searchTerm, $options: "i" } }, // חיפוש בשם פרטי
          { lastName: { $regex: searchTerm, $options: "i" } },
          { location: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }

    const posts = await Post.find(query);
    res.status(200).json(posts); // החזרת כל הפוסטים עם סטטוס 200 (הצלחה)
  } catch (err) {
    res.status(404).json({ message: err.message }); // החזרת שגיאה עם סטטוס 404 (לא נמצא)
  }
};

/* READ */
// פונקציה למציאת כל הפוסטים שהמשתמש שיתף
export const getSharedPosts = async (req, res) => {
  try {
    const { userId } = req.params; // קבלת מזהה המשתמש מהפרמטרים של הבקשה
    const { searchTerm } = req.query; // קבלת מונח החיפוש מתוך פרמטרי ה-query של הבקשה

    let query = { [`shared.${userId}`]: true };

    if (searchTerm) {
      query = {
        ...query,
        $or: [
          { title: { $regex: searchTerm, $options: "i" } }, // חיפוש בכותרת
          { description: { $regex: searchTerm, $options: "i" } }, // חיפוש בתיאור
          { firstName: { $regex: searchTerm, $options: "i" } }, // חיפוש בשם פרטי
          { lastName: { $regex: searchTerm, $options: "i" } }, // חיפוש בשם משפחה
          { location: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }

    const posts = await Post.find(query);
    res.status(200).json(posts); // החזרת כל הפוסטים עם סטטוס 200 (הצלחה)
  } catch (err) {
    res.status(404).json({ message: err.message }); // החזרת שגיאה עם סטטוס 404 (לא נמצא)
  }
};

/* READ */
// פונקציה לקבלת כל הפוסטים בפיד עם אפשרות לחיפוש לפי מונח חיפוש (searchTerm) עבור אורחים
export const getAllGuestPosts = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    console.log("Search term received:", searchTerm); // בדיקת ה- searchTerm שהתקבל

    let query = {};

    if (searchTerm) {
      query = {
        $or: [
          { title: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
          { location: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }

    const posts = await Post.find(query).select("title description location picturePath userPicturePath");
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


/* READ */
// פונקציה לקבלת כל הפוסטים לפי region ומונח חיפוש (searchTerm) עבור אורחים
export const getGuestPostsByRegion = async (req, res) => {
  try {
    const { region, searchTerm } = req.query;

    if (!region) {
      return res.status(400).json({ message: "Region is required" });
    }

    let query = { region };

    if (searchTerm) {
      query = {
        ...query,
        $or: [
          { title: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
          { location: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }

    const posts = await Post.find(query).select("title description location picturePath userPicturePath"); // בחירת השדות המתאימים לאורחים
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
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
    res.status(404).json({ message: err.message }); // החזרת שגיאה עם סטטוס 500 (שגיאת שרת)
  }
};

/* UPDATE */
// פונקציה להוספת/הסרת שמירה מפוסט
export const savePost = async (req, res) => {
  try {
    const { id } = req.params; // קבלת מזהה הפוסט מהפרמטרים של הבקשה
    const { userId } = req.body; // קבלת מזהה המשתמש מהגוף של הבקשה
    const post = await Post.findById(id); // מציאת הפוסט לפי מזהה
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const isSaved = post.saved.get(userId); // בדיקה אם המשתמש כבר עשה לייק לפוסט
    if (isSaved) {
      post.saved.delete(userId); // אם כבר עשה לייק, מסירים את הלייק
    } else {
      post.saved.set(userId, true); // אם לא עשה לייק, מוסיפים את הלייק
    }
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { saved: post.saved }, // עדכון הלייקים בפוסט
      { new: true } // מחזירים את הפוסט המעודכן
    );
    console.log("Post updated:", updatedPost);
    res.status(200).json(updatedPost); // החזרת הפוסט המעודכן עם סטטוס 200 (הצלחה)
  } catch (err) {
    console.error("Error saving post:", err);
    res.status(404).json({ message: err.message }); // החזרת שגיאה עם סטטוס 500 (שגיאת שרת)
  }
};

/* UPDATE */
// פונקציה להוספת/הסרת שיתוף מפוסט
export const sharePost = async (req, res) => {
  try {
    const { id } = req.params; // קבלת מזהה הפוסט מהפרמטרים של הבקשה
    const { userId } = req.body; // קבלת מזהה המשתמש מהגוף של הבקשה
    const post = await Post.findById(id); // מציאת הפוסט לפי מזהה
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const isShared = post.shared.get(userId); // בדיקה אם המשתמש כבר עשה לייק לפוסט
    if (isShared) {
      post.shared.delete(userId); // אם כבר עשה לייק, מסירים את הלייק
    } else {
      post.shared.set(userId, true); // אם לא עשה לייק, מוסיפים את הלייק
    }
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { shared: post.shared }, // עדכון הלייקים בפוסט
      { new: true } // מחזירים את הפוסט המעודכן
    );
    console.log("Post updated:", updatedPost);
    res.status(200).json(updatedPost); // החזרת הפוסט המעודכן עם סטטוס 200 (הצלחה)
  } catch (err) {
    console.error("Error sharing post:", err);
    res.status(404).json({ message: err.message }); // החזרת שגיאה עם סטטוס 500 (שגיאת שרת)
  }
};

/* UPDATE */
// פונקציה למחיקת פוסט
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params; // קבלת מזהה הפוסט מהפרמטרים של הבקשה

    // מציאת הפוסט לפי מזהה
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // מחיקת הפוסט מהמאגר הכללי
    await Post.findByIdAndDelete(id);

    res.status(200).json({ message: "Post deleted successfully" }); // החזרת הצלחה עם סטטוס 200
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: err.message }); // החזרת שגיאה עם סטטוס 500 (שגיאת שרת)
  }
};

/* UPDATE */
// פונקציה לעדכון פרטי פוסט
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location } = req.body;

    if (!title && !description && !location) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (title) post.title = title;
    if (description) post.description = description;
    if (location) post.location = location;

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        title: post.title,
        description: post.description,
        location: post.location,
      },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
