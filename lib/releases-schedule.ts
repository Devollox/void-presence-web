import { parseElectronVersionFromNotes } from '@lib/electron-version'
import { githubHeaders } from '@lib/github-headers'
import { normalizeReleaseNotes } from '@lib/release-notes'
import { classifyRelease } from '@lib/release-tags'

export interface ReleaseAsset {
	name: string
	size: number
	downloadUrl: string
}

export type ReleaseType =
	| 'stable'
	| 'pre-release'
	| 'nightly'
	| 'end of life'
	| 'broken'

export interface ReleaseInfo {
	version: string
	commit: string | null
	date: string
	publishedAt: string
	notes: string
	assets: ReleaseAsset[]
	prerelease: boolean
	draft: boolean
	url: string
	type: ReleaseType
	electronCurrent?: string
	buildTag?: string
}

function formatDate(input: string) {
	if (!input) return 'Unknown'
	const date = new Date(input)
	if (Number.isNaN(date.getTime())) return input
	return date.toISOString().slice(0, 10)
}

function getSortDate(release: ReleaseInfo): Date {
	if (release.publishedAt) {
		const d = new Date(release.publishedAt)
		if (!Number.isNaN(d.getTime())) return d
	}
	if (release.date !== 'Unknown') {
		const d = new Date(release.date)
		if (!Number.isNaN(d.getTime())) return d
	}
	return new Date(0)
}

function compareVersionsDesc(a: string, b: string): number {
	return b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' })
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

export async function getReleases(): Promise<{
	releases: ReleaseInfo[]
	githubLatestRelease: ReleaseInfo | null
	error: string | null
}> {
	try {
		const [listRes, latestRes] = await Promise.all([
			fetch(
				'https://api.github.com/repos/Devollox/void-presence/releases?per_page=100',
				{
					cache: 'force-cache',
					next: { revalidate: 300 },
					headers: githubHeaders(),
				},
			),
			fetch(
				'https://api.github.com/repos/Devollox/void-presence/releases/latest',
				{
					cache: 'force-cache',
					next: { revalidate: 300 },
					headers: githubHeaders(),
				},
			),
		])

		if (!listRes.ok) {
			return {
				releases: [],
				githubLatestRelease: null,
				error:
					listRes.status === 403
						? 'GitHub API rate limit exceeded. Please try again in a few minutes or open the GitHub releases page.'
						: 'Failed to load release schedule. Please try again later.',
			}
		}

		const data = await listRes.json()
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
					publishedAt: item.published_at ?? '',
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
			return getSortDate(b).getTime() - getSortDate(a).getTime()
		})

		releases = applyBuildTagPriority(releases)

		const normalSorted = [...releases].filter(
			r =>
				r.type !== 'nightly' && r.type !== 'pre-release' && r.type !== 'broken',
		)

		normalSorted.sort((a, b) => {
			return getSortDate(b).getTime() - getSortDate(a).getTime()
		})

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

			if (stableTagVersions.has(r.version)) {
				return { ...r, type: 'stable' as const }
			}

			return { ...r, type: 'end of life' as const }
		})

		let lastElectronVersion: string | undefined

		releases = releases
			.sort((a, b) => {
				return getSortDate(a).getTime() - getSortDate(b).getTime()
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
				const dateDiff = getSortDate(b).getTime() - getSortDate(a).getTime()
				if (dateDiff !== 0) return dateDiff
				return compareVersionsDesc(a.version, b.version)
			})

		let githubLatestRelease: ReleaseInfo | null = null

		if (latestRes.ok) {
			const latestData = await latestRes.json()
			const rawAssets = Array.isArray(latestData.assets)
				? latestData.assets
				: []

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

			const rawBody = latestData.body || ''
			const notes = normalizeReleaseNotes(rawBody)
			const electronVersion = parseElectronVersionFromNotes(notes)
			const classification = classifyRelease(latestData, rawBody)

			githubLatestRelease = {
				version: latestData.tag_name || 'unknown',
				commit: latestData.target_commitish || null,
				date: latestData.published_at
					? formatDate(latestData.published_at)
					: 'Unknown',
				publishedAt: latestData.published_at ?? '',
				notes,
				assets,
				prerelease: !!latestData.prerelease,
				draft: !!latestData.draft,
				url: latestData.html_url || '',
				type: classification.type,
				electronCurrent: electronVersion,
				buildTag: classification.buildTag,
			}
		}

		return { releases, githubLatestRelease, error: null }
	} catch {
		return {
			releases: [],
			githubLatestRelease: null,
			error: 'Failed to load release schedule. Please try again later.',
		}
	}
}
