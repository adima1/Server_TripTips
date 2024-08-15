import bcrypt from "bcrypt"; // יבוא של ספריית bcrypt לצורך הצפנת סיסמאות
import jwt from "jsonwebtoken"; // יבוא של ספריית jsonwebtoken ליצירת טוקנים
import User from "../models/User.js"; // יבוא של מודל המשתמש שנוצר במסד הנתונים
import dotenv from 'dotenv'; // יבוא של dotenv לטעינת משתני סביבה
import multer from "multer";
import Post from "../models/Post.js"; // ייבוא המודל של הפוסטים


dotenv.config(); // טוען את משתני הסביבה מקובץ .env

/* REGISTER USER */

export const register = async (req, res) => {
  try {
    // קריאה לפרמטרים מהבקשה שנשלחו בגוף הבקשה
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      location = "", // הוספת ערך ברירת מחדל
      occupation = "", // הוספת ערך ברירת מחדל
    } = req.body;

    // קריאה לפרמטרים מהבקשה שנשלחו עם הקובץ
    const picturePath = req.file ? req.file.filename : "anonymous.jpg"; // ערך ברירת מחדל אם אין קובץ

    // בדוק אם כל השדות הנדרשים נמסרים
    if (!firstName || !lastName || !email || !password || !phoneNumber) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // יצירת מלח לצורך הצפנת הסיסמה
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // יצירת אובייקט משתמש חדש במסד הנתונים
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      phoneNumber,
      picturePath,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
      stars: 0,
    });

    // שמירת המשתמש החדש במסד הנתונים
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error("Error in register:", err.message);
    res.status(500).json({ error: err.message });
  }
};



/* LOGGING IN */
export const login = async (req, res) => { // פונקציה להתחברות משתמש
  try {
    console.log("Login request received:", req.body); // לוג: פרטי הבקשה

    const { login, password } = req.body; // קריאה לדוא"ל וסיסמה מהבקשה

    if (!login || !password) { // בדוק אם כל השדות הנדרשים נמסרים
      return res.status(400).json({ msg: "Email or phone number and password are required." }); // שליחת שגיאה אם חסר דוא"ל או סיסמה
    }

    console.log("Determining if email or phone number");
    let user;
    
    // בדוק אם הקלט הוא אימייל או מספר טלפון וחשב את המשתמש המתאים
    if (login.includes('@')) {
      // אם הקלט מכיל '@', נניח שזה אימייל
      console.log("Finding user with email:", login); // לוג: חיפוש משתמש לפי דוא"ל
      user = await User.findOne({ email: login }); // חיפוש משתמש לפי דוא"ל
    } else {
      // אחרת, נניח שזה מספר טלפון
      console.log("Finding user with phone number:", login); // לוג: חיפוש משתמש לפי מספר טלפון
      user = await User.findOne({ phoneNumber: login }); // חיפוש משתמש לפי מספר טלפון
    }

    if (!user) { // אם לא נמצא משתמש
      console.error("User does not exist"); // לוג: משתמש לא קיים
      return res.status(400).json({ msg: "User does not exist." }); // שליחת שגיאה אם המשתמש לא קיים
    }

    console.log("Comparing passwords"); // לוג: השוואת סיסמאות
    const isMatch = await bcrypt.compare(password, user.password); // השוואת הסיסמה שניתנה לסיסמה המוצפנת

    if (!isMatch) { // אם הסיסמאות לא תואמות
      console.error("Invalid credentials"); // לוג: נתוני התחברות שגויים
      return res.status(400).json({ msg: "Invalid credentials." }); // שליחת שגיאה אם הנתונים שגויים
    }

    console.log("Creating JWT token"); // לוג: יצירת טוקן JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // יצירת טוקן עם תוקף של שעה

    const userResponse = { // אובייקט התשובה עם פרטי המשתמש
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      friends: user.friends,
      followers: user.followers,
      following: user.following,
      location: user.location,
      occupation: user.occupation,
      viewedProfile: user.viewedProfile,
      impressions: user.impressions,
      stars: user.stars,
      phoneNumber: user.phoneNumber,  // הוספת שדה זה גם בתשובה
      picturePath: user.picturePath, 
    };

    console.log("User logged in:", userResponse); // לוג: משתמש התחבר בהצלחה

    res.status(200).json({ token, user: userResponse }); // שליחת תשובת הצלחה עם הטוקן ופרטי המשתמש
  } catch (err) {
    console.error("Error in login:", err.message); // לוג: הודעת שגיאה
    res.status(500).json({ error: err.message }); // שליחת תשובת שגיאה עם הודעת השגיאה
  }
};


