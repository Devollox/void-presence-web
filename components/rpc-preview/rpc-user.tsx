'use client'

import Image from 'next/image'
import styles from './rpc-preview.module.css'

interface Cycle {
	details: string
	state: string
}

interface ImageCycle {
	largeImage: string
	largeText?: string
}

interface ButtonPair {
	label1: string
	url1: string
	label2?: string
	url2?: string
}

interface ConfigData {
	cycles: Cycle[]
	imageCycles: ImageCycle[]
	buttonPairs: ButtonPair[]
}

interface RpcPreviewProps {
	username?: string
	discriminator?: string
	activityType?: string
	currentCycle?: Cycle
	currentImage?: ImageCycle
	currentButtons?: ButtonPair | null
	currentIndex?: number
	config?: ConfigData
	avatarSrc?: string
}

const RpcUser = ({
	username = 'Devollox',
	discriminator = '#0001',
	avatarSrc,
}: {
	username?: string
	discriminator?: string
	avatarSrc?: string
}) => (
	<div className={styles.rpc_user}>
		<div className={styles.rpc_avatar}>
			<div className={styles.avatar_placeholder}>
				<Image
					src={avatarSrc || '/9qYdasdsadPFSA.png'}
					alt='Avatar'
					width={48}
					height={48}
					unoptimized
				/>
			</div>
			<div className={styles.status_indicator} />
		</div>
		<div>
			<div className={styles.username}>{username}</div>
			<div className={styles.discriminator}>{discriminator}</div>
		</div>
	</div>
)

const RpcActivityArt = ({
	currentImage = { largeImage: '/placeholder.jpg' },
}: {
	currentImage?: ImageCycle
}) => (
	<div className={styles.activity_art}>
		<Image
			width={64}
			height={64}
			src={currentImage.largeImage}
			alt='Activity art'
			className={styles.large_art}
			unoptimized
		/>
		<div className={styles.art_overlay} />
	</div>
)

const RpcActivityDetails = ({
	currentCycle = { details: 'No details', state: 'No state' },
	currentIndex = 0,
	config = {
		cycles: [],
		imageCycles: [],
		buttonPairs: [],
	},
}: {
	currentCycle?: Cycle
	currentIndex?: number
	config?: ConfigData
}) => (
	<div className={styles.activity_details}>
		<div className={styles.details_title}>{currentCycle.details}</div>
		<div className={styles.details_state}>{currentCycle.state}</div>
		<div className={styles.progress_bar}>
			<div className={styles.progress_bg}>
				<div
					className={styles.progress_fill}
					style={{
						width:
							config.cycles.length > 0
								? `${((currentIndex + 1) / config.cycles.length) * 100}%`
								: '100%',
					}}
				/>
			</div>
			<div className={styles.progress_time}>
				{config.cycles.length > 0
					? Math.round(((currentIndex + 1) / config.cycles.length) * 100)
					: 100}
				%
			</div>
		</div>
	</div>
)

const RpcButton = ({ label, url }: { label: string; url: string }) => (
	<a
		href={url}
		className={styles.rpc_btn}
		target='_blank'
		rel='noopener noreferrer'
	>
		{label}
	</a>
)

const RpcButtons = ({
	buttons,
}: {
	buttons: Array<{ label: string; url: string }>
}) => (
	<div className={styles.rpc_buttons}>
		{buttons.map((button, index) => (
			<RpcButton key={index} {...button} />
		))}
	</div>
)

const RpcActivity = ({
	activityType = 'Void Presence',
	currentCycle,
	currentImage,
	currentIndex,
	config,
}: {
	activityType?: string
	currentCycle?: Cycle
	currentImage?: ImageCycle
	currentIndex?: number
	config?: ConfigData
}) => (
	<div className={styles.rpc_activity}>
		<div className={styles.activity_type}>{activityType}</div>
		<div className={styles.activity_content}>
			<RpcActivityArt currentImage={currentImage} />
			<RpcActivityDetails
				currentCycle={currentCycle}
				currentIndex={currentIndex}
				config={config}
			/>
		</div>
	</div>
)

export default function RpcPreview({
	username,
	discriminator,
	activityType,
	currentCycle,
	currentImage,
	currentButtons,
	currentIndex,
	config,
	avatarSrc,
}: RpcPreviewProps) {
	const buttons: Array<{ label: string; url: string }> = []

	if (currentButtons) {
		buttons.push({ label: currentButtons.label1, url: currentButtons.url1 })
		if (currentButtons.label2 && currentButtons.url2) {
			buttons.push({ label: currentButtons.label2, url: currentButtons.url2 })
		}
	}

	return (
		<div className={styles.rpc_preview}>
			<RpcUser
				username={username}
				discriminator={discriminator}
				avatarSrc={avatarSrc}
			/>
			<RpcActivity
				activityType={activityType}
				currentCycle={currentCycle}
				currentImage={currentImage}
				currentIndex={currentIndex}
				config={config}
			/>
			{buttons.length > 0 && <RpcButtons buttons={buttons} />}
		</div>
	)
}
