import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params; // הוצאת מזהה המשתמש מהפרמטרים של הבקשה
    const user = await User.findById(id); // חיפוש המשתמש לפי מזהה
    res.status(200).json(user); // שליחת המשתמש שנמצא כתגובה במצב 200 (הצלחה)
  } catch (err) {
    res.status(404).json({ message: err.message }); // שליחת הודעת שגיאה במצב 404 אם המשתמש לא נמצא
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params; // הוצאת מזהה המשתמש מהפרמטרים של הבקשה
    const user = await User.findById(id); // חיפוש המשתמש לפי מזהה

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id)) // חיפוש כל החברים של המשתמש לפי מזהים
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location/*, picturePath */ }) => {
        return { _id, firstName, lastName, occupation, location/*, picturePath */ }; // עיצוב האובייקטים של החברים לפורמט מסוים
      }
    );
    res.status(200).json(formattedFriends); // שליחת רשימת החברים המפורמטת כתגובה במצב 200 (הצלחה)
  } catch (err) {
    res.status(404).json({ message: err.message }); // שליחת הודעת שגיאה במצב 404 אם ישנה בעיה
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params; // הוצאת מזהי המשתמש והחבר מהפרמטרים של הבקשה
    const user = await User.findById(id); // חיפוש המשתמש לפי מזהה
    const friend = await User.findById(friendId); // חיפוש החבר לפי מזהה

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId); // הסרת החבר מרשימת החברים אם הוא כבר קיים בה
      friend.friends = friend.friends.filter((id) => id !== id); // הסרת המשתמש מרשימת החברים של החבר
    } else {
      user.friends.push(friendId); // הוספת החבר לרשימת החברים אם הוא לא קיים בה
      friend.friends.push(id); // הוספת המשתמש לרשימת החברים של החבר
    }
    await user.save(); // שמירת השינויים במשתמש
    await friend.save(); // שמירת השינויים בחבר

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id)) // חיפוש כל החברים החדשים של המשתמש לפי מזהים
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location/*, picturePath*/ }) => {
        return { _id, firstName, lastName, occupation, location/*, picturePath */ }; // עיצוב האובייקטים של החברים לפורמט מסוים
      }
    );

    res.status(200).json(formattedFriends); // שליחת רשימת החברים החדשה המפורמטת כתגובה במצב 200 (הצלחה)
  } catch (err) {
    res.status(404).json({ message: err.message }); // שליחת הודעת שגיאה במצב 404 אם ישנה בעיה
  }
};
