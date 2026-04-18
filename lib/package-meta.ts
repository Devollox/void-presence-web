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

const INTERESTING_DEPENDENCIES: {
	name: string
	label: string
	kind: PackageDependencyEntry['kind']
}[] = [
	{ name: 'electron', label: 'Electron:', kind: 'runtime' },
	{ name: 'react', label: 'React:', kind: 'runtime' },
	{ name: 'react-dom', label: 'React DOM:', kind: 'runtime' },
	{ name: 'typescript', label: 'TypeScript:', kind: 'tooling' },
	{ name: 'vite', label: 'Vite:', kind: 'tooling' },
	{ name: 'webpack', label: 'Webpack:', kind: 'tooling' },
	{ name: 'electron-builder', label: 'electron-builder:', kind: 'tooling' },
	{ name: 'eslint', label: 'ESLint:', kind: 'tooling' },
	{ name: 'prettier', label: 'Prettier:', kind: 'tooling' },
	{ name: '@types/node', label: '@types/node:', kind: 'dev' },
	{ name: '@types/react', label: '@types/react:', kind: 'dev' },
	{ name: 'firebase', label: 'Firebase:', kind: 'runtime' },
	{ name: 'firebase-admin', label: 'Firebase Admin:', kind: 'runtime' },
	{ name: 'discord-rpc', label: 'discord-rpc:', kind: 'runtime' },
	{
		name: 'discord-rich-presence',
		label: 'discord-rich-presence:',
		kind: 'runtime',
	},
	{ name: 'electron-store', label: 'electron-store:', kind: 'runtime' },
	{ name: 'react-router', label: 'React Router:', kind: 'runtime' },
	{ name: 'react-router-dom', label: 'React Router DOM:', kind: 'runtime' },
	{ name: 'zod', label: 'Zod:', kind: 'runtime' },
]

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

	const knownNames = new Set(INTERESTING_DEPENDENCIES.map(d => d.name))

	if (pkg.dependencies) {
		for (const [name, value] of Object.entries(pkg.dependencies)) {
			if (knownNames.has(name)) continue
			entries.push({
				key: name,
				label: `${name}:`,
				value,
				kind: 'runtime',
			})
		}
	}

	if (pkg.devDependencies) {
		for (const [name, value] of Object.entries(pkg.devDependencies)) {
			if (knownNames.has(name)) continue
			entries.push({
				key: name,
				label: `${name}:`,
				value,
				kind: 'dev',
			})
		}
	}

	return {
		name: pkg.name ?? null,
		version: pkg.version ?? null,
		description: pkg.description ?? null,
		dependencies: entries,
	}
}
