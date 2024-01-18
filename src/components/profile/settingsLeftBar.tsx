import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faGear,
	faPerson,
	faShield,
	faStaffAesculapius,
	faBell,
	faCreditCard,
	faIdCard,
	faHandsHelping,
} from "@fortawesome/free-solid-svg-icons";
import { NextPage } from "next";

interface ComponentProps {
	activeCategory: "general" | "profile" | "security" | "privacy" | "notifications" | "account" | "billing" | "help";
	router: any;
}

const SettingsLeftBarComponent: NextPage<ComponentProps> = props => {
	return (
		<div className="rounded-md bg-neutral-900 p-4 w-3/12 sticky self-start my-12">
			<p className="text-bold text-xl">Categories</p>

			<div
				className={
					"transition-all hover:brightness-125 bg-neutral-900 rounded-md p-4 w-full flex items-center cursor-pointer my-2" +
					(props.activeCategory === "general" ? " bg-neutral-700" : "")
				}
				onClick={props.router.push("/profile/settings/general")}
			>
				<FontAwesomeIcon icon={faGear} className="mr-2 w-4 h-4" />
				<p className="m-0">General</p>
			</div>

			<div
				className={
					"transition-all hover:brightness-125 bg-neutral-900 rounded-md p-4 w-full flex items-center cursor-pointer my-2" +
					(props.activeCategory === "profile" ? " bg-neutral-700" : "")
				}
				onClick={props.router.push("/profile/settings/profile")}
			>
				<FontAwesomeIcon icon={faPerson} className="mr-2 w-4 h-4" />
				<p className="m-0">Profile</p>
			</div>

			<div
				className={
					"transition-all hover:brightness-125 bg-neutral-900 rounded-md p-4 w-full flex items-center cursor-pointer my-2" +
					(props.activeCategory === "security" ? " bg-neutral-700" : "")
				}
				onClick={props.router.push("/profile/settings/security")}
			>
				<FontAwesomeIcon icon={faShield} className="mr-2 w-4 h-4" />
				<p className="m-0">Security</p>
			</div>

			<div
				className={
					"transition-all hover:brightness-125 bg-neutral-900 rounded-md p-4 w-full flex items-center cursor-pointer my-2" +
					(props.activeCategory === "privacy" ? " bg-neutral-700" : "")
				}
				onClick={props.router.push("/profile/settings/privacy")}
			>
				<FontAwesomeIcon icon={faStaffAesculapius} className="mr-2 w-4 h-4" />
				<p className="m-0">Privacy</p>
			</div>

			<div
				className={
					"transition-all hover:brightness-125 bg-neutral-900 rounded-md p-4 w-full flex items-center cursor-pointer my-2" +
					(props.activeCategory === "notifications" ? " bg-neutral-700" : "")
				}
				onClick={props.router.push("/profile/settings/notifications")}
			>
				<FontAwesomeIcon icon={faBell} className="mr-2 w-4 h-4" />
				<p className="m-0">Notifications</p>
			</div>

			<div
				className={
					"transition-all hover:brightness-125 bg-neutral-900 rounded-md p-4 w-full flex items-center cursor-pointer my-2" +
					(props.activeCategory === "account" ? " bg-neutral-700" : "")
				}
				onClick={props.router.push("/profile/settings/account")}
			>
				<FontAwesomeIcon icon={faIdCard} className="mr-2 w-4 h-4" />
				<p className="m-0">Account</p>
			</div>

			<div
				className={
					"transition-all hover:brightness-125 bg-neutral-900 rounded-md p-4 w-full flex items-center cursor-pointer my-2" +
					(props.activeCategory === "billing" ? " bg-neutral-700" : "")
				}
				onClick={props.router.push("/profile/settings/billing")}
			>
				<FontAwesomeIcon icon={faCreditCard} className="mr-2 w-4 h-4" />
				<p className="m-0">Billing</p>
			</div>

			<div
				className={
					"transition-all hover:brightness-125 bg-neutral-900 rounded-md p-4 w-full flex items-center cursor-pointer my-2" +
					(props.activeCategory === "help" ? " bg-neutral-700" : "")
				}
				onClick={props.router.push("/profile/settings/help")}
			>
				<FontAwesomeIcon icon={faHandsHelping} className="mr-2 w-4 h-4" />
				<p className="m-0">Help</p>
			</div>
		</div>
	);
};

export default SettingsLeftBarComponent;
