import bcrypt from "bcrypt"; // יבוא של ספריית bcrypt לצורך הצפנת סיסמאות
import jwt from "jsonwebtoken"; // יבוא של ספריית jsonwebtoken ליצירת טוקנים
import User from "../models/User.js"; // יבוא של מודל המשתמש שנוצר במסד הנתונים
import dotenv from 'dotenv'; // יבוא של dotenv לטעינת משתני סביבה

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
      phoneNumber,  // שדה נוסף כאן
      friends = [], // אם החברים לא נשלחים, אתן ערך ברירת מחדל ריק
      location,
      occupation,
    } = req.body;

    // בדוק אם כל השדות הנדרשים נמסרים
    if (!firstName || !lastName || !email || !password || !phoneNumber) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // יצירת מלח לצורך הצפנת הסיסמה
    const salt = await bcrypt.genSalt();
    // הצפנת הסיסמה באמצעות המלח שנוצר
    const passwordHash = await bcrypt.hash(password, salt);

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
    const savedUser = await newUser.save();
    // שליחת תשובה בקוד סטטוס 201 עם המשתמש שנוצר
    res.status(201).json(savedUser);
  } catch (err) {
    console.error("Error in register:", err.message); // הדפסת הודעת שגיאה לקונסול
    res.status(500).json({ error: err.message }); // שליחת תשובת שגיאה
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    console.log("Login request received:", req.body); // לוג: פרטי הבקשה

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required." });
    }

    console.log("Finding user with email:", email);
    const user = await User.findOne({ email: email });

    if (!user) {
      console.error("User does not exist"); // לוג: משתמש לא קיים
      return res.status(400).json({ msg: "User does not exist." });
    }

    console.log("Comparing passwords");
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.error("Invalid credentials"); // לוג: נתוני התחברות שגויים
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    console.log("Creating JWT token");
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // הוספת אפשרות לפקיעת תוקף

    const userResponse = {
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

    res.status(200).json({ token, user: userResponse });
  } catch (err) {
    console.error("Error in login:", err.message); // לוג: הודעת שגיאה
    res.status(500).json({ error: err.message }); // שליחת תשובת שגיאה
  }
};
