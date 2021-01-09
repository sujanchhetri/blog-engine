const { check } = require("express-validator");

exports.CreateTagValidator = [
	check("name").not().isEmpty().withMessage("Name is required"),
];
