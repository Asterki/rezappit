import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import userdata from "@/models/userdata";
import user from "@/models/user";
import { z } from "zod";

type Data = {
	message?: "success" | "method-not-allowed" | "unauthorized" | "server-error" | "bad-request" | "not-found";
};

import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	if (req.method !== "POST") return res.status(405).json({ message: "method-not-allowed" });

	const session = await getServerSession(req, res, authOptions);
	if (!session) return res.status(401).json({ message: "unauthorized" });

	try {
		const parsedBody = z
			.object({
				bio: z.string().max(100),
				name: z.string().min(2).max(40),
				username: z.string().min(2).max(22),
			})
			.safeParse(req.body);

		if (parsedBody.success === false) return res.status(400).json({ message: "bad-request" });

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

		return res.status(200).json({ message: "success" });
	} catch (error) {
		return res.status(500).json({ message: "server-error" });
	}
}

export type { Data };
