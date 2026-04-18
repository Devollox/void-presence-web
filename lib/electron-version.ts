export function parseElectronVersionFromNotes(
	notes: string,
): string | undefined {
	const lines = notes.split(/\r?\n/).map(line => line.trim())

	for (const line of lines) {
		const match = line.match(
			/Updated\s+Electron\s+to\s+([0-9]+(?:\.[0-9]+){2})/i,
		)
		if (match?.[1]) {
			return match[1]
		}
	}

	let inDependencies = false

	for (const line of lines) {
		if (/^dependencies$/i.test(line)) {
			inDependencies = true
			continue
		}

		if (inDependencies) {
			if (!line) break

			const depsMatch = line.match(/Electron[^0-9]*([0-9]+(?:\.[0-9]+){2})/i)
			if (depsMatch?.[1]) {
				return depsMatch[1]
			}
		}
	}

	for (const line of lines) {
		if (!/electron/i.test(line)) continue

		const simpleMatch = line.match(/Electron[^0-9]*([0-9]+(?:\.[0-9]+){2})/i)
		if (simpleMatch?.[1]) {
			return simpleMatch[1]
		}
	}

	return undefined
}

export function parseBuildTagFromNotes(notes: string): string | undefined {
	const lines = notes.split(/\r?\n/)

	for (const rawLine of lines) {
		const line = rawLine.trim()

		if (!/tag:/i.test(line)) continue

		const normalized = line
			.replace(/^[-*]\s*/, '')
			.replace(/\*\*/g, '')
			.trim()

		const match = normalized.match(/tag:\s*([a-z0-9\-_.]+)/i)
		if (match?.[1]) {
			return match[1].toLowerCase()
		}
	}

	return undefined
}
