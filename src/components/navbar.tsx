import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { Session } from "next-auth";
import { NextPage } from "next";

import { motion } from "framer-motion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleDown } from "@fortawesome/free-solid-svg-icons";

interface ComponentProps {
	user: Session["user"];
}

const NavbarComponent: NextPage<ComponentProps> = props => {
	const [menuOpen, setMenuOpen] = React.useState<boolean>(false);

	console.log(props.user);

	return (
		<div className="p-2 bg-dark-2 text-white flex items-center justify-between absolute left-0 top-0 w-full">
			<div>
				<p className="text-2xl">Zappit</p>
			</div>
			{props.user && (
				<div className="w-2/12 relative">
					<div
						onClick={() => {
							setMenuOpen(!menuOpen);
						}}
						className={`rounded-md border-2 border-dark-3/40 flex items-center p-2 justify-between select-none cursor-pointer transition-all ${
							menuOpen ? "bg-dark-3/10" : ""
						}`}
					>
						<div className="flex items-center justify-center">
							<Image
								width={40}
								height={40}
								className="rounded-full mr-2"
								src={
									props.user.image == ""
										? "/images/default-profile.png"
										: `/data/profile-pictures/${props.user.id}/${props.user.image}.png`
								}
								alt={props.user.name}
							/>
							<p>{props.user.name}</p>
						</div>
						<div className="flex items-center justify-center">
							<motion.div
								variants={{
									open: {
										transform: "rotate(180deg)",
									},
								}}
								animate={menuOpen ? "open" : "closed"}
								initial="closed"
								className="flex items-center justify-center"
							>
								<FontAwesomeIcon icon={faChevronCircleDown} className={`text-dark-3/40 text-2xl`} />
							</motion.div>
						</div>
					</div>
					<motion.div
						variants={{
							open: {
								height: "auto",
								opacity: 1,
								display: "flex",
							},
							closed: {
								height: 0,
								opacity: 0,
								transitionEnd: {
									display: "none",
								},
							},
						}}
						animate={menuOpen ? "open" : "closed"}
						initial="closed"
						className="w-full overflow-y-hidden absolute mt-4 flex flex-col justify-center items-center border-2 border-dark-3/40 rounded-md bg-dark-2 z-10"
					>
						<Link
							className="w-full decoration-none p-2 transition-all bg-dark-2 hover:brightness-125"
							href="/settings"
						>
							Settings
						</Link>
						<Link
							className="w-full decoration-none p-2 transition-all bg-dark-2 hover:brightness-125"
							href="/api/auth/signout"
						>
							Logout
						</Link>
					</motion.div>
				</div>
			)}
			{!props.user && (
				<div className="flex items-center justify-center">
					<a className="decoration-none text-blue-400" href="/login">
						Login
					</a>
					<a className="decoration-none text-blue-400" href="/register">
						Register
					</a>
				</div>
			)}
		</div>
	);
};

export default NavbarComponent;
