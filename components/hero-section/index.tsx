'use client'

import RenderBackdropAnimation from '../../lib/render-backdrop'
import Button from '../button'
import Stats from '../stats'
import styles from './hero-section.module.css'

export default function HeroSection() {
	return (
		<section id='home-hero-section' className={styles.page_section}>
			<RenderBackdropAnimation />
			<div className={styles.page_section_inner}>
				<div id='hero-top-container' className={styles.flex_container}>
					<h1 className={`${styles.text_center} ${styles.title}`}>
						Void Presence
					</h1>
					<p className={`${styles.text_center} ${styles.title_description}`}>
						Advanced Discord Rich Presence manager with customizable profiles.
					</p>
					<Button />
					<Stats />
					<div className={styles.mouse_icon}>
						<div className={styles.scroll_wheel}></div>
					</div>
				</div>
			</div>
		</section>
	)
}
