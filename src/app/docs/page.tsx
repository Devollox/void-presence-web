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
					'Install the desktop client, create a Discord application, then configure your first Rich Presence profile in the main window.',
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
					'If buttons or images are missing in Discord, open the status page to check setup, RPC connection and common issues.',
				]}
				linkHref='/status'
				linkLabel='Read setup & troubleshooting'
			/>
		</>
	)

	const right = (
		<article className={styles.docs_content}>
			<section className={styles.docs_card}>
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
			</section>
			<section className={styles.docs_card}>
				<h3 className={styles.docs_subtitle}>Quick usage</h3>
				<ol className={styles.docs_list_ordered}>
					<li className={styles.docs_list_item}>
						Open Discord desktop and keep it running; in Void Presence, the
						status chip at the top of the main card will change once the RPC
						connection is ready.
					</li>
					<li className={styles.docs_list_item}>
						In the{' '}
						<a
							style={{ color: 'white', textDecoration: 'underline' }}
							href='https://discord.com/developers/applications'
							target='_blank'
							rel='noreferrer'
						>
							Discord Developer Portal
						</a>
						, click <span className={styles.docs_code}>New Application</span>,
						give it a name and choose an{' '}
						<span className={styles.docs_code}>App icon</span> that will be used
						as the avatar for your activity when you are in a Discord voice or
						text channel. After creating the app, copy its Application ID into
						the rounded <span className={styles.docs_code}>client id</span>{' '}
						field in Void Presence.
					</li>
					<li className={styles.docs_list_item}>
						Set the <span className={styles.docs_code}>update(sec)</span> value
						to control how often the app rotates to the next entry in your
						lists.
					</li>
					<li className={styles.docs_list_item}>
						In the <span className={styles.docs_code}>Details &amp; State</span>{' '}
						section, click{' '}
						<span className={styles.docs_code}>+ DETAILS &amp; STATE</span> to
						add rows to the text cycle list.
					</li>
					<li className={styles.docs_list_item}>
						In the <span className={styles.docs_code}>images</span> section,
						click <span className={styles.docs_code}>+ image</span> to add rows
						with large/small image keys and texts. (.png/.jpeg/.gif) - URL
					</li>
					<li className={styles.docs_list_item}>
						In the <span className={styles.docs_code}>button pairs</span>{' '}
						section, click <span className={styles.docs_code}>+ pair</span> to
						add rows with one or two HTTPS buttons.
					</li>
					<li className={styles.docs_list_item}>
						Click <span className={styles.docs_code}>Save</span> to send the
						first update; the current payload box at the bottom of the card will
						show what Discord receives.
					</li>
				</ol>

				<p className={styles.docs_text}>
					Click <span className={styles.docs_code}>Save</span> after each change
					– the app will automatically save your configuration and restart the
					active Rich Presence session with the updated details, images and
					buttons.
				</p>
			</section>

			<section className={styles.docs_card}>
				<h3 className={styles.docs_subtitle}>How cycles work</h3>
				<p className={styles.docs_text}>
					Internally, each list (text, images, buttons) is an ordered array of
					rows. On every tick, Void Presence moves an index forward and uses the
					row at that position for the next Rich Presence update.
				</p>
				<ul className={styles.docs_list}>
					<li className={styles.docs_list_item}>
						Text cycle – rows from the Details &amp; State list are used for the
						main and secondary lines in Discord.
					</li>
					<li className={styles.docs_list_item}>
						Image cycle – rows from the images list control large/small image
						keys and their hover texts.
					</li>
					<li className={styles.docs_list_item}>
						Button cycle – rows from the button pairs list control the two
						clickable buttons; missing second button is simply ignored.
					</li>
					<li className={styles.docs_list_item}>
						If a list has only one row, the same values repeat on every step
						while other lists still rotate through their own rows.
					</li>
				</ul>
			</section>

			<section className={styles.docs_card}>
				<h3 className={styles.docs_subtitle}>Cycles UI demo</h3>
				<p className={styles.docs_text}>
					This example mirrors the Details &amp; State section in the desktop
					app: a label row, a rounded “+ Details &amp; State” button and a
					vertical list of draggable rows inside the cycles-list area.
				</p>

				<div className={styles.demo_card}>
					<div className={styles.demo_header}>
						<span className={styles.demo_label}>Details &amp; State</span>
						<button className={styles.demo_add_btn}>
							+ DETAILS &amp; STATE
						</button>
					</div>

					<div className={styles.demo_list} aria-label='cycles-list'>
						<div className={styles.demo_row}>
							<div className={styles.demo_row_body}>
								<input
									className={styles.demo_input}
									placeholder='Working on Void Presence'
									readOnly
									aria-label='Working on Void Presence'
								/>
								<input
									className={styles.demo_input}
									placeholder='Idle · Desktop client'
									readOnly
									aria-label='Idle · Desktop client'
								/>
							</div>
							<button className={styles.demo_remove_btn}>×</button>
						</div>

						<div className={styles.demo_row}>
							<div className={styles.demo_row_body}>
								<input
									className={styles.demo_input}
									placeholder='Playing Escape from Tarkov'
									readOnly
									aria-label='Playing Escape from Tarkov'
								/>
								<input
									className={styles.demo_input}
									placeholder='Custom RPC overlay'
									readOnly
									aria-label='Custom RPC overlay'
								/>
							</div>
							<button className={styles.demo_remove_btn}>×</button>
						</div>

						<div className={`${styles.demo_row} ${styles.demo_row_dragging}`}>
							<div className={styles.demo_row_body}>
								<input
									className={styles.demo_input}
									placeholder='Browsing configs on website'
									readOnly
									aria-label='Browsing configs on website'
								/>
								<input
									className={styles.demo_input}
									placeholder='Drag & drop profiles'
									readOnly
									aria-label='Drag & drop profiles'
								/>
							</div>
							<button className={styles.demo_remove_btn}>×</button>
						</div>
					</div>

					<div className={styles.demo_footer}>
						<div className={styles.demo_chip}>UPDATE(SEC): 30</div>
						<div className={styles.demo_chip}>3 STEPS IN CYCLE</div>
					</div>
				</div>

				<p className={styles.docs_text}>
					In the real app, each row in the cycles-list is draggable: on drag it
					darkens, gets a glow border and shadow, and you can drop it above or
					below other rows to change the order in which statuses appear in
					Discord.
				</p>
			</section>

			<section className={styles.docs_card}>
				<h3 className={styles.docs_subtitle}>Profiles &amp; cloud sync</h3>
				<p className={styles.docs_text}>
					Profiles store your cycles, images, buttons and client settings so you
					can quickly switch between different setups.
				</p>
				<ul className={styles.docs_list}>
					<li className={styles.docs_list_item}>
						Local profiles – Use the config name field and{' '}
						<span className={styles.docs_code}>save</span> button to add a
						profile to the local list.
					</li>
					<li className={styles.docs_list_item}>
						Export / import – Use{' '}
						<span className={styles.docs_code}>export</span> and the import
						dialog to move profiles as JSON between machines.
					</li>
					<li className={styles.docs_list_item}>
						Cloud upload – With an Author ID set,{' '}
						<span className={styles.docs_code}>Upload Current</span> sends your
						active profile to the cloud list in the client and on the website.
					</li>
				</ul>
			</section>

			<section className={styles.docs_card}>
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
			</section>
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
