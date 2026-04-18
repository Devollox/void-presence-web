import { PanelLayout } from '@components/panel-layout'
import layoutStyles from '@components/panel-layout/layout-panels.module.css'
import { parseElectronVersionFromNotes } from '@lib/electron-version'
import { githubHeaders } from '@lib/github-headers'
import { classifyRelease } from '@lib/release-tags'
import type { Metadata } from 'next'
import { InfoBox } from '../../../components/status-info/info-box'
import { normalizeReleaseNotes } from '../../../lib/release-notes'
import ChangelogClient from '../download/changelog-client'
import DownloadButtons from '../download/download-buttons'
import styles from './schedule.module.css'

interface ReleaseAsset {
	name: string
	size: number
	downloadUrl: string
}

type ReleaseType =
	| 'stable'
	| 'pre-release'
	| 'nightly'
	| 'end of life'
	| 'broken'

interface ReleaseInfo {
	version: string
	commit: string | null
	date: string
	notes: string
	assets: ReleaseAsset[]
	prerelease: boolean
	draft: boolean
	url: string
	type: ReleaseType
	electronCurrent?: string
	buildTag?: string
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

function applyBuildTagPriority(releases: ReleaseInfo[]): ReleaseInfo[] {
	return releases.map(release => {
		const tag = release.buildTag
		let type: ReleaseType | null = null

		if (tag === 'nightly') type = 'nightly'
		else if (tag === 'stable') type = 'stable'
		else if (tag === 'pre-release' || tag === 'prerelease') type = 'pre-release'

		if (!type) return release
		return { ...release, type }
	})
}

async function getReleases(): Promise<{
	releases: ReleaseInfo[]
	error: string | null
}> {
	try {
		const res = await fetch(
			'https://api.github.com/repos/Devollox/void-presence/releases?per_page=100',
			{
				cache: 'force-cache',
				next: { revalidate: 300 },
				headers: githubHeaders(),
			},
		)

		if (!res.ok) {
			return {
				releases: [],
				error:
					res.status === 403
						? 'GitHub API rate limit exceeded. Please try again in a few minutes or open the GitHub releases page.'
						: 'Failed to load release schedule. Please try again later.',
			}
		}

		const data = await res.json()
		const rawReleases = Array.isArray(data) ? data : []

		let releases: ReleaseInfo[] = rawReleases
			.filter((item: any) => item && !item.draft)
			.map((item: any) => {
				const rawAssets = Array.isArray(item.assets) ? item.assets : []

				const assets: ReleaseAsset[] = rawAssets
					.map((asset: any) => ({
						name: asset.name,
						size: asset.size / (1024 * 1024),
						downloadUrl: asset.browser_download_url,
					}))
					.sort((a: ReleaseAsset, b: ReleaseAsset) => {
						const aIsExe = a.name.toLowerCase().endsWith('.exe')
						const bIsExe = b.name.toLowerCase().endsWith('.exe')

						if (aIsExe && !bIsExe) return -1
						if (bIsExe && !aIsExe) return 1

						return 0
					})

				const rawBody = item.body || ''
				const notes = normalizeReleaseNotes(rawBody)
				const electronVersion = parseElectronVersionFromNotes(notes)
				const classification = classifyRelease(item, rawBody)

				return {
					version: item.tag_name || 'unknown',
					commit: item.target_commitish || null,
					date: item.published_at ? formatDate(item.published_at) : 'Unknown',
					notes,
					assets,
					prerelease: !!item.prerelease,
					draft: !!item.draft,
					url: item.html_url || '',
					type: classification.type,
					electronCurrent: electronVersion,
					buildTag: classification.buildTag,
				} as ReleaseInfo
			})

		releases = releases.sort((a, b) => {
			const dateA = a.date === 'Unknown' ? new Date(0) : new Date(a.date)
			const dateB = b.date === 'Unknown' ? new Date(0) : new Date(b.date)
			return dateB.getTime() - dateA.getTime()
		})

		releases = applyBuildTagPriority(releases)

		const normalSorted = [...releases].filter(
			r =>
				r.type !== 'nightly' && r.type !== 'pre-release' && r.type !== 'broken',
		)

		normalSorted.sort((a, b) => {
			const dateA = a.date === 'Unknown' ? new Date(0) : new Date(a.date)
			const dateB = b.date === 'Unknown' ? new Date(0) : new Date(b.date)
			return dateB.getTime() - dateA.getTime()
		})

		const latestNormal = normalSorted[0] ?? null

		const stableTagVersions = new Set(
			releases
				.filter(r => r.buildTag?.toLowerCase() === 'stable')
				.map(r => r.version),
		)

		releases = releases.map(r => {
			if (
				r.type === 'nightly' ||
				r.type === 'pre-release' ||
				r.type === 'broken'
			) {
				return r
			}

			const isLatest = latestNormal && r.version === latestNormal.version

			if (isLatest || stableTagVersions.has(r.version)) {
				return { ...r, type: 'stable' as const }
			}

			return { ...r, type: 'end of life' as const }
		})

		let lastElectronVersion: string | undefined

		releases = releases
			.sort((a, b) => {
				const dateA = a.date === 'Unknown' ? new Date(0) : new Date(a.date)
				const dateB = b.date === 'Unknown' ? new Date(0) : new Date(b.date)
				return dateA.getTime() - dateB.getTime()
			})
			.map(release => {
				if (release.electronCurrent) {
					lastElectronVersion = release.electronCurrent
					return release
				}

				return {
					...release,
					electronCurrent: lastElectronVersion,
				}
			})
			.sort((a, b) => {
				const dateA = a.date === 'Unknown' ? new Date(0) : new Date(a.date)
				const dateB = b.date === 'Unknown' ? new Date(0) : new Date(b.date)
				return dateB.getTime() - dateA.getTime()
			})

		return { releases, error: null }
	} catch (err) {
		return {
			releases: [],
			error: 'Failed to load release schedule. Please try again later.',
		}
	}
}

export async function ReleasesSection() {
	const { releases, error } = await getReleases()

	const stableRelease = releases[0]

	const left = (
		<>
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
									v{stableRelease.electronCurrent}
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
					'Prereleases and nightly builds are ordered by release date.',
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
							const hasElectron = release.electronCurrent

							return (
								<li
									key={release.version}
									className={`${styles.release_item} ${
										release.buildTag === 'alpha'
											? styles.bg_release_alpha
											: release.buildTag === 'beta'
												? styles.bg_release_beta
												: release.type === 'stable'
													? styles.bg_release_stable
													: release.type === 'nightly'
														? styles.bg_release_nightly
														: release.type === 'pre-release'
															? styles.bg_release_prerelease
															: release.type === 'broken'
																? styles.bg_release_broken
																: styles.bg_release_eol
									}`}
								>
									<a
										href={`/schedule/${encodeURIComponent(release.version)}`}
										className={styles.release_card}
									>
										<div className={styles.release_card_top}>
											<div className={styles.release_card_left}>
												<div className={styles.version_row}>
													<span className={styles.release_card_version}>
														{release.version}
													</span>
													<span className={styles.release_card_badge}>
														{release.buildTag === 'alpha'
															? 'Alpha'
															: release.buildTag === 'beta'
																? 'Beta'
																: release.type === 'stable'
																	? 'Stable'
																	: release.type === 'nightly'
																		? 'Nightly'
																		: release.type === 'pre-release'
																			? 'Prerelease'
																			: release.type === 'broken'
																				? 'Broken'
																				: 'End of Life'}
													</span>
												</div>
											</div>

											<span className={styles.release_card_date}>
												{release.date}
											</span>
										</div>

										<div className={styles.release_card_meta}>
											{hasElectron && (
												<div className={styles.electron_row}>
													<div className={styles.dot_wrap}>
														<div
															className={`
																${styles.dot}
																${
																	release.buildTag === 'alpha'
																		? styles.dot_alpha
																		: release.buildTag === 'beta'
																			? styles.dot_beta
																			: release.buildTag === 'broken'
																				? styles.dot_broken
																				: release.type === 'stable'
																					? styles.dot_stable
																					: release.type === 'nightly'
																						? styles.dot_nightly
																						: release.type === 'pre-release'
																							? styles.dot_prerelease
																							: styles.dot_eol
																}
															`}
														/>
													</div>
													<span className={styles.electron_versions}>
														Electron v{release.electronCurrent}
													</span>
												</div>
											)}
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
