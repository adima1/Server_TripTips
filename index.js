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
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";


/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url); // מקבל את שם הקובץ הנוכחי
const __dirname = path.dirname(__filename); // מקבל את שם התיקייה של הקובץ הנוכחי

dotenv.config(); // טוען משתני סביבה מקובץ .env
const app = express(); // יוצר אפליקציה של Express (שרת)

app.use(express.json()); // מאפשר לאפליקציה לקרוא נתוני JSON מבקשות

app.use(helmet()); // מוסיף שכבות אבטחה נוספות דרך HTTP headers
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // מאפשר לטעון משאבים מאתרים אחרים בצורה בטוחה

app.use(morgan("common")); // רושם את כל הבקשות שנכנסות לשרת ליומן

app.use(bodyParser.json({ limit: "30mb", extended: true })); // מאפשר לקרוא נתוני JSON גדולים (עד 30MB) מבקשות
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true })); // מאפשר לקרוא נתוני URL-encoded גדולים (עד 30MB) מבקשות

app.use(cors()); // מאפשר בקשות ממקורות שונים (דפדפנים/אתרים שונים)

app.use("/assets", express.static(path.join(__dirname, "public/assets"))); // מגדיר תיקייה סטטית בשם "public/assets" שיהיה אפשר לגשת אליה דרך "/assets"


/*FILE STORAGE*/
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  const upload = multer({ storage });
  
/*ROUTES WHIT FILES*/
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts",verifyToken, upload.single("picture"), createPost);

/*ROUTES*/
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);


/*MONGOOSE SETUP*/
const PORT=process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL)
.then(() => {
  app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
})
.catch((error) => console.log(`${error} did not connect to MongoDB.`));
