import mongoose from "mongoose";

const schema = new mongoose.Schema(
	{
		_id: String,
		title: {
			type: String,
			required: true,
		},
		body: {
			type: String,
			required: true,
		},
		postedTo: {
			type: String,
			required: true,
		},
        verified: {
            type: Boolean,
            required: true,
        },
		authorID: {
			type: String,
			required: true,
		},
		attachments: {
			type: [String],
			default: [],
		},
	},
	{
		timestamps: true,
		collection: "posts",
	},
);

export default mongoose.models.Posts || mongoose.model("Posts", schema);

interface PostModelType {
	_id: string;
	title: string;
	body: string;
	postedTo: string;
	verified: boolean;
	authorID: string;
	attachments: string[];
}

export type { PostModelType };
