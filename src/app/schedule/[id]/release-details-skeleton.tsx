import { PanelLayout } from '@components/panel-layout'
import layoutStyles from '@components/panel-layout/layout-panels.module.css'
import styles from '../schedule.module.css'

function SkeletonLine(props: { width?: string; height?: string }) {
	const { width = '100%', height = '12px' } = props
	return (
		<div
			style={{
				width,
				height,
				borderRadius: 999,
				background:
					'linear-gradient(90deg, #262626 0%, #3f3f3f 50%, #262626 100%)',
				backgroundSize: '200% 100%',
				animation: 'skeleton-shimmer 1.4s ease-in-out infinite',
			}}
		/>
	)
}

export default function ReleaseDetailsSkeleton() {
	const left = (
		<>
			<div className={styles.filter_header}>Release</div>

			<div className={styles.release_meta}>
				<div className={styles.release_row}>
					<span className={styles.release_label}>Version</span>
					<SkeletonLine width='80px' />
				</div>
				<div className={styles.release_row}>
					<span className={styles.release_label}>Release date</span>
					<SkeletonLine width='100px' />
				</div>
				<div className={styles.release_row}>
					<span className={styles.release_label}>Electron</span>
					<SkeletonLine width='90px' />
				</div>
				<div className={styles.release_row}>
					<span className={styles.release_label}>Type</span>
					<SkeletonLine width='70px' />
				</div>
			</div>

			<div style={{ marginTop: 12 }}>
				<SkeletonLine width='180px' height='32px' />
			</div>
		</>
	)

	const right = (
		<section className={styles.page_section}>
			<div className={layoutStyles.preview_card_wrap}>
				<div className={layoutStyles.preview_card}>
					<div className={styles.preview_header}>
						<h3 className={styles.preview_title}>Release details</h3>
					</div>

					<ul className={styles.release_list}>
						<li className={styles.release_item}>
							<div className={styles.release_card}>
								<div className={styles.release_card_top}>
									<div className={styles.release_card_left}>
										<div className={styles.version_row}>
											<SkeletonLine width='80px' />
											<SkeletonLine width='60px' height='16px' />
										</div>
									</div>
									<SkeletonLine width='90px' />
								</div>

								<div className={styles.release_card_meta}>
									<SkeletonLine width='140px' />
									<SkeletonLine width='90px' />
									<SkeletonLine width='110px' />
								</div>
							</div>

							<div className={styles.release_card_changelog}>
								<SkeletonLine width='100%' />
								<div style={{ height: 4 }} />
								<SkeletonLine width='95%' />
								<div style={{ height: 4 }} />
								<SkeletonLine width='90%' />
							</div>
						</li>
					</ul>
				</div>
			</div>
		</section>
	)

	return <PanelLayout left={left} right={right} />
}
