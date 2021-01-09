const express = require("express");
const router = express.Router();
const { authMiddleware, requireSignin } = require("../controllers/auth");
const {
	read,
	publicProfile,
	update,
	photo,
	addFollowing,
	addFollower,
	removeFollowing,
	removeFollower,
	userById,
} = require("../controllers/user");

router.get("/user/profile", requireSignin, authMiddleware, read);
router.get("/user/:username", publicProfile);
router.put("/user/update", requireSignin, authMiddleware, update);
router.get("/user/photo/:username", photo);
router.put("/user/follow", requireSignin, addFollowing, addFollower);
router.put("/user/unfollow", requireSignin, removeFollowing, removeFollower);
router.param("userId", userById);

module.exports = router;
