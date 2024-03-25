import * as React from "react";
import Image from "next/image";

import { Session } from "next-auth";
import { NextPage } from "next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleDown, faFloppyDisk, faPencil, faSpinner } from "@fortawesome/free-solid-svg-icons";

interface ComponentProps {
	user: Session["user"];
}

const NavbarComponent: NextPage<ComponentProps> = props => {
	return (
		<div className="p-4 bg-dark-2 text-white flex items-center justify-between absolute left-0 top-0 w-full">
			<div>
				<p className="text-2xl">Zappit</p>
			</div>
			{props.user && (
				<div className="rounded-md border-2 border-dark-3/40 p-2 w-2/12 flex items-center justify-between select-none transition-all hover:bg-dark-3/10 cursor-pointer">
					<div className="flex items-center justify-center">
						<Image
							width={40}
							height={40}
							className="rounded-full mr-2"
							src={props.user.image}
							alt={props.user.name}
						/>
						<p>{props.user.name}</p>
					</div>
					<div className="flex items-center justify-center">
						<FontAwesomeIcon icon={faChevronCircleDown} className="text-dark-3/40 text-2xl" />
					</div>
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
