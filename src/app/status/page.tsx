import layoutStyles from '@components/panel-layout/layout-panels.module.css'
import type { Metadata } from 'next'
import Footer from '../../../components/footer'
import Page from '../../../components/page'
import PageHeader from '../../../components/page-header'
import { PanelLayout } from '../../../components/panel-layout'
import config from '../../../data/config.json'
import RpcPreviewClient from '../download/rpc-preview-client'
import styles from './status.module.css'

export const metadata: Metadata = {
	title: 'Status',
	description:
		"Current Void Presence status and details about Discord's Rich Presence buttons visibility bug.",
	openGraph: {
		title: 'Void Presence Status',
		description:
			"Check current Void Presence status and learn about Discord's Rich Presence buttons visibility issue.",
		url: '/status',
	},
}

export default function StatusPage() {
	const left = (
		<div className={styles.status_left_side}>
			<div className={styles.info_box}>
				<h4 className={styles.info_title}>Current status</h4>
				<p className={styles.info_text}>
					Void Presence is operating normally. Rich Presence updates are sent to
					Discord on schedule.
				</p>
				<p className={styles.info_text}>
					The only limitation right now is a Discord-side bug with button
					visibility in your own client.
				</p>
			</div>

			<div className={styles.info_box}>
				<h4 className={styles.info_title}>What you will see</h4>
				<p className={styles.info_text}>
					In your own Discord client, Rich Presence buttons may be hidden or
					look inconsistent.
				</p>
				<p className={styles.info_text}>
					Friends and other users still see and can click the buttons as
					expected, using your configured labels and URLs.
				</p>
			</div>

			<div className={styles.info_box_muted}>
				<p className={styles.info_small}>
					If Discord changes this behavior in the future, Void Presence will
					continue working without additional steps from you.
				</p>
				<a href='/docs' className={styles.back_link}>
					Read setup &amp; troubleshooting
				</a>
			</div>
		</div>
	)

	const right = (
		<section className={styles.page_section}>
			<div className={layoutStyles.preview_card_wrap}>
				<div className={layoutStyles.preview_card}>
					<div className={layoutStyles.preview_header}>
						<h3 className={layoutStyles.preview_title}>
							Live presence preview
						</h3>
					</div>

					<div className={styles.rpc_card_preview}>
						<RpcPreviewClient config={config} />
					</div>
				</div>
			</div>
		</section>
	)

	return (
		<Page>
			<main id='main-page-content'>
				<PageHeader
					title='Status'
					subtitle='Void Presence is working normally; Discord may hide your own buttons, but others still see them.'
				/>
				<PanelLayout
					left={left}
					right={right}
					className={styles.status_panel}
				/>
			</main>
			<Footer />
		</Page>
	)
}
