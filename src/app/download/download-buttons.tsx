'use client'

import { Download } from 'lucide-react'
import { incrementDownloadsStats } from '../../../service/firebase'
import styles from './download.module.css'

interface ReleaseAsset {
	name: string
	size: number
	downloadUrl: string
}

interface Props {
	assets: ReleaseAsset[]
}

export default function DownloadButtons({ assets }: Props) {
	const handleDownload = async (asset: ReleaseAsset) => {
		try {
			incrementDownloadsStats()
		} finally {
			window.open(asset.downloadUrl, '_blank')
		}
	}

	return (
		<div className={styles.assets_list}>
			{assets.map(asset => (
				<button
					key={asset.name}
					className={styles.download_btn_primary}
					onClick={() => handleDownload(asset)}
				>
					<div className={styles.asset_info}>
						<span className={styles.asset_name}>{asset.name}</span>
						<span className={styles.asset_size}>
							{asset.size.toFixed(1)} MB
						</span>
					</div>
					<div className={styles.asset_action}>
						<Download size={16} color='#f1f1f1' />
						<span className={styles.asset_action_text}>Download</span>
					</div>
				</button>
			))}
		</div>
	)
}
