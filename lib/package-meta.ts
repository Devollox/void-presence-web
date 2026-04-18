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

function findDepValue(pkg: PackageJson, name: string): string | undefined {
	return (
		pkg.dependencies?.[name] ||
		pkg.devDependencies?.[name] ||
		pkg.peerDependencies?.[name] ||
		pkg.optionalDependencies?.[name]
	)
}

export function extractPackageMeta(
	pkg: PackageJson | null,
): PackageMeta | null {
	if (!pkg) return null

	const entries: PackageDependencyEntry[] = []

	for (const def of INTERESTING_DEPENDENCIES) {
		const value = findDepValue(pkg, def.name)
		if (!value) continue

		entries.push({
			key: def.name,
			label: def.label,
			value,
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
