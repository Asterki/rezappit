import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import userdata from "@/models/userdata";
import { z } from "zod";

// Types
type ResponseDataGet = {
	preferences: {
		emails?: boolean;
		push?: boolean;
	} | null;
	message: "success" | "method-not-allowed" | "unauthorized" | "server-error" | "bad-request" | "not-found";
};
type ResponseDataPost = {
	message?: "success" | "method-not-allowed" | "unauthorized" | "server-error" | "bad-request" | "not-found";
};
type ResponseData<T extends "GET" | "POST"> = T extends "GET" ? ResponseDataGet : ResponseDataPost;

type RequestDataGet = {
	preferences: {
		hideEmail: "everyone" | "friends" | "none";
		hideProfile: "everyone" | "friends" | "none";
		hideActivity: "everyone" | "friends" | "none";
		hideProfilePicture: "everyone" | "friends" | "none";
	};
	message: "success" | "method-not-allowed" | "unauthorized" | "server-error" | "bad-request" | "not-found";
};
type RequestDataPost = {
	email: boolean;
	push: boolean;
};
type RequestData<T extends "GET" | "POST"> = T extends "GET" ? RequestDataGet : RequestDataPost;

import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const session = await getServerSession(req, res, authOptions);
	if (!session) return res.status(401).json({ message: "unauthorized" } as ResponseDataGet);

	if (req.method == "GET") {
		try {
			const data = await userdata.findById(session.user!.id);
			if (!data) return res.status(404).json({ message: "not-found" } as ResponseDataGet);

			return res.status(200).json({ message: "success", ...data.preferences.notifications } as ResponseDataGet);
		} catch (error) {
			return res.status(500).json({ message: "server-error" } as ResponseDataGet);
		}
	} else if (req.method == "POST") {
		try {
			const parsedBody = z
				.object({
					emails: z.boolean(),
					push: z.boolean(),
				})
				.safeParse(req.body);

			if (parsedBody.success === false) return res.status(400).json({ message: "bad-request" } as ResponseDataPost);

			const data = await userdata.findById(session.user!.id);
			if (!data) return res.status(404).json({ message: "not-found" } as ResponseDataPost);

			data.preferences.notifications = parsedBody.data;
			await data.save();

			return res.status(200).json({ message: "success" } as ResponseDataPost);
		} catch (error) {
			return res.status(500).json({ message: "server-error" } as ResponseDataPost);
		}
	} else return res.status(405).json({ message: "method-not-allowed" } as ResponseDataPost);
}

export type { ResponseData, RequestData };
