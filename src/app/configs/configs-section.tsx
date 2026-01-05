import Footer from '../../../components/footer'
import Page from '../../../components/page'
import PageHeader from '../../../components/page-header'
import { Config } from '../../../service/firebase'
import { ConfigsClient } from './configs-client'
import styles from './configs.module.css'

type Props = {
	initialSearchTerm: string
	initialConfigs: Config[]
}

export function ConfigsSection({ initialSearchTerm, initialConfigs }: Props) {
	return (
		<Page>
			<main id='main-page-content'>
				<PageHeader
					title='Pick a Config!'
					subtitle='Browse community custom Discord Rich Presence configs'
				/>

				<div className={styles.themes_panel}>
					<ConfigsClient
						initialConfigs={initialConfigs}
						initialSearchTerm={initialSearchTerm}
					/>
				</div>
			</main>
			<Footer />
		</Page>
	)
}
