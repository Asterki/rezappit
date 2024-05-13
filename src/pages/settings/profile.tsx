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
import type { ResponseData as ProfileDataResponse } from "@/pages/api/profile";
import type { ResponseData as ProfilePictureUploadDataResponse } from "@/pages/api/profile/picture/upload";

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
		imageID: "",
	});

	// Input related
	const [nameInputStatus, setNameInputStatus] = React.useState<"editing" | "showing" | "saving">("showing");
	const [usernameInputStatus, setUsernameInputStatus] = React.useState<"editing" | "showing" | "saving">("showing");
	const [bioInputStatus, setBioInputStatus] = React.useState<"editing" | "showing" | "saving">("showing");

	const profileUploadInput = React.useRef<HTMLInputElement>(null);
	const profileColorInput = React.useRef<HTMLInputElement>(null);

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
			return setShowingModal(true);
		}

		try {
			const response: AxiosResponse<ProfileDataResponse<"POST">> = await axios.post("/api/profile/update", parsedProfile.data);
			if (response.data.message == "success") {
				setModalInfo({
					title: "Profile updated!",
					message: "Your profile has been updated successfully!",
					type: "info",
					dismissButtonText: "Done",
				});
				setShowingModal(true);
			} else {
				throw new Error("An error occurred while updating your profile.");	
			}
		} catch (err) {
			setModalInfo({
				title: "Error!",
				message: "There was an error updating your profile!",
				type: "error",
				dismissButtonText: "Done",
			});
			setShowingModal(true);
			console.error(err);
		}

		setNameInputStatus("showing");
		setUsernameInputStatus("showing");
		setBioInputStatus("showing");
	};

	React.useEffect(() => {
		(async () => {
			if (loggedInStatus !== "authenticated" || !session.user) return;

			try {
				const response: AxiosResponse<ProfileDataResponse<"GET">> = await axios.get("/api/profile/");
				if (response.data.profile && session.user)
					setProfile({
						name: session.user.name,
						username: session.user.username,
						bio: response.data.profile?.bio,
						imageID: response.data.profile?.imageID,
					});
				else {
					throw new Error("An error occurred while fetching your profile.");
				}
			} catch (error) {
				setModalInfo({
					title: "Error!",
					message: "There was an error fetching your profile!",
					type: "error",
					dismissButtonText: "Done",
				});
				setShowingModal(true);
				console.error(error);
			}
		})();
	}, [loggedInStatus, session]);

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
					<SettingsLeftBarComponent router={router} activeCategory="profile" />

					<div className="flex flex-col lg:w-6/12 w-full my-12 rounded-md p-4">
						<h1 className="text-3xl font-bold">Profile Settings</h1>

						<section className="flex flex-col my-4 w-full py-2">
							<div>
								<div
									className="w-full h-32 bg-red-500 rounded-md group relative transition-all hover:brightness-75 cursor-pointer"
									onClick={() => {
										profileColorInput.current?.click();
									}}
								>
									<input type="color" className="hidden" ref={profileColorInput} />

									<FontAwesomeIcon
										icon={faPencil}
										className="absolute text-lg text-white transition-all cursor-pointer top-1/2 right-1/2 translate-x-[50%] translate-y-[-50%] group-hover:opacity-100 peer-focus:opacity-100 opacity-0"
									/>
								</div>

								<div className="flex">
									<div
										className="group relative rounded-full w-36 mt-[-4rem] ml-8 border-4 border-dark-1"
										onClick={() => {
											profileUploadInput.current?.click();
										}}
									>
										<input
											type="file"
											className="hidden"
											ref={profileUploadInput}
											accept="image/x-png,image/jpeg"
											onChange={async e => {
												const file = e.target.files?.[0];
												if (!file) return;

												const formData = new FormData();
												formData.append("profile", file);

												const response: AxiosResponse<ProfilePictureUploadDataResponse> =
													await axios({
														method: "post",
														url: "/api/profile/picture/upload",
														data: formData,
														headers: {
															"Content-Type": "multipart/form-data",
														},
													});

												if (response.data.message == "success") {
													update();
												}
											}}
										/>

										<Image
											width={200}
											height={200}
											className="rounded-full transition-all group-hover:brightness-50 cursor-pointer"
											src={ 
												profile.imageID == ""
													? "/images/default-profile.png"
													: `/data/profile-pictures/${session.user.id}/${profile.imageID}.png`
											}
											alt={"session.user.name"}
										/>

										<FontAwesomeIcon
											icon={faPencil}
											className="absolute text-lg text-white transition-all cursor-pointer top-1/2 right-1/2 translate-x-[50%] translate-y-[-50%] group-hover:opacity-100 peer-focus:opacity-100 opacity-0"
										/>
									</div>

									<div className="ml-4">
										<div className="flex items-center mt-2 relative group">
											<p
												className={`text-xl  mr-2 ${
													nameInputStatus !== "editing" ? "block" : "hidden"
												}`}
											>
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
												className={`mr-2 bg-transparent p-2 w-full rounded-md outline-none border-2 border-neutral-700 transition-all placeholder:text-neutral-400 hover:bg-dark-2 focus:box-shadow-md focus:bg-dark-2 ${
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
													className="absolute right-[-15px] group-hover:opacity-100 opacity-0 text-neutral-400 transition-all cursor-pointer"
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

											<p className="absolute text-sm text-neutral-400 transition-all cursor-pointer top-10 right-0 peer-hover:opacity-100 peer-focus:opacity-100 opacity-0">
												{profile.bio.length}/100
											</p>
										</div>

										<div className="flex items-center relative group">
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
												max={22}
												id="name-input"
												className={`mr-2 bg-transparent p-2 w-full rounded-md outline-none border-2 border-neutral-700 transition-all placeholder:text-neutral-400 hover:bg-dark-2 focus:box-shadow-md focus:bg-dark-2 ${
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
													className="absolute right-[-15px] group-hover:opacity-100 opacity-0 text-neutral-400 transition-all cursor-pointer"
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

											<p className="absolute text-sm text-neutral-400 transition-all cursor-pointer top-10 right-0 peer-hover:opacity-100 peer-focus:opacity-100 opacity-0">
												{profile.username.length}/22
											</p>
										</div>
									</div>
								</div>
							</div>
						</section>

						<section className="lg:w-7/12 w-full mt-6 flex items-center relative group">
							<p className="font-semibold mr-2">Bio</p>

							<p className={` mr-2 ${bioInputStatus !== "editing" ? "block" : "hidden"}`}>
								{profile.bio.length > 0 ? profile.bio : "Empty"}
							</p>

							<input
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
								className={`peer bg-transparent p-2 w-full rounded-md outline-none transition-all placeholder:text-neutral-400 border-2 border-neutral-700 hover:bg-dark-2 focus:box-shadow-md focus:bg-dark-2 mr-2 ${
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
									className="absolute right-[-15px] group-hover:opacity-100 opacity-0 text-neutral-400 transition-all cursor-pointer"
								/>
							)}
							{bioInputStatus == "saving" && (
								<FontAwesomeIcon
									icon={faSpinner}
									onClick={() => {
										setBioInputStatus("saving");
										if (bioInputStatus) updateProfile();
									}}
									className="absolute right-[-15px] group-hover:opacity-100 opacity-0 text-neutral-400 transition-all cursor-pointer animate-spin"
								/>
							)}

							<p className="absolute text-sm mt-[2px] text-neutral-400 transition-all cursor-pointer top-10 right-0 peer-hover:opacity-100 peer-focus:opacity-100 opacity-0">
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
