/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'avatars.githubusercontent.com',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'github.com',
				pathname: '/user-attachments/**',
			},
			{
				protocol: 'https',
				hostname: 'media.giphy.com',
				pathname: '/**',
			},
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'i.imgur.com',
				pathname: '/**',
			},
		],
	},
}

module.exports = nextConfig
