import * as React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Image from "next/image";
import NavbarComponent from "@/components/navbar";
import SettingsLeftBarComponent from "@/components/profile/settingsLeftBar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faPencil } from "@fortawesome/free-solid-svg-icons";

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

	const [bio, setBio] = React.useState<string>("");

	const [editingName, setEditingName] = React.useState<boolean>(false);
	const [editingBio, setEditingBio] = React.useState<boolean>(false);

	const bioInput = React.useRef<HTMLInputElement>(null);

	return (
		<div className="text-white bg-dark-1 min-h-screen flex justify-center">
			<NavbarComponent />

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
								<p className={`text-xl  mr-2 ${!editingName ? "block" : "hidden"}`}>
									{session.user.name}
								</p>
								<input
									type="text"
									placeholder="Empty"
									defaultValue={session.user.name!}
									onChange={e => {}}
									id="name-input"
									className={`mr-2 bg-transparent p-2 w-full rounded-md outline-none transition-all placeholder:text-neutral-400 hover:bg-dark-2 focus:box-shadow-md focus:bg-dark-2 ${
										editingName ? "block" : "hidden"
									}`}
								/>

								<FontAwesomeIcon
									icon={editingName ? faFloppyDisk : faPencil}
									onClick={() => {
										setEditingName(!editingName);
									}}
									className="absolute right-[-15px] text-neutral-400 transition-all cursor-pointer"
								/>
							</div>
							<p className="text-neutral-400">{session.user.email}</p>
						</section>

						<section className="lg:w-7/12 w-full mt-6 flex items-center relative group">
							<p className="font-semibold mr-2">Bio</p>

							<p className={` mr-2 ${!editingBio ? "block" : "hidden"}`}>
								{session.user.name} bio and stuff right
							</p>

							<input
								ref={bioInput}
								type="text"
								placeholder="Empty"
								maxLength={100}
								defaultValue={bio}
								onChange={e => {
									setBio(e.target.value);
								}}
								id="bio-input"
								className={`peer bg-transparent p-2 w-full rounded-md outline-none transition-all placeholder:text-neutral-400 hover:bg-dark-2 focus:box-shadow-md focus:bg-dark-2 mr-2 ${
									editingBio ? "block" : "hidden"
								}`}
							/>

							<FontAwesomeIcon
								icon={editingBio ? faFloppyDisk : faPencil}
								onClick={() => {
									setEditingBio(!editingBio);
								}}
								className="absolute right-[-15px] text-neutral-400 transition-all cursor-pointer"
							/>

							<p className="absolute text-sm text-neutral-400 transition-all cursor-pointer top-10 right-0 peer-hover:opacity-100 peer-focus:opacity-100 opacity-0">
								{bio.length}/100
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
