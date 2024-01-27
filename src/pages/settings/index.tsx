import * as React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import NavbarComponent from "@/components/navbar";
import SettingsLeftBarComponent from "@/components/profile/settingsLeftBar";

import type { GetStaticProps, InferGetStaticPropsType } from "next";
type Props = {};

const SettingsIndexPage = (_props: InferGetStaticPropsType<typeof getStaticProps>) => {
	const router = useRouter();
	const { t } = useTranslation(["main/index", "components/navbar"]);
	const { data: session, status: loggedInStatus } = useSession({
		required: true,
	});
	return (
		<div className="text-white bg-dark-1 min-h-screen flex justify-center">
			<NavbarComponent />

			{loggedInStatus == "authenticated" ? (
				<main className="flex justify-around mt-20 w-10/12 ">
					<SettingsLeftBarComponent router={router} activeCategory="general" />

					<div className="flex flex-col w-6/12 items-center my-12 rounded-md bg-neutral-900 p-4">
						<h1 className="text-2xl font-bold text-center">Settings</h1>

						<section className="py-2">
							<button className="font-semibold w-11/12 p-[10px] px-20 rounded-md bg-blue-400 border-2 border-blue-400 my-2 hover:brightness-110 transition-all">
								Primary
							</button>
							<button className="font-semibold w-11/12 p-[10px] px-20 rounded-md bg-neutral-800 border-2 border-neutral-600 my-2 hover:brightness-110 transition-all">
								Sec
							</button>
							<button className="font-semibold w-11/12 p-[10px]  px-20 rounded-md bg-gray-300 border-2 border-gray-400 my-2 hover:brightness-110 transition-all">
								Third
							</button>
							<button className="font-semibold w-11/12 p-[10px] px-20 rounded-md bg-red-500 border-2 border-red-600 my-2 hover:brightness-110 transition-all">
								Destructive
							</button>
						</section>
					</div>
				</main>
			) : (
				<main className="flex justify-around mt-20 w-10/12">
                    Loading your session...
                </main>
			)}
		</div>
	);
};

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale ?? "en", ["auth/signout"])),
	},
});

export default SettingsIndexPage;
