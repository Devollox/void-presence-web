import { ReactNode } from 'react'
import layoutStyles from './layout-panels.module.css'

interface PanelLayoutProps {
	left?: ReactNode
	right?: ReactNode
	className?: string
}

export function PanelLayout({ left, right, className }: PanelLayoutProps) {
	const rootClassName = className
		? `${layoutStyles.panel} ${className}`
		: layoutStyles.panel

	return (
		<div className={rootClassName}>
			<div className={layoutStyles.panel_left_side}>{left}</div>
			<div className={layoutStyles.panel_right_side}>{right}</div>
		</div>
	)
}
