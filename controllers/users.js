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

export const getUserFollowing = async (req, res) => {
  try {
    const { id } = req.params; // הוצאת מזהה המשתמש מהפרמטרים של הבקשה
    const user = await User.findById(id); // חיפוש המשתמש לפי מזהה

<<<<<<< HEAD
    console.log("User's following array:, user.following");

    const following = await Promise.all(
      user.following.map(async (id) => {
        const followedUser = await User.findById(id);
        return followedUser; // יכול להיות null אם המשתמש לא נמצא
      })
    );
    
    const formattedFollowing = following
      .filter(Boolean) // מסיר ערכי null
      .map(({ _id, firstName, lastName, occupation, location, picturePath }) => ({
        _id, firstName, lastName, occupation, location, picturePath
      }));
    console.log("!!!!!!!!!!!!!!!!!!!", following)

=======
    const following = await Promise.all(
      user.following.map((id) => User.findById(id)) // חיפוש כל החברים של המשתמש לפי מזהים
    );
    const formattedFollowing = following.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath }; // עיצוב האובייקטים של החברים לפורמט מסוים
      }
    );
>>>>>>> 9faf482ac37890432b5dc8c7e8f694eaa9a327c0
    res.status(200).json(formattedFollowing); // שליחת רשימת החברים המפורמטת כתגובה במצב 200 (הצלחה)
  } catch (err) {
    res.status(404).json({ message: err.message }); // שליחת הודעת שגיאה במצב 404 אם ישנה בעיה
  }
};

<<<<<<< HEAD
export const getUserFollowers = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const followers = await Promise.all(
      user.followers.map((id) => User.findById(id))
    );
    const formattedFollowers = followers.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFollowers);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const addRemoveFollowing = async (req, res) => {
  try {
    const { id, followingId } = req.params; // הוצאת מזהי המשתמש והחבר מהפרמטרים של הבקשה
    const user = await User.findById(id); // חיפוש המשתמש לפי מזהה
    const follow = await User.findById(followingId); // חיפוש החבר לפי מזהה

    if (user.following.includes(followingId)) {
      user.following = user.following.filter((id) => id !== followingId); // הסרת החבר מרשימת החברים אם הוא כבר קיים בה
      follow.followers = follow.followers.filter((id) => id !== id); // הסרת המשתמש מרשימת החברים של החבר
    } else {
      user.following.push(followingId); // הוספת החבר לרשימת החברים אם הוא לא קיים בה
      follow.followers.push(id); // הוספת המשתמש לרשימת החברים של החבר
=======
/* UPDATE */
export const addRemoveFollowing = async (req, res) => {
  try {
    const { id, followingId } = req.params; // הוצאת מזהי המשתמש והחבר מהפרמטרים של הבקשה
    const user = await User.findById(id); // חיפוש המשתמש לפי מזהה
    const follow = await User.findById(followingId); // חיפוש החבר לפי מזהה

    if (user.following.includes(followingId)) {
      user.following = user.following.filter((id) => id !== followingId); // הסרת החבר מרשימת החברים אם הוא כבר קיים בה
 //     follow.following = follow.following.filter((id) => id !== id); // הסרת המשתמש מרשימת החברים של החבר
    } else {
      user.following.push(followingId); // הוספת החבר לרשימת החברים אם הוא לא קיים בה
 //     follow.following.push(id); // הוספת המשתמש לרשימת החברים של החבר
>>>>>>> 9faf482ac37890432b5dc8c7e8f694eaa9a327c0
    }
    await user.save(); // שמירת השינויים במשתמש
    await follow.save(); // שמירת השינויים בחבר

    const following = await Promise.all(
      user.following.map((id) => User.findById(id)) // חיפוש כל החברים החדשים של המשתמש לפי מזהים
    );
    const formattedFollowing = following.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath }; // עיצוב האובייקטים של החברים לפורמט מסוים
      }
    );

    res.status(200).json(formattedFollowing); // שליחת רשימת החברים החדשה המפורמטת כתגובה במצב 200 (הצלחה)
  } catch (err) {
    res.status(404).json({ message: err.message }); // שליחת הודעת שגיאה במצב 404 אם ישנה בעיה
  }
};

<<<<<<< HEAD
export const removeFollower = async (req, res) => {
=======

export const updateUser = async (req, res) => {

>>>>>>> 9faf482ac37890432b5dc8c7e8f694eaa9a327c0
  try {
    const { id, followerId } = req.params;
    const user = await User.findById(id);
    const follower = await User.findById(followerId);

    user.followers = user.followers.filter((fId) => fId !== followerId);
    follower.following = follower.following.filter((fId) => fId !== id);

    await user.save();
    await follower.save();

    const followers = await Promise.all(
      user.followers.map((id) => User.findById(id))
    );
    const formattedFollowers = followers.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFollowers);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

