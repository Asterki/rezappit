import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";

import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Head from "next/head";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faBan } from "@fortawesome/free-solid-svg-icons";

import { GetStaticProps, InferGetStaticPropsType } from "next";

interface Props {}

const CreatePostPage = (_props: InferGetStaticPropsType<typeof getStaticProps>) => {
	const router = useRouter();
	const { t } = useTranslation(["auth/signout"]);
	const { data: session, status: loggedInStatus } = useSession({
		required: true,
		onUnauthenticated() {
			router.push(`/auth/signin`);
		},
	});

	return (
		<div className="text-white bg-dark-2">
			<Head>
				<title>{t("pageTitle")}</title>
			</Head>

			{loggedInStatus == "loading" && (
				<main className="absolute w-full min-h-screen text-white bg-dark1">
					<p className="text-2xl text-center text-primary font-bold transition-all duration-500 transform hover:scale-105">
						{t("loading")}
					</p>
				</main>
			)}

			{loggedInStatus == "authenticated" && (
				<main className="min-h-screen flex flex-col justify-center items-center lg:p-12">
					<input type="text" className="text-white bg-dark-2 outline-none border-2 border-dark-3 rounded-lg p-2 w-full focus:border-primary transition-all" />
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

export default CreatePostPage;
