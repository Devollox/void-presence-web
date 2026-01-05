'use client'

import { UserPen } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import styles from './navbar.module.css'

export default function Navbar() {
	const { data: session, status } = useSession()

	const isAuth = status === 'authenticated' && !!session?.user

	return (
		<header id='navbar' className={styles.navbar}>
			<div className={styles.page_section_inner}>
				<div>
					<Link className={styles.navbar_logo_container} href='/'>
						<div>Void Presence.</div>
					</Link>
				</div>

				<nav
					id='navbar-nav-items'
					className={styles.flex_container}
					data-toggle='affix'
				>
					<Link className={styles.nav_item} href='/configs'>
						Configs
					</Link>
					<Link className={styles.nav_item} href='/docs'>
						Documentation
					</Link>
					<Link className={styles.nav_item} href='/download'>
						Download
					</Link>
					<Link
						className={styles.nav_item}
						target='_blank'
						href='https://github.com/Devollox/void-presence'
						rel='noreferrer'
					>
						GitHub
						<svg
							aria-hidden='true'
							className={styles.navbar_external_arrow}
							height='7'
							viewBox='0 0 6 6'
							width='7'
						>
							<path
								d='M1.25215 5.54731L0.622742 4.9179L3.78169 1.75597H1.3834L1.38936 0.890915H5.27615V4.78069H4.40513L4.41109 2.38538L1.25215 5.54731Z'
								fill='var(--accents-3)'
							></path>
						</svg>
					</Link>

					{!isAuth && (
						<Link className={styles.nav_item} href='/signin' rel='noreferrer'>
							<button
								type='button'
								className={`${styles.btn} ${styles.btn_secondary}`}
							>
								<UserPen size={16} />
								<span>Sign In</span>
							</button>
						</Link>
					)}

					{isAuth && (
						<Link className={styles.nav_item} href='/profile'>
							<button
								type='button'
								className={`${styles.btn} ${styles.btn_secondary}`}
							>
								<UserPen size={16} />
								<span>{session.user?.name ?? 'Profile'}</span>
							</button>
						</Link>
					)}
				</nav>
			</div>
		</header>
	)
}
