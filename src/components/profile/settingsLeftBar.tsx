import * as React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleDown } from "@fortawesome/free-solid-svg-icons";

import { NextPage } from "next";

interface ComponentProps {
	activeCategory: "general" | "profile" | "privacy" | "notifications" | "account" | "billing" | "help";
	router: any;
}

const Options = (props: ComponentProps & { className: string }) => {
	return (
		<ul className={`flex flex-col text-sm text-dark-3 ${props.className}`}>
			<li
				className={`${
					props.activeCategory == "general" ? "text-primary" : "hover:text-white"
				} my-2 transition-all cursor-pointer font-bold text-lg`}
				onClick={() => {
					props.router.push("/settings");
				}}
			>
				General
			</li>
			<li
				className={`${
					props.activeCategory == "profile" ? "text-primary" : "hover:text-white"
				} my-2 transition-all cursor-pointer font-bold text-lg`}
				onClick={() => {
					props.router.push("/settings/profile");
				}}
			>
				Profile
			</li>
			<li
				className={`${
					props.activeCategory == "privacy" ? "text-primary" : "hover:text-white"
				} my-2 transition-all cursor-pointer font-bold text-lg`}
				onClick={() => {
					props.router.push("/settings/privacy");
				}}
			>
				Privacy
			</li>
			<li
				className={`${
					props.activeCategory == "notifications" ? "text-primary" : "hover:text-white"
				} my-2 transition-all cursor-pointer font-bold text-lg`}
				onClick={() => {
					props.router.push("/settings/notifications");
				}}
			>
				Notifications
			</li>
			<li
				className={`${
					props.activeCategory == "account" ? "text-primary" : "hover:text-white"
				} my-2 transition-all cursor-pointer font-bold text-lg`}
				onClick={() => {
					props.router.push("/settings/account");
				}}
			>
				Account
			</li>
			<li
				className={`${
					props.activeCategory == "billing" ? "text-primary" : "hover:text-white"
				} my-2 transition-all cursor-pointer font-bold text-lg`}
				onClick={() => {
					props.router.push("/settings/billing");
				}}
			>
				Billing
			</li>
			<li
				className={`${
					props.activeCategory == "help" ? "text-primary" : "hover:text-white"
				} my-2 transition-all cursor-pointer font-bold text-lg`}
				onClick={() => {
					props.router.push("/settings/help");
				}}
			>
				Help
			</li>
		</ul>
	);
};

const SettingsLeftBarComponent: NextPage<ComponentProps> = props => {
	const [categoriesOpen, setCategoriesOpen] = React.useState(false);

	return (
		<div className="rounded-md p-4 lg:w-3/12 lg:ml-32 lg:mr-24 w-full sticky self-start lg:my-12 my-6">
			<p
				className="text-bold text-3xl font-bold mb-2 flex items-center justify-between"
				onClick={() => {
					setCategoriesOpen(!categoriesOpen);
				}}
			>
				Categories
				<FontAwesomeIcon
					className={`text-neutral-400 block lg:opacity-0 ${categoriesOpen ? "rotate-0" : "rotate-180"}`}
					icon={faChevronCircleDown}
				/>
			</p>

			<Options
				className={`lg:block ${categoriesOpen ? "block" : "hidden"}`}
				activeCategory={props.activeCategory}
				router={props.router}
			/>
		</div>
	);
};

export default SettingsLeftBarComponent;
