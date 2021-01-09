const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const blogSchema = new Schema(
	{
		title: {
			type: String,
			trim: true,
			required: true,
			min: 3,
			max: 160,
		},
		slug: {
			type: String,
			unique: true,
			index: true,
		},
		body: {
			type: {},
			trim: true,
			required: true,
			max: 2000000,
		},
		excerpt: {
			type: String,
			max: 1000,
		},
		mtitle: {
			type: String,
		},
		mdesc: {
			type: String,
		},
		photo: {
			data: Buffer,
			contentType: String,
		},
		categories: [{ type: ObjectId, ref: "Category", required: true }],
		tags: [{ type: ObjectId, ref: "Tag", required: true }],
		postedBy: {
			type: ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model("Blog", blogSchema);
