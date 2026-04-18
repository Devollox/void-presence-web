import { PanelLayout } from '@components/panel-layout'
import layoutStyles from '@components/panel-layout/layout-panels.module.css'
import styles from '../../../styles/skeleton.module.css'

export default function DownloadSkeleton() {
	const left = (
		<>
			<div className={styles.skeleton_meta}>
				<div className={styles.skeleton_row}>
					<div className={styles.skeleton_label} />
					<div className={styles.skeleton_value_short} />
				</div>
				<div className={styles.skeleton_row}>
					<div className={styles.skeleton_label} />
					<div className={styles.skeleton_value_short} />
				</div>
				<div className={styles.skeleton_row}>
					<div className={styles.skeleton_label} />
					<div className={styles.skeleton_value_long} />
				</div>
			</div>

			<div className={styles.skeleton_release_meta}>
				<div className={styles.skeleton_row}>
					<div className={styles.skeleton_label} />
					<div className={styles.skeleton_value_short} />
				</div>
				<div className={styles.skeleton_row}>
					<div className={styles.skeleton_label} />
					<div className={styles.skeleton_value_short} />
				</div>
			</div>

			<div className={styles.skeleton_release_meta}>
				<div className={styles.skeleton_row}>
					<div className={styles.skeleton_label} />
					<div className={styles.skeleton_value_short} />
				</div>
			</div>
			<div className={styles.skeleton_release_meta}>
				<div className={styles.skeleton_row}>
					<div className={styles.skeleton_label} />
					<div className={styles.skeleton_value_short} />
				</div>
			</div>
			<div className={styles.skeleton_release_meta}>
				<div className={styles.skeleton_row}>
					<div className={styles.skeleton_label} />
					<div className={styles.skeleton_value_short} />
				</div>
			</div>
		</>
	)

	const right = (
		<section className={styles.page_section}>
			<div className={layoutStyles.preview_card_wrap}>
				<div className={layoutStyles.preview_card}>
					<div className={layoutStyles.preview_header}>
						<div className={styles.skeleton_title} />
						<div className={styles.skeleton_badge} />
					</div>

					<div className={styles.skeleton_changelog} />
				</div>
			</div>
		</section>
	)

	return <PanelLayout left={left} right={right} />
}
