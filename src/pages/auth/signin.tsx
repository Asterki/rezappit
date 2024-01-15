import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";

import Head from "next/head";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faGithub, faDiscord } from "@fortawesome/free-brands-svg-icons";

import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

export default function SignIn({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<div className="text-white bg-neutral-900 flex flex-col items-center justify-center min-h-screen">
			<Head>
				<title>ewq</title>
			</Head>

			<main className="min-h-screen flex flex-col justify-center items-center w-11/12 lg:w-1/2">
				<section>
					<div className="my-4 text-gray-100 text-center">
						<p className="text-[50px] font-black mb-4">Login</p>
						<p>Please select a provider to log in to ReZappit</p>
					</div>

					<div className="text-center">
						{Object.values(providers).map(provider => {
							let icon = faGoogle;

							switch (provider.name) {
								case "Discord":
									icon = faDiscord;
									break;
								case "GitHub":
									icon = faGithub;
									break;
							}

							return (
								<div key={provider.name} className="">
									<button
										className="bg-neutral-800 hover:brightness-125 transition-all w-11/12 lg:w-9/12 my-2 p-4 rounded-lg shadow-md"
										onClick={() => signIn(provider.id)}
									>
										<FontAwesomeIcon className="mx-2" icon={icon} />
										Sign in with {provider.name}
									</button>
								</div>
							);
						})}
					</div>
				</section>
			</main>
		</div>
	);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const session = await getServerSession(context.req, context.res, authOptions);

	if (session) {
		return { redirect: { destination: "/home" } };
	}

	const providers = await getProviders();

	return {
		props: {
			providers: providers ?? [],
		},
	};
}
