'use client'

import { useEffect, useState } from 'react'
import CountUp from '../../lib/count-up'
import {
	incrementVisitors,
	onStatsChange,
	type Stats,
} from '../../service/firebase'
import styles from './stats.module.css'

export default function Stats() {
	const [stats, setStats] = useState<Stats>({
		visitors: { count: 0, lastUpdated: 0 },
		downloads: { count: 0, lastUpdated: 0 },
	})

	const [loaded, setLoaded] = useState(false)

	useEffect(() => {
		incrementVisitors()

		const unsubscribe = onStatsChange(next => {
			setStats(prev => {
				prev.downloads.count || 0
				prev.visitors.count || 0
				return next
			})
			setLoaded(true)
		})

		return unsubscribe
	}, [])

	return (
		<div className={styles.downloads_container}>
			<strong>
				{loaded ? (
					<CountUp
						key={`downloads-${stats.downloads.count}`}
						to={stats.downloads.count}
						duration={2.5}
					/>
				) : (
					<span>0</span>
				)}
			</strong>
			<span> Downloads</span>

			<strong>
				{loaded ? (
					<CountUp
						key={`visitors-${stats.visitors.count}`}
						to={stats.visitors.count}
						duration={2.5}
					/>
				) : (
					<span>0</span>
				)}
			</strong>
			<span> Visitors</span>
		</div>
	)
}
