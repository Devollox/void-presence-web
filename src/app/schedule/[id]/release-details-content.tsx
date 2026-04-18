import DownloadButtons from '@/app/download/download-buttons'
import { PanelLayout } from '@components/panel-layout'
import layoutStyles from '@components/panel-layout/layout-panels.module.css'
import {
	parseBuildTagFromNotes,
	parseElectronVersionFromNotes,
} from '@lib/electron-version'
import { githubHeaders } from '@lib/github-headers'
import { extractPackageMeta, type PackageJson } from '@lib/package-meta'
import type { Metadata } from 'next'
import { InfoBox } from '../../../../components/status-info/info-box'
import { normalizeReleaseNotes } from '../../../../lib/release-notes'
import ChangelogClient from '../../download/changelog-client'
import styles from '../schedule.module.css'

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

interface ReleaseDetails {
	version: string
	date: string
	notes: string
	assets: ReleaseAsset[]
	url: string
	type: ReleaseType
	electronCurrent?: string
	buildTag?: string
}

export const metadata: Metadata = {
	title: 'Release Details',
}

function formatDate(input: string | null | undefined) {
	if (!input) return 'Unknown'
	const date = new Date(input)
	if (Number.isNaN(date.getTime())) return input
	return date.toISOString().slice(0, 10)
}

function classifyRelease(
	raw: any,
	notes: string,
): { type: ReleaseType; buildTag?: string } {
	const tagFromNotes = parseBuildTagFromNotes(notes)
	const tag = tagFromNotes?.toLowerCase()

	if (tag === 'nightly') {
		return { type: 'nightly', buildTag: tag }
	}

	if (tag === 'broken' || tag === 'failed' || tag === 'borked') {
		return { type: 'broken', buildTag: tag }
	}

	if (tag === 'alpha') {
		return { type: 'pre-release', buildTag: 'alpha' }
	}

	if (tag === 'beta') {
		return { type: 'pre-release', buildTag: 'beta' }
	}

	if (tag === 'pre-release' || tag === 'prerelease') {
		return { type: 'pre-release', buildTag: 'pre-release' }
	}

	if (tag === 'stable') {
		return { type: 'stable', buildTag: tag }
	}

	if (raw.prerelease) {
		return { type: 'pre-release', buildTag: tagFromNotes }
	}

	return { type: 'end of life', buildTag: tagFromNotes }
}

async function getPackageJsonByTag(tag: string): Promise<PackageJson | null> {
	const url = `https://raw.githubusercontent.com/Devollox/void-presence/${encodeURIComponent(
		tag,
	)}/package.json`

	const res = await fetch(url, {
		cache: 'force-cache',
		next: { revalidate: 300 },
		headers: githubHeaders(),
	})

	if (!res.ok) {
		return null
	}

	try {
		const json = (await res.json()) as PackageJson
		return json
	} catch (err) {
		if (process.env.NODE_ENV !== 'production') {
			console.error('[release-details] package.json parse failed', {
				tag,
				error: err,
			})
		}
		return null
	}
}

async function getReleaseDetailsByTag(
	tag: string,
): Promise<{ release: ReleaseDetails | null; error: string | null }> {
	const url = `https://api.github.com/repos/Devollox/void-presence/releases/tags/${encodeURIComponent(
		tag,
	)}`

	try {
		const res = await fetch(url, {
			cache: 'force-cache',
			next: { revalidate: 300 },
			headers: githubHeaders(),
		})

		if (!res.ok) {
			return {
				release: null,
				error:
					res.status === 403
						? 'GitHub API rate limit exceeded. Please try again in a few minutes or open the GitHub releases page.'
						: 'Failed to load this release from GitHub. Please try again later.',
			}
		}

		const data = await res.json()

		const rawAssets = Array.isArray(data.assets) ? data.assets : []

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

		const rawBody = data.body || ''
		const notes = normalizeReleaseNotes(rawBody)
		const electronVersion = parseElectronVersionFromNotes(notes)
		const classification = classifyRelease(data, rawBody)

		const release: ReleaseDetails = {
			version: data.tag_name || tag,
			date: formatDate(data.published_at),
			notes,
			assets,
			url: data.html_url || '',
			type: classification.type,
			electronCurrent: electronVersion,
			buildTag: classification.buildTag,
		}

		return { release, error: null }
	} catch (err) {
		if (process.env.NODE_ENV !== 'production') {
			console.error('[release-details] getReleaseDetailsByTag failed', err)
		}
		return {
			release: null,
			error: 'Failed to load this release. Please try again later.',
		}
	}
}

