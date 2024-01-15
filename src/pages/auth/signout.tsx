import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";

import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Head from "next/head";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faBan } from "@fortawesome/free-solid-svg-icons";

import { GetStaticProps, InferGetStaticPropsType } from "next";

interface Props {}

const SignOut = (_props: InferGetStaticPropsType<typeof getStaticProps>) => {
	const router = useRouter();
	const { t } = useTranslation(["auth/signout"]);
	const { data: session, status: loggedInStatus } = useSession({
		required: true,
		onUnauthenticated() {
			router.push(`/auth/signin`);
		},
	});

	return (
		<div className="text-white bg-neutral-900">
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
					<section className="md:w-4/12 w-11/12">
						<div className="my-4 text-gray-100 text-center">
							<h1 className="text-[50px] font-black mb-4">{t("title")}</h1>
							<p>{t("desc")}</p>
						</div>

						<div className="text-center">
							<button
								className="bg-neutral-800 hover:bg-red-400 transition-all w-11/12 lg:w-9/12 my-2 p-4 rounded-lg shadow-md"
								onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
							>
								<FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
								{t("buttons.signout")}
							</button>

							<button
								className="bg-neutral-800 hover:brightness-125 transition-all w-11/12 lg:w-9/12 my-2 p-4 rounded-lg shadow-md"
								onClick={() => router.push(`/${router.locale}/app`)}
							>
								<FontAwesomeIcon icon={faBan} className="mr-2" />
								{t("buttons.cancel")}
							</button>
						</div>
					</section>
				</main>
			)}
		</div>
	);
};

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale ?? "en", ["auth/signout", "components/navbar"])),
	},
});

export default SignOut;
