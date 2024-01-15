/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites: async () => [
    {
      source: '/',
      destination: '/main',
    },
    {
      source: "/home",
      destination: '/main/home',
    }
  ],
}

module.exports = nextConfig
