<template>
	<div
		class="print:tw-hidden"
		:style="isUserDataLoading ? { display: 'var(--ui-data-global-promo-banner-display, block)' } : {}"
	>
		<generic-promo-banner
			v-show="isPromoEnabled"
			:icon-key="promoBannerContent.iconKey"
			:promo-banner-content="promoBannerContent"
		/>
		<appeal-banner-circular-container
			v-if="appealEnabled"
			:appeal-banner-content="activeBanner.fields"
		/>
		<donation-banner-container
			v-if="donationEnabled"
			:donation-banner-content="activeBanner.fields"
		/>
	</div>
</template>

<script>
import { activePromoBanner, bannerQuery, showBannerForPromo } from '#src/util/globalPromoBanner';
import { hasPromoSession, promoCreditQuery } from '#src/util/promoCredit';

import AppealBannerCircularContainer from
	'#src/components/WwwFrame/PromotionalBanner/Banners/AppealBanner/AppealBannerCircularContainer';
import GenericPromoBanner from '#src/components/WwwFrame/PromotionalBanner/Banners/GenericPromoBanner';
import DonationBannerContainer from
	'#src/components/WwwFrame/PromotionalBanner/Banners/Donation/DonationBannerContainer';
// import DepositIncentiveBanner from '#src/components/WwwFrame/PromotionalBanner/Banners/DepositIncentiveBanner';

import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

export default {
	name: 'GlobalPromotionalBannerContentful',
	components: {
		AppealBannerCircularContainer,
		GenericPromoBanner,
		DonationBannerContainer,
	},
	data() {
		return {
			activeBanner: {},
			hasPromoSession: false,
			isUserDataLoading: false,
		};
	},
	inject: {
		apollo: { default: null },
		cookieStore: { default: null },
	},
	apollo: [
		{
			query: promoCreditQuery,
			preFetch(config, client, { renderConfig }) {
				if (renderConfig.useCDNCaching) {
					// if using CDN caching, don't prefetch
					return Promise.resolve();
				}
				return client.query({ query: promoCreditQuery });
			},
			result({ data }) {
				this.isUserDataLoading = false;
				// check if the user has a promo session
				this.hasPromoSession = hasPromoSession(data);
			}
		},
		{
			query: bannerQuery,
			preFetch: true,
			result({ data }) {
				// get the active promo banner from the data
				this.activeBanner = activePromoBanner(data, this.$route.path) ?? {};
			}
		},
	],
	created() {
		const { useCDNCaching } = this.$renderConfig;
		this.isUserDataLoading = useCDNCaching;
	},
	computed: {
		hiddenForPromoCredit() {
			// Hide the banner if this is a promo session and the banner is not set to show for promo credit
			return this.hasPromoSession && !showBannerForPromo(this.activeBanner);
		},
		promoBannerContent() {
			if (!this.activeBanner?.fields) {
				return {};
			}
			// parse the contentful richText into an html string
			return {
				disclaimer: this.activeBanner.fields.disclaimers?.content?.[0] ?? null,
				kvTrackEvent: this.activeBanner.fields.kvTrackEvent,
				link: this.activeBanner.fields.link,
				richText: documentToHtmlString(this.activeBanner.fields.richText),
				iconKey: this.activeBanner.fields.iconKey ?? '',
			};
		},
		appealEnabled() {
			return this.activeBanner?.fields?.bannerType === 'Appeal Banner' && !this.hiddenForPromoCredit;
		},
		customAppealEnabled() {
			return this.activeBanner?.fields?.bannerType === 'Custom Appeal' && !this.hiddenForPromoCredit;
		},
		donationEnabled() {
			return this.activeBanner?.fields?.bannerType === 'Donation Banner' && !this.hiddenForPromoCredit;
		},
		isPromoEnabled() {
			return this.activeBanner?.fields
				&& !this.appealEnabled
				&& !this.customAppealEnabled
				&& !this.donationEnabled
				&& !this.hiddenForPromoCredit;
		},
	},
};
</script>
