import type { Metadata } from 'next'
import Footer from '../../../components/footer'
import Page from '../../../components/page'
import PageHeader from '../../../components/page-header'
import config from '../../../data/config.json'
import { normalizeReleaseNotes } from '../../../lib/releaseNotes'
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

		const assets: ReleaseAsset[] =
			data.assets?.map((asset: any) => ({
				name: asset.name,
				size: asset.size / (1024 * 1024),
				downloadUrl: asset.browser_download_url,
			})) || []

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

	return (
		<Page>
			<main id='main-page-content'>
				<PageHeader
					title='Download Void Presence'
					subtitle='Get the desktop client and keep your Discord Rich Presence always in sync.'
				/>

				<div className={styles.download_panel}>
					<div className={styles.download_left_side}>
						<div className={styles.filter_header}>Latest build</div>

						{error ? (
							<div className={styles.error_banner}>{error}</div>
						) : release ? (
							<>
								<DownloadButtons assets={release.assets} />

								<div className={styles.release_meta}>
									<div className={styles.release_row}>
										<span className={styles.release_label}>Version</span>
										<span className={styles.release_value}>
											{release.version}
										</span>
									</div>
									<div className={styles.release_row}>
										<span className={styles.release_label}>Release date</span>
										<span className={styles.release_value}>{release.date}</span>
									</div>
								</div>
							</>
						) : (
							<div className={styles.stats_summary}>
								<span>No release info available.</span>
							</div>
						)}

						<div className={styles.secondary_box}>
							<h4 className={styles.secondary_title}>Need help installing?</h4>
							<p className={styles.secondary_text}>
								Check the install guide on the main page for platform-specific
								setup and tips.
							</p>
						</div>
					</div>

					<div className={styles.download_right_side}>
						<section className={styles.page_section}>
							<div className={styles.preview_card_wrap}>
								<div className={styles.preview_card}>
									<div className={styles.preview_header}>
										<h3 className={styles.preview_title}>
											Live presence preview
										</h3>
										{release && (
											<div className={styles.preview_badge}>
												<span className={styles.preview_badge_text}>
													{release.version}
												</span>
											</div>
										)}
									</div>

									<div className={styles.rpc_card_preview}>
										<RpcPreviewClient config={config} />
									</div>

									{release && release.notes && (
										<ChangelogClient release={release} />
									)}
								</div>
							</div>
						</section>
					</div>
				</div>
			</main>
			<Footer />
		</Page>
	)
}