export async function ReleaseDetailsContent({ id }: { id: string }) {
	const [pkg, releaseResult] = await Promise.all([
		getPackageJsonByTag(id),
		getReleaseDetailsByTag(id),
	])

	const release = releaseResult.release
	const error = releaseResult.error

	const pkgMeta = extractPackageMeta(pkg)
	const electronFromPkg =
		pkg?.dependencies?.electron ?? pkg?.devDependencies?.electron

	const left = (
		<>
			{error ? (
				<InfoBox variant='muted' lines={[error]} />
			) : release ? (
				<>
					{release.assets.length > 0 && (
						<DownloadButtons assets={release.assets} />
					)}

					<div className={styles.release_meta}>
						<div className={styles.release_row}>
							<span className={styles.release_label}>Version</span>
							<span className={styles.release_value}>{release.version}</span>
						</div>

						{release.date && (
							<div className={styles.release_row}>
								<span className={styles.release_label}>Release date</span>
								<span className={styles.release_value}>{release.date}</span>
							</div>
						)}

						{electronFromPkg && (
							<div className={styles.release_row}>
								<span className={styles.release_label}>Electron</span>
								<span className={styles.release_value}>v{electronFromPkg}</span>
							</div>
						)}
					</div>

					<InfoBox
						variant='secondary'
						title='Want the latest version?'
						lines={[
							'If you just need the latest stable build, you can always download it from the main download page.',
						]}
						linkHref='/download'
						linkLabel='Go to download page'
					/>

					{release.url && (
						<InfoBox
							variant='secondary'
							lines={[
								'View this release on GitHub for full changelog and assets.',
							]}
							linkHref={release.url}
							linkLabel='Check GitHub'
						/>
					)}
				</>
			) : (
				<InfoBox
					variant='muted'
					lines={[
						'This release could not be loaded from GitHub.',
						'It may have been removed or is temporarily unavailable.',
					]}
				/>
			)}

			{!pkg && (
				<p className={styles.release_footer_note}>
					Could not load package.json for this tag. It may not exist for older
					releases or this tag may not be available on GitHub.
				</p>
			)}
		</>
	)

	const right = (
		<section className={styles.page_section}>
			<div style={{ marginBottom: '20px' }}>
				<InfoBox
					variant='secondary'
					linkHref={'/schedule'}
					linkLabel='Back to Schedule'
				/>
			</div>
			<div className={layoutStyles.preview_card_wrap}>
				<div className={layoutStyles.preview_card}>
					<div className={layoutStyles.preview_header}>
						<h3 className={styles.preview_title}>Release details</h3>
						<div className={layoutStyles.preview_badge}>
							<span className={layoutStyles.preview_badge_text}>
								{release && release.version}
							</span>
						</div>
					</div>

					{release && (
						<ul className={styles.release_list}>
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
								<div className={styles.release_card}>
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

										{release.date && (
											<span className={styles.release_card_date}>
												{release.date}
											</span>
										)}
									</div>

									<div className={styles.release_card_meta}>
										{pkgMeta && (
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
													Electron v
													{pkgMeta?.dependencies.find(
														dep => dep.key === 'electron',
													)?.value ?? 'unknown'}
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
								</div>

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
						</ul>
					)}

					{pkgMeta && (
						<div className={styles.package_snapshot_wrap}>
							<div className={styles.package_snapshot_grid}>
								{pkgMeta.dependencies.map(dep => (
									<div key={dep.key} className={styles.package_snapshot_row}>
										<span className={styles.package_snapshot_label}>
											{dep.label}
										</span>
										<div className={styles.package_snapshot_value}>
											<span className={styles.package_snapshot_version}>
												{dep.value}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	)

	return <PanelLayout left={left} right={right} />
}
