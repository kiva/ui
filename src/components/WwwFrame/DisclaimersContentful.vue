<template>
	<div class="row">
		<ol class="text-left">
			<li
				id="disclaimers"
				v-for="(disclaimer, index) in fullyBuiltDisclaimerText"
				:key="index"
			>
				<!-- v-html="disclaimer" -->
				{{ disclaimer }}
			</li>
		</ol>
	</div>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';
import { settingEnabled, settingWithinDateRange } from '@/util/settingsUtils';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

const bannerQuery = gql`query bannerQuery {
	contentful {
		entries(contentType: "uiSetting", contentKey: "ui-global-promo")
	}
}`;

export default {
	data() {
		return {
			disclaimerContent: [],
		};
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		query: bannerQuery,
		preFetch: true,
		result({ data }) {
			// gather contentful content and the uiSetting key ui-global-promo
			const contentfulContent = data?.contentful?.entries?.items ?? [];
			const uiGlobalPromoSetting = contentfulContent.find(item => item.fields.key === 'ui-global-promo');

			// exit if missing setting or fields
			if (!uiGlobalPromoSetting || !uiGlobalPromoSetting.fields) {
				return false;
			}
			// uiGlobalPromoSetting can contain an array of different banners with
			// different start/end dates first determine if setting is enabled.

			// DO I NEED THIS CHECK, SINCE IF THERE'S INACTIVE BANNERS WITHIN DATE RANGE
			// WE STILL WANT TO DISPLAY THE DISCLAIMERS... RIGHT?
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
				console.log('activePromoBanner', activePromoBanner);
				console.log('uiGlobalPromoSetting.fields.content', uiGlobalPromoSetting.fields.content);
				// All 3 banners are present here
				// gather all inactive promo banners by their start and end dates
				const inactivePromoBanners = uiGlobalPromoSetting.fields.content.filter(promoContent => {
					if (promoContent.fields.active) {
						console.log('I feel triggered');
						return false;
					}
					return settingWithinDateRange(
						promoContent.fields,
						'startDate',
						'endDate'
					);
				});
				// only 1 banner here
				console.log('Filtered disclaimerContent', inactivePromoBanners);

				if (activePromoBanner) {
					// check for visibility based on current route and hiddenUrls field

					// WHAT DO WE WANT TO BASE THE DISCLAIMER VISIBILTY ON?
					const hiddenUrls = _get(activePromoBanner, 'fields.hiddenUrls', []);
					if (hiddenUrls.includes(this.$route.path)) {
						return false;
					}

					// check for visibility on promo session override
					const showForPromo = _get(activePromoBanner, 'fields.showForPromo', false);
					if (this.hasPromoSession && !showForPromo) {
						return false;
					}

					// set the disclaimer text if it exists in active promo banner
					const activeDisclaimerText = activePromoBanner?.fields?.disclaimers ?? null;

					// if there's an active disclaimer, push that disclaimer to the disclaimerContent for display
					if (activeDisclaimerText) {
						this.disclaimerContent.push(documentToHtmlString(activeDisclaimerText));
					}

					// go through the inactive promoBanners, if within date range and disclaimer text exists
					// push that disclaimer text to disclaimerContent
					if (inactivePromoBanners.length > 0) {
						inactivePromoBanners.forEach(item => {
							const itemDisclaimer = item?.fields?.disclaimers ?? null;
							if (itemDisclaimer) {
								this.disclaimerContent.push(documentToHtmlString(itemDisclaimer));
							}
						});
					}
				}
			}
		}
	},
	computed: {
		// Constructing the final form of the disclaimer text for display
		fullyBuiltDisclaimerText() {
			const builtDisclaimertext = [];
			this.disclaimerContent.forEach(disclaimer => {
				builtDisclaimertext.push(`Disclaimer: ${disclaimer}`);
			});
			return builtDisclaimertext;
		}
	}
};
</script>
