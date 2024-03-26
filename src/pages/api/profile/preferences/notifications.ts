import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import userdata from "@/models/userdata";
import { z } from "zod";

type ResponseData = {
	message?: "success" | "method-not-allowed" | "unauthorized" | "server-error" | "bad-request" | "not-found";
	emails?: boolean;
	push?: boolean;
};

interface RequestBody {
	email: boolean;
	push: boolean;
}

import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
	const session = await getServerSession(req, res, authOptions);
	if (!session) return res.status(401).json({ message: "unauthorized" });

	if (req.method == "GET") {
		try {
			const data = await userdata.findById(session.user!.id);
			if (!data) return res.status(404).json({ message: "not-found" });

			return res.status(200).json({ message: "success", ...data.preferences.notifications });
		} catch (error) {
			return res.status(500).json({ message: "server-error" });
		}
	} else if (req.method == "POST") {
		try {
			const parsedBody = z
				.object({
					emails: z.boolean(),
					push: z.boolean(),
				})
				.safeParse(req.body);

			if (parsedBody.success === false) return res.status(400).json({ message: "bad-request" });

			const data = await userdata.findById(session.user!.id);
			if (!data) return res.status(404).json({ message: "not-found" });

			data.preferences.notifications = parsedBody.data;
			await data.save();

			return res.status(200).json({ message: "success" });
		} catch (error) {
			return res.status(500).json({ message: "server-error" });
		}
	} else return res.status(405).json({ message: "method-not-allowed" });
}

export type { ResponseData, RequestBody };
