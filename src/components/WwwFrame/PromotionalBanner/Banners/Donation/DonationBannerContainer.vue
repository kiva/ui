<template>
	<div>
		<donation-banner
			v-if="isOpen"
			:button-amounts="buttonAmounts"
			:headline="headline"
			:body="body"
			:disclaimer="hasDisclaimer"
			:banner-image-url="bannerImageUrl"
			:frequency="frequency"
			@close-banner="onCloseBanner"
		/>
	</div>
</template>

<script>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import DonationBanner from '#src/components/WwwFrame/PromotionalBanner/Banners/Donation/DonationBanner';

export default {
	name: 'DonationBannerContainer',
	components: {
		DonationBanner
	},
	props: {
		donationBannerContent: {
			type: Object,
			default: () => {}
		},
	},
	data() {
		return {
			isOpen: true,
		};
	},
	computed: {
		headline() {
			const donationHeadline = this.donationBannerContent?.richText || '';
			const options = {
				renderNode: {
					paragraph: (node, next) => `${next(node.content)}`,
				},
			};
			return documentToHtmlString(donationHeadline, options);
		},
		body() {
			const donationBody = this.donationBannerContent?.additionalContent?.[0]?.fields?.richText || '';
			return documentToHtmlString(donationBody);
		},
		buttonAmounts() {
			return this.donationBannerContent?.dataObject?.donationAmounts || [];
		},
		frequency() {
			return this.donationBannerContent?.dataObject?.frequency || 'once';
		},
		bannerImageUrl() {
			return this.donationBannerContent?.bannerImage?.fields?.file?.url || '';
		},
		hasDisclaimer() {
			const disclaimer = this.donationBannerContent?.disclaimers?.content?.[0] || '';
			return disclaimer !== '';
		},
	},
	methods: {
		onCloseBanner() {
			this.isOpen = false;
		},
	},
};
</script>
