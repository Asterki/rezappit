import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import userdata from "@/models/userdata";
import { z } from "zod";

type Data = {
	message?: "success" | "method-not-allowed" | "unauthorized" | "server-error" | "bad-request" | "not-found";
};

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Session } from "next-auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	if (req.method !== "POST") return res.status(405).json({ message: "method-not-allowed" });

	const session = await getServerSession(req, res, authOptions);
	if (!session) return res.status(401).json({ message: "unauthorized" });

	try {
		const parsedBody = z
			.object({
				bio: z.string().max(100),
			})
			.safeParse(req.body);

		if (parsedBody.success === false) return res.status(400).json({ message: "bad-request" });

		await userdata.findByIdAndUpdate((session as Session & { id: String }).id, { bio: parsedBody.data.bio });
		return res.status(200).json({ message: "success" });
	} catch (error) {
		return res.status(500).json({ message: "server-error" });
	}
}

export type { Data };