// הגדרת Multer לטיפול בקבצים
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// הוספת ה-Upload Middleware
export const updateUser = [
  upload.single("picture"), // שם השדה צריך להיות "picture" כמו שנשלח מ-FormData
  async (req, res) => {
    try {
      console.log("Received update request for user ID:", req.params.id);
      console.log("Update data:", req.body);

      const { id } = req.params;
      const { firstName, lastName, email, location, occupation, phoneNumber, password } = req.body;
      const updateFields = {};

      // בדוק אם האימייל קיים כבר במערכת למשתמש אחר
      if (email) {
        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail && existingUserByEmail._id.toString() !== id) {
          return res.status(400).json({ message: "Email is already in use by another user." });
        }
        updateFields.email = email;
      }

      // בדוק אם מספר הטלפון קיים כבר במערכת למשתמש אחר
      if (phoneNumber) {
        const existingUserByPhoneNumber = await User.findOne({ phoneNumber });
        if (existingUserByPhoneNumber && existingUserByPhoneNumber._id.toString() !== id) {
          return res.status(400).json({ message: "Phone number is already in use by another user." });
        }
        updateFields.phoneNumber = phoneNumber;
      }

      // עדכון שדות המשתמש אם הם ניתנים
      if (firstName) updateFields.firstName = firstName;
      if (lastName) updateFields.lastName = lastName;
      if (location) updateFields.location = location;
      if (occupation) updateFields.occupation = occupation;

      // הצפנת הסיסמה רק אם היא חדשה
      if (password) {
        // קוד לבדוק אם הסיסמה כבר מוצפנת (למשל, אם יש לה לפחות 60 תווים)
        const isEncrypted = password.length >= 60;
        if (!isEncrypted) {
          const salt = await bcrypt.genSalt(10);
          updateFields.password = await bcrypt.hash(password, salt);
        } else {
          updateFields.password = password; // השתמש בסיסמה כפי שהיא אם היא כבר מוצפנת
        }
      }

      // עדכון קובץ התמונה אם נשלח
      if (req.file) updateFields.picturePath = req.file.filename;

      console.log("Fields to update:", updateFields);

      // עדכון המשתמש
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      console.log("User updated successfully:", updatedUser);
      res.status(200).json(updatedUser);
    } catch (err) {
      console.error("Error updating user:", err);
      res.status(500).json({ message: err.message, stack: err.stack });
    }
  },
];



/* UPDATE */
// פונקציה למחיקת 
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // קבלת מזהה המשתמש מהפרמטרים של הבקשה
    console.log(`Attempting to delete user with ID: ${id}`);

    // מציאת המשתמש לפי מזהה
    const user = await User.findById(id); 
    if (!user) {
      console.log(`User with ID ${id} not found.`);
      return res.status(404).json({ message: "User not found" });
    }



    console.log(`User with ID ${id} found. Proceeding to delete.`);
    // מחיקת המשתמש מהמאגר
    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "User deleted successfully" }); // החזרת הצלחה עם סטטוס 200
  } catch (err) {
    console.error(`Error deleting user ${id}:`, err);
    res.status(500).json({ message: (`Internal server error ${id}`) }); // החזרת שגיאה עם סטטוס 500 (שגיאת שרת)
  }
};


export const deletePostsByUserId = async (req, res) => {
  try {
    const { id } = req.params; // קבלת מזהה המשתמש מהפרמטרים של הבקשה

    // מציאת כל הפוסטים שה- userId שלהם תואם ל-id שנשלח
    const posts = await Post.find({ userId: id });

    // אם אין פוסטים עם ה-userId הספציפי, החזר שגיאה מתאימה
    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found for this user" });
    }

    // מחיקת כל הפוסטים שנמצאו
    await Post.deleteMany({ userId: id });

    res.status(200).json({ message: "Posts deleted successfully" }); // החזרת הצלחה עם סטטוס 200
  } catch (err) {
    console.error("Error deleting posts:", err);
    res.status(500).json({ message: err.message }); // החזרת שגיאה עם סטטוס 500 (שגיאת שרת)
  }
};

