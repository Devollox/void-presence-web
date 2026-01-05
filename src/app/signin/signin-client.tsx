'use client'

import { signIn } from 'next-auth/react'
import Link from 'next/link'
import Page from '../../../components/page'
import PageHeader from '../../../components/page-header'
import styles from './signin.module.css'

export function SignInPageClient() {
	const callbackUrl = '/profile'

	return (
		<Page>
			<main id='main-page-content'>
				<PageHeader
					title='Sign in to Void Presence'
					subtitle='Connect your account to manage profiles, status cycles and Discord Rich Presence.'
				/>

				<div className={styles.signin_panel}>
					<div className={styles.signin_left_side}>
						<div className={styles.stats_summary}>
							<span>
								Choose a provider to continue. You can disconnect at any time in
								your account settings.
							</span>
						</div>

						<div className={styles.secondary_box}>
							<h4 className={styles.secondary_title}>
								Don&apos;t have the app yet?
							</h4>
							<p className={styles.secondary_text}>
								Download the latest Void Presence build and start customizing
								your Discord activity.
							</p>
							<Link
								style={{ marginTop: '10px' }}
								href='/download'
								className={styles.signin_btn_primary}
							>
								<span className={styles.asset_action_text}>
									Go to download page
								</span>
							</Link>
						</div>
					</div>

					<div className={styles.signin_right_side}>
						<section className={styles.page_section}>
							<div className={styles.preview_card_wrap}>
								<div className={styles.preview_card}>
									<div className={styles.preview_header}>
										<h3 className={styles.preview_title}>Sign in</h3>
										<div className={styles.preview_badge}>
											<span className={styles.preview_badge_text}>
												Secure OAuth
											</span>
										</div>
									</div>

									<div className={styles.providers_list}>
										<button
											type='button'
											className={styles.signin_btn_primary}
											onClick={() => signIn('github', { callbackUrl })}
										>
											<span className={styles.asset_info}>
												<span className={styles.asset_name}>
													Sign in with GitHub
												</span>
												<span className={styles.asset_size}>
													Use your GitHub account
												</span>
											</span>
											<span className={styles.asset_action_text}>Continue</span>
										</button>

										<button
											type='button'
											className={styles.signin_btn_primary}
											onClick={() => signIn('google', { callbackUrl })}
										>
											<span className={styles.asset_info}>
												<span className={styles.asset_name}>
													Sign in with Google
												</span>
												<span className={styles.asset_size}>
													Use your Google account
												</span>
											</span>
											<span className={styles.asset_action_text}>Continue</span>
										</button>
									</div>

									<p className={styles.secondary_text}>
										We only use your account to authenticate you and sync your
										configs. You can revoke access from your provider&apos;s
										settings at any time.
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
