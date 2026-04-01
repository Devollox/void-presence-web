import './styles.css'

export default function VoidPage() {
	return (
		<div className='app'>
			<div className='titlebar'>
				<div className='titlebar-buttons'>
					<button id='window-minimize' className='titlebar-btn'>
						–
					</button>
					<button id='window-close' className='titlebar-btn'>
						×
					</button>
				</div>
			</div>

			<div className='shell'>
				<div className='top-tabs'>
					<div className='brand-inline'>
						<div className='brand-logo'>VP</div>
						<div className='brand-text'>
							<div className='brand-main'>VOID</div>
							<div className='brand-sub'>PRESENCE</div>
						</div>
					</div>
					<div className='tabs'>
						<button
							className='tab-btn'
							data-page='main'
							data-active='true'
							id='nav-main'
						>
							<div className='tab-indicator' />
							<span>main</span>
						</button>
						<button
							className='tab-btn'
							data-page='logs'
							data-active='false'
							id='nav-logs'
						>
							<div className='tab-indicator' />
							<span>logs</span>
						</button>
						<button
							className='tab-btn'
							data-page='config'
							data-active='false'
							id='nav-config'
						>
							<div className='tab-indicator' />
							<span>config</span>
						</button>
					</div>
				</div>

				<main className='main'>
					<section className='view' data-view='main' data-active='true'>
						<div className='top-bar'>
							<div className='status-chip'>
								<div className='status-dot' />
								<span>ACTIVE SESSION</span>
							</div>
						</div>

						<div className='content-scroll'>
							<div className='card'>
								<div className='card-header'>
									<div className='card-label'>activity</div>
									<div className='card-title-block'>
										<div className='card-title' id='activity-title'>
											Idle
										</div>
										<div className='card-label' id='activity-sub'>
											Waiting for Discord
										</div>
									</div>
								</div>

								<div className='divider' />

								<div className='client-row'>
									<span>client id</span>
									<input id='client-id-input' placeholder='Application ID' />
								</div>

								<div className='client-row'>
									<span>rpc mode</span>
									<div className='timestamp-mode-wrap' id='rpc-mode-wrap'>
										<button
											type='button'
											className='timestamp-mode-btn'
											data-mode='basic'
											data-active='false'
											id='rpc-mode-basic'
										>
											basic
										</button>
										<button
											type='button'
											className='timestamp-mode-btn'
											data-mode='advanced'
											data-active='true'
											id='rpc-mode-advanced'
										>
											music and youtube
										</button>
									</div>
								</div>

								<div className='client-row'>
									<span>update(sec)</span>
									<input
										id='update-interval-input'
										placeholder='Update Activity (sec) Minimum 5 sec'
									/>
								</div>

								<div className='client-row'>
									<span>activity</span>
									<div
										className='timestamp-mode-wrap_activity'
										id='activity-type-modes'
									>
										<button
											id='activity-type-playing'
											className='timestamp-mode-btn'
											data-active='true'
										>
											playing
										</button>
										<button
											id='activity-type-watching'
											className='timestamp-mode-btn'
											data-active='false'
										>
											watching
										</button>
										<button
											id='activity-type-listening'
											className='timestamp-mode-btn'
											data-active='false'
										>
											listening
										</button>
										<button
											id='activity-type-competing'
											className='timestamp-mode-btn'
											data-active='false'
										>
											competing
										</button>
									</div>
								</div>

								<div className='client-row'>
									<span>timestamp</span>
									<div className='timestamp-mode-wrap'>
										<button
											type='button'
											className='timestamp-mode-btn'
											data-mode='now'
											data-active='true'
											id='timestamp-mode-now'
										>
											now
										</button>
										<button
											type='button'
											className='timestamp-mode-btn'
											data-mode='range'
											data-active='false'
											id='timestamp-mode-range'
										>
											range
										</button>
										<button
											type='button'
											className='timestamp-mode-btn'
											data-mode='persist'
											data-active='false'
											id='timestamp-mode-persist'
										>
											persist
										</button>
									</div>
								</div>

								<div
									className='client-row timestamp-range-row'
									data-visible='false'
								>
									<span>range(min)</span>
									<input
										id='timestamp-range-min'
										placeholder='Seconds ago (min)'
									/>
								</div>

								<div
									className='client-row timestamp-range-row'
									data-visible='false'
								>
									<span>range(max)</span>
									<input
										id='timestamp-range-max'
										placeholder='Seconds ago (max)'
									/>
								</div>

								<div
									className='client-row timestamp-persist-row'
									data-visible='false'
								>
									<span>persist</span>
									<button
										id='timestamp-persist-reset'
										className='timestamp-reset-btn'
									>
										reset saved timestamp
									</button>
								</div>

								<div className='client-row now-mode-row' data-visible='true'>
									<span>now mode</span>
									<div className='timestamp-mode-wrap'>
										<button
											type='button'
											className='timestamp-mode-btn'
											id='now-mode-plain'
											data-active='true'
										>
											plain
										</button>
										<button
											type='button'
											className='timestamp-mode-btn'
											id='now-mode-progress'
											data-active='false'
										>
											progress
										</button>
										<button
											type='button'
											className='timestamp-mode-btn'
											id='now-mode-cycles'
											data-active='false'
										>
											cycles
										</button>
									</div>
								</div>

								<div
									className='divider time-cycles-divider'
									data-visible='false'
								/>

								<div
									className='list-header time-cycles-header'
									data-visible='false'
								>
									<div className='list-header-label'>time cycles</div>
									<button id='add-time' className='add-btn'>
										+ time
									</button>
								</div>
								<div
									id='time-list'
									className='time-cycles-list'
									data-visible='false'
								/>

								<div className='divider' />

								<div className='button-row'>
									<button
										style={{ display: 'none' }}
										id='client-id-save'
										className='rpc-button'
									>
										<span>SAVE and RESTART PRESENCE</span>
									</button>
								</div>

								<div className='button-row'>
									<button id='restart-discord' className='rpc-button'>
										<div className='rpc-button-icon'>↻</div>
										<span>RESTART PRESENCE</span>
									</button>
									<button id='stop-discord' className='rpc-button'>
										<div className='rpc-button-icon'>■</div>
										<span>STOP PRESENCE</span>
									</button>
								</div>

								<p className='hint-text'>
									After changing the client id or update(sec), click “RESTART
									PRESENCE”.
								</p>

								<div className='divider' />

								<div className='list-header' style={{ marginTop: '6px' }}>
									<div className='list-header-label'>Details &amp; State</div>
									<button id='add-cycle' className='add-btn'>
										+ Details &amp; State
									</button>
								</div>
								<div id='cycles-list' />

								<div className='divider' />

								<div className='list-header'>
									<div className='list-header-label'>images</div>
									<button id='add-image' className='add-btn'>
										+ image
									</button>
								</div>
								<div id='images-list' />

								<div className='divider' />

								<div className='list-header'>
									<div className='list-header-label'>button pairs</div>
									<button id='add-button-pair' className='add-btn'>
										+ pair
									</button>
								</div>
								<div id='buttons-list' />

								<div className='divider' />

								<div className='list-header'>
									<div className='list-header-label'>party size</div>
									<button id='add-party' className='add-btn'>
										+ party
									</button>
								</div>

								<div id='party-list' />

								<div className='divider' />

								<div className='auto-row'>
									<div className='auto-label'>
										<span>AUTO START</span>
										<div className='hint-text'>launch app with Windows</div>
									</div>
									<div
										id='auto-launch-toggle'
										className='auto-toggle'
										data-on='false'
									>
										<div className='auto-toggle-knob' />
									</div>
									<div className='auto-label'>
										<span>AUTO HIDE</span>
										<div className='hint-text'>minimize to tray on start</div>
									</div>
									<div
										id='auto-hide-toggle'
										className='auto-toggle'
										data-on='false'
									>
										<div className='auto-toggle-knob' />
									</div>
								</div>

								<div className='meta-row'>
									<span id='meta-object'>OBJECT: —</span>
									<span id='meta-buttons'>BUTTONS: —</span>
								</div>
							</div>

							<div className='payload'>
								<div className='payload-title'>current payload</div>
								<div className='payload-grid'>
									<div className='payload-label'>Buttons</div>
									<div className='payload-value' id='info-buttons'>
										–
									</div>
									<div className='payload-label'>Object</div>
									<div className='payload-value' id='info-object'>
										–
									</div>
									<div className='payload-label'>State</div>
									<div className='payload-value' id='info-details'>
										–
									</div>
									<div className='payload-label'>Uptime</div>
									<div className='payload-value' id='info-uptime'>
										–
									</div>
								</div>
								<div className='payload-status' id='info-status'>
									Waiting for first update…
								</div>
							</div>
						</div>
					</section>

					<section className='view' data-view='logs' data-active='false'>
						<div className='logs-view-wrapper'>
							<div className='logs-view-header'>
								<div className='logs-view-title'>logs</div>
								<div className='logs-view-counter' id='logs-counter'>
									0 entries
								</div>
							</div>
							<div id='logs-view-list' className='logs-view-list' />
						</div>
					</section>

					<section
						className='view content-scroll'
						data-view='config'
						data-active='false'
					>
						<div className='card'>
							<div className='card-header'>
								<div className='card-label'>config</div>
								<div className='card-title-block'>
									<div className='card-title'>Profiles</div>
									<div className='card-label'>save / load presets</div>
								</div>
							</div>

							<div className='divider' />

							<div className='client-row'>
								<span>name</span>
								<input id='config-name-input' placeholder='config name' />
								<button id='config-save-btn'>save config</button>
							</div>

							<div className='client-row'>
								<span>author ID</span>
								<input
									id='config-author-input'
									placeholder='you can get an Author ID if you log in to the website'
								/>
							</div>

							<div className='list-header'>
								<div className='list-header-label'>recent apps</div>
							</div>
							<div id='recent-list' />

							<div className='list-header'>
								<div className='list-header-label'>Cloud Sync</div>
							</div>
							<div
								className='cloud-actions'
								style={{
									display: 'flex',
									gap: '8px',
									marginBottom: '12px',
								}}
							>
								<button
									id='cloud-upload-btn'
									className='rpc-button'
									style={{ flex: 1 }}
								>
									<div className='rpc-button-icon'>☁️</div>
									<span>Upload Current</span>
								</button>
							</div>

							<div className='divider' />

							<div className='list-header'>
								<div className='list-header-label'>saved configs</div>
								<button id='config-export-btn' className='add-btn'>
									export
								</button>
								<button id='config-add-btn' className='add-btn'>
									import
								</button>
							</div>
							<div id='config-list' />

							<div
								id='cloud-configs-list'
								style={{ maxHeight: '200px', overflowY: 'auto' }}
							/>
						</div>
					</section>
				</main>
			</div>

			<div id='config-details-overlay' data-open='false'>
				<div className='config-details-modal'>
					<div className='config-details-header'>
						<div>
							<div className='config-details-title' id='config-details-name' />
							<div className='config-details-subtitle'>
								Profile configuration
							</div>
						</div>
						<button id='config-details-close'>×</button>
					</div>
					<div className='config-details-sections content-scroll'>
						<section className='config-details-section'>
							<h3>Details &amp; State</h3>
							<div className='config-details-list' id='config-details-cycles' />
						</section>
						<section className='config-details-section'>
							<h3>Images</h3>
							<div className='config-details-list' id='config-details-images' />
						</section>
						<section className='config-details-section'>
							<h3>Buttons</h3>
							<div
								className='config-details-list'
								id='config-details-buttons'
							/>
						</section>
						<section className='config-details-section'>
							<h3>Party</h3>
							<div className='config-details-list' id='config-details-party' />
						</section>
					</div>
				</div>
			</div>

			<div id='upload-confirm-overlay' data-open='false'>
				<div className='config-details-modal'>
					<div className='config-details-header'>
						<div>
							<div className='config-details-title'>Upload config?</div>
							<div className='config-details-subtitle'>
								Are you sure you want to upload this profile to the cloud?
							</div>
						</div>
						<button id='upload-confirm-close'>×</button>
					</div>
					<div className='config-details-sections'>
						<section className='config-details-section'>
							<h3>Profile</h3>
							<div
								className='config-details-list'
								id='upload-confirm-profile-info'
							/>
						</section>
						<section className='config-details-section'>
							<h3>Actions</h3>
							<button id='upload-confirm-ok' className='rpc-button'>
								confirm upload
							</button>
						</section>
					</div>
				</div>
			</div>

			<div id='import-overlay' data-open='false'>
				<div className='import-modal'>
					<div className='import-header'>
						<div>
							<div className='import-title'>Import profile</div>
							<div className='import-subtitle'>
								Drop a JSON file anywhere or choose it here
							</div>
						</div>
						<button id='import-close-btn'>×</button>
					</div>
					<div className='import-body'>
						<div>Only button, cycles and image will be imported.</div>
						<div className='import-input-row'>
							<input
								type='file'
								id='import-file-input'
								accept='application/json,.json'
							/>
						</div>
						<div style={{ fontSize: '11px', color: '#9ca3af' }}>
							You can also drag and drop a .json file onto the window; dashed
							border will appear when ready to drop.
						</div>
					</div>
				</div>
			</div>

			<div id='client-id-toast' className='copy-toast' data-visible='false'>
				client id saved
			</div>
			<div id='blocks-toast' className='copy-toast' data-visible='false'>
				changes saved
			</div>
			<div id='global-drop-overlay' data-active='false' />
		</div>
	)
}
