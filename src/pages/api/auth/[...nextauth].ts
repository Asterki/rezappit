import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";

import NextAuth, { AuthOptions } from "next-auth";

import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

import UserDataModel, { UserDataModelType } from "@/models/userdata";
import UserModel from "@/models/user";
import mongoose from "mongoose";

export const authOptions: AuthOptions = {
	secret: process.env.SESSION_SECRET as string,
	adapter: MongoDBAdapter(clientPromise) as any,
	callbacks: {
		session: async data => {
			// Add the user id and username to session information, which can be used to fetch information about the user in the database
			const userData: mongoose.HydratedDocument<UserDataModelType> | null = await UserDataModel.findById(
				data.user.id,
			);
			if (!userData) return data.session;

			let newSession = {
				...data.session,
				user: { ...data.session.user, username: userData.profile.username, id: data.user.id },
			};

			return newSession;
		},
	},
	events: {
		// TODO: Save for user statistics and admin panel
		async createUser({ user }) {
			// Create a user profile
			await UserDataModel.create({
				_id: user.id,
				profile: {
					username: user.email!.split("@")[0] + Math.floor(Math.random() * 1000).toString(),
					imageID: "",
					bio: "",
				},
			});

			await UserModel.findByIdAndUpdate(user.id, { image: "" });
		},
	},
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
		GitHubProvider({
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
		}),
		DiscordProvider({
			clientId: process.env.DISCORD_CLIENT_ID as string,
			clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
		}),
	],
	pages: {
		signIn: "/auth/signin",
		signOut: "/auth/signout",
		// TODO: Create these pages
		// error: "/auth/error", // Error code passed in query string as ?error=
		// verifyRequest: "/auth/verify-request", // (used for check email message)
	},
};

export default NextAuth(authOptions);
