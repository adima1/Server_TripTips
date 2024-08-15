import express from "express";
import {
    getUser,
    // getUserFriends,
    // addRemoveFriend,
<<<<<<< HEAD
    getUserFollowing,
    getUserFollowers,
    addRemoveFollowing,
    removeFollower,
=======
    updateUser,
    addRemoveFollowing,
    getUserFollowing,
>>>>>>> 9faf482ac37890432b5dc8c7e8f694eaa9a327c0
}from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";


const router = express.Router();

/*READ*/
router.get("/:id", verifyToken, getUser);
<<<<<<< HEAD
// router.get("/:id/friends", verifyToken, getUserFriends);

router.get("/:id/following", verifyToken, getUserFollowing);
router.get("/:id/followers", verifyToken, getUserFollowers);

/*UPDATE*/
// router.patch("/:id/:friendId",verifyToken, addRemoveFriend);

router.patch("/:id/:followingId",verifyToken, addRemoveFollowing);
router.patch("/:id/remove-follower/:followerId", verifyToken, removeFollower);
export default router;

=======
//router.get("/:id/friends", verifyToken, getUserFriends);
router.get("/:id/following", verifyToken, getUserFollowing);


/*UPDATE*/
//router.patch("/:id/:friendId",verifyToken, addRemoveFriend);
router.patch("/:id/:followingId",verifyToken, addRemoveFollowing);
router.patch("/:id",verifyToken, updateUser);
export default router;
>>>>>>> 9faf482ac37890432b5dc8c7e8f694eaa9a327c0
