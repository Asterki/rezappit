import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import userdata from "@/models/userdata";
import { z } from "zod";

type Data = {
	message?: "success" | "method-not-allowed" | "unauthorized" | "server-error" | "bad-request" | "not-found";
};

interface RequestBody {
	hideEmail: "everyone" | "friends" | "none";
	hideProfile: "everyone" | "friends" | "none";
	hideActivity: "everyone" | "friends" | "none";
	hideProfilePicture: "everyone" | "friends" | "none";
}

import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	const session = await getServerSession(req, res, authOptions);
	if (!session) return res.status(401).json({ message: "unauthorized" });

	if (req.method == "GET") {
		try {
			const data = await userdata.findById(session.user!.id);
			if (!data) return res.status(404).json({ message: "not-found" });

			return res.status(200).json(data.preferences.privacy);
		} catch (error) {
			return res.status(500).json({ message: "server-error" });
		}
	} else if (req.method == "POST") {
		try {
			const parsedBody = z
				.object({
					hideEmail: z.enum(["everyone", "friends", "none"]),
					hideProfile: z.enum(["everyone", "friends", "none"]),
					hideActivity: z.enum(["everyone", "friends", "none"]),
					hideProfilePicture: z.enum(["everyone", "friends", "none"]),
				})
				.safeParse(req.body);

			if (parsedBody.success === false) return res.status(400).json({ message: "bad-request" });

			const data = await userdata.findById(session.user!.id);
			if (!data) return res.status(404).json({ message: "not-found" });

			data.preferences.privacy = parsedBody.data;
			await data.save();

			return res.status(200).json({ message: "success" });
		} catch (error) {
			return res.status(500).json({ message: "server-error" });
		}
	} else {
		return res.status(405).json({ message: "method-not-allowed" });
	}
}

export type { Data, RequestBody };
