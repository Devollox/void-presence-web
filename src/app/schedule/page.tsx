import { PanelLayout } from '@components/panel-layout'
import layoutStyles from '@components/panel-layout/layout-panels.module.css'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import Footer from '../../../components/footer'
import Page from '../../../components/page'
import PageHeader from '../../../components/page-header'
import { InfoBox } from '../../../components/status-info/info-box'
import { normalizeReleaseNotes } from '../../../lib/release-notes'
import ChangelogClient from '../download/changelog-client'
import DownloadButtons from '../download/download-buttons'
import ReleaseListSkeleton from './release-list-skeleton'
import styles from './schedule.module.css'

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
	prerelease: boolean
	draft: boolean
	url: string
	type: 'stable' | 'pre-release' | 'end of life'
	electronCurrent?: string
	electronNext?: string
}

export const metadata: Metadata = {
	title: 'Release Schedule',
	description:
		'Release schedule and history for Void Presence with version timeline and GitHub release data.',
	openGraph: {
		title: 'Void Presence Release Schedule',
		description:
			'Track Void Presence releases, prereleases, and changelog history in one place.',
		url: '/schedule',
	},
}

function formatDate(input: string) {
	if (!input) return 'Unknown'
	const date = new Date(input)
	if (Number.isNaN(date.getTime())) return input
	return date.toISOString().slice(0, 10)
}

function parseElectronVersions(notes: string): {
	current?: string
	next?: string
} {
	const matches: string[] = []
	const regex = /Electron[^0-9]*([0-9]+\.[0-9]+\.[0-9]+)/gi
	let match
	while ((match = regex.exec(notes)) !== null) {
		matches.push(match[1])
	}

	return {
		current: matches[0],
		next: matches[1],
	}
}

async function getReleases(): Promise<{
	releases: ReleaseInfo[]
	error: string | null
}> {
	try {
		const res = await fetch(
			'https://api.github.com/repos/Devollox/void-presence/releases?per_page=100',
			{
				cache: 'no-store',
				headers: {
					Accept: 'application/vnd.github+json',
				},
			},
		)

		if (!res.ok) {
			throw new Error('GitHub response not ok')
		}

		const data = await res.json()
		const rawReleases = Array.isArray(data) ? data : []

		const stableReleases = rawReleases
			.filter((item: any) => item && !item.draft && !item.prerelease)
			.map((item: any) => {
				const rawAssets = Array.isArray(item.assets) ? item.assets : []

				const assets: ReleaseAsset[] = rawAssets.map((asset: any) => ({
					name: asset.name,
					size: asset.size / (1024 * 1024),
					downloadUrl: asset.browser_download_url,
				}))

				const notes = normalizeReleaseNotes(item.body || '')
				const electron = parseElectronVersions(notes)

				return {
					version: item.tag_name || 'unknown',
					date: item.published_at ? formatDate(item.published_at) : 'Unknown',
					notes,
					assets,
					prerelease: false,
					draft: false,
					url: item.html_url || '',
					type: 'end of life' as const,
					...electron,
				}
			})

		const prereleases = rawReleases
			.filter((item: any) => item && !item.draft && item.prerelease)
			.map((item: any) => {
				const rawAssets = Array.isArray(item.assets) ? item.assets : []

				const assets: ReleaseAsset[] = rawAssets.map((asset: any) => ({
					name: asset.name,
					size: asset.size / (1024 * 1024),
					downloadUrl: asset.browser_download_url,
				}))

				const notes = normalizeReleaseNotes(item.body || '')
				const electron = parseElectronVersions(notes)

				return {
					version: item.tag_name || 'unknown',
					date: item.published_at ? formatDate(item.published_at) : 'Unknown',
					notes,
					assets,
					prerelease: true,
					draft: false,
					url: item.html_url || '',
					type: 'pre-release' as const,
					...electron,
				}
			})

		const stableLatest = stableReleases.shift()

		const releases: ReleaseInfo[] = [
			...(stableLatest ? [{ ...stableLatest, type: 'stable' as const }] : []),
			...prereleases,
			...stableReleases.map(release => ({
				...release,
				type: 'end of life' as const,
			})),
		]

		releases.sort((a, b) => {
			const dateA = a.date === 'Unknown' ? new Date(0) : new Date(a.date)
			const dateB = b.date === 'Unknown' ? new Date(0) : new Date(b.date)
			return dateB.getTime() - dateA.getTime()
		})

		return { releases, error: null }
	} catch {
		return {
			releases: [],
			error: 'Failed to load release schedule. Please try again later.',
		}
	}
}

