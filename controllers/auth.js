const User = require("../models/user");
const Blog = require("../models/blog");
const shortid = require("shortid");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { OAuth2Client } = require("google-auth-library");
const { errorHandler } = require("../helpers/dbErrorHandler");
const sgMail = require("@sendgrid/mail");
const _ = require("lodash");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.preSignup = (req, res) => {
	const { name, email, password } = req.body;

	User.findOne({ email: req.body.email }).exec((err, user) => {
		if (user) {
			return res.status(400).json({
				error: "Email is taken",
			});
		}
		const token = jwt.sign(
			{ name, email, password },
			process.env.JWT_ACTIVATION,
			{
				expiresIn: "10m",
			},
		);
		const emailData = {
			from: "abc@gmail.com",
			to: email,
			subject: `Account activation link`,
			html: `
      <p>Please use the following link to activate your account</p>
      <p>${process.env.CLIENT_URL}/auth/account/activate/${token}</p>
      <hr />
      <p>This email may contain sensitive information</p>
      <p>https://domain.com</p>
  `,
		};
		sgMail.send(emailData).then((sent) => {
			return res.json({
				message: `Email has been sent to ${email}. Follow the instructions to activate your account. Link expires in 10min.`,
			});
		});
	});
};

exports.signup = (req, res) => {
	const token = req.body.token;
	if (token) {
		jwt.verify(token, process.env.JWT_ACTIVATION, function (err, decoded) {
			if (err) {
				return res.status(401).json({
					error: "Expired link. Signup again",
				});
			}

			const { name, email, password } = jwt.decode(token);

			let username = shortid.generate();
			let profile = `${process.env.CLIENT_URL}/profile/${username}`;

			const user = new User({ name, email, password, profile, username });
			user.save((err, user) => {
				if (err) {
					return res.status(401).json({
						error: errorHandler(err),
					});
				}
				return res.json({
					message: "Singup success! Please signin",
				});
			});
		});
	} else {
		return res.json({
			message: "Something went wrong. Try again",
		});
	}
};

exports.signin = (req, res) => {
	const { email, password } = req.body;
	User.findOne({ email }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "User with that email does not exist. Please signup",
			});
		}
		if (!user.authenticate(password)) {
			return res.status(400).json({
				error: "Email and password do not match",
			});
		}
		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "30d",
		});
		res.cookie("token", token, { expiresIn: "30d" });
		const { _id, username, name, email, role } = user;
		return res.json({
			token,
			user: { _id, username, name, email, role },
		});
	});
};

exports.signout = (req, res) => {
	res.clearCookie("token");
	res.json({
		message: "Signout success",
	});
};

exports.requireSignin = expressJwt({
	secret: process.env.JWT_SECRET,
});

exports.authMiddleware = (req, res, next) => {
	const authUserId = req.user._id;
	User.findById({ _id: authUserId }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "User not found",
			});
		}
		req.profile = user;
		next();
	});
};

exports.adminMiddleware = (req, res, next) => {
	const adminUserId = req.user._id;
	User.findById({ _id: adminUserId }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "User not found",
			});
		}
		if (user.role !== 1) {
			return res.status(400).json({
				error: "Admin resource access denied",
			});
		}
		req.profile = user;
		next();
	});
};

exports.forgotPassword = (req, res) => {
	const { email } = req.body;

	User.findOne({ email }, (err, user) => {
		if (err || !user) {
			return res.status(401).json({
				error: "User with that email does not exist",
			});
		}

		const token = jwt.sign(
			{ _id: user._id },
			process.env.JWT_RESET_PASSWORD,
			{ expiresIn: "10m" },
		);
		const emailData = {
			from: "abc@gmail.com",
			to: email,
			subject: `Password reset link`,
			html: `
          <p>Please use the following link to reset your password:</p>
          <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
          <hr />
          <p>This email may contain sensitive information</p>
          <p>https://domain.com</p>
      `,
		};
		return user.updateOne({ resetPasswordLink: token }, (err, success) => {
			if (err) {
				return res.json({ error: errorHandler(err) });
			} else {
				sgMail.send(emailData).then((sent) => {
					return res.json({
						message: `Email has been sent to ${email}. Follow the instructions to reset your password. Link expires in 10min.`,
					});
				});
			}
		});
	});
};

exports.resetPassword = (req, res) => {
	const { resetPasswordLink, newPassword } = req.body;

	if (resetPasswordLink) {
		jwt.verify(
			resetPasswordLink,
			process.env.JWT_RESET_PASSWORD,
			function (err, decoded) {
				if (err) {
					return res.status(401).json({
						error: "Expired link. Try again",
					});
				}
				User.findOne({ resetPasswordLink }, (err, user) => {
					if (err || !user) {
						return res.status(401).json({
							error: "Something went wrong. Try later",
						});
					}
					const updatedFields = {
						password: newPassword,
						resetPasswordLink: "",
					};

					user = _.extend(user, updatedFields);

					user.save((err, result) => {
						if (err) {
							return res.status(400).json({
								error: errorHandler(err),
							});
						}
						res.json({
							message: `Now you can login with your new password`,
						});
					});
				});
			},
		);
	}
};

exports.canUpdateDeleteBlog = (req, res, next) => {
	const slug = req.params.slug.toLowerCase();
	Blog.findOne({ slug }).exec((err, data) => {
		if (err) {
			return res.status(400).json({
				error: errorHandler(err),
			});
		}
		let authorizedUser =
			data.postedBy._id.toString() === req.profile._id.toString();
		if (!authorizedUser) {
			return res.status(400).json({
				error: "you are not authorize",
			});
		}
		next();
	});
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
exports.googleLogin = (req, res) => {
	const idToken = req.body.tokenId;
	client
		.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID })
		.then((response) => {
			const { email_verified, name, email, jti } = response.payload;
			if (email_verified) {
				User.findOne({ email }).exec((err, user) => {
					if (user) {
						const token = jwt.sign(
							{ _id: user._id },
							process.env.JWT_SECRET,
							{
								expiresIn: "30d",
							},
						);
						res.cookie("token", token, { expiresIn: "30d" });
						const { _id, name, email, role, username } = user;
						return res.json({
							token,
							user: { _id, email, name, role, username },
						});
					} else {
						let username = shortid.generate();
						let profile = `${process.env.CLIENT_URL}/profile/${username}`;
						let password = jti;
						user = new User({ name, email, profile, username, password });
						user.save((err, data) => {
							if (err) {
								return res.status(400).json({
									error: errorHandler(err),
								});
							}
							const token = jwt.sign(
								{ _id: data._id },
								process.env.JWT_SECRET,
								{
									expiresIn: "30d",
								},
							);
							res.cookie("token", token, { expiresIn: "30d" });
							const { _id, name, email, role, username } = data;
							return res.json({
								token,
								user: { _id, email, name, role, username },
							});
						});
					}
				});
			} else {
				return res.status(400).json({
					error: "Google login fail try again",
				});
			}
		});
};
