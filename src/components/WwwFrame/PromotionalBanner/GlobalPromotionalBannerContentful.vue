<template>
	<div>
		<generic-promo-banner
			v-show="isPromoEnabled"
			:icon-key="promoBannerContent.iconKey"
			:promo-banner-content="promoBannerContent"
		/>
		<appeal-banner
			v-if="showAppeal"
			:appeal-banner-content="appealBannerContent.fields"
		/>
		<appeal-banner-15
			v-if="show15YearAppeal"
			:appeal-banner-content="appealBannerContent.fields"
		/>
	</div>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';

import { settingEnabled } from '@/util/settingsUtils';

import AppealBanner from '@/components/WwwFrame/PromotionalBanner/Banners/AppealBanner/AppealBanner';
import AppealBanner15 from '@/components/WwwFrame/PromotionalBanner/Banners/AppealBanner/AppealBanner15';
import GenericPromoBanner from '@/components/WwwFrame/PromotionalBanner/Banners/GenericPromoBanner';

import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

const contentfulContent = gql`query contentfulContent {
	contentful {
		entries(contentType: "uiSetting", contentKey: "ui-global-promo")
	}
}`;

export default {
	components: {
		GenericPromoBanner,
		AppealBanner,
		AppealBanner15
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
			appealBannerContent: {},
			appealEnabled: false,
			appeal15Enabled: false,
			globalBannerBlacklist: [
				'/checkout',
				'/donate/support-kiva'
			]
		};
	},
	inject: ['apollo'],
	apollo: {
		query: contentfulContent,
		preFetch: true,
		result({ data }) {
			// Hide ALL banners on these pages
			if (this.globalBannerBlacklist.includes(this.$route.path)) {
				return false;
			}

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
						// Appeal Banner
						this.appealEnabled = true;
						this.appealBannerContent = activePromoBanner;
					} else if (activePromoBanner.fields.bannerType === 'Custom Appeal') {
						// Custom Banner
						// Currently the only custom appeal banner is the 15 year appeal
						this.appeal15Enabled = true;
						this.appealBannerContent = activePromoBanner;
					} else {
						// Promo Banner
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
		show15YearAppeal() {
			// only show the 15 year appeal on these pages
			const whitelist = [
				'/',
				'/15',
			];
			// First check if Appeal 15 Banner
			// is active and the user is on a whitelist URL
			if (this.appeal15Enabled && whitelist.includes(this.$route.path)) {
				return true;
			}
			return false;
		},
		showAppeal() {
			// make sure the appeal is enabled + we're not on certain blacklisted pages
			const appealBlacklist = [
				'/checkout',
				'/error',
				'/join-team',
				'/register/social',
				'/possibility/giving-tuesday',
				'/possibility/12-days-of-lending',
				'/possibility/year-end'
			];
			// First check if Appeal Banner
			// is active and the user is not on a blacklisted page URL
			if (this.appealEnabled && !appealBlacklist.includes(this.$route.path)) {
				return true;
			}
			return false;
		},
	},
};
</script>
