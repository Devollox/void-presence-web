import type { Metadata } from 'next'
import Page from '../../../../components/page'
import PageHeader from '../../../../components/page-header'
import { getConfigById, type Config } from '../../../../service/firebase'
import styles from './config-details.module.scss'
import { ConfigDetailsClient } from './details-client'

type Params = {
	id: string
}

type Props = {
	params: Promise<Params> | Params
}

function getPreviewTick() {
	const now = Date.now()
	return Math.floor(now / 3000)
}

export async function generateMetadata(props: Props): Promise<Metadata> {
	const { id } = await props.params
	const config: Config | null = await getConfigById(id)

	if (!config) {
		return {
			title: 'Config not found',
			description:
				'Requested Void Presence Discord Rich Presence config could not be found.',
			openGraph: {
				title: 'Config not found',
				description:
					'Requested Void Presence Discord Rich Presence config could not be found.',
				url: `/configs/${id}`,
			},
		}
	}

	const name = (config as any).title ?? 'Void Presence Config'
	return {
		title: name,
		description: `View details and import the "${name}" Discord Rich Presence config for Void Presence.`,
		openGraph: {
			title: name,
			description: `Inspect and use the "${name}" community config for Void Presence Discord Rich Presence.`,
			url: `/configs/${id}`,
		},
	}
}

export default async function ConfigDetailsPage(props: Props) {
	const { id } = await props.params
	const config: Config | null = await getConfigById(id)
	const previewTick = getPreviewTick()

	if (!config) {
		return (
			<Page>
				<main id='main-page-content'>
					<PageHeader
						title='Pick a Config!'
						subtitle='Browse community custom Discord Rich Presence configs'
					/>
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
				</main>
			</Page>
		)
	}

	return (
		<Page>
			<main id='main-page-content'>
				<PageHeader
					title='Pick a Config!'
					subtitle='Browse community custom Discord Rich Presence configs'
				/>
				<ConfigDetailsClient
					initialConfig={config}
					initialPreviewTick={previewTick}
				/>
			</main>
		</Page>
	)
}
