const User = require("../models/user");
const Blog = require("../models/blog");
const _ = require("lodash");
const formidable = require("formidable");
const fs = require("fs");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.userById = (req, res, next) => {
	let userId = user._id;
	User.findById(userId)
		.populate("following", "_id name")
		.populate("followers", "_id name")
		.exec((err, user) => {
			if (err || !user) {
				return res.status(400).json({
					error: "User not found",
				});
			}
			req.profile = user;
			next();
		});
};

exports.read = (req, res) => {
	req.profile.hashed_password = undefined;
	return res.json(req.profile);
};

exports.publicProfile = (req, res) => {
	let username = req.params.username;
	let user;
	let blogs;

	User.findOne({ username }).exec((err, userFromDB) => {
		if (err || !userFromDB) {
			return res.status(400).json({
				error: "User not found",
			});
		}
		user = userFromDB;
		let userId = user._id;
		Blog.find({ postedBy: userId })
			.populate("categories", "_id name slug")
			.populate("tags", "_id name slug")
			.populate("postedBy", "_id name")
			.sort({ createdAt: -1 })
			.select(
				"_id title slug excerpt categories tags postedBy createdAt updatedAt",
			)
			.exec((err, data) => {
				if (err) {
					return res.status(400).json({
						error: errorHandler(err),
					});
				}
				user.photo = undefined;
				user.hashed_password = undefined;
				res.json({
					user,
					blogs: data,
				});
			});
	});
};

exports.update = (req, res) => {
	let form = new formidable.IncomingForm();
	form.keepExtension = true;
	form.parse(req, (err, fields, files) => {
		if (err) {
			return res.status(400).json({
				error: "Photo could not be uploaded",
			});
		}
		let user = req.profile;
		user = _.extend(user, fields);

		if (fields.password && fields.password.length < 7) {
			return res.status(400).json({
				error: "Password should be min 7 characters long",
			});
		}

		if (files.photo) {
			if (files.photo.size > 10000000) {
				return res.status(400).json({
					error: "Image should be less than 1mb",
				});
			}
			user.photo.data = fs.readFileSync(files.photo.path);
			user.photo.contentType = files.photo.type;
		}

		user.save((err, result) => {
			if (err) {
				return res.status(400).json({
					error: errorHandler(err),
				});
			}
			user.hashed_password = undefined;
			user.salt = undefined;
			user.photo = undefined;
			res.json(user);
		});
	});
};

exports.photo = (req, res) => {
	const username = req.params.username;
	User.findOne({ username }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "User not found",
			});
		}
		if (user.photo.data) {
			res.set("Content-Type", user.photo.contentType);
			return res.send(user.photo.data);
		}
	});
};

exports.addFollowing = (req, res, next) => {
	User.findByIdAndUpdate(
		req.body.userId,
		{ $push: { following: req.body.followId } },
		(err, result) => {
			if (err) {
				return res.status(400).json({ error: err });
			}
			next();
		},
	);
};

exports.addFollower = (req, res) => {
	User.findByIdAndUpdate(
		req.body.followId,
		{ $push: { followers: req.body.userId } },
		{ new: true },
	)
		.populate("following", "_id name")
		.populate("followers", "_id name")
		.exec((err, result) => {
			if (err) {
				return res.status(400).json({
					error: err,
				});
			}
			result.hashed_password = undefined;
			result.salt = undefined;
			res.json(result);
		});
};

// remove follow unfollow
exports.removeFollowing = (req, res, next) => {
	User.findByIdAndUpdate(
		req.body.userId,
		{ $pull: { following: req.body.unfollowId } },
		(err, result) => {
			if (err) {
				return res.status(400).json({ error: err });
			}
			next();
		},
	);
};

exports.removeFollower = (req, res) => {
	User.findByIdAndUpdate(
		req.body.unfollowId,
		{ $pull: { followers: req.body.userId } },
		{ new: true },
	)
		.populate("following", "_id name")
		.populate("followers", "_id name")
		.exec((err, result) => {
			if (err) {
				return res.status(400).json({
					error: err,
				});
			}
			result.hashed_password = undefined;
			result.salt = undefined;
			res.json(result);
		});
};

exports.findPeople = (req, res) => {
	let following = req.profile.following;
	following.push(req.profile._id);
	User.find({ _id: { $nin: following } }, (err, users) => {
		if (err) {
			return res.status(400).json({
				error: err,
			});
		}
		res.json(users);
	}).select("name");
};
