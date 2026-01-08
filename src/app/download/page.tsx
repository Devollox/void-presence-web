import { PanelLayout } from '@components/panel-layout'
import layoutStyles from '@components/panel-layout/layout-panels.module.css'
import type { Metadata } from 'next'
import Footer from '../../../components/footer'
import Page from '../../../components/page'
import PageHeader from '../../../components/page-header'
import { InfoBox } from '../../../components/status-info/info-box'
import config from '../../../data/config.json'
import { normalizeReleaseNotes } from '../../../lib/release-notes'
import ChangelogClient from './changelog-client'
import DownloadButtons from './download-buttons'
import styles from './download.module.css'
import RpcPreviewClient from './rpc-preview-client'

interface ReleaseAsset {
	name: string
	size: number
	downloadUrl: string
}

interface ReleaseInfo {
	version: string
	date: string
	notes: string
	assets: ReleaseAsset[]
}

export const metadata: Metadata = {
	title: 'Download',
	description:
		'Download Void Presence for Windows and keep your Discord Rich Presence always in sync.',
	openGraph: {
		title: 'Download Void Presence',
		description:
			'Get the latest Void Presence build and customize your Discord Rich Presence with profiles, buttons, and cycles.',
		url: '/download',
	},
}

async function getLatestRelease(): Promise<{
	release: ReleaseInfo | null
	error: string | null
}> {
	try {
		const res = await fetch(
			'https://api.github.com/repos/Devollox/void-presence/releases/latest',
			{
				cache: 'no-store',
			}
		)

		if (!res.ok) {
			throw new Error('GitHub response not ok')
		}

		const data = await res.json()
		const rawAssets = Array.isArray(data.assets) ? data.assets : []

		const assets: ReleaseAsset[] = rawAssets.map((asset: any) => ({
			name: asset.name,
			size: asset.size / (1024 * 1024),
			downloadUrl: asset.browser_download_url,
		}))

		const release: ReleaseInfo = {
			version: data.tag_name,
			date: data.published_at
				? new Date(data.published_at).toISOString().slice(0, 10)
				: '',
			notes: normalizeReleaseNotes(data.body || ''),
			assets,
		}

		return { release, error: null }
	} catch {
		return {
			release: null,
			error: 'Failed to load download information. Please try again later.',
		}
	}
}

export default async function DownloadPage() {
	const { release, error } = await getLatestRelease()

	const left = (
		<>
			<div className={styles.filter_header}>Latest build</div>

			{error ? (
				<InfoBox variant='muted' lines={[error]} />
			) : release ? (
				<>
					<DownloadButtons assets={release.assets} />

					<div className={styles.release_meta}>
						<div className={styles.release_row}>
							<span className={styles.release_label}>Version</span>
							<span className={styles.release_value}>{release.version}</span>
						</div>
						<div className={styles.release_row}>
							<span className={styles.release_label}>Release date</span>
							<span className={styles.release_value}>{release.date}</span>
						</div>
					</div>
				</>
			) : (
				<InfoBox lines={['No release info available.']} />
			)}

			<InfoBox
				variant='secondary'
				title='Need help installing?'
				lines={[
					'Check the install guide on the main page for platform-specific setup and tips.',
				]}
			/>
		</>
	)

	const right = (
		<section className={styles.page_section}>
			<div className={layoutStyles.preview_card_wrap}>
				<div className={layoutStyles.preview_card}>
					<div className={layoutStyles.preview_header}>
						<h3 className={layoutStyles.preview_title}>
							Live presence preview
						</h3>
						{release && (
							<div className={layoutStyles.preview_badge}>
								<span className={layoutStyles.preview_badge_text}>
									{release.version}
								</span>
							</div>
						)}
					</div>

					<div className={styles.rpc_card_preview}>
						<RpcPreviewClient config={config} />
					</div>

					{release && release.notes && <ChangelogClient release={release} />}
				</div>
			</div>
		</section>
	)

	return (
		<Page>
			<main id='main-page-content'>
				<PageHeader
					title='Download Void Presence'
					subtitle='Get the desktop client and keep your Discord Rich Presence always in sync.'
				/>
				<PanelLayout left={left} right={right} />
			</main>
			<Footer />
		</Page>
	)
}
