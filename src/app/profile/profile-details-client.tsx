'use client'

import RpcPreview from '@components/rpc-preview/rpc-user'
import type { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import { useState } from 'react'
import type { Config } from '../../../service/firebase'
import styles from './profile-details.module.scss'

type Props = {
	user: any
	session: Session
	lastConfig: Config | null
}

export function ProfileDetailsClient({ user, lastConfig }: Props) {
	const [copied, setCopied] = useState(false)

	const configData = lastConfig?.configData
	const cycles = configData?.cycles?.length
		? configData.cycles
		: [{ details: '', state: '' }]
	const images = configData?.imageCycles?.length
		? configData.imageCycles
		: [{ largeImage: '' }]
	const buttonsList = configData?.buttonPairs?.length
		? configData.buttonPairs
		: [{ label1: '', url1: '' }]

	const firstCycle = cycles[0]
	const firstImage = images[0]
	const firstButtons = buttonsList[0]

	const handleCopyUserId = async () => {
		if (!user?.id) return
		try {
			await navigator.clipboard.writeText(String(user.id))
			setCopied(true)
			setTimeout(() => setCopied(false), 1500)
		} catch (e) {}
	}

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
								<h1 className={styles.title}>{user.name || 'Your profile'}</h1>
								<div className={styles.title_description}>
									<strong>Email: </strong>
									{user.email || 'No email linked'}
								</div>
								<section className={styles.addon_actions}>
									<div className={styles.btn_container}>
										<a href='/download' className={styles.download_btn_primary}>
											Download Void Presence
										</a>
									</div>
								</section>
								<section className={styles.about_addon}>
									<span className={styles.addon_metadata_row}>
										<strong>Author ID: </strong>
										{user.id ?? '—'}
									</span>
								</section>
							</div>
						</div>

						<div className={styles.addon_details_middle_column}>
							<div className={styles.rpc_card_preview}>
								{lastConfig && configData ? (
									<RpcPreview
										discriminator={`#${user.id.slice(0, 4)}` || '#0001'}
										username={user.name || 'User'}
										activityType={lastConfig.title}
										currentCycle={firstCycle}
										currentImage={firstImage}
										currentButtons={firstButtons}
										currentIndex={0}
										config={configData}
									/>
								) : (
									<div className={styles.skel_rpc} />
								)}
							</div>
						</div>

						<div className={styles.addon_details_middle_column}>
							<div className={styles.actions_panel}>
								<h2 className={styles.actions_title}>Profile actions</h2>
								<p className={styles.actions_subtitle}>
									Manage your account and configs.
								</p>
								<div className={styles.actions_buttons}>
									<a href='/configs' className={styles.action_btn_primary}>
										<span>View all configs</span>
										<span className={styles.action_btn_hint}>
											community list
										</span>
									</a>
									<button
										type='button'
										className={styles.action_btn_secondary}
										onClick={handleCopyUserId}
									>
										<span>{copied ? 'Copied' : 'Copy author ID'}</span>
										<span className={styles.action_btn_hint}>
											{copied ? 'success' : 'to clipboard'}
										</span>
									</button>
									<button
										type='button'
										className={styles.action_btn_secondary}
										onClick={() => signOut({ callbackUrl: '/' })}
									>
										<span>Sign out</span>
										<span className={styles.action_btn_hint}>end session</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
