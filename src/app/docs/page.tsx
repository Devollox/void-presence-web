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
						Create a Discord application and set Client ID from the{' '}
						<a
							style={{ color: 'white', textDecoration: 'underline' }}
							href='https://discord.com/developers/applications'
							target='_blank'
							rel='noreferrer'
						>
							Discord Developer Portal
						</a>
						.
					</li>
					<li className={styles.docs_list_item}>
						On the Rich Presence / Art Assets tab, upload images that you want
						to use as large and small icons and remember their keys.
					</li>
					<li className={styles.docs_list_item}>
						In Void Presence, choose update interval (default: 30 seconds) and
						enter details, state, image keys and optional tooltips.
					</li>
					<li className={styles.docs_list_item}>
						Add button pairs with labels and HTTPS URLs; leave the second button
						empty if you only need one.
					</li>
					<li className={styles.docs_list_item}>
						Create profiles and reorder them with drag and drop to group setups
						for different games or activities.
					</li>
					<li className={styles.docs_list_item}>
						Use config import / export to sync setups across machines via JSON.
					</li>
					<li className={styles.docs_list_item}>
						Click Save to start Rich Presence and use Restart / Stop when
						needed; make sure the Discord desktop app is running.
					</li>
				</ol>
			</div>

			<div className={styles.docs_card}>
				<h3 className={styles.docs_subtitle}>Configuration details</h3>
				<p className={styles.docs_text}>
					To use Rich Presence, Discord desktop client must be running and you
					need a Discord application with a valid Client ID created in the
					Developer Portal.
				</p>
				<p className={styles.docs_text}>
					Void Presence talks to the local Discord client via RPC: it sends the
					current activity (details, state, images and buttons) on a timer using
					your Client ID as the application identifier.
				</p>

				<ul className={styles.docs_list}>
					<li className={styles.docs_list_item}>
						<span className={styles.docs_code}>Client ID</span> – Application ID
						from the Discord Developer Portal; this tells Discord which app the
						presence belongs to.
					</li>
					<li className={styles.docs_list_item}>
						<span className={styles.docs_code}>Details</span> – Main line of
						text (for example “Working on Void Presence docs”).
					</li>
					<li className={styles.docs_list_item}>
						<span className={styles.docs_code}>State</span> – Second line of
						text under details, often used for status like “Idle” or “In game”.
					</li>
					<li className={styles.docs_list_item}>
						<span className={styles.docs_code}>Large image / Small image</span>–
						Keys of images that you uploaded on the Rich Presence tab for your
						application in the Developer Portal.
					</li>
					<li className={styles.docs_list_item}>
						<span className={styles.docs_code}>Large text / Small text</span> –
						Tooltips for the large and small image that appear on hover in the
						Discord client.
					</li>
					<li className={styles.docs_list_item}>
						<span className={styles.docs_code}>Buttons</span> – Up to two
						interactive buttons with label and URL; Discord only shows valid
						HTTPS links.
					</li>
					<li className={styles.docs_list_item}>
						<span className={styles.docs_code}>Update interval</span> – How
						often Void Presence pushes a new activity to Discord; shorter
						intervals look more dynamic but create more RPC traffic.
					</li>
				</ul>

				<p className={styles.docs_text}>
					Profiles in Void Presence store all of these fields plus your cycles
					configuration, so you can switch between completely different setups
					in one click.
				</p>

				<h4 className={styles.docs_subtitle}>
					What the <span className={styles.docs_code}>+</span> buttons do
				</h4>
				<ul className={styles.docs_list}>
					<li className={styles.docs_list_item}>
						<span className={styles.docs_code}>+ DETAILS &amp; STATE</span> –
						Adds a new status cycle entry with its own details and state. All
						cycles are rotated one by one using the update interval.
					</li>
					<li className={styles.docs_list_item}>
						<span className={styles.docs_code}>+ IMAGE</span> – Adds a new image
						cycle entry with large/small image keys and optional texts. Images
						are rotated independently from text and buttons.
					</li>
					<li className={styles.docs_list_item}>
						<span className={styles.docs_code}>+ PAIR</span> – Adds a new button
						pair with up to two buttons (label + HTTPS URL). Leave the second
						button empty if you only need a single button.
					</li>
				</ul>
			</div>
			<div className={styles.docs_card}>
				<h3 className={styles.docs_subtitle}>Profiles & cloud sync</h3>
				<p className={styles.docs_text}>
					Profiles store your cycles, images, buttons and client settings so you
					can quickly switch between different setups.
				</p>
				<ul className={styles.docs_list}>
					<li className={styles.docs_list_item}>
						Local profiles – Use the config name field and{' '}
						<span className={styles.docs_code}>save</span>
						button to add a profile to the local list.
					</li>
					<li className={styles.docs_list_item}>
						Export / import – Use{' '}
						<span className={styles.docs_code}>export</span> and the import
						dialog to move profiles as JSON between machines.
					</li>
					<li className={styles.docs_list_item}>
						Cloud upload – With an Author ID set,{' '}
						<span className={styles.docs_code}>Upload Current</span>
						sends your active profile to the cloud list in the client and on the
						website.
					</li>
				</ul>
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
