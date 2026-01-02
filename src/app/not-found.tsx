import Link from 'next/link'
import Page from '../../components/page'
import PageHeader from '../../components/page-header'
import styles from './download/download.module.css'

export default function NotFound() {
	return (
		<Page>
			<main id='main-page-content'>
				<PageHeader
					title='Page not found'
					subtitle='The page you requested does not exist or is no longer available.'
				/>

				<div className={styles.download_panel}>
					<div className={styles.download_left_side}>
						<div className={styles.stats_summary}>
							<span>We couldn&apos;t find anything at this address.</span>
						</div>

						<div className={styles.secondary_box}>
							<h4 className={styles.secondary_title}>Looking for downloads?</h4>
							<p className={styles.secondary_text}>
								You can always get the latest Void Presence build on the
								download page.
							</p>
							<Link
								style={{ marginTop: '10px' }}
								href='/download'
								className={styles.download_btn_primary}
							>
								<span className={styles.asset_action_text}>
									Go to download page
								</span>
							</Link>
						</div>
					</div>

					<div className={styles.download_right_side}>
						<section className={styles.page_section}>
							<div className={styles.preview_card_wrap}>
								<div className={styles.preview_card}>
									<h3 className={styles.preview_title}>Nothing to see here</h3>
									<p className={styles.secondary_text}>
										The content you were looking for might have been moved or
										deleted.
									</p>
								</div>
							</div>
						</section>
					</div>
				</div>
			</main>
		</Page>
	)
}
