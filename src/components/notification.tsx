import * as React from "react";

import { NextPage } from "next";

import { motion } from "framer-motion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faCheck, faInfo, IconDefinition } from "@fortawesome/free-solid-svg-icons";

interface NotificationProps {
	showing: boolean;
	setShowing: React.Dispatch<React.SetStateAction<boolean>>;
	type: "success" | "error" | "info";
	message: string;
	title?: string;
	icon?: string;
	dismissButtonText: string;
}

const NotificationComponent: NextPage<NotificationProps> = props => {
	return (
		<motion.div
			variants={{
				hidden: {
					opacity: 0,
					transitionEnd: {
						display: "none",
					},
				},
				visible: {
					opacity: 1,
					display: "flex",
				},
			}}
			initial="hidden"
			animate={props.showing ? "visible" : "hidden"}
			className="fixed top-0 bottom-0 bg-black/50 backdrop-blur-sm h-screen w-screen flex items-center justify-center z-10 drop-shadow"
		>
			<div className="lg:w-4/12 md:w-1/2 w-11/12 bg-neutral-900 rounded-md">
				{props.type == "success" && (
					<div className={`bg-green-500 h-24 rounded-t-md flex items-center justify-center`}>
						<FontAwesomeIcon
							icon={faCheck}
							className={`text-2xl text-green-500 bg-white rounded-full p-4 aspect-square`}
						/>
					</div>
				)}

				{props.type == "error" && (
					<div className={`bg-red-500 h-24 rounded-t-md flex items-center justify-center`}>
						<FontAwesomeIcon
							icon={faX}
							className={`text-2xl text-red-500 bg-white rounded-full p-4 aspect-square`}
						/>
					</div>
				)}

				{props.type == "info" && (
					<div className={`bg-blue-500 h-24 rounded-t-md flex items-center justify-center`}>
						<FontAwesomeIcon
							icon={faInfo}
							className={`text-2xl text-blue-500 bg-white rounded-full p-4 aspect-square`}
						/>
					</div>
				)}
				<div className="p-4 text-center">
					<h1 className="font-bold text-xl">{props.title}</h1>
					<p className="my-4">{props.message}</p>

					<button
						onClick={() => {
							props.setShowing(false);
						}}
						className="bg-neutral-800 hover:brightness-125 transition-all w-11/12 lg:w-9/12 my-2 p-4 rounded-lg shadow-md"
					>
						{props.dismissButtonText}
					</button>
				</div>
			</div>
		</motion.div>
	);
};

export default NotificationComponent;
