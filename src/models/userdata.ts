import mongoose from "mongoose";

const schema = new mongoose.Schema(
	{
		_id: String,
		profile: {
			name: {
				type: String,
				required: true,
			},
			username: {
				type: String,
				required: true,
				unique: true,
			},
			bio: {
				type: String,
				default: "",
			},
		},
	},
	{
		timestamps: true,
		collection: "userdata",
	},
);

export default mongoose.models.UserData || mongoose.model("UserData", schema);
