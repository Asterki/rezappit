import * as React from "react";
import axios, { AxiosResponse } from "axios";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Image from "next/image";
import NavbarComponent from "@/components/navbar";
import SettingsLeftBarComponent from "@/components/profile/settingsLeftBar";
import NotificationComponent from "@/components/notification";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faPencil, faSpinner } from "@fortawesome/free-solid-svg-icons";

// API Types
import type { Data as FetchProfileDataResponse } from "@/pages/api/profile/fetch";

import type { GetStaticProps, InferGetStaticPropsType } from "next";
type Props = {};

const SettingsProfilePage = (_props: InferGetStaticPropsType<typeof getStaticProps>) => {
	const router = useRouter();
	const { t } = useTranslation(["main/index", "components/navbar"]);
	const {
		data: session,
		status: loggedInStatus,
		update,
	} = useSession({
		required: true,
	});

	const [profile, setProfile] = React.useState({
		bio: "",
		username: "",
		name: "",
	});

	// Input related
	const [nameInputStatus, setNameInputStatus] = React.useState<"editing" | "showing" | "saving">("showing");
	const [usernameInputStatus, setUsernameInputStatus] = React.useState<"editing" | "showing" | "saving">("showing");
	const [bioInputStatus, setBioInputStatus] = React.useState<"editing" | "showing" | "saving">("showing");

	const bioInput = React.useRef<HTMLInputElement>(null);

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

	const updateProfile = async () => {
		const parsedProfile = z
			.object({
				bio: z.string().max(100),
				name: z.string().min(2).max(40),
				username: z.string().min(2).max(22),
			})
			.safeParse(profile);

		if (!parsedProfile.success) {
			setModalInfo({
				title: "Error!",
				message: "There was an error updating your profile!",
				type: "error",
				dismissButtonText: "Done",
			});
			setShowingModal(true);
			return;
		}

		const response: AxiosResponse<FetchProfileDataResponse> = await axios({
			method: "post",
			url: "/api/profile/update",
			data: {
				...parsedProfile.data,
			},
		});

		setModalInfo({
			title: "Profile updated!",
			message: "Your profile has been updated successfully!",
			type: "info",
			dismissButtonText: "Done",
		});
		setShowingModal(true);

		setNameInputStatus("showing");
		setUsernameInputStatus("showing");
		setBioInputStatus("showing");
	};

	React.useEffect(() => {
		(async () => {
			if (loggedInStatus !== "authenticated" || !session.user) return;

			const response: AxiosResponse<FetchProfileDataResponse> = await axios({
				method: "post",
				url: "/api/profile/fetch",
				data: {
					username: "s", // The "s" stands for "self", as in the user is fetching their own profile
				},
			});

			console.log(response, session)

			if (response.data.profile)
				setProfile({
					name: session.user.name,
					username: session.user.username,
					bio: response.data.profile?.bio,
				});
		})();
	}, [loggedInStatus, session]);

	return (
		<div className="text-white bg-dark-1 min-h-screen flex justify-center">
			<NavbarComponent />

			<NotificationComponent
				showing={showingModal}
				setShowing={setShowingModal}
				type={modalInfo.type}
				title={modalInfo.title}
				message={modalInfo.message}
				dismissButtonText={modalInfo.dismissButtonText}
			/>

			{loggedInStatus == "authenticated" && session.user ? (
				<main className="flex lg:flex-row flex-col lg:justify-around mt-20 w-10/12 ">
					<SettingsLeftBarComponent router={router} activeCategory="profile" />

					<div className="flex flex-col lg:w-6/12 w-full items-center my-12 rounded-md bg-neutral-900 p-4">
						<h1 className="text-2xl font-bold text-center">Profile Settings</h1>

						<section className="flex items-center flex-col my-4 w-full py-2">
							<Image
								width={100}
								height={100}
								className="rounded-full"
								src={session.user.image || "https://placehold.co/400x400"}
								alt={"session.user.name"}
							/>

							<div className="flex items-center mt-2 justify-center relative group">
								<p className={`text-xl  mr-2 ${nameInputStatus !== "editing" ? "block" : "hidden"}`}>
									{profile.name}
								</p>
								<input
									type="text"
									placeholder="Empty"
									defaultValue={session.user.name!}
									onChange={e => {
										setProfile({
											...profile,
											name: e.target.value,
										});
									}}
									id="name-input"
									className={`mr-2 bg-transparent p-2 w-full rounded-md outline-none transition-all placeholder:text-neutral-400 hover:bg-dark-2 focus:box-shadow-md focus:bg-dark-2 ${
										nameInputStatus == "editing" ? "block" : "hidden"
									}`}
								/>
								{nameInputStatus !== "saving" && (
									<FontAwesomeIcon
										icon={nameInputStatus == "editing" ? faFloppyDisk : faPencil}
										onClick={() => {
											if (nameInputStatus == "editing") {
												setNameInputStatus("saving");
												updateProfile();
											} else {
												setNameInputStatus("editing");
											}
										}}
										className="absolute right-[-15px] text-neutral-400 transition-all cursor-pointer"
									/>
								)}
								{nameInputStatus == "saving" && (
									<FontAwesomeIcon
										icon={faSpinner}
										onClick={() => {
											setNameInputStatus("saving");
											if (nameInputStatus) updateProfile();
										}}
										className="absolute right-[-15px] text-neutral-400 transition-all cursor-pointer animate-spin"
									/>
								)}
							</div>

							<div className="flex items-center mt-2 justify-center relative group">
								<p
									className={`text-neutral-400 mr-2 ${
										usernameInputStatus !== "editing" ? "block" : "hidden"
									}`}
								>
									@{profile.username}
								</p>

								<input
									type="text"
									placeholder="Empty"
									defaultValue={profile.username}
									onChange={e => {
										setProfile({
											...profile,
											username: e.target.value,
										});
									}}
									id="name-input"
									className={`mr-2 bg-transparent p-2 w-full rounded-md outline-none transition-all placeholder:text-neutral-400 hover:bg-dark-2 focus:box-shadow-md focus:bg-dark-2 ${
										usernameInputStatus == "editing" ? "block" : "hidden"
									}`}
								/>

								{usernameInputStatus !== "saving" && (
									<FontAwesomeIcon
										icon={usernameInputStatus == "editing" ? faFloppyDisk : faPencil}
										onClick={() => {
											if (usernameInputStatus == "editing") {
												setUsernameInputStatus("saving");
												updateProfile();
											} else {
												setUsernameInputStatus("editing");
											}
										}}
										className="absolute right-[-15px] text-neutral-400 transition-all cursor-pointer"
									/>
								)}
								{usernameInputStatus == "saving" && (
									<FontAwesomeIcon
										icon={faSpinner}
										onClick={() => {
											setUsernameInputStatus("saving");
											if (usernameInputStatus) updateProfile();
										}}
										className="absolute right-[-15px] text-neutral-400 transition-all cursor-pointer animate-spin"
									/>
								)}
							</div>
						</section>

						<section className="lg:w-7/12 w-full mt-6 flex items-center relative group">
							<p className="font-semibold mr-2">Bio</p>

							<p className={` mr-2 ${bioInputStatus !== "editing" ? "block" : "hidden"}`}>
								{profile.bio.length > 0 ? profile.bio : "Empty"}
							</p>

							<input
								ref={bioInput}
								type="text"
								placeholder="Empty"
								maxLength={100}
								defaultValue={profile.bio}
								onChange={e => {
									setProfile({
										...profile,
										bio: e.target.value,
									});
								}}
								id="bio-input"
								className={`peer bg-transparent p-2 w-full rounded-md outline-none transition-all placeholder:text-neutral-400 hover:bg-dark-2 focus:box-shadow-md focus:bg-dark-2 mr-2 ${
									bioInputStatus == "editing" ? "block" : "hidden"
								}`}
							/>

							{bioInputStatus !== "saving" && (
								<FontAwesomeIcon
									icon={bioInputStatus == "editing" ? faFloppyDisk : faPencil}
									onClick={() => {
										if (bioInputStatus == "editing") {
											setBioInputStatus("saving");
											updateProfile();
										} else {
											setBioInputStatus("editing");
										}
									}}
									className="absolute right-[-15px] text-neutral-400 transition-all cursor-pointer"
								/>
							)}
							{bioInputStatus == "saving" && (
								<FontAwesomeIcon
									icon={faSpinner}
									onClick={() => {
										setBioInputStatus("saving");
										if (bioInputStatus) updateProfile();
									}}
									className="absolute right-[-15px] text-neutral-400 transition-all cursor-pointer animate-spin"
								/>
							)}

							<p className="absolute text-sm text-neutral-400 transition-all cursor-pointer top-10 right-0 peer-hover:opacity-100 peer-focus:opacity-100 opacity-0">
								{profile.bio.length}/100
							</p>
						</section>
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

export default SettingsProfilePage;
