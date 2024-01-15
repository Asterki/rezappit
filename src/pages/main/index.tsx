import * as React from "react";
import { useRouter } from "next/router";

const IndexPage = () => {
	const router = useRouter();

	return (
		<div className="text-white bg-neutral-800 flex flex-col items-center justify-center min-h-screen">
			<main>
				<p className="text-2xl">So yeah this is zappit</p>

				<div className="flex items-center justify-center">
					<button
						className="p-2 m-2 bg-neutral-400 rounded-md"
						onClick={() => {
							router.push("/auth/signin");
						}}
					>
						Login then
					</button>
					<button
						className="p-2 m-2 bg-neutral-400 rounded-md"
						onClick={() => {
							router.push("/auth/signin");
						}}
					>
						Login then
					</button>
				</div>
			</main>
		</div>
	);
};

export default IndexPage;
