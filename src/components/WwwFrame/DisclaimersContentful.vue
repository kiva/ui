<template>
	<div :style="isUserDataLoading ? { display: 'var(--ui-data-global-promo-banner-display, block)' } : {}">
		<ol id="disclaimers" class="tw-text-small tw-list-decimal tw-list-outside">
			<li
				v-for="(disclaimer, index) in fullyBuiltDisclaimerText"
				:key="index"
				v-html="disclaimer"
			>
			</li>
		</ol>
	</div>
</template>

<script>
import {
	bannerQuery,
	activePromoBanner,
	inactivePromoBanners,
	showBannerForPromo,
} from '#src/util/globalPromoBanner';
import { hasPromoSession, promoCreditQuery } from '#src/util/promoCredit';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

export default {
	name: 'DisclaimersContentful',
	data() {
		return {
			activePromoBanner: null,
			hasPromoSession: false,
			inactivePromoBanners: [],
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
				this.activePromoBanner = activePromoBanner(data, this.$route.path);
				this.inactivePromoBanners = inactivePromoBanners(data, this.$route.path);
			}
		},
	],
	created() {
		const { useCDNCaching } = this.$renderConfig;
		this.isUserDataLoading = useCDNCaching;
	},
	computed: {
		disclaimerContent() {
			const content = [];
			if (this.activePromoBanner) {
				// Determine if active banner will be shown even if there is a promo session
				const canShowForPromo = !this.hasPromoSession || showBannerForPromo(this.activePromoBanner);

				// set the disclaimer text if it exists in active promo banner
				const activeDisclaimerText = this.activePromoBanner.fields.disclaimers ?? null;
				if (activeDisclaimerText && canShowForPromo) {
					content.push(documentToHtmlString(activeDisclaimerText));
				}
			}
			// go through the inactive promoBanners, and add them if disclaimer text exists
			if (this.inactivePromoBanners?.length > 0) {
				this.inactivePromoBanners.forEach(banner => {
					const disclaimerText = banner?.fields?.disclaimers ?? null;
					if (disclaimerText) {
						content.push(documentToHtmlString(disclaimerText));
					}
				});
			}
			return content;
		},
		// constructing the final form of the disclaimer text for display
		fullyBuiltDisclaimerText() {
			// prepend 'Disclaimer: ' to each disclaimer text
			const builtDisclaimertext = [];
			this.disclaimerContent.forEach(disclaimer => {
				const prependDisclaimer = disclaimer.replace('<p>', '<p>Disclaimer: ');
				builtDisclaimertext.push(prependDisclaimer);
			});
			return builtDisclaimertext;
		},
	},
};
</script>
