import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import userdata, { UserDataModelType } from "@/models/userdata";
import user from "@/models/user";
import { z } from "zod";

// Types
type ResponseDataGet = {
	profile: {
		username: string;
		bio: string;
		imageID: string;
	} | null;
	message: "success" | "method-not-allowed" | "unauthorized" | "server-error" | "bad-request" | "not-found";
};
type ResponseDataPost = {
	message: "success" | "method-not-allowed" | "unauthorized" | "server-error" | "bad-request";
};
type ResponseData<T extends "GET" | "POST"> = T extends "GET" ? ResponseDataGet : ResponseDataPost;

type RequestDataGet = {
	username?: string;
};
type RequestDataPost = {
	bio: string;
	name: string;
	username: string;
};
type RequestData<T extends "GET" | "POST"> = T extends "GET" ? RequestDataGet : RequestDataPost;

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Session } from "next-auth";
import { HydratedDocument } from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const session = await getServerSession(req, res, authOptions);
	if (!session) return res.status(401).json({ message: "unauthorized" });

	if (req.method == "GET") {
		// Fetch profile
		try {
			const parsedBody = z
				.object({
					username: z.string().optional(),
				})
				.safeParse(req.query);

			if (parsedBody.success === false)
				return res.status(400).json({ message: "bad-request" } as ResponseDataGet);

			// Fetch their own profile
			if (!parsedBody.data.username) {
				if (!session) return res.status(401).json({ message: "unauthorized" } as ResponseDataGet);
				const data = await userdata.findById(session.user!.id);

				if (!data) return res.status(404).json({ message: "not-found" } as ResponseDataGet);
				return res.status(200).json({ profile: data.profile, message: "success" } as ResponseDataGet);
			} else {
				// Fetch someone else's profile
				const user: HydratedDocument<UserDataModelType> | null = await userdata.findById(
					(session as Session & { id: String }).id,
				);
				if (user == null) return res.status(404).json({ message: "not-found" } as ResponseDataGet);

				if (user.preferences.privacy.hideProfile == "none")
					return res.status(401).json({ message: "not-found" });
				// TODO - Check if the user has permission to view the profile (in friend list)

				return res.status(200).json({ profile: user.profile, message: "success" } as ResponseDataGet);
			}
		} catch (error) {
			return res.status(500).json({ message: "server-error" });
		}
	} else if (req.method == "POST") {
		// Update profile
		try {
			const parsedBody = z
				.object({
					bio: z.string().max(100),
					name: z.string().min(2).max(40),
					username: z.string().min(2).max(22),
				})
				.safeParse(req.body);

			if (parsedBody.success === false)
				return res.status(400).json({ message: "bad-request" } as ResponseDataPost);

			// Update profile object
			await userdata.updateOne(
				{ _id: session.user!.id },
				{
					$set: {
						"profile.username": parsedBody.data.username,
						"profile.bio": parsedBody.data.bio,
					},
				},
			);

			// Update account object
			if (session.user!.name !== parsedBody.data.name)
				await user.updateOne({ email: session.user?.email }, { name: parsedBody.data.name });

			return res.status(200).json({ message: "success" } as ResponseDataPost);
		} catch (error) {
			return res.status(500).json({ message: "server-error" });
		}
	} else {
		return res.status(405).json({ message: "method-not-allowed" } as ResponseDataPost);
	}
}

export type { ResponseData, RequestData };
