<template>
	<kv-lightbox
		:visible="isLightboxVisible"
		title="Find the best loans for you"
		@lightbox-closed="closeLightbox"
	>
		<div class="tw-flex tw-flex-col md:tw-flex-row-reverse tw-mb-4">
			<div class="tw-w-full md:tw-w-auto tw-mb-4 md:tw-mb-0">
				<img
					class="tw-mx-auto"
					style="max-width: 374px;"
					:src="imageSource"
					alt="Learn about Monthly Good"
				>
			</div>
			<div class="tw-prose md:tw-mr-4">
				<p class="tw-text-subhead">
					For as little as $5 a month, we’ll help you automatically lend to borrowers around the world.
				</p>
				<kv-button
					class=""
					to="/monthlygood"
					v-kv-track-event="['Lend','click-Learn-More-MG-Lightbox', 'Learn More']"
				>
					Learn More
					<kv-material-icon
						:icon="mdiChevronRight"
						class="tw-w-2 tw-h-2"
					/>
				</kv-button>
			</div>
		</div>
	</kv-lightbox>
</template>

<script>
import gql from 'graphql-tag';
import { mdiChevronRight } from '@mdi/js';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

const imageRequire = require.context('@/assets/images', true);

export default {
	inject: ['apollo', 'cookieStore'],
	components: {
		KvButton,
		KvLightbox,
		KvMaterialIcon,
	},
	data() {
		return {
			imageRequire,
			imageSource: imageRequire('./MG-Lightbox-11894_Paraguay_Pablina_45.jpg'),
			isLightboxVisible: false,
			mdiChevronRight,
			mgDriverEnabled: false,
			showLightbox: false,
			mgTimer: null,
			timerDuration: 7000,
		};
	},
	mounted() {
		this.fetchMgDriverSetting();
	},
	methods: {
		closeLightbox(context) {
			console.log('close lightbox context: ', JSON.stringify(context));
			this.isLightboxVisible = false;
			this.$kvTrackEvent('Lend', 'close-mg-lightbox');
		},
		fetchMgDriverSetting() {
			// Fetch setting ui.lbc_mg_driver
			const mgDriverSetting = gql`query mySubscriptionsQuery {
				general {
					mgDriver: uiConfigSetting(key: "lbc_mg_driver") {
						key
						value
					}
				}
			}`;
			this.apollo.query({
				query: mgDriverSetting
			}).then(({ data }) => {
				console.log(data?.general?.mgDriver);
				const mgDriverEnabled = (data?.general?.mgDriver?.value ?? false) === 'true';
				this.mgDriverEnabled = mgDriverEnabled;
				if (mgDriverEnabled) {
					this.initializeMgDriveLightbox();
				}
			});
		},
		initializeMgDriveLightbox() {
			this.mgTimer = setInterval(this.showMgDriverLightbox, this.timerDuration);
		},
		showMgDriverLightbox() {
			this.isLightboxVisible = true;
		}
	},
	onBeforeDestroy() {
		clearInterval(this.mgTimer);
	}
};
</script>