async function ReleasesSection() {
	const { releases, error } = await getReleases()

	const stableRelease = releases.find(release => release.type === 'stable')
	const otherReleases = releases.filter(release => release.type !== 'stable')

	const left = (
		<>
			<div className={styles.filter_header}>Latest build</div>

			{error ? (
				<InfoBox variant='muted' lines={[error]} />
			) : stableRelease ? (
				<>
					<DownloadButtons assets={stableRelease.assets} />

					<div className={styles.release_meta}>
						<div className={styles.release_row}>
							<span className={styles.release_label}>Version</span>
							<span className={styles.release_value}>
								{stableRelease.version}
							</span>
						</div>
						<div className={styles.release_row}>
							<span className={styles.release_label}>Release date</span>
							<span className={styles.release_value}>{stableRelease.date}</span>
						</div>
						{stableRelease.electronCurrent && (
							<div className={styles.release_row}>
								<span className={styles.release_label}>Electron</span>
								<span className={styles.release_value}>
									{stableRelease.electronCurrent}
									{stableRelease.electronNext &&
										` → ${stableRelease.electronNext}`}
								</span>
							</div>
						)}
					</div>
				</>
			) : (
				<InfoBox lines={['No stable release available.']} />
			)}

			<InfoBox
				variant='secondary'
				title='Schedule info'
				lines={[
					'Latest stable release appears at the top.',
					'Prereleases are ordered by release date.',
					'Older stable versions are marked as End of Life .',
				]}
			/>

			<InfoBox
				variant='muted'
				lines={[
					'If your Rich Presence buttons are not visible in Discord, see the status page for details.',
				]}
				linkHref='/status'
				linkLabel='Read setup & troubleshooting'
			/>
		</>
	)

	const right = (
		<section className={styles.page_section}>
			<div className={layoutStyles.preview_card_wrap}>
				<div className={layoutStyles.preview_card}>
					<div className={layoutStyles.preview_header}>
						<h3 className={styles.preview_title}>Release list</h3>
						<div className={layoutStyles.preview_badge}>
							<span className={layoutStyles.preview_badge_text}>
								{releases.length} total
							</span>
						</div>
					</div>

					<ul className={styles.release_list}>
						{releases.map(release => {
							const hasElectron =
								release.electronCurrent || release.electronNext
							return (
								<li
									key={release.version}
									className={`${styles.release_item} ${
										release.type === 'stable'
											? styles.bg_release_stable
											: release.type === 'pre-release'
												? styles.bg_release_prerelease
												: styles.bg_release_eol
									}`}
								>
									<a
										href={release.url}
										target='_blank'
										rel='noreferrer'
										className={styles.release_card}
									>
										<div className={styles.release_card_top}>
											<div className={styles.release_card_left}>
												<div className={styles.version_row}>
													<span className={styles.release_card_version}>
														{release.version}
													</span>
													<span className={styles.release_card_badge}>
														{release.type === 'stable'
															? 'Stable'
															: release.type === 'pre-release'
																? 'Prerelease'
																: 'End of Life'}
													</span>
												</div>
												{hasElectron && (
													<div className={styles.electron_row}>
														<div className={styles.dot_wrap}>
															<div
																className={`
                                  ${styles.dot}
                                  ${
																		release.type === 'stable'
																			? styles.dot_stable
																			: release.type === 'pre-release'
																				? styles.dot_prerelease
																				: styles.dot_eol
																	}
                                `}
															/>
														</div>
														<span className={styles.electron_versions}>
															{release.electronCurrent || '?'} →{' '}
															{release.electronNext || '?'}
														</span>
													</div>
												)}
											</div>
											<span className={styles.release_card_date}>
												{release.date}
											</span>
										</div>

										<div className={styles.release_card_meta}>
											<span className={styles.release_card_meta_item}>
												{release.assets.length} assets
											</span>
											<span className={styles.release_card_meta_item}>
												{release.notes ? 'Has changelog' : 'No changelog'}
											</span>
										</div>
									</a>

									{release.notes && (
										<div className={styles.release_card_changelog}>
											<ChangelogClient
												release={{
													version: release.version,
													date: release.date,
													notes: release.notes,
													assets: release.assets,
												}}
											/>
										</div>
									)}
								</li>
							)
						})}
					</ul>
				</div>
			</div>
		</section>
	)

	return <PanelLayout left={left} right={right} />
}

export default function SchedulePage() {
	return (
		<Page>
			<main id='main-page-content'>
				<PageHeader
					title='Void Presence Release Schedule'
					subtitle='Track current and past releases, prereleases, and published builds.'
				/>
				<Suspense fallback={<ReleaseListSkeleton />}>
					<ReleasesSection />
				</Suspense>
			</main>
			<Footer />
		</Page>
	)
}
