const { i18n } = require("./next-i18next.config");

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	i18n,

	images: {
		remotePatterns: [
		  {
			protocol: 'https',
			hostname: 'lh3.googleusercontent.com',
			port: '',
			pathname: '/a/**',
		  },
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
				port: "",
				pathname: "/**",
			},
		  {
			protocol: 'https',
			hostname: 'placehold.co',
			port: '',
			pathname: '/**',
		  },
		],
	  },

	rewrites: async () => [
		{
			source: "/",
			destination: "/main",
		},
		{
			source: "/home",
			destination: "/main/home",
		},
	],
};

module.exports = nextConfig;
