import * as React from "react";
import axios, { AxiosResponse } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import Image from "next/image";
import NavbarComponent from "@/components/navbar";
import SettingsLeftBarComponent from "@/components/profile/settingsLeftBar";
import NotificationComponent from "@/components/notification";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import type { GetStaticProps, InferGetStaticPropsType } from "next";
type Props = {};

const SettingsPrivacy = (_props: InferGetStaticPropsType<typeof getStaticProps>) => {
	const router = useRouter();
	const { t } = useTranslation(["main/index", "components/navbar"]);
	const {
		data: session,
		status: loggedInStatus,
		update,
	} = useSession({
		required: true,
	});

    // Modal related
	const [showingModal, setShowingModal] = React.useState<boolean>(false);
	const [modalInfo, setModalInfo] = React.useState<{
		title: string;
		message: string;
		type: "success" | "error" | "info";
		dismissButtonText: string;
	}>({
		title: "",
		message: "",
		type: "success",
		dismissButtonText: "",
	});

	return (
		<div className="text-white bg-dark-1 min-h-screen flex justify-center w-full">
			<NavbarComponent user={session?.user} />

			<NotificationComponent
				showing={showingModal}
				setShowing={setShowingModal}
				type={modalInfo.type}
				title={modalInfo.title}
				message={modalInfo.message}
				dismissButtonText={modalInfo.dismissButtonText}
			/>
		</div>
	);
};

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale ?? "en", ["auth/signout"])),
	},
});

export default SettingsPrivacy;
