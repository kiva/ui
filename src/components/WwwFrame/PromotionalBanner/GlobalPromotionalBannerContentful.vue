<template>
	<div>
		<generic-promo-banner
			v-if="isPromoEnabled"
			:icon-key="promoBannerContent.iconKey"
			:promo-banner-content="promoBannerContent"
		/>
		<appeal-banner
			v-if="showAppeal"
			:appeal-banner-content="appealBannerContent.fields"
		/>
	</div>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';
import { settingEnabled } from '@/util/settingsUtils';
import GenericPromoBanner from './Banners/GenericPromoBanner';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';
import AppealBanner from './Banners/AppealBanner/AppealBanner';

const contentfulContent = gql`query contentfulContent {
	contentful {
		entries(contentType: "uiSetting", contentKey: "ui-global-promo")
	}
}`;

export default {
	components: {
		GenericPromoBanner,
		AppealBanner
	},
	props: {
		hasPromoSession: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			isPromoEnabled: false,
			promoBannerContent: {},
			appealEnabled: false,
		};
	},
	inject: ['apollo'],
	apollo: {
		query: contentfulContent,
		preFetch: true,
		result({ data }) {
			// returns the contentful content of the uiSetting key ui-global-promo or empty object
			// it should always be the first and only item in the array, since we pass the variable to the query above
			const uiGlobalPromoSetting = _get(data, 'contentful.entries.items', []).find(item => item.fields.key === 'ui-global-promo'); // eslint-disable-line max-len
			// exit if missing setting or fields
			if (!uiGlobalPromoSetting || !uiGlobalPromoSetting.fields) {
				return false;
			}
			// uiGlobalPromoSetting can contain an array of different banners with
			// different start/end dates first determine if setting is enabled.
			const isGlobalSettingEnabled = settingEnabled(
				uiGlobalPromoSetting.fields,
				'active',
				'startDate',
				'endDate'
			);

			// if setting is enabled determine which banner to display
			if (isGlobalSettingEnabled) {
				const activePromoBanner = uiGlobalPromoSetting.fields.content.find(promoContent => {
					return settingEnabled(
						promoContent.fields,
						'active',
						'startDate',
						'endDate'
					);
				});

				if (activePromoBanner) {
					// always hide the promo banner on the checkout page.
					// TODO move these paths into array to check against
					if (this.$route.path === '/checkout' || this.$route.path === '/donate/support-kiva') {
						return false;
					}

					// check for visibility based on current route and hiddenUrls field
					const hiddenUrls = _get(activePromoBanner, 'fields.hiddenUrls', []);
					if (hiddenUrls.includes(this.$route.path)) {
						return false;
					}

					// check for visibility on promo session override
					const showForPromo = _get(activePromoBanner, 'fields.showForPromo', false);
					if (this.hasPromoSession && !showForPromo) {
						return false;
					}

					// check for special conditions and allow that process to control enabled
					const specialConditions = _get(activePromoBanner, 'fields.specialConditions', null);
					if (specialConditions) {
						// check for and operate on autolending opt in condition
						// if special conditions exist, for example:
						// specialConditions.includes('autolending-opted-in')
						// process them and set this.isPromoEnabled = true accordingly
						return false;
					}

					// Check banner type
					if (activePromoBanner.fields.bannerType === 'Appeal Banner') {
						this.appealEnabled = true;
						this.appealBannerContent = activePromoBanner;
					} else {
						// parse the contentful richText into an html string
						this.promoBannerContent = {
							kvTrackEvent: activePromoBanner.fields.kvTrackEvent,
							link: activePromoBanner.fields.link,
							richText: documentToHtmlString(activePromoBanner.fields.richText),
							iconKey: _get(activePromoBanner, 'fields.iconKey', 'present')
						};

						this.isPromoEnabled = true;
					}
				}
			}
		}
	},
	computed: {
		showAppeal() {
			// make sure the appeal is enable + we're not on certain blacklisted pages
			const blacklist = [
				'/checkout',
				'/error',
				'/join-team',
				'/register/social',
				'/possibility/giving-tuesday',
				'/possibility/12-days-of-lending',
				'/possibility/year-end'
			];
			// First check if Appeal Banner or Appeal Banner Matching
			// is active and the user is not on a blacklisted page URL
			if ((this.appealEnabled || this.appealMatchEnabled) && !blacklist.includes(this.$route.path)) {
				return true;
			}
			return false;
		},
	},
};
</script>
