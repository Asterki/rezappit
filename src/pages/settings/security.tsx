import * as React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import NavbarComponent from "@/components/navbar";
import SettingsLeftBarComponent from "@/components/profile/settingsLeftBar";

import type { GetStaticProps, InferGetStaticPropsType } from "next";
type Props = {};

const SettingsSecurityPage = (_props: InferGetStaticPropsType<typeof getStaticProps>) => {
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
					<SettingsLeftBarComponent router={router} activeCategory="security" />

					<div className="flex flex-col w-6/12 items-center my-12 rounded-md bg-neutral-900 p-4">
						<h1 className="text-2xl font-bold text-center">Settings</h1>
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

export default SettingsSecurityPage;
