import * as nextAuth from "next-auth";

// Override the session type
declare module "next-auth" {
	interface Session extends nextAuth.Session {
		user?: {
			name: string;
			email: string;
			image: string;
			id: string;
			username: string;
		};
		expires: ISODateString;
	}
}
