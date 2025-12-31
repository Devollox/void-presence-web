import type { Metadata } from 'next'
import Footer from '../../../components/footer'
import Page from '../../../components/page'
import PageHeader from '../../../components/page-header'
import styles from './status.module.css'

export const metadata: Metadata = {
	title: 'Status',
	description:
		"Status information about Discord's Rich Presence buttons bug and how it affects Void Presence.",
	openGraph: {
		title: 'Void Presence Status',
		description:
			"Learn about Discord's Rich Presence buttons visibility issue and current Void Presence status.",
		url: '/status',
	},
}

export default function StatusPage() {
	return (
		<Page>
			<main id='main-page-content'>
				<PageHeader
					title='Status'
					subtitle="Discord screwed something up so you can't see your own buttons, but others will see them just fine."
				/>

				<div className={styles.status_panel}>
					<div className={styles.status_left_side}>
						<div className={styles.info_box}>
							<h4 className={styles.info_title}>What is going on?</h4>
							<p className={styles.info_text}>
								Discord has a long-standing bug where you can&apos;t see your
								own Rich Presence buttons in the client.
							</p>
							<p className={styles.info_text}>
								Your friends will still see and be able to click the buttons
								just fine – Void Presence is working as expected.
							</p>
						</div>

						<div className={styles.info_box}>
							<h4 className={styles.info_title}>Do I need to fix anything?</h4>
							<p className={styles.info_text}>
								No. There is nothing to configure or reinstall on your side.
								This behavior is entirely on Discord&apos;s end.
							</p>
						</div>

						<div className={styles.info_box_muted}>
							<p className={styles.info_small}>
								If Discord ever changes this behavior, Void Presence will keep
								working without any extra updates from you.
							</p>
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</Page>
	)
}
