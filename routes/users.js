import express from "express";
import {
    getUser,
    // getUserFriends,
    // addRemoveFriend,
    getUserFollowing,
    getUserFollowers,
    addRemoveFollowing,
    removeFollower,
    getAllUsersSortedByStars,
    searchUsers,
}from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";


const router = express.Router();

/*READ*/
router.get("/search", searchUsers);

router.get("/sortedByStars", getAllUsersSortedByStars);
router.get("/:id", verifyToken, getUser);
// router.get("/:id/friends", verifyToken, getUserFriends);

router.get("/:id/following", verifyToken, getUserFollowing);
router.get("/:id/followers", verifyToken, getUserFollowers);

/*UPDATE*/
// router.patch("/:id/:friendId",verifyToken, addRemoveFriend);

router.patch("/:id/:followingId",verifyToken, addRemoveFollowing);
router.patch("/:id/remove-follower/:followerId", verifyToken, removeFollower);
export default router;

