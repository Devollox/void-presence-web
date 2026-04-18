export type PackageJson = {
	name?: string
	version?: string
	description?: string
	dependencies?: Record<string, string>
	devDependencies?: Record<string, string>
	peerDependencies?: Record<string, string>
	optionalDependencies?: Record<string, string>
	[key: string]: any
}

export type PackageDependencyEntry = {
	key: string
	label: string
	value: string
	kind: 'runtime' | 'dev' | 'tooling'
}

export type PackageMeta = {
	name: string | null
	version: string | null
	description: string | null
	dependencies: PackageDependencyEntry[]
}

const INTERESTING_DEPENDENCIES = [
	{ name: 'electron', label: 'Electron', kind: 'tooling' },
	{ name: 'typescript', label: 'TypeScript', kind: 'tooling' },
	{ name: 'firebase', label: 'Firebase', kind: 'runtime' },
	{ name: 'discord-rpc', label: 'Discord RPC', kind: 'runtime' },
	{ name: 'electron-builder', label: 'Electron Builder', kind: 'tooling' },
	{
		name: 'electron-squirrel-startup',
		label: 'Electron Squirrel Startup',
		kind: 'tooling',
	},
	{ name: 'electron-reloader', label: 'Electron Reloader', kind: 'tooling' },
	{ name: 'eslint', label: 'ESLint', kind: 'tooling' },
	{
		name: '@coooookies/windows-smtc-monitor',
		label: 'Windows Smtc Monitor',
		kind: 'tooling',
	},
	{
		name: 'dotenv',
		label: 'Dotenv',
		kind: 'tooling',
	},
] satisfies {
	name: string
	label: string
	kind: PackageDependencyEntry['kind']
}[]

function findDepValue(
	pkg: PackageJson,
	name: string,
): { value: string; kind: PackageDependencyEntry['kind'] } | null {
	if (pkg.dependencies?.[name]) {
		return { value: pkg.dependencies[name], kind: 'runtime' }
	}
	if (pkg.devDependencies?.[name]) {
		return { value: pkg.devDependencies[name], kind: 'dev' }
	}
	if (pkg.peerDependencies?.[name]) {
		return { value: pkg.peerDependencies[name], kind: 'runtime' }
	}
	if (pkg.optionalDependencies?.[name]) {
		return { value: pkg.optionalDependencies[name], kind: 'runtime' }
	}
	return null
}

export function extractPackageMeta(
	pkg: PackageJson | null,
): PackageMeta | null {
	if (!pkg) return null

	const entries: PackageDependencyEntry[] = []

	for (const def of INTERESTING_DEPENDENCIES) {
		const found = findDepValue(pkg, def.name)
		if (!found) continue

		entries.push({
			key: def.name,
			label: def.label,
			value: found.value,
			kind: def.kind,
		})
	}

	return {
		name: pkg.name ?? null,
		version: pkg.version ?? null,
		description: pkg.description ?? null,
		dependencies: entries,
	}
}
