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
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath }; // עיצוב האובייקטים של החברים לפורמט מסוים
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
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath }; // עיצוב האובייקטים של החברים לפורמט מסוים
      }
    );

    res.status(200).json(formattedFriends); // שליחת רשימת החברים החדשה המפורמטת כתגובה במצב 200 (הצלחה)
  } catch (err) {
    res.status(404).json({ message: err.message }); // שליחת הודעת שגיאה במצב 404 אם ישנה בעיה
  }
};

export const updateUser = async (req, res) => {

  try {

    console.log("Received update request for user ID:", req.params.id);
    console.log("Update data:", req.body);
    const { id } = req.params;
    const { firstName, lastName, email, location, occupation } = req.body;
 

    const updateFields = {};
    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;
    if (email) updateFields.email = email;
    if (location) updateFields.location = location;
    if (occupation) updateFields.occupation = occupation;
    console.log("Fields to update:", updateFields);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "משתמש לא נמצא" });
    }
    console.log("User updated successfully:", updatedUser);
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
};
