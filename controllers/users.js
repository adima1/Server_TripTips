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

    const following = await Promise.all(
      user.following.map((id) => User.findById(id)) // חיפוש כל החברים של המשתמש לפי מזהים
    );
    const formattedFollowing = following.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath }; // עיצוב האובייקטים של החברים לפורמט מסוים
      }
    );
    res.status(200).json(formattedFollowing); // שליחת רשימת החברים המפורמטת כתגובה במצב 200 (הצלחה)
  } catch (err) {
    res.status(404).json({ message: err.message }); // שליחת הודעת שגיאה במצב 404 אם ישנה בעיה
  }
};

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

export const removeFollower = async (req, res) => {
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

export const getAllUsersSortedByStars = async (req, res) => {
  try {
    const users = await User.find().sort({ stars: -1 }); // מיון לפי כוכבים
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { searchTerm } = req.query;

    if (!searchTerm) {
      return res.status(200).json([]);
    }

    const users = await User.find({
      $or: [
        { firstName: { $regex: searchTerm, $options: "i" } },
        { lastName: { $regex: searchTerm, $options: "i" } },
        { occupation: { $regex: searchTerm, $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: { $concat: ["$firstName", " ", "$lastName"] },
              regex: searchTerm,
              options: "i",
            },
          },
        },
      ],
    })
    .sort({ stars: -1 })
    .select("firstName lastName occupation picturePath stars");

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// New function to get all users sorted by stars
// export const getAllUsersSortedByStars = async (req, res) => {
//   try {
//     const users = await User.find({}).sort({ stars: -1 }); // Fetching all users and sorting by stars in descending order
//     const formattedUsers = users.map(
//       ({ _id, firstName, lastName, occupation, location, picturePath, stars }) => {
//         return { _id, firstName, lastName, occupation, location, picturePath, stars };
//       }
//     );
//     res.status(200).json(formattedUsers); // Sending the sorted list as a response
//   } catch (err) {
//     res.status(500).json({ message: err.message }); // Sending an error response if something goes wrong
//   }
// };



// // פונקציה להבאת כל המשתמשים ממוינים לפי כמות הכוכבים (מהגבוה לנמוך)
// // פונקציה שתביא את כל המשתמשים ממוינים לפי מספר כוכבים
// export const getAllUsersSortedByStars = async (req, res) => {
//   try {
//     // חיפוש כל המשתמשים והסדר לפי מספר כוכבים יורד
//     const users = await User.find().sort({ stars: -1 });
//     const formattedUsers = users.map(
//       ({ _id, firstName, lastName, stars }) => {
//         return { _id, firstName, lastName, stars }; // עיצוב הנתונים הנחוצים
//       }
//     );
//     res.status(200).json(formattedUsers); // שליחת הרשימה הממוינת כתגובה
//   } catch (err) {
//     res.status(500).json({ message: err.message }); // שליחת הודעת שגיאה אם ישנה בעיה
//   }
// };

