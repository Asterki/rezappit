import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import userdata from "@/models/userdata";
import { z } from "zod";

type Data = {
	profile?: {
		name: String;
		bio: String;
	};
	message?: "success" | "method-not-allowed" | "unauthorized" | "server-error" | "bad-request";
};

import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	if (req.method !== "GET") return res.status(405).json({ message: "method-not-allowed" });

	try {
		const parsedBody = z
			.object({
				username: z.string(),
			})
			.safeParse(req.body);

		if (parsedBody.success === false) return res.status(400).json({ message: "bad-request" });
		const { username } = parsedBody.data;

		if (username == "") {
			const session = await getServerSession(req, res, authOptions);
			if (!session) return res.status(401).json({ message: "unauthorized" });

			const user = await userdata.findById(session.id as string);
			if (!user) return res.status(401).json({ message: "unauthorized" });

			return res.status(200).json({ profile: user.profile, message: "success" });
		} else {
			// TODO: Remember to respect privacy settings
		}
	} catch (error) {
		return res.status(500).json({ message: "server-error" });
	}
}
