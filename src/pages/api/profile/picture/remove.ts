import { getServerSession } from "next-auth";
import fs from "fs-extra";
import path from "path";

import userdata, { UserDataModelType } from "@/models/userdata";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

type Data = {
	message?: "success" | "method-not-allowed" | "unauthorized" | "server-error" | "bad-request";
};

export const config = {
	api: {
		bodyParser: false,
	},
};

import type { NextApiRequest, NextApiResponse } from "next";
import { HydratedDocument } from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	if (req.method !== "POST") return res.status(405).json({ message: "method-not-allowed" });

	const session = await getServerSession(req, res, authOptions);
	if (!session) return res.status(401).json({ message: "unauthorized" });

	try {
		// Delete the old user profile picture
		const userProfile: HydratedDocument<UserDataModelType> | null = await userdata.findOne({
			_id: session.user!.id,
		});
		if (userProfile && userProfile.profile.imageID) {
			fs.unlinkSync(
				path.join(
					process.cwd(),
					"/public/data/profile-pictures/",
					session.user!.id,
					"/" + userProfile.profile.imageID + ".png",
				),
			);
		}

		// Update the user's profile picture
		await userdata.updateOne(
			{ _id: session.user!.id },
			{
				$set: {
					"profile.imageID": "",
				},
			},
		);

		return res.status(200).json({ message: "success" });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "server-error" });
	}
}

export type { Data };
