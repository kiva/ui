<template>
	<div class="print:tw-hidden">
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
	</div>
</template>

<script>
import {
	bannerQuery,
	activePromoBanner,
} from '#src/util/globalPromoBanner';

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
			isPromoEnabled: false,
			promoBannerContent: {},
			appealBannerContent: {},
			donationBannerContent: {},
			appealEnabled: false,
			donationEnabled: false,
			customAppealEnabled: false,
		};
	},
	inject: {
		apollo: { default: null },
		cookieStore: { default: null },
	},
	apollo: {
		query: bannerQuery,
		preFetch: true,
		result({ data }) {
			const activeBanner = activePromoBanner(data);

			// check for activePromoBanner and ensure it has content fields
			if (activeBanner?.fields) {
				// Check banner type
				if (activeBanner.fields.bannerType === 'Appeal Banner') {
					// Appeal Banner
					this.appealEnabled = true;
					this.appealBannerContent = activeBanner;
				} else if (activeBanner.fields.bannerType === 'Custom Appeal') {
					// Custom Banner
					this.customAppealEnabled = true;
					this.appealBannerContent = activeBanner;
				} else if (activeBanner.fields.bannerType === 'Donation Banner') {
					// Donation Banner
					this.donationEnabled = true;
					this.donationBannerContent = activeBanner;
				} else {
					// Promo Banner
					// parse the contentful richText into an html string
					this.promoBannerContent = {
						disclaimer: activeBanner.fields.disclaimers?.content?.[0] ?? null,
						kvTrackEvent: activeBanner.fields.kvTrackEvent,
						link: activeBanner.fields.link,
						richText: documentToHtmlString(activeBanner.fields.richText),
						iconKey: activeBanner.fields.iconKey ?? '',
					};
					this.isPromoEnabled = true;
				}
			}
		}
	},
};
</script>
