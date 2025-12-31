import type { Metadata } from 'next'
import { ConfigsSection } from './configs-section'

type SearchParams = {
	q?: string
}

type PageProps = {
	searchParams: Promise<SearchParams> | SearchParams
}

export const metadata: Metadata = {
	title: 'Configs',
	description:
		'Browse and search shared Void Presence configs to quickly set up your Discord Rich Presence.',
	openGraph: {
		title: 'Void Presence Configs',
		description:
			'Discover ready-to-use Void Presence configurations and import them into your setup.',
		url: '/configs',
	},
}

export default async function ConfigsPage(props: PageProps) {
	const { q = '' } = await props.searchParams
	const searchTerm = q || ''

	return <ConfigsSection initialSearchTerm={searchTerm} />
}
