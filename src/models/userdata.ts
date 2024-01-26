import mongoose from "mongoose";

const schema = new mongoose.Schema(
	{
		_id: String,
		profile: {
			username: {
				type: String,
				required: true,
				unique: true,
			},
			imageID: {
				type: String,
				default: "",
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

interface UserDataModelType {
	_id: string;
	profile: {
		username: string;
		imageID: string;
		bio: string;
	};
}

export type { UserDataModelType };
