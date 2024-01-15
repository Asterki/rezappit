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
			router.push(`/auth/signin`);
		},
	});

	return (
		<div className="text-white bg-neutral-900">
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
							<h1 className="text-[50px] font-black mb-4">Logout</h1>
							<p>Do you wish to log out of ReZappit?</p>
						</div>

						<div className="text-center">
							<button
								className="bg-neutral-800 hover:bg-red-400 transition-all w-11/12 lg:w-9/12 my-2 p-4 rounded-lg shadow-md"
								onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
							>
								<FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
								Sign Out
							</button>

							<button
								className="bg-neutral-800 hover:brightness-125 transition-all w-11/12 lg:w-9/12 my-2 p-4 rounded-lg shadow-md"
								onClick={() => router.push(`/${router.locale}/app`)}
							>
								<FontAwesomeIcon icon={faBan} className="mr-2" />
								Cancel
							</button>
						</div>
					</section>
				</main>
			)}
		</div>
	);
};

export default SignOut;
