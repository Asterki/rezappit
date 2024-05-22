/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import axios, { AxiosResponse } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faPerson, faCompass, faMessage, faCamera, faClose } from "@fortawesome/free-solid-svg-icons";

import NavbarComponent from "@/components/navbar";
import * as Dialog from "@radix-ui/react-dialog";

import type { GetStaticProps, InferGetStaticPropsType } from "next";
type Props = {};

const HomePage = (_props: InferGetStaticPropsType<typeof getStaticProps>) => {
	const router = useRouter();
	const { t } = useTranslation(["main/index", "components/navbar"]);
	const { data: session } = useSession({
		required: true,
	});

	// Dialog stuff
	const [postDialogOpen, setPostDialogOpen] = React.useState(false);
	const fileInputRef = React.useRef<HTMLInputElement>(null);
	const imageRef = React.useRef<HTMLImageElement>(null);
	const captionRef = React.useRef<HTMLInputElement>(null);

	const post = async () => {
		const file = fileInputRef.current?.files?.[0];
		if (!file) return alert("Add an image");

		const formData = new FormData();
		formData.append("postImage", file);

		const response: AxiosResponse = await axios({
			method: "post",
			url: "/api/userposts/create",
			data: formData,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		if (response.data.message == "success") {
			alert("posted");
		} else {
			console.error(response.data.message);
		}
	};

	return (
		<div className="text-white bg-dark-1 min-h-screen flex justify-center">
			<NavbarComponent user={session?.user} />

			{/* Post dialog */}
			<Dialog.Root
				open={postDialogOpen}
				onOpenChange={state => {
					setPostDialogOpen(state);
				}}
			>
				<Dialog.Overlay className="z-20 fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow" />
				<Dialog.Content className="z-30 shadow-md data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-900 p-4 rounded-md w-11/12 md:w-7/12 lg:w-5/12">
					<div className="flex items-center justify-between">
						<h1 className="text-xl font-bold">Create a post</h1>
						<FontAwesomeIcon
							icon={faClose}
							className="text-white/80 text-2xl cursor-pointer"
							onClick={() => {
								setPostDialogOpen(false);
							}}
						/>
					</div>

					<input
						type="file"
						accept="image/x-png,image/jpeg"
						className="hidden"
						ref={fileInputRef}
						onChange={e => {
							const file = e.target.files?.[0];
							if (!file) return (imageRef.current!.src = "");

							const reader = new FileReader();
							reader.onload = () => {
								imageRef.current!.src = reader.result as string;
							};
							reader.readAsDataURL(file);

							imageRef.current!.src = URL.createObjectURL(file);
						}}
					/>

					<div
						onClick={() => {
							fileInputRef.current?.click();
						}}
						className="w-full cursor-pointer transition-all hover:bg-white/5 border-2 border-white/30 border-dotted rounded-md my-2 p-4 flex items-center justify-center flex-col text-white/30"
					>
						<div className="py-32 flex flex-col items-center">
							<FontAwesomeIcon icon={faCamera} className="w-16 h-16 text-2xl" />
							<p className="text-2xl">Select an image</p>
						</div>

						<img src="" ref={imageRef} className="max-h-64 w-auto data" alt="" />
					</div>

					<input
						placeholder="Add a caption"
						type="text"
						ref={captionRef}
						className="text-white bg-dark-2 outline-none border-2 border-white/30 rounded-lg p-2 w-full focus:border-primary transition-all my-2"
					/>
					<button
						onClick={post}
						className="bg-primary text-white rounded-md p-2 w-full mt-2 hover:brightness-110 transition-all  z-50"
					>
						Post
					</button>
				</Dialog.Content>
			</Dialog.Root>

			<main className="flex justify-around mt-20 w-10/12">
				<div className="bg-neutral-900 w-3/12 p-4 sticky rounded-md text-neutral-300 justify-end self-start my-12">
					<h1 className="text-xl font-bold text-white">ReZappit</h1>

					<div className="transition-all hover:brightness-125 bg-neutral-900 rounded-md p-4 w-full flex items-center cursor-pointer my-2">
						<FontAwesomeIcon icon={faPerson} className="mr-2 w-4 h-4" />
						<p className="m-0">Profile</p>
					</div>

					<div className="transition-all hover:brightness-125 bg-neutral-900 rounded-md p-4 w-full flex items-center cursor-pointer my-2">
						<FontAwesomeIcon icon={faCompass} className="mr-2 w-4 h-4" />
						<p className="m-0">Explore</p>
					</div>

					<div className="transition-all hover:brightness-125 bg-neutral-900 rounded-md p-4 w-full flex items-center cursor-pointer my-2">
						<FontAwesomeIcon icon={faMessage} className="mr-2 w-4 h-4" />
						<p className="m-0">Messages</p>
					</div>

					<div
						className="transition-all hover:brightness-125 bg-neutral-900 rounded-md p-4 w-full flex items-center cursor-pointer my-2"
						onClick={() => router.push(`/${router.locale}/settings`)}
					>
						<FontAwesomeIcon icon={faGear} className="mr-2 w-4 h-4" />
						<p className="m-0">Settings</p>
					</div>
				</div>

				<div className="flex flex-col w-6/12">
					<div className="bg-neutral-900 rounded-md p-4 my-12">
						<h1 className="text-xl ">Feeling like posting something?</h1>
						<input
							type="text"
							className="bg-neutral-800 text-white p-2 rounded-md my-2 w-full"
							placeholder="What's on your mind?"
						/>

						<div className="flex items-center justify-between flex-1 mt-2">
							<button
								className="bg-neutral-700 text-white rounded-md p-2 w-3/12 mr-2"
								onClick={() => {
									setPostDialogOpen(true);
								}}
							>
								Post
							</button>
							<button className="bg-neutral-700 text-white rounded-md p-2 w-3/12 mx-2">Post</button>
							<button className="bg-neutral-700 text-white rounded-md p-2 w-3/12 mx-2">Post</button>
							<button className="bg-neutral-700 text-white rounded-md p-2 w-3/12 ml-2">Post</button>
						</div>
					</div>

					<div className="bg-neutral-900 rounded-md p-4 h-24 w-full">This si some content</div>
				</div>
			</main>
		</div>
	);
};

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale ?? "en", ["auth/signout"])),
	},
});

export default HomePage;
