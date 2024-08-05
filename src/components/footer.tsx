const FooterComponent = () => {
	return (
		<div className="flex items-center justify-center gap-24 py-16 lg:px-64 w-full shadow-md">
			<div>
				<p className="text-2xl text-white">Zappit</p>
				<p className="text-gray-200">Your space of creativity</p>
			</div>

			<ul className="list-disc text-gray-200">
				<li>
					<a className="hover:underline hover:text-white" href="mailto:asterki.dev@proton.me">Contact</a>
				</li>
				<li>
					<a className="hover:underline hover:text-white" href="/privacy">
						<p>Privacy</p>
					</a>
				</li>
				<li>
					<a className="hover:underline hover:text-white" href="/terms">
						<p>Terms</p>
					</a>
				</li>
			</ul>

			<ul className="list-disc text-gray-200">
				<li>
					<a className="hover:underline hover:text-white" href="/about">
						<p>About</p>
					</a>
				</li>
				<li>
					<a className="hover:underline hover:text-white" href="/pricing">
						<p>Pricing</p>
					</a>
				</li>
				<li>
					<a className="hover:underline hover:text-white" href="/faq">
						<p>FAQ</p>
					</a>
				</li>
			</ul>
		</div>
	);
};

export default FooterComponent;
