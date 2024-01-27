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
		preferences: {
			general: {
				theme: {
					type: String,
					default: "light",
				},
				language: {
					type: String,
					default: "en",
				},
			},
			privacy: {
				hideEmail: {
					type: String,
					enum: ["everyone", "friends", "none"],
					default: false,
				},
				hideProfile: {
					type: String,
					enum: ["everyone", "friends", "none"],
					default: false,
				},
				hideActivity: {
					type: String,
					enum: ["everyone", "friends", "none"],
					default: false,
				},
				hideProfilePicture: {
					type: String,
					enum: ["everyone", "friends", "none"],
					default: false,
				},
			},
			notifications: {
				emails: {
					type: Boolean,
					default: true,
				},
				push: {
					type: Boolean,
					default: true,
				},
			},
			account: {

			},
		},
		penalties: {
			mute: {
				type: Boolean,
				default: false,
			},
			ban: {
				type: Boolean,
				default: false,
			},
		},
		friends: {
			type: [String],
			default: [],
		},
		communities: {
			type: [String],
			default: [],
		},
		blockedUsers: {
			type: [String],
			default: [],
		},
		blockedCommnuities: {
			type: [String],
			default: [],
		},
		activity: {
			type: [String],
			default: [],
		},
		postHistory: {
			type: [String],
			default: [],
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
	preferences: {
		general: {
			theme: string;
			language: string;
		};
		privacy: {
			hideEmail: "everyone" | "friends" | "none";
			hideProfile: "everyone" | "friends" | "none";
			hideActivity: "everyone" | "friends" | "none";
			hideProfilePicture: "everyone" | "friends" | "none";
		};
		notifications: {
			emails: boolean;
			push: boolean;
		};
	};
	penalties: {
		mute: boolean;
		ban: boolean;
	};
	friends: string[];
	communities: string[];
	blockedUsers: string[];
	blockedCommnuities: string[];
	activity: string[];
	postHistory: string[];
}

export type { UserDataModelType };
