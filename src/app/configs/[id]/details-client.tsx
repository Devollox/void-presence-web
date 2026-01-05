'use client'

import { useEffect, useState } from 'react'
import RpcPreview from '../../../../components/rpc-preview/rpc-user'
import type { Config } from '../../../../service/firebase'
import { onConfigByIdChange } from '../../../../service/firebase'
import styles from './config-details.module.scss'
import { CopyJsonButton } from './copy-button'
import { ConfigStructure } from './structure'

type Props = {
	initialConfig: Config
	initialPreviewTick: number
}

function getPreviewTick() {
	const now = Date.now()
	return Math.floor(now / 3000)
}

export function ConfigDetailsClient({
	initialConfig,
	initialPreviewTick,
}: Props) {
	const [config, setConfig] = useState<Config | null>(initialConfig)
	const [previewTick, setPreviewTick] = useState(initialPreviewTick)

	useEffect(() => {
		const id = initialConfig.id

		const unsubscribe = onConfigByIdChange(id, next => {
			setConfig(next)
		})

		const interval = setInterval(() => {
			setPreviewTick(getPreviewTick())
		}, 3000)

		return () => {
			unsubscribe()
			clearInterval(interval)
		}
	}, [initialConfig.id])

	if (!config) {
		return (
			<section id='addon-details' className={styles.page_section}>
				<div className={styles.theme_view_panel}>
					<div className={styles.addon_splitview_container}>
						<div className={styles.addon_details_right_column}>
							<div className={styles.addon_details_segment}>
								<div className={styles.skel_back_link} />
								<div className={styles.skel_title} />
								<div className={styles.skel_subtitle} />
								<div className={styles.skel_meta_block}>
									<div className={styles.skel_meta_row} />
									<div className={styles.skel_meta_row} />
									<div className={styles.skel_meta_row} />
								</div>
							</div>
						</div>
						<div className={styles.addon_details_middle_column}>
							<div className={styles.skel_rpc} />
						</div>
						<div className={styles.addon_details_middle_column}>
							<div className={styles.skel_actions_panel}>
								<div className={styles.skel_actions_title} />
								<div className={styles.skel_actions_subtitle} />
								<div className={styles.skel_actions_btns}>
									<div className={styles.skel_btn} />
									<div className={styles.skel_btn} />
								</div>
							</div>
						</div>
					</div>
					<div className={styles.addon_details_left_column}>
						<div className={styles.skel_details_toggle} />
					</div>
				</div>
			</section>
		)
	}

	const configData = config.configData

	const cycles = configData.cycles?.length
		? configData.cycles
		: [{ details: '', state: '' }]
	const images = configData.imageCycles?.length
		? configData.imageCycles
		: [{ largeImage: '' }]
	const buttonsList = configData.buttonPairs?.length
		? configData.buttonPairs
		: [{ label1: '', url1: '' }]

	const cycleIndex = previewTick % cycles.length
	const imageIndex = previewTick % images.length
	const buttonIndex = previewTick % buttonsList.length

	const firstCycle = cycles[cycleIndex]
	const firstImage = images[imageIndex]
	const firstButtons = buttonsList[buttonIndex]

	return (
		<section id='addon-details' className={styles.page_section}>
			<div className={styles.theme_view_panel}>
				<img
					key={firstImage.largeImage || '/images/config-backdrop.png'}
					src={firstImage.largeImage || '/images/config-backdrop.png'}
					className={styles.addon_backdrop}
					alt=''
				/>
				<div>
					<div className={styles.addon_splitview_container}>
						<div className={styles.addon_details_right_column}>
							<div className={styles.addon_details_segment}>
								<a href='/configs' className={styles.back_link}>
									← Back to Configs
								</a>
								<h1 className={styles.title}>{config.title}</h1>
								<div className={styles.title_description}>
									{config.description}
								</div>
								<section className={styles.addon_actions}>
									<div className={styles.btn_container}>
										<a href='/configs' className={styles.download_btn_primary}>
											Back to list
										</a>
									</div>
								</section>
								<section className={styles.about_addon}>
									<span className={styles.addon_metadata_row}>
										<strong>Downloads: </strong>
										{config.downloads.toLocaleString()}
									</span>
									<span className={styles.addon_metadata_row}>
										<strong>Author: </strong>
										{config.author}
									</span>
									<span className={styles.addon_metadata_row}>
										<strong>Id: </strong>
										{config.id}
									</span>
								</section>
							</div>
						</div>

						<div className={styles.addon_details_middle_column}>
							<div className={styles.rpc_card_preview}>
								<RpcPreview
									discriminator={`#${config.authorId!.slice(0, 4)}` || '#0001'}
									username={config.author || 'User'}
									activityType={config.title}
									currentCycle={firstCycle}
									currentImage={firstImage}
									currentButtons={firstButtons}
									currentIndex={cycleIndex}
									config={configData}
								/>
							</div>
						</div>

						<div className={`${styles.addon_details_middle_column}`}>
							<div className={styles.actions_panel}>
								<h2 className={styles.actions_title}>Config actions</h2>
								<p className={styles.actions_subtitle}>
									Export or share this Discord Rich Presence config.
								</p>
								<div className={styles.actions_buttons}>
									<a
										href={`/api/configs/${config.id}/download`}
										className={styles.action_btn_primary}
									>
										<span>Download JSON</span>
										<span className={styles.action_btn_hint}>.json file</span>
									</a>
									<CopyJsonButton configId={config.id} />
								</div>
							</div>
						</div>
					</div>

					<div className={styles.addon_details_left_column}>
						<ConfigStructure configData={configData} />
					</div>
				</div>
			</div>
		</section>
	)
}
