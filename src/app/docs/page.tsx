import { PanelLayout } from '@components/panel-layout'
import { InfoBox } from '@components/status-info/info-box'
import type { Metadata } from 'next'
import Footer from '../../../components/footer'
import Page from '../../../components/page'
import PageHeader from '../../../components/page-header'
import styles from './docs.module.css'

export const metadata: Metadata = {
	title: 'Docs',
	description:
		'Void Presence documentation: learn how to install, configure, and debug your Discord Rich Presence.',
	openGraph: {
		title: 'Void Presence Docs',
		description:
			'Read the full Void Presence documentation including features, setup steps, and usage tips.',
		url: '/docs',
	},
}

export default function DocsPage() {
	const left = (
		<>
			<InfoBox
				title='Getting started'
				lines={[
					'Learn how to install the app, configure Discord Developer Portal, and set up your first Rich Presence profile.',
				]}
			/>

			<InfoBox
				variant='secondary'
				title='Need the app?'
				lines={[
					'Download the latest Void Presence build on the download page and follow this guide to configure it.',
				]}
			/>

			<InfoBox
				variant='muted'
				lines={[
					'If your Rich Presence buttons are not visible in Discord, see the status page for details.',
				]}
				linkHref='/status'
				linkLabel='Read setup & troubleshooting'
			/>
		</>
	)

	const right = (
		<article className={styles.docs_content}>
			<div className={styles.docs_card}>
				<h3 className={styles.docs_title}>Overview</h3>
				<p className={styles.docs_text}>
					Void Presence is an advanced Discord Rich Presence manager with
					customizable button pairs, text cycles, image rotation and profile
					management via drag and drop.
				</p>
				<p className={styles.docs_text}>
					Text, image and button cycles are independent: you can mix different
					lengths and Void Presence will automatically loop each set on a timer,
					keeping your activity fresh without manual updates.
				</p>
			</div>

			<div className={styles.docs_card}>
				<h3 className={styles.docs_subtitle}>Quick usage</h3>
				<ol className={styles.docs_list_ordered}>
					<li className={styles.docs_list_item}>
						Set Client ID from the{' '}
						<a
							style={{ color: 'white' }}
							href='https://discord.com/developers/applications'
							target='_blank'
							rel='noreferrer'
						>
							Discord Developer Portal
						</a>
						.
					</li>
					<li className={styles.docs_list_item}>
						Choose update interval (default: 30 seconds).
					</li>
					<li className={styles.docs_list_item}>
						Add images, button pairs and status cycles; each list can have its
						own length, cycles will loop automatically.
					</li>
					<li className={styles.docs_list_item}>
						Create profiles and reorder them with drag and drop.
					</li>
					<li className={styles.docs_list_item}>
						Use config import / export to sync setups across machines.
					</li>
					<li className={styles.docs_list_item}>
						Click Save to start Rich Presence and use Restart / Stop when
						needed.
					</li>
				</ol>
			</div>

			<div className={styles.docs_card}>
				<h3 className={styles.docs_subtitle}>Features</h3>
				<ul className={styles.docs_list}>
					<li className={styles.docs_list_item}>
						Custom button pairs – Multiple button sets with labels and URLs;
						leave the second empty if you only need a single button.
					</li>
					<li className={styles.docs_list_item}>
						Status cycles – Rotate multiple details and state texts on a timer,
						independently from images and buttons.
					</li>
					<li className={styles.docs_list_item}>
						Image rotation – Cycle through large and small Rich Presence images;
						shorter image lists are reused automatically.
					</li>
					<li className={styles.docs_list_item}>
						Profiles with drag &amp; drop – Create and reorder presence presets.
					</li>
					<li className={styles.docs_list_item}>
						Config import / export – Move setups between machines via JSON.
					</li>
					<li className={styles.docs_list_item}>
						Auto-launch &amp; auto-hide – Optional start on boot and to tray.
					</li>
				</ul>
			</div>
		</article>
	)

	return (
		<Page>
			<main id='main-page-content'>
				<PageHeader
					title='Void Presence Docs'
					subtitle='Learn how to install, configure and debug your Discord Rich Presence.'
				/>
				<PanelLayout left={left} right={right} />
			</main>
			<Footer />
		</Page>
	)
}
