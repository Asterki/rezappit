import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import userdata from "@/models/userdata";
import { z } from "zod";

type Data = {
	profile?: {
		username: string;
		bio: string;
	};
	message?: "success" | "method-not-allowed" | "unauthorized" | "server-error" | "bad-request" | "not-found";
};

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Session } from "next-auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	if (req.method !== "POST") return res.status(405).json({ message: "method-not-allowed" });

	const session = await getServerSession(req, res, authOptions);

	try {
		const parsedBody = z
			.object({
				username: z.string(),
			})
			.safeParse(req.body);

		if (parsedBody.success === false) return res.status(400).json({ message: "bad-request" });

		if (parsedBody.data.username == "s") { // The "s" stands for "self", as in, the user is requesting their own profile
			if (!session) return res.status(401).json({ message: "unauthorized" });
			const data = await userdata.findById(session.user!.id);

			if (!data) return res.status(404).json({ message: "not-found" });
			return res.status(200).json({ profile: data.profile, message: "success" });
		} else {
			// // Profile privacy here
			// const profile = await userdata.findById((session as Session & { id: String }).id);
			// if (!profile) return res.status(404).json({ message: "not-found" });
			// return res.status(200).json({ profile, message: "success" });
		}
	} catch (error) {
		return res.status(500).json({ message: "server-error" });
	}
}

export type { Data };
