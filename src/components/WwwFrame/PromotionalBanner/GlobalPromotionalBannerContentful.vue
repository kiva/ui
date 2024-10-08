<template>
	<div>
		<deposit-incentive-banner
			v-if="enableDepositExperiment"
		/>
		<template v-else>
			<generic-promo-banner
				v-show="isPromoEnabled"
				:icon-key="promoBannerContent.iconKey"
				:promo-banner-content="promoBannerContent"
			/>
			<appeal-banner-circular-container
				v-if="appealEnabled"
				:appeal-banner-content="appealBannerContent.fields"
			/>
			<donation-banner-container
				v-if="donationEnabled"
				:donation-banner-content="donationBannerContent.fields"
			/>
		</template>
	</div>
</template>

<script>
import _get from 'lodash/get';
import { gql } from 'graphql-tag';

import { settingEnabled } from '#src/util/settingsUtils';
import { globalBannerDenyList, isExcludedUrl } from '#src/util/urlUtils';

import AppealBannerCircularContainer from
	'#src/components/WwwFrame/PromotionalBanner/Banners/AppealBanner/AppealBannerCircularContainer';
import GenericPromoBanner from '#src/components/WwwFrame/PromotionalBanner/Banners/GenericPromoBanner';
import DonationBannerContainer from
	'#src/components/WwwFrame/PromotionalBanner/Banners/Donation/DonationBannerContainer';
import experimentVersionFragment from '#src/graphql/fragments/experimentVersion.graphql';
import DepositIncentiveBanner from '#src/components/WwwFrame/PromotionalBanner/Banners/DepositIncentiveBanner';
import { trackExperimentVersion } from '#src/util/experiment/experimentUtils';

import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

const DEPOSIT_REWARD_EXP_KEY = 'deposit_incentive_banner';

const bannerQuery = gql`query bannerQuery {
	contentful {
		entries(contentType: "uiSetting", contentKey: "ui-global-promo")
	}
	experiment(id: "deposit_incentive_banner") @client {
		id
		version
	}
}`;

export default {
	name: 'GlobalPromotionalBannerContentful',
	components: {
		AppealBannerCircularContainer,
		GenericPromoBanner,
		DonationBannerContainer,
		DepositIncentiveBanner,
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
			donationBannerContent: {},
			appealEnabled: false,
			donationEnabled: false,
			customAppealEnabled: false,
			enableDepositExperiment: false,
		};
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		query: bannerQuery,
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
					// guard against drafts
					if (promoContent?.sys?.revision === 0) {
						return false;
					}
					// guard against missing fields
					if (!promoContent?.fields
						|| !promoContent?.fields?.active
						|| !promoContent?.fields?.startDate
						|| !promoContent?.fields?.endDate) {
						return false;
					}
					return settingEnabled(
						promoContent.fields,
						'active',
						'startDate',
						'endDate'
					);
				});

				// check for activePromoBanner and ensure it has content fields
				if (activePromoBanner && activePromoBanner?.fields) {
					// check for visibility based on current route and hiddenUrls field
					const hiddenUrls = globalBannerDenyList.concat(activePromoBanner?.fields?.hiddenUrls ?? []);
					const visibleUrls = activePromoBanner?.fields?.visibleUrls ?? [];
					if (isExcludedUrl(hiddenUrls, visibleUrls, this.$route.path)) return false;

					// check for visibility on promo session override
					const showForPromo = _get(activePromoBanner, 'fields.showForPromo', false);
					if (this.hasPromoSession && !showForPromo) {
						return false;
					}

					// Check banner type
					if (activePromoBanner.fields.bannerType === 'Appeal Banner') {
						// Appeal Banner
						this.appealEnabled = true;
						this.appealBannerContent = activePromoBanner;
					} else if (activePromoBanner.fields.bannerType === 'Custom Appeal') {
						// Custom Banner
						this.customAppealEnabled = true;
						this.appealBannerContent = activePromoBanner;
					} else if (activePromoBanner.fields.bannerType === 'Donation Banner') {
						// Donation Banner
						this.donationEnabled = true;
						this.donationBannerContent = activePromoBanner;
					} else {
						// Promo Banner
						// parse the contentful richText into an html string
						this.promoBannerContent = {
							disclaimer: activePromoBanner?.fields?.disclaimers?.content?.[0] ?? null,
							kvTrackEvent: activePromoBanner.fields.kvTrackEvent,
							link: activePromoBanner.fields.link,
							richText: documentToHtmlString(activePromoBanner.fields.richText),
							iconKey: activePromoBanner?.fields?.iconKey ?? '',
						};
						this.isPromoEnabled = true;
					}
				}
			}
		}
	},
	created() {
		if (!isExcludedUrl(globalBannerDenyList, [], this.$route.path)) {
			const { version } = this.apollo.readFragment({
				id: `Experiment:${DEPOSIT_REWARD_EXP_KEY}`,
				fragment: experimentVersionFragment,
			}) ?? {};

			trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'promo',
				DEPOSIT_REWARD_EXP_KEY,
				'EXP-MP-500-Jul2024'
			);

			if (version === 'b' && this.$route.path !== '/checkout') {
				this.enableDepositExperiment = true;
			}
		}
	}
};
</script>
