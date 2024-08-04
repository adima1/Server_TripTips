import bcrypt from "bcrypt"; // יבוא של ספריית bcrypt לצורך הצפנת סיסמאות
import jwt from "jsonwebtoken"; // יבוא של ספריית jsonwebtoken ליצירת טוקנים
import User from "../models/User.js"; // יבוא של מודל המשתמש שנוצר במסד הנתונים
import dotenv from 'dotenv'; // יבוא של dotenv לטעינת משתני סביבה

dotenv.config(); // טוען את משתני הסביבה מקובץ .env

/* REGISTER USER */
export const register = async (req, res) => { // פונקציה לרישום משתמש חדש
  try {
    // קריאה לפרמטרים מהבקשה שנשלחו בגוף הבקשה
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,  // שדה נוסף כאן
      friends = [], // אם החברים לא נשלחים, אתן ערך ברירת מחדל ריק
      location,
      occupation,
    } = req.body;

    // בדוק אם כל השדות הנדרשים נמסרים
    if (!firstName || !lastName || !email || !password || !phoneNumber) {
      return res.status(400).json({ error: "Missing required fields." }); // שליחת שגיאה אם חסר שדה נדרש
    }

    // יצירת מלח לצורך הצפנת הסיסמה
    const salt = await bcrypt.genSalt(); // יצירת מלח אקראי
    // הצפנת הסיסמה באמצעות המלח שנוצר
    const passwordHash = await bcrypt.hash(password, salt); // הצפנת הסיסמה עם המלח

    // יצירת אובייקט משתמש חדש במסד הנתונים
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash, // שמירת הסיסמה המוצפנת
      phoneNumber,  // שדה נוסף כאן
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000), // יצירת מספר אקראי לפרופיל צפוי
      impressions: Math.floor(Math.random() * 10000), // יצירת מספר אקראי לרושם
    });

    // שמירת המשתמש החדש במסד הנתונים
    const savedUser = await newUser.save(); // שמירה במסד הנתונים
    // שליחת תשובה בקוד סטטוס 201 עם המשתמש שנוצר
    res.status(201).json(savedUser); // שליחה של המשתמש שנוצר
  } catch (err) {
    console.error("Error in register:", err.message); // הדפסת הודעת שגיאה לקונסול
    res.status(500).json({ error: err.message }); // שליחת תשובת שגיאה עם הודעת השגיאה
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
      location: user.location,
      occupation: user.occupation,
      viewedProfile: user.viewedProfile,
      impressions: user.impressions,
      phoneNumber: user.phoneNumber,  // הוספת שדה זה גם בתשובה
    };

    console.log("User logged in:", userResponse); // לוג: משתמש התחבר בהצלחה

    res.status(200).json({ token, user: userResponse }); // שליחת תשובת הצלחה עם הטוקן ופרטי המשתמש
  } catch (err) {
    console.error("Error in login:", err.message); // לוג: הודעת שגיאה
    res.status(500).json({ error: err.message }); // שליחת תשובת שגיאה עם הודעת השגיאה
  }
};
