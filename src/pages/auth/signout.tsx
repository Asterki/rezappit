import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";

import Head from "next/head";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faBan } from "@fortawesome/free-solid-svg-icons";


const SignOut = () => {
	const router = useRouter();
	const { data: session, status: loggedInStatus } = useSession({
		required: true,
		onUnauthenticated() {
			router.push(`/${router.locale}/auth/signin`);
		},
	});

	return (
		<div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
			<Head>
				<title></title>
			</Head>

			{loggedInStatus == "loading" && (
				<main className="absolute w-full min-h-screen text-white bg-dark1">
					<p className="text-2xl text-center text-primary font-bold transition-all duration-500 transform hover:scale-105">
						Loading...
					</p>
				</main>
			)}

			{loggedInStatus == "authenticated" && (
				<main className="min-h-screen flex flex-col justify-center items-center lg:p-12">
					<section className="md:w-4/12 w-11/12">
						<div className="my-4 text-gray-100 text-center">
							<h1 className="text-3xl"></h1>
							<p></p>
						</div>

						<button
							className="bg-white/20 hover:bg-red1 w-full shadow-md rounded-md p-4 transition-all"
							onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
						>
							<FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
							Sign Out
						</button>

						<br />
						<br />

						<button
							className="bg-white/20 hover:bg-primary w-full shadow-md rounded-md p-4 transition-all"
							onClick={() => router.push(`/${router.locale}/app`)}
						>
							<FontAwesomeIcon icon={faBan} className="mr-2" />
							Cancel
						</button>
					</section>
				</main>
			)}
		</div>
	);
};


export default SignOut;
