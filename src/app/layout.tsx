import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '../../styles/globals.css'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

const siteUrl = 'https://voidpresence.site'

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: 'Void Presence – Discord Rich Presence Manager',
		template: '%s – Void Presence',
	},
	description:
		'Advanced Discord Rich Presence manager with customizable profiles, buttons, status cycles, images, and flexible update intervals for your Discord activity.',
	applicationName: 'Void Presence',
	authors: [{ name: 'Devollox', url: siteUrl }],
	keywords: [
		'discord rich presence',
		'discord rpc',
		'discord status',
		'rich presence manager',
		'discord presence app',
	],
	manifest: '/favicons/manifest.json',
	icons: {
		icon: [
			{ url: '/favicons/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
			{
				url: '/favicons/web-app-manifest-192x192.png',
				sizes: '192x192',
				type: 'image/png',
			},
		],
		apple: [
			{
				url: '/favicons/web-app-manifest-192x192.png',
				sizes: '192x192',
				type: 'image/png',
			},
		],
	},
	openGraph: {
		type: 'website',
		url: siteUrl,
		title: 'Void Presence – Discord Rich Presence Manager',
		siteName: 'Void Presence',
		description:
			'Manage advanced Discord Rich Presence with profiles, buttons, status cycles, and custom images.',
		images: [
			{
				url: '/og/void-presence.png',
				width: 1200,
				height: 630,
				alt: 'Void Presence – Discord Rich Presence Manager',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		site: '@devollox',
		creator: '@devollox',
		title: 'Void Presence – Discord Rich Presence Manager',
		description:
			'Advanced Discord Rich Presence manager with customizable profiles and status cycles.',
		images: ['/og/void-presence.png'],
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				{children}
			</body>
		</html>
	)
}
