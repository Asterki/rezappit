import * as React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faPerson, faCompass, faMessage } from "@fortawesome/free-solid-svg-icons";

import NavbarComponent from "@/components/navbar";

import type { GetStaticProps, InferGetStaticPropsType } from "next";
type Props = {};

const HomePage = (_props: InferGetStaticPropsType<typeof getStaticProps>) => {
	const router = useRouter();
	const { t } = useTranslation(["main/index", "components/navbar"]);
	const { data: session } = useSession({
		required: true,
	});

	return (
		<div className="text-white bg-dark-1 min-h-screen flex justify-center">
			<NavbarComponent />

			<main className="flex justify-around mt-20 w-10/12">
				<div className="bg-neutral-900 w-3/12 p-4 sticky rounded-md text-neutral-300 justify-end self-start my-12">
					<h1 className="text-xl font-bold text-white">ReZappit</h1>

					<div className="transition-all hover:brightness-125 bg-neutral-900 rounded-md p-4 w-full flex items-center cursor-pointer my-2">
						<FontAwesomeIcon icon={faPerson} className="mr-2 w-4 h-4" />
						<p className="m-0">Profile</p>
					</div>

					<div className="transition-all hover:brightness-125 bg-neutral-900 rounded-md p-4 w-full flex items-center cursor-pointer my-2">
						<FontAwesomeIcon icon={faCompass} className="mr-2 w-4 h-4" />
						<p className="m-0">Explore</p>
					</div>

					<div className="transition-all hover:brightness-125 bg-neutral-900 rounded-md p-4 w-full flex items-center cursor-pointer my-2">
						<FontAwesomeIcon icon={faMessage} className="mr-2 w-4 h-4" />
						<p className="m-0">Messages</p>
					</div>

					<div
						className="transition-all hover:brightness-125 bg-neutral-900 rounded-md p-4 w-full flex items-center cursor-pointer my-2"
						onClick={() => router.push(`/${router.locale}/settings`)}
					>
						<FontAwesomeIcon icon={faGear} className="mr-2 w-4 h-4" />
						<p className="m-0">Settings</p>
					</div>
				</div>

				<div className="flex flex-col w-6/12">
					<div className="bg-neutral-900 rounded-md p-4 my-12">
						<h1 className="text-xl ">Feeling like posting something?</h1>
						<input
							type="text"
							className="bg-neutral-800 text-white p-2 rounded-md my-2 w-full"
							placeholder="What's on your mind?"
						/>

						<div className="flex items-center justify-between flex-1 mt-2">
							<button className="bg-neutral-700 text-white rounded-md p-2 w-3/12 mr-2">Post</button>
							<button className="bg-neutral-700 text-white rounded-md p-2 w-3/12 mx-2">Post</button>
							<button className="bg-neutral-700 text-white rounded-md p-2 w-3/12 mx-2">Post</button>
							<button className="bg-neutral-700 text-white rounded-md p-2 w-3/12 ml-2">Post</button>
						</div>
					</div>

					<div className="bg-neutral-900 rounded-md p-4 h-24 w-full">This si some content</div>
				</div>
			</main>
		</div>
	);
};

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale ?? "en", ["auth/signout"])),
	},
});

export default HomePage;
