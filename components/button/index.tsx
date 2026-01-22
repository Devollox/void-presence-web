'use client'

import { Book, Download } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { incrementDownloadsStats } from '../../service/firebase'
import styles from './button.module.css'

export default function Button() {
	const [downloadUrl, setDownloadUrl] = useState('')
	const [loading, setLoading] = useState(true)
	const router = useRouter()

	useEffect(() => {
		async function fetchLatestRelease() {
			try {
				setLoading(true)
				const response = await fetch(
					'https://api.github.com/repos/Devollox/void-presence/releases/latest',
				)
				const release = await response.json()

				const exeAsset = release.assets.find((asset: { name: string }) =>
					asset.name.endsWith('.exe'),
				)

				if (exeAsset) {
					setDownloadUrl(exeAsset.browser_download_url)
				}
			} catch (error) {
				console.error('Error:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchLatestRelease()
	}, [])

	const handleDownloadClick = () => {
		incrementDownloadsStats()

		setTimeout(() => {
			router.push('/docs')
		}, 1)
	}

	return (
		<div className={styles.btn_container}>
			<a
				href={downloadUrl}
				rel='noreferrer'
				onClick={handleDownloadClick}
				className={loading ? styles.disabled : ''}
			>
				<button
					className={`${styles.btn} ${styles.btn_primary}`}
					id='hero-download-button'
					disabled={loading || !downloadUrl}
				>
					<Download size={18} color='#000000' />
					<span>{loading ? 'Install Now' : 'Install Now'}</span>
				</button>
			</a>

			<a className={styles.btn_config} href='/configs'>
				<button
					className={`${styles.btn} ${styles.btn_secondary}`}
					id='hero-community-button'
				>
					<Book size={18} />
					<span>Configs</span>
				</button>
			</a>
		</div>
	)
}
