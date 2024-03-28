import * as React from "react";
import axios, { AxiosResponse } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import Image from "next/image";
import NavbarComponent from "@/components/navbar";
import SettingsLeftBarComponent from "@/components/profile/settingsLeftBar";
import NotificationComponent from "@/components/notification";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useTranslation } from "next-i18next";

import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { RequestData, ResponseData } from "../api/profile/preferences/privacy";

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

	const [currentPreferences, setCurrentPreferences] = React.useState<null | ResponseData<"GET">["preferences"]>(null);

	// Fetch the current user's preferences
	React.useEffect(() => {
		if (session?.user) {
			axios
				.get("/api/profile/preferences/privacy")
				.then((res: AxiosResponse<ResponseData<"GET">>) => {
					if (res.status == 200) {
						console.log(res.data);
						setCurrentPreferences(res.data.preferences);
					}
				})
				.catch(err => {
					console.log(err);
				});
		}
	}, [session?.user]);

	React.useEffect(() => {
		if (currentPreferences) {
			axios
				.post("/api/profile/preferences/privacy", currentPreferences as RequestData<"POST">)
				.then((res: AxiosResponse<ResponseData<"POST">>) => {
					if (res.status == 200) {
						console.log(res.data);
						setShowingModal(true);
						setModalInfo({
							title: "Success",
							message: "Your preferences have been updated.",
							type: "success",
							dismissButtonText: "Close",
						});
					}
				})
				.catch(err => {
					setShowingModal(true);
					setModalInfo({
						title: "Error",
						message: "An error occurred while updating your preferences.",
						type: "error",
						dismissButtonText: "Close",
					});
					console.error(err);
				});
		}
	}, [currentPreferences]);

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

			{loggedInStatus == "authenticated" && session.user ? (
				<main className="flex lg:flex-row flex-col mt-20 w-full">
					<SettingsLeftBarComponent activeCategory="privacy" router={router} />

					<div className="flex flex-col lg:w-6/12 w-full my-12 rounded-md p-4">
						<h1 className="text-3xl font-bold">Privacy Settings</h1>

						<h1>hideEmail</h1>
						<select
							name=""
							id=""
							defaultValue={currentPreferences?.hideEmail}
							onChange={e => {
								setCurrentPreferences({
									...currentPreferences,
									hideEmail: e.target.value,
								} as ResponseData<"GET">["preferences"]);
							}}
						>
							<option value="everyone">Everyone</option>
							<option value="friends">Friends</option>
							<option value="none">None</option>
						</select>

						<h1>hideProfile</h1>
						<select
							name=""
							id=""
							defaultValue={currentPreferences?.hideProfile}
							onChange={e => {
								setCurrentPreferences({
									...currentPreferences,
									hideProfile: e.target.value,
								} as ResponseData<"GET">["preferences"]);
							}}
						>
							<option value="everyone">Everyone</option>
							<option value="friends">Friends</option>
							<option value="none">None</option>
						</select>

						<h1>hideActivity</h1>
						<select
							name=""
							id=""
							defaultValue={currentPreferences?.hideActivity}
							onChange={e => {
								setCurrentPreferences({
									...currentPreferences,
									hideActivity: e.target.value,
								} as ResponseData<"GET">["preferences"]);
							}}
						>
							<option value="everyone">Everyone</option>
							<option value="friends">Friends</option>
							<option value="none">None</option>
						</select>

						<h1>hideProfilePicture</h1>
						<select
							name=""
							id=""
							defaultValue={currentPreferences?.hideProfilePicture}
							onChange={e => {
								setCurrentPreferences({
									...currentPreferences,
									hideProfilePicture: e.target.value,
								} as ResponseData<"GET">["preferences"]);
							}}
						>
							<option value="everyone">Everyone</option>
							<option value="friends">Friends</option>
							<option value="none">None</option>
						</select>
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

export default SettingsPrivacy;
