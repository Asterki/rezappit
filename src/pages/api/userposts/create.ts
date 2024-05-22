import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import formidable, { IncomingForm } from "formidable";
import { v4 as uuidv4 } from "uuid";
import fs from "fs-extra";
import sharp from "sharp";
import path from "path";

import PostModel, { PostModelType } from "@/models/post";
import { z } from "zod";

import { HydratedDocument } from "mongoose";

// Types
type ResponseData = {
	message: "success" | "method-not-allowed" | "unauthorized" | "server-error" | "bad-request";
};
type RequestDataPost = {
	theme: "light" | "dark";
	language: "en" | "es" | "fr" | "de";
};

import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") return res.status(405).json({ message: "method-not-allowed" });

	const session = await getServerSession(req, res, authOptions);
	if (!session) return res.status(401).json({ message: "unauthorized" });

	try {
		// Read the file
		const data: { files: formidable.Files; fields: formidable.Fields } = await new Promise((resolve, reject) => {
			const form = new IncomingForm();
			form.parse(req, (err, fields, files) => {
				// TODO: Add filter to only allow images
				if (err) return reject(err);

				resolve({ fields, files });
			});
		});

		if (!data.files.postImage) return res.status(400).json({ message: "bad-request" });
		let file = data.files.postImage[0];

		// Create the directory if it doesn't exist
		if (!fs.existsSync(path.join(process.cwd(), "/public/data/ewqprofile-pictures/", session.user!.id))) {
			fs.mkdirpSync(path.join(process.cwd(), "/public/data/ewqprofile-pictures/", session.user!.id));
		}

		let imgID = uuidv4();

		// Save the image
		let newPath =
			path.join(process.cwd(), "/public/data/post-images/", session.user!.id) + "/" + imgID + "." + "png";
		let rawData = fs.readFileSync(file.filepath);

		// Compress the file
		await sharp(rawData)
			.resize(256, 256)
			.png()
			.toBuffer()
			.then(data => {
				rawData = data;
			});

		fs.writeFile(newPath, rawData, function (err) {
			if (err) console.log(err);
		});

		// TODO: Update the user's posts

		return res.status(200).json({ message: "success" });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "server-error" });
	}
}
