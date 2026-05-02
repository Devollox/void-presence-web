import { PanelLayout } from '@components/panel-layout'
import layoutStyles from '@components/panel-layout/layout-panels.module.css'
import { getReleaseDownloads } from '@lib/releases-schedule'
import { InfoBox } from '../../../../components/status-info/info-box'
import styles from '../schedule.module.css'
import ReleasesDownloadsChart from './releases-downloads-chart'

export async function DownloadsContent() {
	const { items, error } = await getReleaseDownloads()
	
	const chartData = items
		.map(r => ({
			tag: r.tag,
			totalDownloads: r.totalDownloads,
		}))
		.reverse()

	const totalDownloads = chartData.reduce(
		(sum, item) => sum + item.totalDownloads,
		0,
	)

	const left = (
		<>
			{error ? (
				<InfoBox variant='muted' lines={[error]} />
			) : (
				<>
					<div className={styles.release_meta}>
						<div className={styles.release_row}>
							<span className={styles.release_label}>Releases tracked</span>
							<span className={styles.release_value}>{items.length}</span>
						</div>
						<div className={styles.release_row}>
							<span className={styles.release_label}>Total downloads</span>
							<span className={styles.release_value}>
								{totalDownloads.toLocaleString('en-US')}
							</span>
						</div>
					</div>

					<InfoBox
						variant='secondary'
						title='Looking for a download?'
						lines={[
							'If you just need the latest stable build, you can always download it from the main download page.',
						]}
						linkHref='/download'
						linkLabel='Go to download page'
					/>
					<InfoBox
						variant='secondary'
						title='Need help installing?'
						lines={[
							'Check the install guide on the main page for platform-specific setup and tips.',
						]}
						linkHref='/docs'
						linkLabel='Read docs'
					/>
					<InfoBox
						variant='muted'
						lines={[
							'For full release history and detailed changelog per version, visit the release schedule page.',
						]}
						linkHref='/schedule'
						linkLabel='Open release schedule'
					/>
				</>
			)}
		</>
	)

	const right = (
		<section className={styles.page_section}>
			<div style={{ marginBottom: '20px' }}>
				<InfoBox
					variant='secondary'
					linkHref='/schedule'
					linkLabel='Back to Schedule'
				/>
			</div>
			<div className={layoutStyles.preview_card_wrap}>
				<ReleasesDownloadsChart data={chartData} />
			</div>
		</section>
	)

	return <PanelLayout left={left} right={right} />
}
