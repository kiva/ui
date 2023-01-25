<template>
	<kv-lightbox
		:visible="mgDriverEnabled && isLightboxVisible"
		title="Let Kiva find the best loans for you"
		@lightbox-closed="closeLightbox"
	>
		<div class="tw-flex tw-flex-col md:tw-flex-row-reverse tw-mb-4">
			<div class="tw-w-full tw-mb-4 md:tw-mb-0">
				<img
					class="tw-mx-auto tw-w-full"
					style="max-width: 374px;"
					:src="imageSource"
					alt="Learn about Monthly Good"
				>
			</div>
			<div class="tw-prose md:tw-mr-4">
				<p class="tw-text-subhead">
					For as little as $5 a month, we’ll help you automatically lend to
					borrowers that meet your lending preferences.
				</p>
				<kv-button
					class="tw-w-full md:tw-w-auto"
					to="/monthlygood"
					v-kv-track-event="['Lending','click-Learn-More-MG-Lightbox', 'Learn More']"
				>
					Learn More
					<kv-material-icon
						:icon="mdiChevronRight"
						class="tw-w-2.5 tw-h-2.5 tw-align-text-bottom"
					/>
				</kv-button>
			</div>
		</div>
	</kv-lightbox>
</template>

<script>
import { gql } from '@apollo/client';
import { mdiChevronRight } from '@mdi/js';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

const imageRequire = require.context('@/assets/images', true);

export default {
	name: 'MGLightbox',
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
			mgLightboxDelay: 10000,
		};
	},
	mounted() {
		this.fetchMgDriverSetting();
	},
	methods: {
		closeLightbox() {
			this.isLightboxVisible = false;
			this.$kvTrackEvent('Lending', 'close-mg-lightbox', 'Close MG lightbox');
		},
		fetchMgDriverSetting() {
			// skip fetching and setting this if they've already seen the lightbox
			if (this.mgDriverPreviouslyShown()) {
				return false;
			}

			// Fetch setting ui.lbc_mg_driver
			const mgDriverEligibilityQuery = gql`query mgDriverEligibilityQuery($basketId: String) {
				hasEverLoggedIn @client
				general {
					mgDriver: uiConfigSetting(key: "lbc_mg_driver") {
						key
						value
					}
				}
				shop (basketId: $basketId) {
					id
					nonTrivialItemCount
				}
				my {
					autoDeposit {
						id
						isSubscriber
						isOnetime
					}
					subscriptions {
						values {
							id
						}
					}
				}
			}`;

			this.apollo.query({
				query: mgDriverEligibilityQuery
			}).then(({ data }) => {
				// check for existing mg subs
				const isMonthlyGoodSubscriber = data?.my?.autoDeposit?.isSubscriber ?? false;
				// check for legacy subs
				const hasLegacySubs = (data?.my?.subscriptions?.values?.length ?? 0) > 0;
				// check for basket items
				const basketCount = data?.shop?.nonTrivialItemCount ?? 0;
				// establish feature flag state
				const mgDriverEnabled = (data?.general?.mgDriver?.value ?? false) === 'true';
				// check for existing user
				const hasEverLoggedIn = data?.hasEverLoggedIn;

				if (!basketCount && !isMonthlyGoodSubscriber && !hasLegacySubs && mgDriverEnabled && hasEverLoggedIn) {
					this.mgDriverEnabled = mgDriverEnabled;
					this.initializeMgDriveLightbox();
				}
			});
		},
		initializeMgDriveLightbox() {
			this.mgTimer = setTimeout(this.showMgDriverLightbox, this.mgLightboxDelay);
		},
		mgDriverPreviouslyShown() {
			return this.cookieStore.get('mg-lightbox-shown-in-session-2') === 'true' || false;
		},
		showMgDriverLightbox() {
			this.cookieStore.set('mg-lightbox-shown-in-session-2', true);
			this.isLightboxVisible = true;
			this.$kvTrackEvent('Lending', 'show-mg-lightbox', 'Learn about Monthly Good Lightbox');
		},
	},
	onBeforeDestroy() {
		clearTimeout(this.mgTimer);
	}
};
</script>
