import * as React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";



import type { GetStaticProps, InferGetStaticPropsType } from "next";
type Props = {};

const MainIndex = (_props: InferGetStaticPropsType<typeof getStaticProps>) => {
	const router = useRouter();
	const { t } = useTranslation(["main/index", "components/navbar"]);
    const { data: session } = useSession({
        required: false,
    });

	return (
		<div className="text-white bg-dark-1 min-h-screen flex justify-center">
			<main>
				<p className="text-2xl">So yeah this is zappit</p>

				<div className="flex items-center justify-center">
					<button
						className="p-2 m-2 bg-neutral-400 rounded-md"
						onClick={() => {
							router.push("/auth/signin");
						}}
					>
						Login then
					</button>
					<button
						className="p-2 m-2 bg-neutral-400 rounded-md"
						onClick={() => router.push(`/home`)}
					>
						Home
					</button>
				</div>
			</main>
		</div>
	);
};

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale ?? "en", ["main/index", "components/navbar"])),
    },
});


export default MainIndex;
