import mongoose from "mongoose";

const schema = new mongoose.Schema(
	{
		_id: String,
		username: {
			type: String,
			required: true,
			unique: true,
		},
		profile: {
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

interface UserDataModelType {
	_id: string;
	username: string;
	profile: {
		bio: string;
	};
}

export type { UserDataModelType };
