import { initializeApp } from 'firebase/app'
import {
	get,
	getDatabase,
	onValue,
	ref,
	runTransaction,
} from 'firebase/database'

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY as string,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
	databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL as string,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
	messagingSenderId: process.env
		.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID as string,
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app, firebaseConfig.databaseURL)

export interface ButtonPair {
	label1: string
	url1: string
	label2?: string
	url2?: string
}

export interface ConfigData {
	cycles: Array<{ details: string; state: string }>
	imageCycles: Array<{
		largeImage: string
		largeText?: string
		smallImage?: string
		smallText?: string
	}>
	buttonPairs: ButtonPair[]
}

export interface Config {
	id: string
	title: string
	author: string
	downloads: number
	description: string
	configData: ConfigData
}

export function onConfigsChange(
	callback: (configs: Config[]) => void,
	refPath?: string
) {
	const path = refPath || 'configs'
	const configsRef = ref(db, path)

	const unsubscribe = onValue(configsRef, snapshot => {
		const data = snapshot.val()
		const configs: Config[] = Object.entries(data || {}).map(([id, raw]) => {
			const config = raw as any
			return {
				id,
				title: config.title || 'Unnamed',
				author: config.author || 'Unknown',
				downloads:
					typeof config.downloads === 'number'
						? config.downloads
						: parseInt(String(config.downloads ?? '0')) || 0,
				description: config.description || '',
				configData: config.configData || {
					cycles: [{ details: 'Idling in the void', state: 'Just vibing' }],
					imageCycles: [],
					buttonPairs: [],
				},
			}
		})
		callback(configs)
	})

	return unsubscribe
}

export async function incrementDownloads(configId: string): Promise<void> {
	const configRef = ref(db, `configs/${configId}`)

	await runTransaction(configRef, currentData => {
		if (!currentData) return currentData

		const raw = currentData.downloads
		const current =
			typeof raw === 'number' ? raw : parseInt(String(raw ?? '0')) || 0

		return {
			...currentData,
			downloads: current + 1,
		}
	})
}

export async function incrementVisitors(): Promise<void> {
	try {
		const statsRef = ref(db, 'stats/visitors')
		await runTransaction(statsRef, stats => {
			if (stats) {
				stats.count = (stats.count || 0) + 1
			} else {
				stats = { count: 1, lastUpdated: Date.now() }
			}
			return stats
		})
	} catch {}
}

export async function incrementDownloadsStats(): Promise<void> {
	try {
		const statsRef = ref(db, 'stats/downloads')
		await runTransaction(statsRef, stats => {
			if (stats) {
				stats.count = (stats.count || 0) + 1
			} else {
				stats = { count: 1, lastUpdated: Date.now() }
			}
			return stats
		})
	} catch {}
}

export interface Stats {
	visitors: { count: number; lastUpdated: number }
	downloads: { count: number; lastUpdated: number }
}

export function onStatsChange(callback: (stats: Stats) => void) {
	const statsRef = ref(db, 'stats')
	const unsubscribe = onValue(statsRef, snapshot => {
		const data = snapshot.val()
		callback({
			visitors: data.visitors,
			downloads: data.downloads,
		})
	})
	return unsubscribe
}

export function onConfigByIdChange(
	id: string,
	callback: (config: Config | null) => void
) {
	const configRef = ref(db, `configs/${id}`)

	const unsubscribe = onValue(configRef, snapshot => {
		const data = snapshot.val()

		if (!data) {
			callback(null)
			return
		}

		const downloads =
			typeof data.downloads === 'number'
				? data.downloads
				: parseInt(String(data.downloads ?? '0')) || 0

		const config: Config = {
			id,
			title: data.title || 'Unnamed',
			author: data.author || 'Unknown',
			downloads,
			description: data.description || '',
			configData: data.configData || {
				cycles: [{ details: 'Idling in the void', state: 'Just vibing' }],
				imageCycles: [],
				buttonPairs: [],
			},
		}

		callback(config)
	})

	return unsubscribe
}

export async function getConfigs(): Promise<Config[]> {
	const configsRef = ref(db, 'configs')
	const snapshot = await get(configsRef)
	if (!snapshot.exists()) return []
	const data = snapshot.val() as Record<string, any>

	const configs: Config[] = Object.entries(data).map(([id, raw]) => {
		const config = raw as any

		return {
			id,
			title: config.title || 'Unnamed',
			author: config.author || 'Unknown',
			downloads:
				typeof config.downloads === 'number'
					? config.downloads
					: parseInt(String(config.downloads ?? '0')) || 0,
			description: config.description || '',
			configData: config.configData || {
				cycles: [{ details: 'Idling in the void', state: 'Just vibing' }],
				imageCycles: [],
				buttonPairs: [],
			},
		}
	})

	return configs
}

export async function getConfigById(id: string): Promise<Config | null> {
	const all = await getConfigs()
	const found = all.find(c => c.id === id)
	return found ?? null
}
