import * as React from "react";
import axios, { AxiosResponse } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import Image from "next/image";
import NavbarComponent from "@/components/navbar";
import SettingsLeftBarComponent from "@/components/profile/settingsLeftBar";
import NotificationComponent from "@/components/notification";
import * as Select from "@radix-ui/react-select";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import type { GetStaticProps, InferGetStaticPropsType } from "next";
type Props = {};

const SettingsGeneral = (_props: InferGetStaticPropsType<typeof getStaticProps>) => {
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
		<div className="text-white bg-dark-1 flex justify-center w-full">
			<NavbarComponent user={session?.user} />

			<NotificationComponent
				showing={showingModal}
				setShowing={setShowingModal}
				type={modalInfo.type}
				title={modalInfo.title}
				message={modalInfo.message}
				dismissButtonText={modalInfo.dismissButtonText}
			/>

			{loggedInStatus == "authenticated" && session.user ? (
				<main className="flex lg:flex-row flex-col mt-20 w-full">
					<SettingsLeftBarComponent activeCategory="general" router={router} />

					<div className="flex flex-col lg:w-6/12 w-full my-12 rounded-md p-4">
						<h1 className="text-3xl font-bold">General Settings</h1>

						<div className="my-2 flex items-center justify-between">
							<div>
								<h1 className="text-2xl">Language</h1>
								<p className="text-xs text-white/80">Choose your preferred language</p>
							</div>
							<div>
								<Select.Root defaultValue="en">
									<Select.Trigger className="bg-dark-2 p-2 rounded-md w-full">
										<Select.Value placeholder="Select a fruit…" />
										ewqeqw
									</Select.Trigger>

									<Select.Portal>
										<Select.Content asChild={true} className="bg-dark-2 p-2 rounded-md w-full">
											<Select.Viewport>
												<Select.Item value="es">Spanish</Select.Item>
												<Select.Item value="en">English</Select.Item>
											</Select.Viewport>
										</Select.Content>
									</Select.Portal>
								</Select.Root>
							</div>
						</div>

						<div className="my-2">
							<h1 className="text-2xl">Theme</h1>
							<p className="text-xs text-white/80">Choose your preferred theme</p>
						</div>
					</div>
				</main>
			) : (
				<main className="flex justify-around mt-20 w-10/12">Loading your session...</main>
			)}
		</div>
	);
};

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale ?? "en", ["auth/signout"])),
	},
});

export default SettingsGeneral;
