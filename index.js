import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost, getAllPosts, getPostsByRegion } from "./controllers/posts.js"; // ייבוא של הפונקציה getAllPosts ו-getPostsByRegion
import { verifyToken } from "./middleware/auth.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// נתיב חדש לגישה לפוסטים עבור אורחים
app.get("/posts/guest", getAllPosts);

// נתיב חדש לגישה לפוסטים לפי אזור עבור אורחים
app.get("/posts/region/guest", getPostsByRegion);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    })
    .catch((error) => console.log(`${error} did not connect to MongoDB.`));

/* ABOUT ROUTE */
app.get("/about", (req, res) => {
    const aboutContent = {
        title: "אודות TripTips",
        content: `TripTips מהות הרשת החברתית Trip-Tips: 
        המערכת נותנת גישה למטיילים אשר רוצים להתרשם ממקומות בילוי ומטיולים בארץ.
        כל משתמש יכול להתחבר לאתר כאורח או כמשתמש רשום.
        כך שמשתמש רשום יוכל לשתף מקומות אשר נכח בהם על ידי העלאה של פוסט ובו: תמונה, תיאור ומיקום
        שלהם לפרופיל שלו באתר או על ידי שיתוף פוסט של משתמש רשום אחר בפרופיל שלו.
        בנוסף, משתמש רשום יוכל לסמן ״לייק״ לפוסטים שאהב וכך משתמשים אחרים שצופים בפוסט זה יוכלו
        לראות חוות דעת נוספת על המקום דרך כמות ה״לייקים״ על אותו פוסט.
        כמו כן, המשתמש הרשום יכול לשמור אותם וכך לגשת לפוסטים אלה במועד מאוחר יותר.
        כל משתמש רשום, מקבל דירוג על פי הפעילות שלו באתר ועל פי זה משתמשים אחרים יכולים לדעת יותר
        אם התוכן שהמשתמש מעלה פופולרי או שפחות.
        אורח לעומת זאת כמו המשתמש הרשום, יכול רק לצפות בפרופילים של משתמשים, ולחפש ולצפות
        בפוסטים של משתמשים אחרים.
        כך מטיילים יכולים להכיר ולגלות מקומות בישראל ממטיילים אחרים שמנגישים את התוכן בצורה נוחה
        וחווייתית יותר למשתמש.
        צורך ביישום:
        המערכת שלנו יכולה לעזור מאוד לאנשים שאינם מכירים מגוון רחב של מקומות בישראל שניתן לטייל בהם,
        ליצור בהם חוויות חדשות ולהתרשם מהנופים המרהיבים שלהם.
        קהל היעד:
        מטיילים בישראל שרוצים לקבל רעיונות לטיולים בארץ על פי שיתופי נופים ומקומות של מטיילים אחרים. כמו
        כן, מטיילים אשר רוצים לשתף אחרים במקומות בישראל אשר היו בהם.`
    };
    res.json(aboutContent);
});

/* PING ROUTE */
app.get("/ping", (req, res) => {
    res.send("pong TripTips6");
});

export default app;